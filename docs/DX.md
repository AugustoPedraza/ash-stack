# Developer Experience (DX) Guide

> Tools and utilities to make Phoenix + Svelte development smoother.

## Error Handling

### ErrorBoundary Component

Wrap components to catch and display errors gracefully:

```svelte
<script>
  import { ErrorBoundary } from '$lib/components/ui';
</script>

<ErrorBoundary>
  <RiskyComponent />
</ErrorBoundary>

<!-- With custom fallback -->
<ErrorBoundary fallback={CustomErrorComponent}>
  <RiskyComponent />
</ErrorBoundary>

<!-- Report errors to server -->
<ErrorBoundary reportToServer reportEvent="client_error">
  <RiskyComponent />
</ErrorBoundary>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `fallback` | Component | null | Custom error UI component |
| `reportToServer` | boolean | false | Send errors to server |
| `reportEvent` | string | 'client_error' | Event name for error reporting |
| `showDetails` | boolean | DEV | Show error stack in dev |
| `message` | string | 'Something went wrong' | Error message |
| `retryable` | boolean | true | Show retry button |

**Events:**
- `error` - Fired when error is caught: `{ error, info }`
- `reset` - Fired on retry: `{ retryCount }`

---

## Connection Status

### ConnectionStatus Component

Shows LiveView connection state with reconnect UI:

```svelte
<script>
  import { ConnectionStatus } from '$lib/components/ui';
</script>

<!-- Fixed position indicator -->
<ConnectionStatus position="bottom-right" />

<!-- Only show when disconnected -->
<ConnectionStatus showOnlyWhenDisconnected />

<!-- Inline in your UI -->
<header>
  <ConnectionStatus position="inline" />
</header>

<!-- Custom messages -->
<ConnectionStatus
  messages={{
    connecting: 'Reconnecting...',
    disconnected: 'You are offline'
  }}
/>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `position` | string | 'bottom-right' | Position: top-right, top-left, bottom-right, bottom-left, inline |
| `showOnlyWhenDisconnected` | boolean | true | Hide when connected |
| `autoHideDelay` | number | 3000 | Auto-hide delay in ms (0 = never) |
| `showReconnectButton` | boolean | true | Show manual reconnect |
| `messages` | object | {} | Custom status messages |

---

## Debug Utilities

### Enable Debug Mode

```javascript
import { enableDebug, disableDebug } from '$lib';

// Enable all debug features
enableDebug();

// Enable specific features
enableDebug({
  events: true,    // Log pushEvent calls
  stores: true,    // Log store changes
  presence: true,  // Log presence events
  timing: true,    // Log performance timing
  verbose: false   // Detailed console output
});

// Or from browser console
window.__ASH_STACK__.enableDebug();
```

### Event Logging

```javascript
import { logEvent, getEventLog, clearEventLog } from '$lib';

// Log custom events
logEvent('send', 'save_user', { id: 1, name: 'Alice' });
logEvent('receive', 'user_saved', { success: true });
logEvent('error', 'save_failed', { reason: 'Validation error' });

// Get event history
const events = getEventLog();

// Clear log
clearEventLog();
```

### Performance Timing

```javascript
import { startTiming, endTiming, timeAsync } from '$lib';

// Manual timing
startTiming('api_call');
await fetchData();
endTiming('api_call'); // Logs: [TIMING] api_call (234.5ms)

// Async timing wrapper
const result = await timeAsync('load_users', async () => {
  return await api.getUsers();
});
```

### Store Inspection

```javascript
import { registerDebugStore, inspectStore, dumpStores, listStores } from '$lib';

// Register stores for debugging
registerDebugStore('users', usersStore);
registerDebugStore('messages', messagesStore);

// Inspect from console
window.__ASH_STACK__.inspectStore('users');
window.__ASH_STACK__.dumpStores(); // Logs all store values
window.__ASH_STACK__.listStores(); // ['users', 'messages']
```

### Export Debug Data

```javascript
import { exportDebugData } from '$lib';

// Export all debug info as JSON
const debugJson = exportDebugData();
console.log(debugJson);

// Or from console
copy(window.__ASH_STACK__.exportDebugData());
```

---

## Testing Utilities

### Mock LiveSocket

```javascript
import { mockLiveSocket } from '$lib/testing';

const socket = mockLiveSocket({
  assigns: {
    user: { id: 1, name: 'Test User' }
  },
  eventHandlers: {
    'save': (payload) => ({ ok: true, data: payload }),
    'delete': (payload) => ({ ok: true })
  }
});

// Use in tests
socket.pushEvent('save', { name: 'New Name' });
expect(socket.hasEvent('save')).toBe(true);
expect(socket.getEvents()).toHaveLength(1);
```

### Mock Push Events

