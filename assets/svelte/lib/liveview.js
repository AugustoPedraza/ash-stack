/**
 * LiveView Integration Utilities
 *
 * Provides seamless integration between Phoenix LiveView and Svelte components.
 *
 * Features:
 * - Toast notifications from server flash/events
 * - Store updates from server pushes
 * - Component-specific event handling
 * - Form submission helpers
 *
 * Usage in app.js:
 *
 *   import { initLiveViewHooks, getLiveSocket } from "./svelte/lib/liveview"
 *
 *   let liveSocket = new LiveSocket("/live", Socket, {
 *     hooks: initLiveViewHooks()
 *   })
 *
 *   // Later, from Svelte components:
 *   import { pushEvent, pushEventTo } from "$lib/liveview"
 *   pushEvent("save", { data })
 */

import { writable, get } from 'svelte/store';
import { toast } from './toast.js';

// =============================================================================
// LiveSocket Reference
// =============================================================================

let liveSocketRef = null;

/**
 * Set the LiveSocket reference for use in Svelte components.
 * Called from app.js after LiveSocket is created.
 *
 * @param {LiveSocket} liveSocket
 */
export function setLiveSocket(liveSocket) {
  liveSocketRef = liveSocket;
}

/**
 * Get the current LiveSocket instance.
 * @returns {LiveSocket|null}
 */
export function getLiveSocket() {
  return liveSocketRef;
}

// =============================================================================
// Server → Client Event Handling
// =============================================================================

/**
 * Store registry for server-pushed updates
 * @type {Map<string, import('svelte/store').Writable>}
 */
const storeRegistry = new Map();

/**
 * Register a Svelte store to receive server updates.
 *
 * @param {string} name - Store name (matches server push_store_update)
 * @param {import('svelte/store').Writable} store - Svelte writable store
 *
 * @example
 * const users = writable([]);
 * registerStore('users', users);
 *
 * // Server can now do:
 * // push_store_update(socket, "users", updated_users)
 */
export function registerStore(name, store) {
  storeRegistry.set(name, store);
}

/**
 * Unregister a store.
 * @param {string} name
 */
export function unregisterStore(name) {
  storeRegistry.delete(name);
}

/**
 * Component event listeners
 * @type {Map<string, Set<Function>>}
 */
const componentListeners = new Map();

/**
 * Subscribe to events for a specific component.
 *
 * @param {string} componentId - Component identifier
 * @param {(event: string, payload: any) => void} callback
 * @returns {() => void} Unsubscribe function
 *
 * @example
 * onMount(() => {
 *   const unsub = subscribeToComponent('user-list', (event, payload) => {
 *     if (event === 'user:added') {
 *       users = [...users, payload.user];
 *     }
 *   });
 *   return unsub;
 * });
 */
export function subscribeToComponent(componentId, callback) {
  if (!componentListeners.has(componentId)) {
    componentListeners.set(componentId, new Set());
  }
  componentListeners.get(componentId).add(callback);

  return () => {
    componentListeners.get(componentId)?.delete(callback);
  };
}

// =============================================================================
// Client → Server Event Helpers
// =============================================================================

/**
 * Push an event to the LiveView.
 *
 * @param {string} event - Event name
 * @param {object} payload - Event payload
 * @param {HTMLElement} [target] - Optional target element for phx-target
 *
 * @example
 * pushEvent('save', { id: 1, name: 'Updated' });
 */
export function pushEvent(event, payload = {}, target = null) {
  const socket = getLiveSocket();
  if (!socket) {
    console.warn('LiveSocket not initialized. Call setLiveSocket first.');
    return;
  }

  // Find the live view element
  const liveView = target?.closest('[data-phx-main]') || document.querySelector('[data-phx-main]');
  if (!liveView) {
    console.warn('No LiveView found on page');
    return;
  }

  const view = socket.getViewByEl(liveView);
  if (view) {
    view.pushEvent(event, payload);
  }
}

/**
 * Push an event to a specific LiveComponent.
 *
 * @param {string} selector - CSS selector or phx-target value
 * @param {string} event - Event name
 * @param {object} payload - Event payload
 *
 * @example
 * pushEventTo('#user-form', 'validate', formData);
 */
export function pushEventTo(selector, event, payload = {}) {
  const socket = getLiveSocket();
  if (!socket) {
    console.warn('LiveSocket not initialized');
    return;
  }

  const target = document.querySelector(selector);
  if (!target) {
    console.warn(`Target not found: ${selector}`);
    return;
  }

  const liveView = target.closest('[data-phx-main]');
  const view = socket.getViewByEl(liveView);

  if (view) {
    view.pushEventTo(selector, event, payload);
  }
}

/**
 * Push an event and wait for a response.
 *
 * @param {string} event - Event name
 * @param {object} payload - Event payload
 * @returns {Promise<any>} Response from server
 *
 * @example
 * const result = await pushEventAsync('search', { query: 'test' });
 */
