# Component Catalog

> UI component reference for consistent design and AI generation.

## Design Tokens

All components use CSS custom properties from `assets/css/tokens.css`.

### Quick Reference

```css
/* Spacing */
--space-{0,1,2,3,4,5,6,8,10,12,16,20,24}

/* Colors */
--color-primary, --color-primary-hover, --color-on-primary
--color-secondary, --color-secondary-hover, --color-on-secondary
--color-success, --color-success-soft, --color-on-success
--color-warning, --color-warning-soft, --color-on-warning
--color-error, --color-error-soft, --color-on-error
--color-background, --color-surface, --color-surface-raised, --color-surface-sunken
--color-text, --color-text-secondary, --color-text-muted, --color-text-disabled
--color-border, --color-border-strong, --color-border-focus

/* Typography */
--text-{xs,sm,base,lg,xl,2xl,3xl,4xl}
--font-{normal,medium,semibold,bold}

/* Radii */
--radius-{none,sm,md,lg,xl,2xl,full}

/* Shadows */
--shadow-{xs,sm,md,lg,xl}
```

---

## Base Components

### Button

**File:** `assets/svelte/components/ui/Button.svelte`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | 'primary' \| 'secondary' \| 'ghost' \| 'danger' | 'primary' | Visual style |
| size | 'sm' \| 'md' \| 'lg' | 'md' | Size |
| disabled | boolean | false | Disabled state |
| loading | boolean | false | Loading state |
| fullWidth | boolean | false | Full width |
| type | 'button' \| 'submit' \| 'reset' | 'button' | Button type |

**Usage:**

```svelte
<Button variant="primary" on:click={handleClick}>
  Click me
</Button>

<Button variant="secondary" loading={isSaving}>
  {isSaving ? 'Saving...' : 'Save'}
</Button>

<Button variant="danger" size="sm">
  Delete
</Button>

<Button variant="ghost" fullWidth>
  Full Width Ghost
</Button>
```

**Variants:**

| Variant | Use Case |
|---------|----------|
| primary | Main actions, CTAs |
| secondary | Secondary actions |
| ghost | Tertiary actions, less emphasis |
| danger | Destructive actions |

---

### Avatar

**File:** `assets/svelte/components/ui/Avatar.svelte`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| size | 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' | 'md' | Size |
| src | string \| null | null | Image URL |
| alt | string | '' | Alt text / name for initials |
| fallback | string \| null | null | Explicit initials |
| shape | 'circle' \| 'rounded' | 'circle' | Shape |
| status | 'online' \| 'offline' \| 'away' \| 'busy' \| null | null | Status indicator |

**Usage:**

```svelte
<!-- With image -->
<Avatar src="/avatars/john.jpg" alt="John Doe" size="lg" />

<!-- With initials (auto-generated) -->
<Avatar alt="John Doe" size="md" />

<!-- With explicit initials -->
<Avatar fallback="JD" size="md" />

<!-- With status indicator -->
<Avatar alt="John Doe" status="online" />

<!-- Avatar group -->
<div class="flex -space-x-2">
  <Avatar alt="User 1" size="sm" />
  <Avatar alt="User 2" size="sm" />
  <Avatar alt="User 3" size="sm" />
</div>
```

**Sizes:**

| Size | Pixels | Use Case |
|------|--------|----------|
| xs | 24px | Compact lists |
| sm | 32px | Comments, threads |
| md | 40px | Default, cards |
| lg | 48px | Profiles |
| xl | 64px | Profile pages |

---

### Input

**File:** `assets/svelte/components/ui/Input.svelte`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| type | 'text' \| 'email' \| 'password' \| 'tel' \| 'url' | 'text' | Input type |
| value | string | '' | Bound value |
| placeholder | string | '' | Placeholder |
| label | string \| null | null | Label text |
| error | string \| null | null | Error message |
| hint | string \| null | null | Hint text |
| disabled | boolean | false | Disabled state |
| required | boolean | false | Required indicator |

**Usage:**

```svelte
<Input
  label="Email"
  type="email"
  bind:value={email}
  placeholder="you@example.com"
  error={errors.email}
  required
/>

<Input
  label="Password"
  type="password"
  bind:value={password}
  hint="Must be at least 8 characters"
/>
```

---

### Textarea

**File:** `assets/svelte/components/ui/Textarea.svelte`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| value | string | '' | Bound value |
| placeholder | string | '' | Placeholder |
| label | string \| null | null | Label text |
| error | string \| null | null | Error message |
| rows | number | 3 | Number of rows |
| maxLength | number \| null | null | Character limit |
| disabled | boolean | false | Disabled state |

**Usage:**

```svelte
<Textarea
  label="Message"
  bind:value={message}
  placeholder="Type your message..."
  rows={5}
  maxLength={500}
/>
```

---

### Badge

