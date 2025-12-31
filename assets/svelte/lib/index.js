/**
 * Svelte Utilities Index
 *
 * Usage:
 * import { toast, required, haptic, swipe } from '$lib';
 */

// Toast notifications
export { toast } from './toast.js';

// Validation
export {
  required,
  email,
  minLength,
  maxLength,
  min,
  max,
  pattern,
  matches,
  url,
  phone,
  createValidator,
  validateField,
  createFormStore
} from './validation.js';

// Utilities
export { cn, debounce, throttle, uniqueId } from './utils.js';

// Mobile
export {
  // Platform detection
  isIOS,
  isStandalone,
  isTouchDevice,
  platform,
  // Haptics
  haptic,
  hapticAction,
  HapticType,
  // Safe areas
  safeArea,
  // Keyboard
  keyboard,
  // Scroll lock
  lockScroll,
  unlockScroll,
  // Orientation
  orientation
} from './mobile.js';

// Gestures
export {
  swipe,
  pullToRefresh,
  longPress,
  pan,
  pinch
} from './gestures.js';

// Optimistic Updates
export {
  createOptimisticStore,
  createOptimisticList,
  optimistic,
  debounceOptimistic
} from './optimistic.js';

// LiveView Integration
export {
  setLiveSocket,
  getLiveSocket,
  pushEvent,
  pushEventTo,
  pushEventAsync,
  registerStore,
  unregisterStore,
  subscribeToComponent,
  createFormHandler,
  createLiveStore,
  initLiveViewHooks,
  presence,
  initPresence
} from './liveview.js';

// Real-time Integration
export {
  // Realtime stores
  createRealtimeStore,
  getRealtimeStore,
  // Presence stores
  createPresenceStore,
  getPresenceStore,
  // LiveView hooks
  initRealtimeHooks,
  // Typing indicator
  createTypingIndicator,
  // Merge strategies
  mergeStrategies
} from './realtime.js';

// Debug Utilities (dev only)
export {
  // Configuration
  debugConfig,
  enableDebug,
  disableDebug,
  isDebugEnabled,
  // Event logging
  logEvent,
  getEventLog,
  clearEventLog,
  eventLogStore,
  // Timing
  startTiming,
  endTiming,
  timeAsync,
  // Store inspection
  registerDebugStore,
  inspectStore,
  listStores,
  dumpStores,
  // Connection state
  connectionState,
  updateConnectionState,
  // Export
  getDebugSummary,
  exportDebugData
} from './debug.js';

// Testing Utilities
export {
  // LiveSocket mocking
  mockLiveSocket,
  mockPushEvent,
  // Store testing
  createTestStore,
  waitForStore,
  collectStoreValues,
  // Component mocks
  mockPresenceStore,
  mockRealtimeStore,
  // Async helpers
  tick,
  wait,
  flushPromises,
  createDeferred,
  // Event testing
  createEventSpy,
  waitForEvent
} from './testing.js';
