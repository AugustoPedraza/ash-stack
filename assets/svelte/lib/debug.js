/**
 * Debug Utilities for Phoenix + Svelte Development
 *
 * Provides logging, event tracing, and debugging tools for
 * LiveView ↔ Svelte communication.
 *
 * Features:
 * - Event logging with filtering
 * - Performance timing
 * - Store inspection
 * - Connection state monitoring
 *
 * Usage:
 *   import { debug, enableDebug, logEvent } from '$lib/debug';
 *
 *   // Enable debug mode
 *   enableDebug({ events: true, stores: true });
 *
 *   // Log custom events
 *   logEvent('user:action', { id: 123 });
 */

import { writable, get } from 'svelte/store';

// =============================================================================
// Debug Configuration
// =============================================================================

/**
 * Debug configuration store
 */
export const debugConfig = writable({
  enabled: import.meta.env?.DEV ?? false,
  events: true,
  stores: true,
  presence: true,
  timing: true,
  verbose: false
});

/**
 * Enable debug mode with options
 * @param {object} options
 */
export function enableDebug(options = {}) {
  debugConfig.update((config) => ({
    ...config,
    enabled: true,
    ...options
  }));

  if (typeof window !== 'undefined') {
    window.__ASH_STACK_DEBUG__ = true;
    console.log(
      '%c[AshStack] Debug mode enabled',
      'color: #10b981; font-weight: bold'
    );
  }
}

/**
 * Disable debug mode
 */
export function disableDebug() {
  debugConfig.update((config) => ({ ...config, enabled: false }));

  if (typeof window !== 'undefined') {
    window.__ASH_STACK_DEBUG__ = false;
  }
}

/**
 * Check if debug is enabled
 */
export function isDebugEnabled() {
  return get(debugConfig).enabled;
}

// =============================================================================
// Event Logging
// =============================================================================

const eventLog = writable([]);
const MAX_LOG_SIZE = 100;

/**
 * Log styles for different event types
 */
const LOG_STYLES = {
  send: 'color: #3b82f6; font-weight: bold',      // blue
  receive: 'color: #10b981; font-weight: bold',   // green
  store: 'color: #8b5cf6; font-weight: bold',     // purple
  presence: 'color: #f59e0b; font-weight: bold',  // amber
  error: 'color: #ef4444; font-weight: bold',     // red
  timing: 'color: #6b7280; font-style: italic',   // gray
  info: 'color: #06b6d4; font-weight: bold'       // cyan
};

/**
 * Log an event with optional payload
 *
 * @param {string} type - Event type (send, receive, store, presence, error)
 * @param {string} name - Event name
 * @param {any} payload - Event payload
 * @param {object} options - Additional options
 */
export function logEvent(type, name, payload = null, options = {}) {
  const config = get(debugConfig);
  if (!config.enabled) return;

  // Check if this event type should be logged
  if (type === 'store' && !config.stores) return;
  if (type === 'presence' && !config.presence) return;
  if ((type === 'send' || type === 'receive') && !config.events) return;

  const timestamp = new Date();
  const entry = {
    type,
    name,
    payload,
    timestamp,
    duration: options.duration
  };

  // Add to log
  eventLog.update((log) => {
    const newLog = [...log, entry];
    return newLog.slice(-MAX_LOG_SIZE);
  });

  // Console output
  const prefix = `[${type.toUpperCase()}]`;
  const style = LOG_STYLES[type] || LOG_STYLES.info;
  const timeStr = timestamp.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3
  });

  if (config.verbose && payload) {
    console.groupCollapsed(`%c${prefix} ${name} @ ${timeStr}`, style);
    console.log('Payload:', payload);
    if (options.duration) {
      console.log(`%cDuration: ${options.duration.toFixed(2)}ms`, LOG_STYLES.timing);
    }
    console.groupEnd();
  } else {
    const durationStr = options.duration ? ` (${options.duration.toFixed(1)}ms)` : '';
    console.log(`%c${prefix} ${name}${durationStr}`, style, payload || '');
  }
}

/**
 * Get the event log
 */
export function getEventLog() {
  return get(eventLog);
}

/**
 * Clear the event log
 */
