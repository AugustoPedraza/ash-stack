/**
 * Optimistic Update Utilities
 *
 * Provides utilities for optimistic UI updates with automatic rollback on error.
 * Integrates with Svelte stores for reactive state management.
 *
 * Usage:
 * import { createOptimisticStore, optimistic } from '$lib';
 */

import { writable, get } from 'svelte/store';

/**
 * Create an optimistic store with built-in pending/error state tracking.
 *
 * @template T
 * @param {T} initialValue - Initial store value
 * @returns {OptimisticStore<T>}
 *
 * @example
 * const todos = createOptimisticStore([]);
 *
 * // Add item optimistically
 * todos.optimistic(
 *   (items) => [...items, newTodo],  // Optimistic update
 *   async () => await api.createTodo(newTodo)  // Actual API call
 * );
 */
export function createOptimisticStore(initialValue) {
  const store = writable(initialValue);
  const pending = writable(new Set());
  const errors = writable(new Map());

  let operationId = 0;

  return {
    // Core store methods
    subscribe: store.subscribe,
    set: store.set,
    update: store.update,

    // Pending operations store
    pending: { subscribe: pending.subscribe },

    // Errors store
    errors: { subscribe: errors.subscribe },

    /**
     * Perform an optimistic update with automatic rollback on error.
     *
     * @template R
     * @param {(current: T) => T} optimisticUpdate - Function to apply optimistic update
     * @param {() => Promise<R>} asyncAction - Async action to perform
     * @param {Object} options
     * @param {(result: R, current: T) => T} [options.onSuccess] - Transform state on success
     * @param {(error: Error, current: T) => T} [options.onError] - Transform state on error (default: rollback)
     * @param {string} [options.id] - Optional operation ID for tracking
     * @returns {Promise<R>}
     */
    async optimistic(optimisticUpdate, asyncAction, options = {}) {
      const id = options.id || `op_${++operationId}`;
      const previousValue = get(store);

      // Apply optimistic update immediately
      store.update(optimisticUpdate);

      // Track pending operation
      pending.update((p) => new Set([...p, id]));
      errors.update((e) => {
        e.delete(id);
        return new Map(e);
      });

      try {
        const result = await asyncAction();

        // Apply success transformation if provided
        if (options.onSuccess) {
          store.update((current) => options.onSuccess(result, current));
        }

        return result;
      } catch (error) {
        // Apply error transformation or rollback
        if (options.onError) {
          store.update((current) => options.onError(error, current));
        } else {
          // Default: rollback to previous value
          store.set(previousValue);
        }

        // Track error
        errors.update((e) => new Map([...e, [id, error]]));

        throw error;
      } finally {
        // Remove from pending
        pending.update((p) => {
          p.delete(id);
          return new Set(p);
        });
      }
    },

    /**
     * Clear all errors
     */
    clearErrors() {
      errors.set(new Map());
    },

    /**
     * Clear specific error
     * @param {string} id - Operation ID
     */
    clearError(id) {
      errors.update((e) => {
        e.delete(id);
        return new Map(e);
      });
    },

    /**
     * Check if any operations are pending
     * @returns {boolean}
     */
    isPending() {
      return get(pending).size > 0;
    },

    /**
     * Check if there are any errors
     * @returns {boolean}
     */
    hasErrors() {
      return get(errors).size > 0;
    }
  };
}

/**
 * Higher-order function for optimistic mutations.
 * Wraps an async function with optimistic update logic.
 *
 * @template T, R
 * @param {Object} config
 * @param {import('svelte/store').Writable<T>} config.store - Svelte writable store
 * @param {(current: T, ...args: any[]) => T} config.optimistic - Optimistic update function
 * @param {(...args: any[]) => Promise<R>} config.action - Async action
 * @param {(result: R, current: T) => T} [config.onSuccess] - Success transformation
 * @param {(error: Error, previous: T) => void} [config.onError] - Error callback
 * @returns {(...args: any[]) => Promise<R>}
 *
 * @example
 * const deleteItem = optimistic({
 *   store: items,
 *   optimistic: (items, id) => items.filter(i => i.id !== id),
 *   action: (id) => api.deleteItem(id),
 *   onError: (error) => toast.error('Failed to delete')
 * });
 *
 * await deleteItem(itemId);
 */
