/**
 * Testing Utilities for Phoenix LiveView + Svelte
 *
 * Provides mocks and helpers for testing Svelte components
 * that integrate with LiveView.
 *
 * Usage:
 *   import { mockLiveSocket, mockPushEvent, createTestStore } from '$lib/testing';
 *
 *   // In your test
 *   const { pushEvent, pushEventAsync, getEvents } = mockPushEvent();
 *
 *   // Render component
 *   const { component } = render(MyComponent);
 *
 *   // Assert events were pushed
 *   expect(getEvents()).toContainEqual({ event: 'save', payload: { id: 1 } });
 */

import { writable, get } from 'svelte/store';

// =============================================================================
// LiveSocket Mocking
// =============================================================================

/**
 * Create a mock LiveSocket for testing
 *
 * @param {object} options
 * @param {object} options.assigns - Initial assigns
 * @param {object} options.eventHandlers - Custom event handlers
 * @returns {MockLiveSocket}
 *
 * @example
 * const mockSocket = mockLiveSocket({
 *   assigns: { user: { id: 1, name: 'Test' } },
 *   eventHandlers: {
 *     'save': (payload) => ({ ok: true, data: payload })
 *   }
 * });
 */
export function mockLiveSocket(options = {}) {
  const { assigns = {}, eventHandlers = {} } = options;

  const events = [];
  const eventListeners = new Map();

  const mockSocket = {
    // Assigns
    assigns,

    // Track pushed events
    pushEvent(event, payload, callback) {
      events.push({ event, payload, timestamp: Date.now() });

      // Call custom handler if provided
      if (eventHandlers[event]) {
        const result = eventHandlers[event](payload);
        if (callback) callback(result);
        return result;
      }

      // Default success response
      const defaultResult = { ok: true };
      if (callback) callback(defaultResult);
      return defaultResult;
    },

    // Push event and return promise
    async pushEventAsync(event, payload) {
      return new Promise((resolve) => {
        this.pushEvent(event, payload, resolve);
      });
    },

    // Handle server events
    handleEvent(event, callback) {
      if (!eventListeners.has(event)) {
        eventListeners.set(event, []);
      }
      eventListeners.get(event).push(callback);

      // Return unsubscribe function
      return () => {
        const listeners = eventListeners.get(event);
        const index = listeners.indexOf(callback);
        if (index > -1) listeners.splice(index, 1);
      };
    },

    // Simulate server pushing event
    simulateEvent(event, payload) {
      const listeners = eventListeners.get(event) || [];
      listeners.forEach((callback) => callback(payload));
    },

    // Get all pushed events
    getEvents() {
      return [...events];
    },

    // Get events by name
    getEventsByName(name) {
      return events.filter((e) => e.event === name);
    },

    // Clear events
    clearEvents() {
      events.length = 0;
    },

    // Check if event was pushed
    hasEvent(name, payload = null) {
      return events.some(
        (e) =>
          e.event === name &&
          (payload === null || JSON.stringify(e.payload) === JSON.stringify(payload))
      );
    }
  };

  return mockSocket;
}

/**
 * Create mock pushEvent functions for testing
 *
 * @param {object} handlers - Event handlers { eventName: (payload) => response }
 * @returns {object} Mock functions and utilities
 *
 * @example
 * const { pushEvent, pushEventAsync, getEvents } = mockPushEvent({
 *   'create_todo': (p) => ({ ok: true, todo: { id: 1, ...p } })
 * });
 */
