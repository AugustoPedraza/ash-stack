# UX Patterns & Decision Framework

> A living document defining UX patterns, decisions, and rationale for this project.
> AI assistants MUST reference this when generating UI code.

## Core UX Principles

### 1. Clarity Over Cleverness
- **Do**: Use familiar patterns users already understand
- **Don't**: Invent novel interactions that require learning
- **Why**: Cognitive load should be spent on the task, not the interface

### 2. Immediate Feedback
- **Do**: Respond to every user action within 100ms
- **Don't**: Leave users wondering if their action registered
- **Why**: Instant feedback builds trust and reduces errors

### 3. Progressive Disclosure
- **Do**: Show essential info first, details on demand
- **Don't**: Overwhelm with all options at once
- **Why**: Reduces cognitive load, guides users naturally

### 4. Accessible by Default
- **Do**: Build for keyboard, screen readers, and all abilities
- **Don't**: Add accessibility as an afterthought
- **Why**: Accessible design benefits everyone

### 5. Mobile-First, Desktop-Enhanced
- **Do**: Design for touch first, enhance for mouse/keyboard
- **Don't**: Shrink desktop designs to fit mobile
- **Why**: Mobile constraints force better prioritization

---

## Interaction Patterns

### Buttons

| Action Type | Variant | Size | Use Case |
|-------------|---------|------|----------|
| Primary action | `primary` | `md` | One per view (Save, Submit, Continue) |
| Secondary action | `secondary` | `md` | Alternative options (Cancel, Back) |
| Destructive action | `danger` | `md` | Delete, Remove (always confirm) |
| Tertiary action | `ghost` | `sm` | Less important actions |
| Icon-only | `ghost` | `sm` | Toolbars, compact spaces (needs aria-label) |

**Rules:**
- ✅ One primary button per visible area
- ✅ Primary on right, secondary on left (Western reading order)
- ✅ Destructive actions require confirmation
- ❌ Never disable buttons without explanation
- ❌ Never use color alone to convey meaning

```svelte
<!-- ✅ Correct -->
<div class="flex gap-3 justify-end">
  <Button variant="secondary">Cancel</Button>
  <Button variant="primary">Save Changes</Button>
</div>

<!-- ❌ Wrong - primary on left -->
<div class="flex gap-3">
  <Button variant="primary">Save</Button>
  <Button variant="secondary">Cancel</Button>
</div>
```

### Forms

**Layout Rules:**
- Single column for most forms (proven higher completion rates)
- Labels above inputs (not inline/floating)
- Group related fields with Section component
- Required fields marked with asterisk (screen reader: "required")

**Validation Rules:**
- Validate on blur, not on every keystroke
- Show errors inline below the field
- Use positive confirmation for valid fields (optional)
- Never clear the form on error

**Field Sizing:**
- Input width should hint at expected length
- Email/URL: full width
- Phone: ~12 characters
- ZIP/Postal: ~8 characters
- State/Country: use Select

```svelte
<!-- ✅ Correct form structure -->
<Form on:submit={handleSubmit}>
  <Section title="Personal Information">
    <FormField label="Full Name" required error={errors.name}>
      <Input bind:value={name} autocomplete="name" />
    </FormField>

    <FormField label="Email" required error={errors.email}>
      <Input type="email" bind:value={email} autocomplete="email" />
    </FormField>
  </Section>

  <Section title="Preferences">
    <!-- Optional fields -->
  </Section>

  <div class="flex gap-3 justify-end">
    <Button variant="secondary" type="button" on:click={cancel}>Cancel</Button>
    <Button variant="primary" type="submit">Create Account</Button>
  </div>
</Form>
```

### Loading States

**Skeleton Strategy:**
- Use skeletons that match final content shape
- Animate with subtle pulse (not spin)
- Show immediately (no delay)

**Progressive Loading:**
1. 0-100ms: Show nothing (action feels instant)
2. 100-300ms: Show subtle indicator (button spinner)
3. 300ms+: Show skeleton/loading state
4. 5s+: Show "taking longer than expected" message

```svelte
<!-- ✅ Correct loading pattern -->
{#if loading}
  <Skeleton variant="card" lines={3} />
{:else if error}
  <EmptyState preset="error" title="Failed to load" on:retry={reload} />
{:else if data.length === 0}
  <EmptyState preset="default" title="No items yet" />
{:else}
  <DataTable {data} {columns} />
{/if}
```

### Empty States

| Context | Preset | Include |
|---------|--------|---------|
| First-time user | `default` | Welcome + CTA to add first item |
| Search no results | `search` | Suggestions, clear filters button |
| Error loading | `error` | What happened + retry button |
| Offline | `offline` | Explain + what they can still do |

```svelte
<!-- ✅ Helpful empty state -->
<EmptyState
  preset="search"
  title="No matches found"
  description="Try adjusting your filters or search terms"
>
  <Button variant="secondary" on:click={clearFilters}>Clear Filters</Button>
</EmptyState>
```

### Modals & Dialogs

