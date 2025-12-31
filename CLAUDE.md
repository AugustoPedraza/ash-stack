# CLAUDE.md - AI Assistant Context

> This file provides context for AI assistants working on this codebase.
> **READ THIS CAREFULLY** - Following these patterns prevents 90% of errors.

## Project Overview

This is a Phoenix application using:
- **Backend**: Elixir 1.17+, Phoenix 1.7+, Ash Framework 3.x
- **Frontend**: Svelte 5 via LiveSvelte, Tailwind CSS 4
- **Database**: PostgreSQL 16+

## Critical Commands

```bash
# ALWAYS run after making changes
just check          # Format + Credo + Dialyzer + Sobelow

# Run specific checks
just test           # Run tests
mix compile         # Check for compilation errors
```

---

## Component Manifest (AI CONTEXT)

**READ `components.json`** for complete component API reference.

This file is auto-generated and contains:
- All available components with their props, types, defaults
- Slot definitions and events
- Example usage for each component
- Component categories

```bash
# Regenerate after modifying components
just gen-docs
```

**Usage Pattern:**
```svelte
<script>
  import { Button, Input, Card } from '$lib/components/ui';
</script>
```

**When building UI:**
1. Check `components.json` for available components
2. Use existing components - don't recreate
3. Follow prop patterns (variant, size, etc.)
4. No `class` prop - use component props

---

## UX ENFORCEMENT RULES (CRITICAL)

> **READ `docs/UX_PATTERNS.md`** for complete UX decision framework.
> AI assistants MUST follow these rules when generating UI code.

### Quick Reference

**Buttons:**
- One primary button per visible area
- Primary on right, secondary on left
- Destructive actions require confirmation modal

**Forms:**
- Single column layout (higher completion rates)
- Labels above inputs (not floating)
- Validate on blur, show errors inline
- Required fields marked with asterisk

**Loading States:**
- 0-100ms: Show nothing
- 100-300ms: Button spinner
- 300ms+: Skeleton loader
- Always handle error and empty states

**Accessibility (Non-negotiable):**
- `aria-label` on icon-only buttons
- Focus visible on all interactive elements
- Touch targets 44x44px minimum
- Never use color alone for meaning

### AI Must Check Before Generating UI

```
□ Does this use existing components from $lib/components/ui?
□ Is there a loading state?
□ Is there an error state?
□ Is there an empty state?
□ Do icon-only buttons have aria-label?
□ Are destructive actions confirmed?
□ Is keyboard navigation supported?
□ Does it respect prefers-reduced-motion?
```

### Common UX Mistakes to Avoid

```svelte
<!-- ❌ WRONG: Primary on left -->
<div class="flex gap-3">
  <Button variant="primary">Save</Button>
  <Button variant="secondary">Cancel</Button>
</div>

<!-- ✅ CORRECT: Primary on right -->
<div class="flex gap-3 justify-end">
  <Button variant="secondary">Cancel</Button>
  <Button variant="primary">Save</Button>
</div>
```

```svelte
<!-- ❌ WRONG: No loading/error/empty states -->
{#each items as item}
  <ItemCard {item} />
{/each}

<!-- ✅ CORRECT: All states handled -->
{#if loading}
  <Skeleton variant="card" />
{:else if error}
  <EmptyState preset="error" on:retry={reload} />
{:else if items.length === 0}
  <EmptyState preset="default" title="No items yet" />
{:else}
  {#each items as item}
    <ItemCard {item} />
  {/each}
{/if}
```

```svelte
<!-- ❌ WRONG: Icon button without label -->
<Button variant="ghost" size="sm" on:click={close}>
  <Icon name="x" />
</Button>

<!-- ✅ CORRECT: Has aria-label -->
<Button variant="ghost" size="sm" on:click={close} aria-label="Close dialog">
  <Icon name="x" />
</Button>
```

```svelte
<!-- ❌ WRONG: Delete without confirmation -->
<Button variant="danger" on:click={() => deleteItem(id)}>Delete</Button>

<!-- ✅ CORRECT: Confirmation modal -->
<Button variant="danger" on:click={() => showDeleteModal = true}>Delete</Button>
<Modal bind:open={showDeleteModal} title="Delete Item?">
  <p>This cannot be undone.</p>
  <svelte:fragment slot="footer">
    <Button variant="secondary" on:click={() => showDeleteModal = false}>Cancel</Button>
    <Button variant="danger" on:click={confirmDelete}>Delete</Button>
  </svelte:fragment>
</Modal>
```

---

