# Mobile-First PWA Guide

> iOS-optimized mobile development with shadcn-svelte.

## Stack Overview

```
shadcn-svelte (Bits UI primitives + Tailwind)
    ↓
Our Design Tokens (colors, spacing, etc.)
    ↓
Mobile Enhancement Layer (gestures, haptics, safe areas)
```

## Setup

```bash
# Install dependencies
cd assets && npm install

# Add shadcn components (when needed)
npx shadcn-svelte add button dialog dropdown-menu
```

## CSS Imports

```css
/* assets/css/app.css - automatically loaded */
@import "tailwindcss";
@import "./tokens.css";      /* Design tokens */
@import "./shadcn.css";      /* shadcn variable mapping */
@import "./mobile.css";      /* Mobile enhancements */
@import "./tailwind.config.css";  /* Restricted theme */
```

---

## Mobile Utilities

### Platform Detection

```javascript
import { platform, isIOS, isStandalone } from '$lib/components/ui';

// Reactive store
$: if ($platform.ios) {
  // iOS-specific behavior
}

// One-time checks
if (isIOS()) { ... }
if (isStandalone()) { ... }  // Installed PWA
```

### Haptic Feedback

```javascript
import { haptic, HapticType } from '$lib/components/ui';

// Trigger haptics
haptic(HapticType.LIGHT);    // Subtle
haptic(HapticType.MEDIUM);   // Standard
haptic(HapticType.HEAVY);    // Strong
haptic(HapticType.SUCCESS);  // Success pattern
haptic(HapticType.ERROR);    // Error pattern
haptic(HapticType.SELECTION); // Selection tick

// As Svelte action
<button use:hapticAction={HapticType.LIGHT}>Tap me</button>
```

### Safe Areas

```javascript
import { safeArea } from '$lib/components/ui';

// Reactive store
$: console.log($safeArea.top, $safeArea.bottom);
```

```css
/* CSS utilities (in mobile.css) */
.safe-top { padding-top: var(--safe-area-top); }
.safe-bottom { padding-bottom: max(var(--safe-area-bottom), 1rem); }
.safe-area { /* all sides */ }
```

### Keyboard Detection

```javascript
import { keyboard } from '$lib/components/ui';

$: if ($keyboard.visible) {
  console.log('Keyboard height:', $keyboard.height);
}
```

### Scroll Lock

```javascript
import { lockScroll, unlockScroll } from '$lib/components/ui';

// For modals/sheets
lockScroll();   // Prevent background scroll
unlockScroll(); // Restore scroll
```

---

## Touch Gestures

### Swipe

```svelte
<script>
  import { swipe } from '$lib/components/ui';

  function handleSwipe(e) {
    console.log(e.detail.direction); // 'left', 'right', 'up', 'down'
  }
</script>

<div use:swipe on:swipe={handleSwipe}>
  Swipe me
</div>

<!-- Or specific directions -->
<div use:swipe on:swipeleft={goNext} on:swiperight={goPrev}>
```

### Pull to Refresh

```svelte
<script>
  import { pullToRefresh } from '$lib/components/ui';

  async function handleRefresh(e) {
    await fetchData();
    e.detail.done(); // Required to reset
  }
</script>

<div use:pullToRefresh on:refresh={handleRefresh}>
  <slot />
</div>
```

### Long Press

```svelte
<script>
  import { longPress } from '$lib/components/ui';
</script>

<div use:longPress={{ duration: 500 }} on:longpress={showContextMenu}>
  Long press me
</div>
```

### Pan (Drag)

```svelte
<script>
  import { pan } from '$lib/components/ui';

  let x = 0;
  let y = 0;
</script>

<div
  use:pan={{ direction: 'both' }}
  on:panmove={(e) => {
    x += e.detail.velocityX;
    y += e.detail.velocityY;
  }}
  style="transform: translate({x}px, {y}px)"
>
  Drag me
</div>
```

### Pinch (Zoom)

```svelte
<script>
  import { pinch } from '$lib/components/ui';

  let scale = 1;
</script>

<div
  use:pinch
  on:pinch={(e) => scale = e.detail.scale}
  style="transform: scale({scale})"
>
  Pinch to zoom
</div>
```

