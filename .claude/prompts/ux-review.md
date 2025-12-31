# UX Review Prompt

> Use this prompt when reviewing UI code for UX quality.

## Context Files to Read First

1. `docs/UX_PATTERNS.md` - Complete UX decision framework
2. `CLAUDE.md` - UX enforcement rules section
3. `components.json` - Available components

## Review Checklist

When reviewing Svelte component code, check ALL of the following:

### 1. State Handling
- [ ] Loading state exists and uses Skeleton component
- [ ] Error state exists and uses EmptyState preset="error"
- [ ] Empty state exists for lists/data
- [ ] States are mutually exclusive (if/else if/else)

### 2. Accessibility
- [ ] Icon-only buttons have `aria-label`
- [ ] Form inputs are wrapped in `FormField` with labels
- [ ] Interactive elements are keyboard accessible
- [ ] Focus is visible on interactive elements
- [ ] Color is not the only indicator of state

### 3. Interactions
- [ ] One primary button per view
- [ ] Primary button on right, secondary on left
- [ ] Destructive actions have confirmation modal
- [ ] Touch targets are 44x44px minimum

### 4. Component Usage
- [ ] Uses existing components from `$lib/components/ui`
- [ ] No custom implementations of existing components
- [ ] Correct component for use case (see selection guide)

### 5. Design Tokens
- [ ] No raw Tailwind colors (use `primary`, `surface`, etc.)
- [ ] No arbitrary values (`[#fff]`, `[24px]`)
- [ ] Standard spacing only (0,1,2,3,4,6,8,12,16,20,24)

### 6. Animation
- [ ] Respects `prefers-reduced-motion`
- [ ] Animation duration appropriate (150-400ms)
- [ ] Uses transform/opacity only

## Review Output Format

```
## UX Review: [Component Name]

### ✅ Good
- [What's done well]

### ⚠️ Improvements Needed
- [Issue]: [How to fix]

### ❌ Must Fix
- [Critical issue]: [How to fix]

### Code Suggestions
\`\`\`svelte
[Suggested code changes]
\`\`\`
```

## Common Issues & Fixes

### Missing Loading State
```svelte
<!-- Before -->
{#each items as item}

<!-- After -->
{#if loading}
  <Skeleton variant="card" />
{:else if error}
  <EmptyState preset="error" on:retry={reload} />
{:else if items.length === 0}
  <EmptyState preset="default" />
{:else}
  {#each items as item}
```

### Icon Button Without Label
```svelte
<!-- Before -->
<Button variant="ghost" on:click={close}>
  <Icon name="x" />
</Button>

<!-- After -->
<Button variant="ghost" on:click={close} aria-label="Close">
  <Icon name="x" />
</Button>
```

### Wrong Button Order
```svelte
<!-- Before -->
<Button variant="primary">Save</Button>
<Button variant="secondary">Cancel</Button>

<!-- After -->
<div class="flex gap-3 justify-end">
  <Button variant="secondary">Cancel</Button>
  <Button variant="primary">Save</Button>
</div>
```

### Delete Without Confirmation
```svelte
<!-- Before -->
<Button variant="danger" on:click={() => deleteItem(id)}>
  Delete
</Button>

<!-- After -->
<Button variant="danger" on:click={() => showConfirm = true}>
  Delete
</Button>

<Modal bind:open={showConfirm} title="Delete Item?">
  <p>This cannot be undone.</p>
  <svelte:fragment slot="footer">
    <Button variant="secondary" on:click={() => showConfirm = false}>
      Cancel
    </Button>
    <Button variant="danger" on:click={confirmDelete}>
      Delete
    </Button>
  </svelte:fragment>
</Modal>
```