export function optimistic({ store, optimistic: optimisticFn, action, onSuccess, onError }) {
  return async (...args) => {
    const previousValue = get(store);

    // Apply optimistic update
    store.update((current) => optimisticFn(current, ...args));

    try {
      const result = await action(...args);

      if (onSuccess) {
        store.update((current) => onSuccess(result, current));
      }

      return result;
    } catch (error) {
      // Rollback
      store.set(previousValue);

      if (onError) {
        onError(error, previousValue);
      }

      throw error;
    }
  };
}

/**
 * Create a list store with common optimistic operations built-in.
 *
 * @template T
 * @param {T[]} initialItems - Initial list items
 * @param {Object} options
 * @param {(item: T) => string | number} [options.getId] - Function to get item ID
 * @returns {OptimisticListStore<T>}
 *
 * @example
 * const todos = createOptimisticList([], { getId: (t) => t.id });
 *
 * // Add item
 * await todos.add(newTodo, () => api.create(newTodo));
 *
 * // Update item
 * await todos.update(id, changes, () => api.update(id, changes));
 *
 * // Remove item
 * await todos.remove(id, () => api.delete(id));
 */
export function createOptimisticList(initialItems = [], options = {}) {
  const getId = options.getId || ((item) => item.id);
  const store = createOptimisticStore(initialItems);

  return {
    ...store,

    /**
     * Add an item optimistically
     * @param {T} item - Item to add
     * @param {() => Promise<T>} action - API action
     * @param {Object} opts - Additional options
     * @returns {Promise<T>}
     */
    async add(item, action, opts = {}) {
      return store.optimistic(
        (items) => [...items, item],
        action,
        {
          ...opts,
          onSuccess: (result, items) => {
            // Replace temp item with server response
            const tempId = getId(item);
            return items.map((i) => (getId(i) === tempId ? result : i));
          }
        }
      );
    },

    /**
     * Update an item optimistically
     * @param {string | number} id - Item ID
     * @param {Partial<T>} changes - Changes to apply
     * @param {() => Promise<T>} action - API action
     * @param {Object} opts - Additional options
     * @returns {Promise<T>}
     */
    async update(id, changes, action, opts = {}) {
      return store.optimistic(
        (items) =>
          items.map((item) =>
            getId(item) === id ? { ...item, ...changes } : item
          ),
        action,
        {
          ...opts,
          onSuccess: (result, items) =>
            items.map((item) => (getId(item) === id ? result : item))
        }
      );
    },

    /**
     * Remove an item optimistically
     * @param {string | number} id - Item ID
     * @param {() => Promise<void>} action - API action
     * @param {Object} opts - Additional options
     * @returns {Promise<void>}
     */
    async remove(id, action, opts = {}) {
      return store.optimistic(
        (items) => items.filter((item) => getId(item) !== id),
        action,
        opts
      );
    },

    /**
     * Reorder items optimistically
     * @param {number} fromIndex - Source index
     * @param {number} toIndex - Target index
     * @param {() => Promise<void>} action - API action
     * @param {Object} opts - Additional options
     * @returns {Promise<void>}
     */
    async reorder(fromIndex, toIndex, action, opts = {}) {
      return store.optimistic(
        (items) => {
          const newItems = [...items];
          const [removed] = newItems.splice(fromIndex, 1);
          newItems.splice(toIndex, 0, removed);
          return newItems;
        },
        action,
        opts
      );
    },

    /**
     * Find an item by ID
     * @param {string | number} id - Item ID
     * @returns {T | undefined}
     */
    find(id) {
      return get(store).find((item) => getId(item) === id);
    },

    /**
     * Get current items
     * @returns {T[]}
     */
    getItems() {
      return get(store);
    }
  };
}

/**
 * Debounce optimistic updates to batch rapid changes.
 *
 * @template T
 * @param {(value: T) => Promise<void>} action - Action to debounce
 * @param {number} delay - Debounce delay in ms
 * @returns {(value: T) => void}
 *
 * @example
 * const saveTitle = debounceOptimistic(
 *   (title) => api.updateTitle(id, title),
 *   500
 * );
 *
 * // Call rapidly - only last value is sent
 * saveTitle('H');
 * saveTitle('He');
 * saveTitle('Hello');  // Only this one triggers API call
 */
export function debounceOptimistic(action, delay = 300) {
  let timeout = null;
  let latestValue = null;

  return (value) => {
    latestValue = value;

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(async () => {
      try {
        await action(latestValue);
      } catch (error) {
        console.error('Debounced action failed:', error);
      }
    }, delay);
  };
}