---

## iOS-Style Sheet

```svelte
<script>
  import { Sheet, Button } from '$lib/components/ui';

  let open = false;
</script>

<Button on:click={() => open = true}>Open Sheet</Button>

<Sheet
  bind:open
  title="Settings"
  gestureEnabled={true}
  snapPoints={[0.5, 1]}
>
  <p>Sheet content with gesture dismiss</p>

  <svelte:fragment slot="footer">
    <Button fullWidth on:click={() => open = false}>Done</Button>
  </svelte:fragment>
</Sheet>
```

### Sheet Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| open | boolean | false | Open state |
| title | string | '' | Sheet title |
| showClose | boolean | true | Show close button |
| closeOnBackdrop | boolean | true | Close on backdrop tap |
| closeOnEscape | boolean | true | Close on Escape key |
| gestureEnabled | boolean | true | Enable swipe dismiss |
| dismissThreshold | number | 0.3 | Pull distance to dismiss (0-1) |
| snapPoints | number[] | [1] | Snap points (0-1, e.g., [0.5, 1]) |

---

## Custom UI Components

### Modal

```svelte
<script>
  import { Modal, Button } from '$lib/components/ui';
  let open = false;
</script>

<Button on:click={() => open = true}>Open Modal</Button>

<Modal bind:open title="Confirm Action" gestureEnabled>
  <p>Are you sure you want to proceed?</p>

  <svelte:fragment slot="footer">
    <Button variant="ghost" on:click={() => open = false}>Cancel</Button>
    <Button variant="primary">Confirm</Button>
  </svelte:fragment>
</Modal>
```

### Tabs

```svelte
<script>
  import { Tabs } from '$lib/components/ui';

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'settings', label: 'Settings' },
    { id: 'billing', label: 'Billing' }
  ];
  let activeTab = 'overview';
</script>

<Tabs {tabs} bind:value={activeTab} variant="segment" fullWidth>
  <div slot="overview">Overview content</div>
  <div slot="settings">Settings content</div>
  <div slot="billing">Billing content</div>
</Tabs>
```

### Toggle

```svelte
<script>
  import { Toggle } from '$lib/components/ui';
  let notifications = true;
</script>

<Toggle
  bind:checked={notifications}
  label="Push Notifications"
  description="Receive alerts on your device"
/>
```

### Dropdown (Sheet on Mobile)

```svelte
<script>
  import { Dropdown } from '$lib/components/ui';

  const items = [
    { id: 'edit', label: 'Edit' },
    { id: 'duplicate', label: 'Duplicate' },
    { separator: true },
    { id: 'delete', label: 'Delete', danger: true }
  ];
</script>

<Dropdown {items} title="Actions" on:select={handleSelect}>
  <svelte:fragment slot="trigger">
    <Button variant="ghost">Actions</Button>
  </svelte:fragment>
</Dropdown>
```

### AnimatedList

```svelte
<script>
  import { AnimatedList } from '$lib/components/ui';
  let items = [{ id: 1, text: 'First' }, { id: 2, text: 'Second' }];
</script>

<AnimatedList {items} animation="slide" stagger={50} let:item>
  <div class="item">{item.text}</div>
</AnimatedList>
```

### Skeleton Loading

```svelte
<script>
  import { Skeleton } from '$lib/components/ui';
</script>

<!-- Text lines -->
<Skeleton variant="text" lines={3} />

<!-- Avatar -->
<Skeleton variant="avatar" size="lg" />

<!-- Card placeholder -->
<Skeleton variant="card" height="200px" />
```

---

## Data Components

### DataTable

```svelte
<script>
  import { DataTable } from '$lib/components/ui';

  const columns = [
    { key: 'name', label: 'Name', sortable: true, primary: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'status', label: 'Status' }
  ];

  let data = [...];
  let selected = [];
</script>

<DataTable
  {columns}
  {data}
  selectable
  bind:selected
  on:sort={handleSort}
  on:rowClick={handleRowClick}
  mobileCards
>
  <svelte:fragment slot="cell" let:row let:column let:value>
    {#if column.key === 'status'}
      <Badge variant={value === 'active' ? 'success' : 'secondary'}>{value}</Badge>
    {:else}
      {value}
    {/if}
  </svelte:fragment>
</DataTable>
```