**When to Use:**
- ✅ Confirmations (delete, discard changes)
- ✅ Quick forms (< 3 fields)
- ✅ Media preview
- ❌ Complex forms (use dedicated page)
- ❌ Long content (use page or sheet)

**Rules:**
- Always have a way to dismiss (X, Escape, click outside)
- Focus trap inside modal
- Return focus to trigger on close
- Max width 32rem for most content

```svelte
<!-- ✅ Confirmation modal -->
<Modal bind:open={showDelete} title="Delete Item?" size="sm">
  <p>This action cannot be undone. The item will be permanently removed.</p>

  <svelte:fragment slot="footer">
    <Button variant="secondary" on:click={() => showDelete = false}>Cancel</Button>
    <Button variant="danger" on:click={confirmDelete}>Delete</Button>
  </svelte:fragment>
</Modal>
```

### Navigation

**Breadcrumbs:**
- Show on pages 2+ levels deep
- Current page is last item (not a link)
- Truncate middle items on mobile

**Tabs:**
- Use for parallel content at same hierarchy level
- 2-5 tabs maximum
- Show tab content inline (no page navigation)

**Mobile Navigation:**
- Bottom nav for primary destinations (max 5)
- Hamburger menu for secondary items
- Sheet for contextual actions

### Feedback & Notifications

| Type | Component | Duration | Use Case |
|------|-----------|----------|----------|
| Success | Toast (success) | 3s auto-dismiss | Action completed |
| Error | Toast (error) | Manual dismiss | Action failed |
| Warning | Toast (warning) | 5s | Important notice |
| Info | Toast (info) | 4s | Neutral info |
| Blocking | Modal | User action | Must acknowledge |

**Toast Rules:**
- One toast at a time (queue others)
- Position: top-right (desktop), top-center (mobile)
- Include action when possible ("Undo", "View")
- Never use for critical errors that need action

---

## Responsive Breakpoints

| Name | Min Width | Target Devices |
|------|-----------|----------------|
| `sm` | 640px | Large phones landscape |
| `md` | 768px | Tablets portrait |
| `lg` | 1024px | Tablets landscape, laptops |
| `xl` | 1280px | Desktops |

**Mobile-First Rules:**
1. Start with mobile layout (no breakpoint prefix)
2. Add larger breakpoints as enhancements
3. Test real devices, not just browser resize

```svelte
<!-- ✅ Mobile-first responsive -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
```

---

## Animation Guidelines

### Timing

| Animation Type | Duration | Easing |
|----------------|----------|--------|
| Micro (button, toggle) | 150ms | ease-out |
| Small (dropdown, tooltip) | 200ms | ease-out |
| Medium (modal, sheet) | 300ms | ease-in-out |
| Large (page transition) | 400ms | ease-in-out |

### Motion Principles

1. **Purposeful**: Every animation should communicate something
2. **Quick**: Users shouldn't wait for animations
3. **Subtle**: Enhance, don't distract
4. **Respectful**: Honor `prefers-reduced-motion`

```svelte
<!-- ✅ Respects reduced motion -->
<div
  in:fly={{ y: 20, duration: 200 }}
  class="motion-reduce:transition-none"
>
```

### What to Animate

- ✅ State changes (open/close, expand/collapse)
- ✅ Feedback (success checkmark, error shake)
- ✅ Attention (subtle pulse for new items)
- ❌ Decoration (spinning logos, bouncing icons)
- ❌ Every element (overwhelming)

---

## Accessibility Checklist

### Every Component Must Have:

- [ ] Keyboard navigation (Tab, Enter, Escape, Arrows)
- [ ] Focus visible indicator
- [ ] Sufficient color contrast (4.5:1 text, 3:1 UI)
- [ ] Screen reader announcements
- [ ] Touch target 44x44px minimum

### Interactive Elements:

```svelte
<!-- ✅ Accessible button -->
<button
  type="button"
  aria-label="Close dialog"
  aria-pressed={isActive}
  on:click={handleClick}
  on:keydown={handleKeyDown}
>
  <Icon name="x" aria-hidden="true" />
</button>

<!-- ✅ Accessible form field -->
<FormField label="Email" required error={emailError}>
  <Input
    type="email"
    bind:value={email}
    aria-describedby={emailError ? 'email-error' : undefined}
    aria-invalid={!!emailError}
  />
</FormField>
```

### Focus Management:

- Modal opens → focus first interactive element
- Modal closes → focus trigger element
- Error occurs → focus first error field
- Content updates → announce with aria-live

---

## Color Usage

### Semantic Colors Only

| Purpose | Token | Never Use |
|---------|-------|-----------|
| Primary action | `primary` | `blue-500` |
| Success state | `success` | `green-500` |
| Warning state | `warning` | `yellow-500` |
| Error state | `error` | `red-500` |
| Neutral text | `text` | `gray-900` |

### Color + Icon Rule

Never rely on color alone. Always pair with:
- Icon (checkmark for success, X for error)
- Text label
- Pattern or position

