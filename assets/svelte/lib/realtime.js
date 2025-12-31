/**
 * Real-time Svelte Utilities
 *
 * Provides seamless integration between Phoenix PubSub/Presence and Svelte stores.
 *
 * Features:
 * - Auto-syncing stores with server broadcasts
 * - Presence tracking (online users, typing indicators)
 * - Optimistic update reconciliation
 * - Conflict resolution
 *
 * Usage:
 *   import { createRealtimeStore, createPresenceStore } from '$lib/realtime';
 *
 *   const messages = createRealtimeStore('messages', []);
 *   const users = createPresenceStore('room:lobby');
 */

import { writable, derived, get } from 'svelte/store';
import { getLiveSocket } from './liveview.js';

// =============================================================================
// Real-time Store
// =============================================================================

/**
 * Registry of real-time stores for server sync
 * @type {Map<string, RealtimeStore>}
 */
const realtimeStores = new Map();

/**
 * Create a store that auto-syncs with server broadcasts.
 *
 * @template T
 * @param {string} name - Store name (must match server-side store name)
 * @param {T[]} initialValue - Initial value
 * @param {object} options
 * @param {(item: T) => string | number} [options.getId] - Function to get item ID
 * @param {(a: T, b: T) => number} [options.sort] - Sort function
 * @param {(existing: T, incoming: T) => T} [options.merge] - Merge function for conflicts
 * @returns {RealtimeStore<T>}
 *
 * @example
 * const messages = createRealtimeStore('messages', [], {
 *   getId: (m) => m.id,
 *   sort: (a, b) => a.created_at - b.created_at
 * });
 *
 * // Server broadcasts automatically update the store:
 * // broadcast_store_sync(pubsub, topic, "messages", "append", message)
 */
export function createRealtimeStore(name, initialValue = [], options = {}) {
  const getId = options.getId || ((item) => item.id);
  const sortFn = options.sort;
  const mergeFn = options.merge || ((_, incoming) => incoming);

  const store = writable(initialValue);
  const pendingOptimistic = new Map(); // temp_id -> original item

  const realtimeStore = {
    subscribe: store.subscribe,

    /**
     * Set the entire store value
     */
    set(value) {
      store.set(sortFn ? [...value].sort(sortFn) : value);
    },

    /**
     * Update the store
     */
    update(fn) {
      store.update((current) => {
        const result = fn(current);
        return sortFn ? [...result].sort(sortFn) : result;
      });
    },

    /**
     * Append item to the store
     */
    append(item) {
      store.update((items) => {
        const result = [...items, item];
        return sortFn ? result.sort(sortFn) : result;
      });
    },

    /**
     * Prepend item to the store
     */
    prepend(item) {
      store.update((items) => {
        const result = [item, ...items];
        return sortFn ? result.sort(sortFn) : result;
      });
    },

    /**
     * Update an item by ID
     */
    updateItem(id, changes) {
      store.update((items) =>
        items.map((item) =>
          getId(item) === id ? { ...item, ...changes } : item
        )
      );
    },

    /**
     * Remove an item by ID
     */
    remove(id) {
      store.update((items) => items.filter((item) => getId(item) !== id));
    },

    /**
     * Add an optimistic item (with temp ID)
     */
    addOptimistic(tempId, item) {
      pendingOptimistic.set(tempId, item);
      this.append({ ...item, _optimistic: true, _tempId: tempId });
    },

    /**
     * Reconcile optimistic update with server response
     */
    reconcile(tempId, realItem) {
      pendingOptimistic.delete(tempId);
      store.update((items) =>
        items.map((item) =>
          item._tempId === tempId
            ? { ...realItem, _optimistic: false }
            : item
        )
      );
    },

    /**
     * Rollback an optimistic update
     */
    rollback(tempId) {
      pendingOptimistic.delete(tempId);
      store.update((items) =>
        items.filter((item) => item._tempId !== tempId)
      );
    },

    /**
     * Handle server sync event
     */
    handleSync(action, payload) {
      switch (action) {
        case 'set':
          this.set(payload.data);
          break;
        case 'append':
          this.append(payload.item);
          break;
        case 'prepend':
          this.prepend(payload.item);
          break;
        case 'update':
          this.updateItem(payload.id, payload.changes);
          break;
        case 'remove':
          this.remove(payload.id);
          break;
        default:
          console.warn(`Unknown sync action: ${action}`);
      }
    },

    /**
     * Handle reconciliation from server
     */
    handleReconcile(tempId, item) {
      if (pendingOptimistic.has(tempId)) {
        this.reconcile(tempId, item);
      } else {
        // Item came from another client, just append
        this.append(item);
      }
    },

    /**
     * Get current value
     */
    get() {
      return get(store);
    },

    /**
     * Find item by ID
     */
    find(id) {
      return get(store).find((item) => getId(item) === id);
    },

    /**
     * Cleanup
     */
    destroy() {
      realtimeStores.delete(name);
      pendingOptimistic.clear();
    }
  };

  // Register for server sync
  realtimeStores.set(name, realtimeStore);

  return realtimeStore;
}