### InfiniteScroll

```svelte
<script>
  import { InfiniteScroll } from '$lib/components/ui';

  let items = [];
  let loading = false;
  let hasMore = true;

  async function loadMore() {
    loading = true;
    const newItems = await fetchItems(items.length);
    items = [...items, ...newItems];
    hasMore = newItems.length > 0;
    loading = false;
  }

  async function refresh({ detail }) {
    items = await fetchItems(0);
    detail.done();
  }
</script>

<InfiniteScroll
  {loading}
  {hasMore}
  pullToRefresh
  on:loadMore={loadMore}
  on:refresh={refresh}
>
  {#each items as item}
    <ItemCard {item} />
  {/each}
</InfiniteScroll>
```

### Pagination

```svelte
<script>
  import { Pagination } from '$lib/components/ui';

  let page = 1;
  let pageSize = 10;
  const totalItems = 150;
  $: totalPages = Math.ceil(totalItems / pageSize);
</script>

<Pagination
  bind:page
  {totalPages}
  {totalItems}
  {pageSize}
  showPageSize
  on:change={fetchPage}
/>
```

### EmptyState

```svelte
<script>
  import { EmptyState, Button } from '$lib/components/ui';
</script>

<EmptyState preset="search" title="No results" description="Try different keywords">
  <svelte:fragment slot="actions">
    <Button variant="primary" on:click={clearFilters}>Clear Filters</Button>
  </svelte:fragment>
</EmptyState>
```

### Optimistic Updates

```javascript
import { createOptimisticList, toast } from '$lib/components/ui';

// Create an optimistic list store
const todos = createOptimisticList([], { getId: (t) => t.id });

// Add item with optimistic update
async function addTodo(text) {
  const tempTodo = { id: `temp_${Date.now()}`, text, completed: false };

  try {
    await todos.add(tempTodo, async () => {
      return await api.createTodo({ text });
    });
    toast.success('Todo added');
  } catch (error) {
    toast.error('Failed to add todo');
  }
}

// Delete with optimistic update
async function deleteTodo(id) {
  try {
    await todos.remove(id, () => api.deleteTodo(id));
  } catch (error) {
    toast.error('Failed to delete');
  }
}
```

---

## shadcn-svelte Components

For complex components not in our library, use shadcn-svelte:

```bash
npx shadcn-svelte add button
npx shadcn-svelte add dialog
npx shadcn-svelte add dropdown-menu
# etc.
```

Components are installed to `assets/svelte/components/ui/` and use our design tokens automatically.

See full list: https://shadcn-svelte.com/docs/components

---

## PWA Configuration

### manifest.json

```json
{
  "name": "App Name",
  "short_name": "App",
  "display": "standalone",
  "theme_color": "#000000",
  "background_color": "#ffffff",
  "icons": [...]
}
```

### iOS Meta Tags

```html
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">
```

---

## Best Practices

### Touch Targets

```svelte
<!-- Minimum 44x44px for touch targets -->
<button class="touch-target">...</button>
```

### Prevent Zoom on Input Focus (iOS)

```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
```

### Disable Pull-to-Refresh (Native)

```css
html {
  overscroll-behavior-y: none;
}
```

### Smooth Scrolling

```css
.scroll-ios {
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
}
```

### Respect Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Debugging

### Platform Info

```svelte
<script>
  import { platform, safeArea, keyboard } from '$lib/components/ui';
</script>

<pre>
Platform: {JSON.stringify($platform, null, 2)}
Safe Area: {JSON.stringify($safeArea, null, 2)}
Keyboard: {JSON.stringify($keyboard, null, 2)}
</pre>
```

### Safe Area Visualization

```css
/* Temporarily visualize safe areas */
.safe-area-debug::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--safe-area-top);
  background: rgba(255, 0, 0, 0.2);
  pointer-events: none;
}
```