```svelte
<!-- ✅ Color + icon + text -->
<Badge variant="success">
  <Icon name="check" size="sm" />
  Approved
</Badge>

<!-- ❌ Color only -->
<span class="text-success">Approved</span>
```

---

## Content Guidelines

### Microcopy

| Context | Do | Don't |
|---------|-----|-------|
| Button labels | "Save Changes" | "Submit" |
| Error messages | "Email is required" | "Invalid input" |
| Empty states | "No projects yet" | "No data" |
| Loading | "Loading projects..." | "Please wait" |
| Success | "Project saved" | "Success!" |

### Error Messages

1. Say what happened
2. Say why (if helpful)
3. Say how to fix it

```
❌ "Error 422"
❌ "Invalid input"
❌ "Something went wrong"

✅ "This email is already registered. Try signing in instead."
✅ "Password must be at least 8 characters"
✅ "We couldn't save your changes. Check your connection and try again."
```

### Action Labels

- Use verbs: "Save", "Delete", "Create"
- Be specific: "Save Changes" > "Save", "Delete Project" > "Delete"
- Match the trigger: If button says "Save Changes", toast says "Changes saved"

---

## Decision Log

> Document significant UX decisions and their rationale here.

### Decision: Single-column Forms
- **Date**: Project start
- **Decision**: All forms use single-column layout
- **Rationale**: Research shows higher completion rates
- **Exceptions**: Short inline forms (search + filter)

### Decision: Toast Positioning
- **Date**: Project start
- **Decision**: Top-right (desktop), top-center (mobile)
- **Rationale**: Doesn't obscure primary content or actions
- **Exceptions**: None

### Decision: Confirmation for Destructive Actions
- **Date**: Project start
- **Decision**: All delete/remove actions require modal confirmation
- **Rationale**: Prevent accidental data loss
- **Exceptions**: Undo available within 5 seconds (soft delete)

---

## Component Selection Guide

> When building UI, use this guide to select the right component.

### "I need to show a list of items"

```
Is it tabular data with columns?
├─ Yes → DataTable
└─ No
   ├─ Can items be added/removed in real-time?
   │  ├─ Yes → RealtimeList
   │  └─ No → AnimatedList or simple {#each}
   └─ Is it a long list (100+ items)?
      ├─ Yes → InfiniteScroll or Pagination
      └─ No → Simple list
```

### "I need to collect user input"

```
Is it a single value?
├─ Yes
│  ├─ Text → Input
│  ├─ Long text → Textarea
│  ├─ Selection from options → Select
│  ├─ Yes/No → Checkbox or Toggle
│  └─ One of few options → Radio (coming) or Tabs
└─ No (multiple fields)
   └─ Form with FormField wrappers
```

### "I need to show feedback"

```
Is it blocking/critical?
├─ Yes → Modal with required action
└─ No
   ├─ Is it temporary notification?
   │  └─ Yes → Toast
   └─ Is it inline status?
      └─ Yes → Badge or inline text
```

### "I need a container"

```
Is it a page section?
├─ Yes
│  ├─ Full page → Page
│  ├─ Page title area → PageHeader
│  └─ Content section → Section
└─ No
   ├─ Elevated content block → Card
   └─ Overlay content
      ├─ Dialog → Modal
      └─ Bottom sheet (mobile) → Sheet
```

---

## Performance Budgets

### Core Web Vitals Targets

| Metric | Target | Maximum |
|--------|--------|---------|
| LCP (Largest Contentful Paint) | < 1.5s | < 2.5s |
| FID (First Input Delay) | < 50ms | < 100ms |
| CLS (Cumulative Layout Shift) | < 0.05 | < 0.1 |

### Asset Budgets

| Asset Type | Budget |
|------------|--------|
| Total JS | < 200KB gzipped |
| Total CSS | < 50KB gzipped |
| Hero image | < 100KB |
| Font files | < 100KB total |

### Animation Performance

- Use `transform` and `opacity` only (GPU accelerated)
- Avoid animating `width`, `height`, `top`, `left`
- Use `will-change` sparingly
- Test on low-end devices

---

## AI Enforcement Rules

> These rules are checked by AI during code review.

### Must Always

1. Use semantic HTML elements (`button` not `div` for clicks)
2. Include `aria-label` for icon-only buttons
3. Use design tokens, never raw colors
4. Provide loading and error states
5. Handle empty states explicitly
6. Support keyboard navigation
7. Test with `prefers-reduced-motion`

### Must Never

1. Use `outline: none` without visible focus alternative
2. Use color alone to convey information
3. Create touch targets smaller than 44x44px
4. Auto-play media without user consent
5. Remove content on error (show error state instead)
6. Use placeholder text as labels
7. Disable buttons without explanation (use tooltip)

### Should Prefer

1. Native elements over custom implementations
2. Progressive enhancement over graceful degradation
3. Skeleton loaders over spinners
4. Inline validation over submit-time validation
5. Specific error messages over generic ones