/**
 * Get a registered realtime store by name
 */
export function getRealtimeStore(name) {
  return realtimeStores.get(name);
}

// =============================================================================
// Presence Store
// =============================================================================

/**
 * Presence state for a topic
 * @type {Map<string, import('svelte/store').Writable>}
 */
const presenceStores = new Map();

/**
 * Create a presence store for tracking online users.
 *
 * @param {string} topic - Presence topic
 * @returns {PresenceStore}
 *
 * @example
 * const presence = createPresenceStore('room:lobby');
 *
 * // In template:
 * {#each $presence.users as user}
 *   <Avatar src={user.avatar} status={user.status} />
 *   {#if user.typing}<TypingIndicator />{/if}
 * {/each}
 *
 * // Show typing users:
 * {#if $presence.typingUsers.length > 0}
 *   {$presence.typingUsers.map(u => u.name).join(', ')} typing...
 * {/if}
 */
export function createPresenceStore(topic) {
  const users = writable([]);

  const presenceStore = {
    subscribe: users.subscribe,

    /**
     * Derived store of all users
     */
    users: { subscribe: users.subscribe },

    /**
     * Derived store of users who are typing
     */
    typingUsers: derived(users, ($users) =>
      $users.filter((u) => u.typing)
    ),

    /**
     * Derived store of online count
     */
    count: derived(users, ($users) => $users.length),

    /**
     * Update users list from server
     */
    sync(userList) {
      users.set(userList);
    },

    /**
     * Handle user join
     */
    join(user) {
      users.update((list) => {
        if (list.find((u) => u.id === user.id)) {
          return list; // Already present
        }
        return [...list, user];
      });
    },

    /**
     * Handle user leave
     */
    leave(userId) {
      users.update((list) => list.filter((u) => u.id !== userId));
    },

    /**
     * Update user metadata (e.g., typing status)
     */
    updateUser(userId, meta) {
      users.update((list) =>
        list.map((u) => (u.id === userId ? { ...u, ...meta } : u))
      );
    },

    /**
     * Check if user is online
     */
    isOnline(userId) {
      return get(users).some((u) => u.id === userId);
    },

    /**
     * Get current users
     */
    get() {
      return get(users);
    },

    /**
     * Cleanup
     */
    destroy() {
      presenceStores.delete(topic);
    }
  };

  presenceStores.set(topic, presenceStore);

  return presenceStore;
}

/**
 * Get a registered presence store by topic
 */
export function getPresenceStore(topic) {
  return presenceStores.get(topic);
}

// =============================================================================
// LiveView Hooks for Real-time
// =============================================================================

/**
 * Initialize real-time LiveView hooks.
 * Call this and spread into your hooks object.
 *
 * @returns {object} Hooks for LiveSocket
 *
 * @example
 * let liveSocket = new LiveSocket("/live", Socket, {
 *   hooks: {
 *     ...initLiveViewHooks(),
 *     ...initRealtimeHooks()
 *   }
 * })
 */