```javascript
import { mockPushEvent } from '$lib/testing';

const { pushEvent, pushEventAsync, getEvents, hasEvent } = mockPushEvent({
  'create_todo': (p) => ({ ok: true, todo: { id: 1, ...p } })
});

// In component test
await pushEventAsync('create_todo', { text: 'Test' });

expect(hasEvent('create_todo')).toBe(true);
expect(getEvents()).toContainEqual({
  event: 'create_todo',
  payload: { text: 'Test' }
});
```

### Test Stores

```javascript
import { createTestStore, waitForStore, collectStoreValues } from '$lib/testing';

// Store with history
const store = createTestStore([]);
store.set([1, 2]);
store.update(arr => [...arr, 3]);

expect(store.get()).toEqual([1, 2, 3]);
expect(store.getHistory()).toEqual([[], [1, 2], [1, 2, 3]]);
expect(store.getChangeCount()).toBe(2);

// Wait for store condition
await waitForStore(loadingStore, (loading) => !loading);

// Collect multiple values
const values = await collectStoreValues(counterStore, 3);
expect(values).toEqual([0, 1, 2]);
```

### Mock Presence Store

```javascript
import { mockPresenceStore } from '$lib/testing';

const presence = mockPresenceStore([
  { id: 1, name: 'Alice', typing: false },
  { id: 2, name: 'Bob', typing: true }
]);

// Test presence updates
presence.join({ id: 3, name: 'Charlie', typing: false });
presence.setTyping(1, true);
presence.leave(2);

expect(presence.get()).toHaveLength(2);
```

### Mock Realtime Store

```javascript
import { mockRealtimeStore } from '$lib/testing';

const messages = mockRealtimeStore([], { getId: (m) => m.id });

// Test optimistic updates
messages.addOptimistic('temp_1', { text: 'Hello' });
expect(messages.getOptimisticCount()).toBe(1);

// Reconcile with server response
messages.reconcile('temp_1', { id: 'real_1', text: 'Hello' });
expect(messages.getOptimisticCount()).toBe(0);
```

### Event Spying

```javascript
import { createEventSpy, waitForEvent } from '$lib/testing';

// Create spy
const spy = createEventSpy();
render(MyComponent, { props: { onSave: spy.handler } });

// Trigger event...
await fireEvent.click(saveButton);

expect(spy.wasCalled()).toBe(true);
expect(spy.callCount).toBe(1);
expect(spy.lastCall).toEqual({ id: 1 });

// Wait for event
const event = await waitForEvent(element, 'custom-event');
expect(event.detail).toEqual({ value: 42 });
```

### Async Helpers

```javascript
import { tick, wait, flushPromises, createDeferred } from '$lib/testing';

// Wait for next tick
await tick();

// Wait for specific time
await wait(100);

// Flush pending promises
await flushPromises();

// Create deferred promise for testing
const { promise, resolve, reject } = createDeferred();
// Later: resolve(value) or reject(error)
```

---

## Browser DevTools

When debug mode is enabled, access tools from the console:

```javascript
// Enable debug mode
window.__ASH_STACK__.enableDebug();

// Inspect stores
window.__ASH_STACK__.inspectStore('users');
window.__ASH_STACK__.dumpStores();

// View event log
window.__ASH_STACK__.getEventLog();
window.__ASH_STACK__.clearEventLog();

// Export all debug data
copy(window.__ASH_STACK__.exportDebugData());

// Check connection
window.__ASH_STACK__.connectionState;
```

---

## Integration with Phoenix

### Server-side Error Handling

```elixir
# Handle client errors in LiveView
def handle_event("client_error", %{"message" => msg, "stack" => stack}, socket) do
  Logger.error("Client error: #{msg}\n#{stack}")

  # Optionally report to error tracking
  Sentry.capture_message(msg, extra: %{stack: stack})

  {:noreply, socket}
end
```

### Connection State Events

Phoenix LiveView dispatches these events that `ConnectionStatus` listens to:

- `phx:page-loading-start` - Navigation/reconnection starting
- `phx:page-loading-stop` - Navigation/reconnection complete
- `phx:disconnect` - Socket disconnected
- `phx:error` - Socket error

---

## Best Practices

1. **Enable debug in development only**
   ```javascript
   if (import.meta.env.DEV) {
     enableDebug({ verbose: true });
   }
   ```

2. **Register important stores for inspection**
   ```javascript
   registerDebugStore('auth', authStore);
   registerDebugStore('cart', cartStore);
   ```

3. **Time slow operations**
   ```javascript
   await timeAsync('heavy_computation', () => processData(largeDataset));
   ```

4. **Use ErrorBoundary at strategic points**
   ```svelte
   <ErrorBoundary>
     <DataVisualization /> <!-- Complex component -->
   </ErrorBoundary>
   ```

5. **Show ConnectionStatus for real-time apps**
   ```svelte
   {#if isRealtimeApp}
     <ConnectionStatus />
   {/if}
   ```