## PATTERNS TO FOLLOW (CRITICAL)

### Phoenix Components

```elixir
# ✅ CORRECT - Use function components with attr
attr :name, :string, required: true
attr :class, :string, default: nil
slot :inner_block, required: true

def my_component(assigns) do
  ~H"""
  <div class={["base-class", @class]}>
    <%= render_slot(@inner_block) %>
  </div>
  """
end

# ❌ WRONG - Don't use old-style assigns
def my_component(assigns) do
  ~H"""
  <div class={assigns.class}>  # WRONG - use @class
  """
end
```

### Heroicons (IMPORTANT - Common Error Source)

```elixir
# ✅ CORRECT - Use Heroicons module
<.icon name="hero-user" class="w-5 h-5" />
<.icon name="hero-check-circle" class="w-5 h-5" />
<.icon name="hero-x-mark" class="w-5 h-5" />

# ❌ WRONG - These icon names DON'T EXIST
<.icon name="hero-close" />      # Use hero-x-mark
<.icon name="hero-success" />    # Use hero-check-circle
<.icon name="hero-error" />      # Use hero-exclamation-circle
<.icon name="hero-warning" />    # Use hero-exclamation-triangle
<.icon name="hero-menu" />       # Use hero-bars-3
```

**Icon Naming Convention:**
- All Heroicons start with `hero-`
- Use kebab-case: `hero-arrow-right` not `hero-arrowRight`
- Outline is default, add `-solid` for solid: `hero-user-solid`
- Check: https://heroicons.com for valid names

### Tailwind CSS (Design Tokens)

```elixir
# ✅ CORRECT - Use design tokens
class="bg-primary text-on-primary p-4 rounded-lg"
class="text-text-muted bg-surface-raised"

# ❌ WRONG - Don't use raw Tailwind colors
class="bg-blue-500 text-white"    # Use bg-primary text-on-primary
class="text-gray-500"              # Use text-text-muted
class="bg-gray-100"                # Use bg-surface-sunken
```

---

## UI/UX CONSISTENCY (ENFORCED)

> **Tailwind is restricted** - raw colors like `bg-blue-500` do NOT exist.
> Only design tokens are available. This is enforced at build time.

### Available Design Tokens

**Colors** (ONLY these work):
- `primary`, `primary-hover`, `primary-active`, `on-primary`
- `secondary`, `secondary-hover`, `on-secondary`
- `success`, `success-soft`, `on-success`
- `warning`, `warning-soft`, `on-warning`
- `error`, `error-soft`, `on-error`
- `info`, `info-soft`, `on-info`
- `background`, `surface`, `surface-raised`, `surface-sunken`
- `text`, `text-secondary`, `text-muted`, `text-disabled`
- `border`, `border-strong`, `border-focus`

**Spacing** (ONLY these work):
- `0`, `px`, `0.5`, `1`, `2`, `3`, `4`, `6`, `8`, `12`, `16`, `20`, `24`
- ❌ `p-5`, `m-7`, `gap-9` do NOT exist

**Border Radius** (ONLY these work):
- `rounded-none`, `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-full`
- ❌ `rounded-xl`, `rounded-2xl`, `rounded-3xl` do NOT exist

**Shadows** (ONLY these work):
- `shadow-none`, `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-xl`
- ❌ `shadow-2xl`, `shadow-inner` do NOT exist

**Z-Index** (use named layers):
- `z-below`, `z-base`, `z-raised`, `z-dropdown`, `z-sticky`
- `z-overlay`, `z-modal`, `z-popover`, `z-toast`, `z-tooltip`
- ❌ `z-10`, `z-50` do NOT exist

### Svelte Component Usage

**ALWAYS use existing components** - don't recreate:

```svelte
<!-- ✅ CORRECT - Use component library -->
<script>
  import { Button, Input, Card, Avatar } from '$lib/components/ui';
</script>

<Card title="User Profile">
  <Input size="md" placeholder="Name" bind:value={name} />
  <Button variant="primary" size="md">Save</Button>
</Card>

<!-- ❌ WRONG - Don't use raw HTML with classes -->
<div class="bg-surface border rounded-lg p-6">
  <input class="border p-2 rounded" />
  <button class="bg-primary text-on-primary px-4 py-2">Save</button>
</div>
```

**Components have NO class escape hatch** - use props:

```svelte
<!-- ✅ CORRECT - Use variant/size props -->
<Button variant="danger" size="lg">Delete</Button>
<Input size="sm" invalid={hasError} />

<!-- ❌ WRONG - class prop doesn't exist -->
<Button class="mt-4 bg-red-500">Delete</Button>
```