export function pushEventAsync(event, payload = {}) {
  return new Promise((resolve, reject) => {
    const socket = getLiveSocket();
    if (!socket) {
      reject(new Error('LiveSocket not initialized'));
      return;
    }

    const liveView = document.querySelector('[data-phx-main]');
    const view = socket.getViewByEl(liveView);

    if (!view) {
      reject(new Error('No LiveView found'));
      return;
    }

    view.pushEvent(event, payload, (reply, ref) => {
      resolve(reply);
    });
  });
}

// =============================================================================
// Form Helpers
// =============================================================================

/**
 * Create a form submission handler that integrates with LiveView.
 *
 * @param {object} options
 * @param {string} options.event - Event name (default: form's phx-submit)
 * @param {() => object} options.getData - Function to get form data
 * @param {(result: any) => void} [options.onSuccess] - Success callback
 * @param {(error: any) => void} [options.onError] - Error callback
 *
 * @example
 * const handleSubmit = createFormHandler({
 *   event: 'save',
 *   getData: () => ({ name, email }),
 *   onSuccess: () => toast.success('Saved!'),
 *   onError: (err) => toast.error(err.message)
 * });
 */
export function createFormHandler({ event, getData, onSuccess, onError }) {
  return async (e) => {
    e?.preventDefault();

    try {
      const data = getData();
      const result = await pushEventAsync(event, data);

      if (result?.error) {
        onError?.(result.error);
      } else {
        onSuccess?.(result);
      }
    } catch (error) {
      onError?.(error);
    }
  };
}

// =============================================================================
// LiveView Hooks
// =============================================================================

/**
 * Initialize LiveView hooks for Svelte integration.
 * Call this when setting up LiveSocket.
 *
 * @returns {object} Hooks object for LiveSocket
 *
 * @example
 * let liveSocket = new LiveSocket("/live", Socket, {
 *   hooks: initLiveViewHooks()
 * })
 */
export function initLiveViewHooks() {
  return {
    /**
     * Toast hook - handles toast events from server
     */
    Toast: {
      mounted() {
        this.handleEvent('toast', ({ message, variant, duration, action }) => {
          toast[variant || 'info'](message, { duration, action });
        });
      }
    },

    /**
     * Store hook - handles store updates from server
     */
    StoreSync: {
      mounted() {
        this.handleEvent('store:update', ({ store: storeName, data }) => {
          const store = storeRegistry.get(storeName);
          if (store) {
            store.set(data);
          } else {
            console.warn(`Store not registered: ${storeName}`);
          }
        });
      }
    },

    /**
     * Svelte component hook - handles component-specific events
     */
    SvelteComponent: {
      mounted() {
        const componentId = this.el.dataset.svelteId;
        if (!componentId) return;

        this.handleEvent(`svelte:${componentId}`, ({ event, payload }) => {
          const listeners = componentListeners.get(componentId);
          listeners?.forEach(callback => callback(event, payload));
        });
      }
    },

    /**
     * Flash hook - auto-shows flash messages as toasts
     */
    FlashToast: {
      mounted() {
        // Handle initial flash from page load
        this.showFlash();

        // Handle flash updates
        this.handleEvent('flash', () => this.showFlash());
      },

      updated() {
        this.showFlash();
      },

      showFlash() {
        const flash = this.el.dataset;
        if (flash.success) toast.success(flash.success);
        if (flash.error) toast.error(flash.error);
        if (flash.info) toast.info(flash.info);
        if (flash.warning) toast.warning(flash.warning);
      }
    }
  };
}

// =============================================================================
// Reactive Store for LiveView State
// =============================================================================

/**
 * Create a store that syncs with LiveView assigns.
 *
 * @param {string} assignName - Name of the LiveView assign
 * @param {any} initialValue - Initial value before server sends data
 * @returns {import('svelte/store').Writable}
 *
 * @example
 * // In Svelte component
 * const users = createLiveStore('users', []);
 *
 * // LiveView pushes: assign(socket, users: updated_users)
 * // Store automatically updates
 */
export function createLiveStore(assignName, initialValue) {
  const store = writable(initialValue);

  // Register for server updates
  registerStore(assignName, store);

  // Return store with cleanup
  return {
    subscribe: store.subscribe,
    set: store.set,
    update: store.update,
    destroy: () => unregisterStore(assignName)
  };
}

// =============================================================================
// Presence Integration
// =============================================================================

/**
 * Presence state store
 */
export const presence = writable({
  users: [],
  metas: new Map()
});

/**
 * Initialize presence tracking.
 * Call from a component that needs presence data.
 *
 * @param {string} topic - Presence topic to join
 *
 * @example
 * onMount(() => {
 *   const cleanup = initPresence('room:lobby');
 *   return cleanup;
 * });
 */
export function initPresence(topic) {
  const socket = getLiveSocket();
  if (!socket?.channel) {
    console.warn('LiveSocket channel not available for presence');
    return () => {};
  }

  // This would integrate with Phoenix.Presence
  // Implementation depends on your presence setup

  return () => {
    // Cleanup
  };
}