**File:** `assets/svelte/components/ui/Badge.svelte`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | 'default' \| 'success' \| 'warning' \| 'error' \| 'info' | 'default' | Color variant |
| size | 'sm' \| 'md' | 'md' | Size |

**Usage:**

```svelte
<Badge>Default</Badge>
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="error">Failed</Badge>
<Badge variant="info" size="sm">New</Badge>
```

---

### Card

**File:** `assets/svelte/components/ui/Card.svelte`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| padding | 'none' \| 'sm' \| 'md' \| 'lg' | 'md' | Internal padding |
| shadow | 'none' \| 'sm' \| 'md' \| 'lg' | 'sm' | Shadow depth |
| hover | boolean | false | Hover effect |

**Usage:**

```svelte
<Card>
  <h3>Card Title</h3>
  <p>Card content goes here.</p>
</Card>

<Card padding="lg" shadow="md" hover>
  <slot name="header">
    <h3>Header</h3>
  </slot>
  <p>Hoverable card with larger padding.</p>
</Card>
```

---

### Modal

**File:** `assets/svelte/components/ui/Modal.svelte`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| open | boolean | false | Open state |
| title | string | '' | Modal title |
| size | 'sm' \| 'md' \| 'lg' \| 'full' | 'md' | Width |
| closable | boolean | true | Show close button |

**Events:**
- `on:close` - Fired when modal should close

**Usage:**

```svelte
<script>
  let showModal = $state(false);
</script>

<Button on:click={() => showModal = true}>Open Modal</Button>

<Modal bind:open={showModal} title="Confirm Action" size="sm">
  <p>Are you sure you want to proceed?</p>

  <svelte:fragment slot="footer">
    <Button variant="ghost" on:click={() => showModal = false}>
      Cancel
    </Button>
    <Button variant="primary" on:click={handleConfirm}>
      Confirm
    </Button>
  </svelte:fragment>
</Modal>
```

---

### Spinner

**File:** `assets/svelte/components/ui/Spinner.svelte`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| size | 'sm' \| 'md' \| 'lg' | 'md' | Size |
| color | 'primary' \| 'current' | 'primary' | Color |

**Usage:**

```svelte
<Spinner />
<Spinner size="lg" />
<Spinner size="sm" color="current" />
```

---

### Toast

**File:** `assets/svelte/components/ui/Toast.svelte`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | 'info' \| 'success' \| 'warning' \| 'error' | 'info' | Type |
| message | string | '' | Message text |
| dismissible | boolean | true | Can dismiss |
| duration | number | 5000 | Auto-dismiss (ms) |

**Usage:**

```svelte
<Toast variant="success" message="Changes saved!" />
<Toast variant="error" message="Something went wrong" dismissible />
```

---

## Layout Components

### Stack

**File:** `assets/svelte/components/layout/Stack.svelte`

Vertical or horizontal flex layout with consistent spacing.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| direction | 'vertical' \| 'horizontal' | 'vertical' | Direction |
| gap | 'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' | 'md' | Gap size |
| align | 'start' \| 'center' \| 'end' \| 'stretch' | 'stretch' | Alignment |

**Usage:**

```svelte
<Stack gap="lg">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Stack>

<Stack direction="horizontal" gap="sm" align="center">
  <Avatar size="sm" />
  <span>Username</span>
</Stack>
```

---

### Container

**File:** `assets/svelte/components/layout/Container.svelte`

Centered container with max-width.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| size | 'sm' \| 'md' \| 'lg' \| 'xl' \| 'full' | 'lg' | Max width |
| padding | boolean | true | Horizontal padding |

**Usage:**

```svelte
<Container size="md">
  <h1>Page Content</h1>
  <p>Centered with max-width.</p>
</Container>
```

---

## Creating New Components

### Checklist

- [ ] Use design tokens (no hardcoded values)
- [ ] Add JSDoc comments for all props
- [ ] Provide default values
- [ ] Use semantic HTML
- [ ] Support keyboard navigation
- [ ] Add to index.js exports
- [ ] Document in this file

### Template

```svelte
<!--
  ComponentName
  Description of the component.
-->
<script>
  /**
   * Description of prop
   * @type {'option1' | 'option2'}
   */
  export let propName = 'option1';

  /** @type {boolean} */
  export let disabled = false;

  // Computed classes
  const variantClasses = {
    option1: 'bg-primary text-on-primary',
    option2: 'bg-secondary text-on-secondary',
  };
</script>

<div
  class="
    base-classes
    {variantClasses[propName]}
    {disabled ? 'opacity-50 cursor-not-allowed' : ''}
  "
  {...$$restProps}
>
  <slot />
</div>
```

### Export from Index

```javascript
// assets/svelte/components/ui/index.js
export { default as Button } from './Button.svelte';
export { default as Avatar } from './Avatar.svelte';
export { default as Input } from './Input.svelte';
export { default as NewComponent } from './NewComponent.svelte';
```