### Available Svelte Components

**Form Components:**
- `Button` - variant: primary|secondary|ghost|danger, size: sm|md|lg
- `Input` - type, size, invalid, disabled
- `Select` - options, size, invalid, placeholder
- `Textarea` - rows, size, resizable, invalid
- `Checkbox` - checked, label, description, size
- `FormField` - label, error, helper, required (wrapper)

**Layout Components:**
- `Page` - size: sm|md|lg|xl|full, padded, centered
- `PageHeader` - title, description, bordered (slots: actions, tabs)
- `Card` - variant, padding, title, description (slots: header, footer, actions)
- `Section` - title, description, spacing (slots: header, actions)

**Display Components:**
- `Avatar` - src, alt, size: xs|sm|md|lg|xl, shape, status
- `Badge` - variant, size, dot
- `Skeleton` - variant: text|circle|rect|card|avatar|button, animate, lines

**Interactive Components:**
- `Modal` - open, title, size: sm|md|lg|full, gestureEnabled (slots: header, footer)
- `Tabs` - tabs, value, variant: underline|pill|segment, fullWidth
- `Toggle` - checked, label, description, size: sm|md|lg, disabled
- `Dropdown` - open, items, align: left|right, mobileSheet (slots: trigger)

**Animation Components:**
- `AnimatedList` - items, animation: fade|slide|scale|fly, direction, stagger

**Data Components:**
- `DataTable` - columns, data, selectable, sortable, mobileCards (slots: cell, empty)
- `InfiniteScroll` - loading, hasMore, pullToRefresh, threshold (events: loadMore, refresh)
- `Pagination` - page, totalPages, mode: full|simple|minimal, showPageSize
- `EmptyState` - preset: default|search|error|success|offline, title, description

**Real-time Components:**
- `RealtimeList` - store, items, getId, sort, duration, showOptimistic (slots: default, empty)
- `TypingIndicator` - users, maxNames, format

**DX Components:**
- `ErrorBoundary` - fallback, reportToServer, showDetails, message, retryable
- `ConnectionStatus` - position, showOnlyWhenDisconnected, autoHideDelay, messages

**Auth Components:**
- `AuthForm` - mode (login|register|forgot|reset), errors, loading, oauthProviders, links
- `OAuthButton` - provider (google|github|apple|microsoft|facebook|twitter|discord|slack), size, iconOnly

**Navigation Components:**
- `CommandPalette` - open, commands, placeholder, showRecent (⌘K / Ctrl+K to trigger)
- `Breadcrumbs` - items, separator (slash|chevron|arrow|dot), maxItems, home
- `Sidebar` - items, activeId, collapsed, mobileOpen, header (slots: footer)

**Advanced Input Components:**
- `SearchInput` - suggestions, loading, debounce, minChars, showRecent (events: search, select, submit)
- `DatePicker` - value, range, min, max, disabled[], firstDayOfWeek, showWeekNumbers
- `FileUpload` - accept, multiple, maxSize, maxFiles, variant (default|compact|avatar), uploadFn

**Notification Components:**
- `NotificationCenter` - notifications, position, showBadge, maxVisible (events: read, markAllRead, viewAll)
- `ActivityFeed` - items, groupByDate, showAvatars, showTimeline, typeConfig, compact

**Data Visualization Components:**
- `StatCard` - label, value, previousValue, format, icon, iconColor, sparkline, trend
- `ProgressBar` - value, max, variant, size, showLabel, striped, indeterminate, segments
- `MiniChart` - data, type (line|bar|dot|area), variant, fill, showPoints, showTooltip
- `Meter` - value, min, max, type (circle|semicircle|linear), variant (auto for thresholds)

**Mobile Components:**
- `Sheet` - open, title, gestureEnabled, snapPoints (slots: footer)

### Form Pattern

```svelte
<script>
  import { FormField, Input, Button } from '$lib/components/ui';
  let name = '';
  let error = null;
</script>

<FormField label="Full Name" {error} required>
  <Input bind:value={name} invalid={!!error} placeholder="John Doe" />
</FormField>

<Button type="submit" variant="primary">Submit</Button>
```

### Page Pattern

```svelte
<script>
  import { Page, PageHeader, Section, Card } from '$lib/components/ui';
</script>

<Page size="lg">
  <PageHeader title="Dashboard" description="Overview of your account">
    <svelte:fragment slot="actions">
      <Button variant="primary">New Item</Button>
    </svelte:fragment>
  </PageHeader>

  <Section title="Recent Activity">
    <Card>
      <!-- content -->
    </Card>
  </Section>
</Page>
```