export function mockPushEvent(handlers = {}) {
  const events = [];

  const pushEvent = (event, payload, callback) => {
    events.push({ event, payload, timestamp: Date.now() });

    const handler = handlers[event];
    const result = handler ? handler(payload) : { ok: true };

    if (callback) {
      // Simulate async behavior
      setTimeout(() => callback(result), 0);
    }
  };

  const pushEventAsync = async (event, payload) => {
    return new Promise((resolve) => {
      pushEvent(event, payload, resolve);
    });
  };

  return {
    pushEvent,
    pushEventAsync,
    getEvents: () => [...events],
    clearEvents: () => {
      events.length = 0;
    },
    hasEvent: (name, payload = null) =>
      events.some(
        (e) =>
          e.event === name &&
          (payload === null || JSON.stringify(e.payload) === JSON.stringify(payload))
      )
  };
}

// =============================================================================
// Store Testing Utilities
// =============================================================================

/**
 * Create a test store with history tracking
 *
 * @template T
 * @param {T} initialValue - Initial store value
 * @returns {TestStore<T>}
 *
 * @example
 * const store = createTestStore([]);
 * store.set([1, 2, 3]);
 * store.update(arr => [...arr, 4]);
 *
 * expect(store.getHistory()).toHaveLength(3);
 * expect(store.get()).toEqual([1, 2, 3, 4]);
 */
export function createTestStore(initialValue) {
  const history = [initialValue];
  const store = writable(initialValue);

  const originalSet = store.set;
  const originalUpdate = store.update;

  store.set = (value) => {
    history.push(value);
    originalSet(value);
  };

  store.update = (fn) => {
    originalUpdate((current) => {
      const next = fn(current);
      history.push(next);
      return next;
    });
  };

  return {
    ...store,
    get: () => get(store),
    getHistory: () => [...history],
    getChangeCount: () => history.length - 1,
    reset: () => {
      history.length = 0;
      history.push(initialValue);
      originalSet(initialValue);
    }
  };
}

/**
 * Wait for store to have a specific value
 *
 * @template T
 * @param {import('svelte/store').Readable<T>} store
 * @param {(value: T) => boolean} predicate
 * @param {number} timeout
 * @returns {Promise<T>}
 *
 * @example
 * await waitForStore(loadingStore, (loading) => !loading);
 */
export function waitForStore(store, predicate, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      unsubscribe();
      reject(new Error(`Store did not match predicate within ${timeout}ms`));
    }, timeout);

    const unsubscribe = store.subscribe((value) => {
      if (predicate(value)) {
        clearTimeout(timeoutId);
        unsubscribe();
        resolve(value);
      }
    });
  });
}

/**
 * Collect store values over time
 *
 * @template T
 * @param {import('svelte/store').Readable<T>} store
 * @param {number} count - Number of values to collect
 * @param {number} timeout
 * @returns {Promise<T[]>}
 */
export function collectStoreValues(store, count, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const values = [];

    const timeoutId = setTimeout(() => {
      unsubscribe();
      reject(
        new Error(
          `Only collected ${values.length}/${count} values within ${timeout}ms`
        )
      );
    }, timeout);

    const unsubscribe = store.subscribe((value) => {
      values.push(value);
      if (values.length >= count) {
        clearTimeout(timeoutId);
        unsubscribe();
        resolve(values);
      }
    });
  });
}

// =============================================================================
// Component Testing Helpers
// =============================================================================

/**
 * Create a mock presence store for testing
 *
 * @param {Array} initialUsers
 * @returns {MockPresenceStore}
 *
 * @example
 * const presence = mockPresenceStore([
 *   { id: 1, name: 'Alice', typing: false },
 *   { id: 2, name: 'Bob', typing: true }
 * ]);
 */
export function mockPresenceStore(initialUsers = []) {
  const users = writable(initialUsers);

  return {
    subscribe: users.subscribe,
    users: { subscribe: users.subscribe },
    typingUsers: {
      subscribe: (fn) =>
        users.subscribe((list) => fn(list.filter((u) => u.typing)))
    },
    count: {
      subscribe: (fn) => users.subscribe((list) => fn(list.length))
    },
    sync: (userList) => users.set(userList),
    join: (user) => users.update((list) => [...list, user]),
    leave: (userId) => users.update((list) => list.filter((u) => u.id !== userId)),
    updateUser: (userId, meta) =>
      users.update((list) =>
        list.map((u) => (u.id === userId ? { ...u, ...meta } : u))
      ),
    setTyping: (userId, typing) =>
      users.update((list) =>
        list.map((u) => (u.id === userId ? { ...u, typing } : u))
      ),
    get: () => get(users)
  };
}