export function clearEventLog() {
  eventLog.set([]);
}

/**
 * Subscribe to event log changes
 */
export const eventLogStore = { subscribe: eventLog.subscribe };

// =============================================================================
// Performance Timing
// =============================================================================

const timings = new Map();

/**
 * Start timing an operation
 * @param {string} label - Timing label
 */
export function startTiming(label) {
  if (!get(debugConfig).timing) return;
  timings.set(label, performance.now());
}

/**
 * End timing and log result
 * @param {string} label - Timing label
 * @returns {number|null} Duration in ms
 */
export function endTiming(label) {
  if (!get(debugConfig).timing) return null;

  const start = timings.get(label);
  if (!start) return null;

  const duration = performance.now() - start;
  timings.delete(label);

  logEvent('timing', label, null, { duration });
  return duration;
}

/**
 * Time an async operation
 * @param {string} label - Timing label
 * @param {() => Promise<T>} fn - Async function to time
 * @returns {Promise<T>}
 */
export async function timeAsync(label, fn) {
  startTiming(label);
  try {
    return await fn();
  } finally {
    endTiming(label);
  }
}

// =============================================================================
// Store Inspection
// =============================================================================

const registeredStores = new Map();

/**
 * Register a store for debugging
 * @param {string} name - Store name
 * @param {import('svelte/store').Readable} store - Svelte store
 */
export function registerDebugStore(name, store) {
  registeredStores.set(name, store);

  // Log store changes in verbose mode
  if (get(debugConfig).verbose) {
    store.subscribe((value) => {
      logEvent('store', `${name}:changed`, value);
    });
  }
}

/**
 * Get current value of a registered store
 * @param {string} name - Store name
 */
export function inspectStore(name) {
  const store = registeredStores.get(name);
  if (!store) {
    console.warn(`[Debug] Store not found: ${name}`);
    return undefined;
  }
  return get(store);
}

/**
 * List all registered stores
 */
export function listStores() {
  return Array.from(registeredStores.keys());
}

/**
 * Dump all store values to console
 */
export function dumpStores() {
  console.group('%c[Debug] Store Dump', 'color: #8b5cf6; font-weight: bold');
  for (const [name, store] of registeredStores) {
    console.log(`${name}:`, get(store));
  }
  console.groupEnd();
}

// =============================================================================
// Connection State
// =============================================================================

/**
 * Connection state store
 */
export const connectionState = writable({
  connected: true,
  latency: null,
  lastPing: null,
  reconnectAttempts: 0
});

/**
 * Update connection state
 */
export function updateConnectionState(state) {
  connectionState.update((current) => ({ ...current, ...state }));

  if (get(debugConfig).enabled) {
    logEvent('info', 'connection:state', state);
  }
}

// =============================================================================
// Debug Panel Helpers
// =============================================================================

/**
 * Get debug summary for display
 */
export function getDebugSummary() {
  const config = get(debugConfig);
  const log = get(eventLog);
  const connection = get(connectionState);

  return {
    enabled: config.enabled,
    eventCount: log.length,
    storeCount: registeredStores.size,
    connected: connection.connected,
    latency: connection.latency
  };
}

/**
 * Export debug data as JSON
 */
export function exportDebugData() {
  const data = {
    timestamp: new Date().toISOString(),
    config: get(debugConfig),
    events: get(eventLog),
    stores: Object.fromEntries(
      Array.from(registeredStores.entries()).map(([name, store]) => [
        name,
        get(store)
      ])
    ),
    connection: get(connectionState)
  };

  return JSON.stringify(data, null, 2);
}

// =============================================================================
// Global Debug Access (Dev Only)
// =============================================================================

if (typeof window !== 'undefined' && import.meta.env?.DEV) {
  window.__ASH_STACK__ = {
    enableDebug,
    disableDebug,
    logEvent,
    getEventLog,
    clearEventLog,
    inspectStore,
    listStores,
    dumpStores,
    exportDebugData,
    connectionState,
    debugConfig
  };

  console.log(
    '%c[AshStack] Debug tools available at window.__ASH_STACK__',
    'color: #6b7280; font-style: italic'
  );
}