### Verification

Run `just lint-tokens` to catch violations:
- Raw Tailwind colors
- Arbitrary values `[...]`
- Non-standard spacing

---

## MOBILE & COMPONENTS

### Component Strategy

| Component Type | Source | Notes |
|----------------|--------|-------|
| Complex (Modal, Dropdown, Tabs) | shadcn-svelte | `npx shadcn-svelte add dialog` |
| Layout (Page, Card, Section) | Custom | In repo |
| Form (Input, Select, Checkbox) | Custom or shadcn | Both work |
| Mobile (Sheet, gestures) | Custom | iOS-optimized |

### Mobile Utilities

```javascript
import {
  // Haptics
  haptic, HapticType,
  // Platform detection
  platform, isIOS, isStandalone,
  // Safe areas
  safeArea, keyboard,
  // Gestures (use:action)
  swipe, pullToRefresh, longPress, pan
} from '$lib/components/ui';

// Haptic feedback
haptic(HapticType.SUCCESS);

// Check platform
if ($platform.ios && $platform.standalone) { ... }
```

### iOS Sheet

```svelte
<Sheet bind:open title="Options" gestureEnabled snapPoints={[0.5, 1]}>
  Content with swipe-to-dismiss
</Sheet>
```

### Gestures

```svelte
<!-- Swipe -->
<div use:swipe on:swipeleft={next} on:swiperight={prev}>

<!-- Pull to refresh -->
<div use:pullToRefresh on:refresh={({ detail }) => { await load(); detail.done(); }}>

<!-- Long press -->
<div use:longPress on:longpress={showMenu}>
```

See `docs/MOBILE.md` for full mobile guide.

---

## PHOENIX + SVELTE INTEGRATION

### Quick Setup

```elixir
# In LiveView
use AshStackWeb.LiveSvelteHelpers
import AshStackWeb.SvelteHelpers
import AshStackWeb.AshFormHelpers
```

### Ash Forms → Svelte

```heex
<.svelte_form for={@form} phx-submit="save">
  <.svelte_input field={@form[:name]} label="Name" />
  <.svelte_select field={@form[:role]} label="Role" options={@roles} />
  <.svelte_submit>Save</.svelte_submit>
</.svelte_form>
```

### Flash → Toast (Automatic)

```elixir
# These automatically show as toasts:
put_flash(socket, :success, "Saved!")
put_flash(socket, :error, "Failed")

# Or explicit:
push_toast(socket, :success, "Done!")
```

### Server → Svelte Events

```elixir
# Push to specific component
push_to_svelte(socket, "user-list", "user:added", %{user: user})

# Update Svelte store
push_store_update(socket, "users", updated_users)
```

### Svelte → Server Events

```javascript
import { pushEvent, pushEventAsync } from '$lib';

// Fire and forget
pushEvent('delete', { id });

// Wait for response
const result = await pushEventAsync('save', data);
```

See `docs/INTEGRATION.md` for full guide.

### Real-time (PubSub + Presence)

```elixir
# In LiveView - use RealtimeHelpers
use AshStackWeb.RealtimeHelpers, pubsub: MyApp.PubSub

def mount(%{"room_id" => room_id}, _session, socket) do
  if connected?(socket) do
    subscribe("room:#{room_id}")
    track_presence("room:#{room_id}", socket.assigns.current_user)
  end
  {:ok, socket}
end

# Broadcast to Svelte stores
broadcast("room:#{room_id}", "message:new", %{
  store: "messages",
  action: "append",
  data: message
})
```

```javascript
// In app.js - add realtime hooks
import { initRealtimeHooks } from "./svelte/lib/realtime"

let liveSocket = new LiveSocket("/live", Socket, {
  hooks: { ...initLiveViewHooks(), ...initRealtimeHooks() }
})
```

```svelte
<!-- Real-time list component -->
<script>
  import { RealtimeList, TypingIndicator } from '$lib/components/ui';
  import { createPresenceStore } from '$lib';

  const presence = createPresenceStore('room:lobby');
</script>

<RealtimeList store="messages" let:item>
  <MessageBubble {item} />
</RealtimeList>

<TypingIndicator users={$presence.typingUsers} />
```

### Debug & DX Tools