/**
 * Create a mock realtime store for testing
 *
 * @template T
 * @param {T[]} initialItems
 * @param {object} options
 * @returns {MockRealtimeStore<T>}
 */
export function mockRealtimeStore(initialItems = [], options = {}) {
  const getId = options.getId || ((item) => item.id);
  const items = writable(initialItems);
  const optimisticItems = new Map();

  return {
    subscribe: items.subscribe,
    set: (value) => items.set(value),
    append: (item) => items.update((list) => [...list, item]),
    prepend: (item) => items.update((list) => [item, ...list]),
    updateItem: (id, changes) =>
      items.update((list) =>
        list.map((item) => (getId(item) === id ? { ...item, ...changes } : item))
      ),
    remove: (id) =>
      items.update((list) => list.filter((item) => getId(item) !== id)),
    addOptimistic: (tempId, item) => {
      optimisticItems.set(tempId, item);
      items.update((list) => [...list, { ...item, _optimistic: true, _tempId: tempId }]);
    },
    reconcile: (tempId, realItem) => {
      optimisticItems.delete(tempId);
      items.update((list) =>
        list.map((item) =>
          item._tempId === tempId ? { ...realItem, _optimistic: false } : item
        )
      );
    },
    rollback: (tempId) => {
      optimisticItems.delete(tempId);
      items.update((list) => list.filter((item) => item._tempId !== tempId));
    },
    get: () => get(items),
    find: (id) => get(items).find((item) => getId(item) === id),
    getOptimisticCount: () => optimisticItems.size
  };
}

// =============================================================================
// Async Testing Utilities
// =============================================================================

/**
 * Wait for next tick
 */
export function tick() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

/**
 * Wait for specified milliseconds
 */
export function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Flush all pending promises
 */
export async function flushPromises() {
  await tick();
  await tick();
}

/**
 * Create a deferred promise for testing
 *
 * @returns {{ promise: Promise, resolve: Function, reject: Function }}
 */
export function createDeferred() {
  let resolve, reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

// =============================================================================
// Event Testing
// =============================================================================

/**
 * Create a spy for component events
 *
 * @returns {EventSpy}
 *
 * @example
 * const spy = createEventSpy();
 * const { component } = render(MyComponent, { props: { onSave: spy.handler } });
 *
 * // Trigger event...
 *
 * expect(spy.calls).toHaveLength(1);
 * expect(spy.lastCall).toEqual({ id: 1 });
 */
export function createEventSpy() {
  const calls = [];

  return {
    handler: (event) => {
      calls.push(event?.detail ?? event);
    },
    get calls() {
      return [...calls];
    },
    get callCount() {
      return calls.length;
    },
    get lastCall() {
      return calls[calls.length - 1];
    },
    get firstCall() {
      return calls[0];
    },
    wasCalled: () => calls.length > 0,
    wasCalledWith: (expected) =>
      calls.some(
        (call) => JSON.stringify(call) === JSON.stringify(expected)
      ),
    reset: () => {
      calls.length = 0;
    }
  };
}

/**
 * Wait for a component event
 *
 * @param {HTMLElement} element
 * @param {string} eventName
 * @param {number} timeout
 * @returns {Promise<CustomEvent>}
 */
export function waitForEvent(element, eventName, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(`Event "${eventName}" not received within ${timeout}ms`));
    }, timeout);

    element.addEventListener(
      eventName,
      (event) => {
        clearTimeout(timeoutId);
        resolve(event);
      },
      { once: true }
    );
  });
}