export function initRealtimeHooks() {
  return {
    /**
     * Real-time store sync hook
     */
    RealtimeSync: {
      mounted() {
        // Handle store sync events
        this.handleEvent('store:sync', ({ store, action, payload }) => {
          const realtimeStore = getRealtimeStore(store);
          if (realtimeStore) {
            realtimeStore.handleSync(action, payload);
          } else {
            console.warn(`Realtime store not found: ${store}`);
          }
        });

        // Handle optimistic reconciliation
        this.handleEvent('store:reconcile', ({ store, temp_id, item }) => {
          const realtimeStore = getRealtimeStore(store);
          if (realtimeStore) {
            realtimeStore.handleReconcile(temp_id, item);
          }
        });

        // Handle optimistic rollback
        this.handleEvent('store:rollback', ({ store, temp_id, reason }) => {
          const realtimeStore = getRealtimeStore(store);
          if (realtimeStore) {
            realtimeStore.rollback(temp_id);
            if (reason) {
              console.warn(`Optimistic update rolled back: ${reason}`);
            }
          }
        });
      }
    },

    /**
     * Presence sync hook
     */
    PresenceSync: {
      mounted() {
        // Handle full presence sync
        this.handleEvent('presence:sync', ({ topic, users }) => {
          const presenceStore = getPresenceStore(topic);
          if (presenceStore) {
            presenceStore.sync(users);
          }
        });

        // Handle presence join
        this.handleEvent('presence:join', ({ topic, user }) => {
          const presenceStore = getPresenceStore(topic);
          if (presenceStore) {
            presenceStore.join(user);
          }
        });

        // Handle presence leave
        this.handleEvent('presence:leave', ({ topic, user_id }) => {
          const presenceStore = getPresenceStore(topic);
          if (presenceStore) {
            presenceStore.leave(user_id);
          }
        });

        // Handle presence update (e.g., typing status)
        this.handleEvent('presence:update', ({ topic, user_id, meta }) => {
          const presenceStore = getPresenceStore(topic);
          if (presenceStore) {
            presenceStore.updateUser(user_id, meta);
          }
        });
      }
    }
  };
}

// =============================================================================
// Typing Indicator Utilities
// =============================================================================

/**
 * Create a typing indicator manager.
 *
 * @param {object} options
 * @param {() => void} options.onStart - Called when typing starts
 * @param {() => void} options.onStop - Called when typing stops
 * @param {number} [options.debounce=1000] - Debounce time in ms
 * @returns {TypingManager}
 *
 * @example
 * const typing = createTypingIndicator({
 *   onStart: () => pushEvent('typing:start'),
 *   onStop: () => pushEvent('typing:stop'),
 *   debounce: 1500
 * });
 *
 * // In input handler:
 * <input on:input={typing.onInput} />
 */
export function createTypingIndicator(options) {
  const { onStart, onStop, debounce = 1000 } = options;

  let isTyping = false;
  let timeout = null;

  return {
    /**
     * Call on input event
     */
    onInput() {
      if (!isTyping) {
        isTyping = true;
        onStart?.();
      }

      // Reset timeout
      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(() => {
        isTyping = false;
        onStop?.();
      }, debounce);
    },

    /**
     * Force stop typing
     */
    stop() {
      if (timeout) {
        clearTimeout(timeout);
      }
      if (isTyping) {
        isTyping = false;
        onStop?.();
      }
    },

    /**
     * Check if currently typing
     */
    get isTyping() {
      return isTyping;
    },

    /**
     * Cleanup
     */
    destroy() {
      if (timeout) {
        clearTimeout(timeout);
      }
    }
  };
}

// =============================================================================
// Conflict Resolution
// =============================================================================

/**
 * Default merge strategies for conflict resolution
 */
export const mergeStrategies = {
  /**
   * Server wins - always use incoming data
   */
  serverWins: (existing, incoming) => incoming,

  /**
   * Client wins - keep existing data
   */
  clientWins: (existing, incoming) => existing,

  /**
   * Last write wins - use most recent by timestamp
   */
  lastWriteWins: (existing, incoming) => {
    const existingTime = existing.updated_at || existing.created_at || 0;
    const incomingTime = incoming.updated_at || incoming.created_at || 0;
    return incomingTime >= existingTime ? incoming : existing;
  },

  /**
   * Deep merge - recursively merge objects
   */
  deepMerge: (existing, incoming) => {
    if (typeof existing !== 'object' || typeof incoming !== 'object') {
      return incoming;
    }
    return { ...existing, ...incoming };
  }
};