```javascript
// Enable debug mode in development
import { enableDebug, logEvent, timeAsync } from '$lib';

enableDebug({ events: true, stores: true, verbose: true });

// Log custom events
logEvent('send', 'save_user', { id: 1 });

// Time async operations
await timeAsync('api_call', () => fetchData());

// From browser console:
window.__ASH_STACK__.dumpStores();
window.__ASH_STACK__.getEventLog();
```

```svelte
<!-- Error boundaries -->
<ErrorBoundary reportToServer>
  <RiskyComponent />
</ErrorBoundary>

<!-- Connection status indicator -->
<ConnectionStatus position="bottom-right" showOnlyWhenDisconnected />
```

See `docs/DX.md` for full DX guide.

---

### LiveSvelte Integration

```elixir
# ✅ CORRECT - Pass socket for events
<.svelte
  name="MyComponent"
  props={%{data: @data, user_id: @current_user.id}}
  socket={@socket}
/>

# ❌ WRONG - Missing socket (events won't work)
<.svelte name="MyComponent" props={%{data: @data}} />
```

### Ash Resources

```elixir
# ✅ CORRECT - Full resource with all required parts
defmodule MyApp.Domain.Resource do
  use Ash.Resource,
    data_layer: AshPostgres.DataLayer,
    domain: MyApp.Domain           # Don't forget domain!

  postgres do
    table "resources"
    repo MyApp.Repo
  end

  attributes do
    uuid_primary_key :id           # Always use UUID
    timestamps()                    # Always include
  end

  actions do
    defaults [:read, :destroy]
    # Define create/update explicitly
  end

  policies do
    policy action_type(:read) do
      authorize_if always()        # Always have at least one policy
    end
  end
end

# ❌ WRONG - Missing required parts
defmodule MyApp.Domain.Resource do
  use Ash.Resource  # Missing data_layer and domain!

  attributes do
    attribute :id, :uuid  # Wrong! Use uuid_primary_key
  end
  # Missing timestamps, actions, policies
end
```

### Form Handling

```elixir
# ✅ CORRECT - Use to_form
def mount(_params, _session, socket) do
  form = AshPhoenix.Form.for_create(Resource, :create) |> to_form()
  {:ok, assign(socket, form: form)}
end

# In template
<.form for={@form} phx-submit="save">
  <.input field={@form[:name]} label="Name" />
</.form>

# ❌ WRONG - Raw changeset
<.form for={@changeset}>  # Use to_form()!
```

---

## COMMON ERRORS AND FIXES

### Error: "undefined function icon/1"
```elixir
# Fix: Import CoreComponents
import MyAppWeb.CoreComponents
```

### Error: "no case clause matching: nil"
```elixir
# Usually means an assign is missing
# Fix: Check mount/2 sets all required assigns
def mount(_params, _session, socket) do
  {:ok, assign(socket,
    items: [],           # Initialize all assigns!
    loading: false,
    form: nil
  )}
end
```

### Error: "(Ash.Error.Query.NotFound)"
```elixir
# Handle not found in action
case MyApp.Domain.get(id) do
  {:ok, record} -> # success
  {:error, %Ash.Error.Query.NotFound{}} -> # handle not found
end
```

### Error: "no policy authorizes this request"
```elixir
# Add policy to resource
policies do
  policy action_type(:read) do
    authorize_if always()
  end
end
```

---

## BEFORE SUBMITTING CODE

AI should mentally check:

1. [ ] All icons use valid `hero-*` names
2. [ ] All colors use design tokens (`bg-primary` not `bg-blue-500`)
3. [ ] All LiveSvelte components have `socket={@socket}`
4. [ ] All Ash resources have policies
5. [ ] All forms use `to_form()`
6. [ ] All LiveViews initialize assigns in mount

---

## FILE STRUCTURE

```
lib/
├── ash_stack/              # Ash domains (business logic)
│   └── [domain]/
│       ├── [domain].ex     # Domain module
│       └── resources/      # Ash resources
└── ash_stack_web/
    ├── components/
    │   ├── core_components.ex    # Phoenix defaults
    │   └── ui_components.ex      # App components
    ├── live/
    │   └── [feature]_live.ex
    └── router.ex

assets/svelte/components/
├── ui/                     # Base components
└── features/               # Feature-specific
```

---

## RUNNING VERIFICATION

After ANY code change, run:

```bash
# Quick check
mix compile --warnings-as-errors

# Full check
just check

# If touching tests
just test
```

---

## GETTING HELP

If you encounter an error:
1. Read the full error message
2. Check this file for the pattern
3. Check if icon names are valid (heroicons.com)
4. Check if all assigns are initialized
