# Component Catalog

> UI component reference for consistent design and AI generation.
> **Components have NO class escape hatch** - use variant/size props.

## Design System Enforcement

Tailwind is **restricted** to design tokens only. Raw classes like `bg-blue-500` don't exist.

### Available Values

```
Colors:   primary, secondary, success, warning, error, info
          surface, surface-raised, surface-sunken, background
          text, text-secondary, text-muted, text-disabled
          border, border-strong

Spacing:  0, px, 0.5, 1, 2, 3, 4, 6, 8, 12, 16, 20, 24
          ❌ p-5, m-7, gap-9 do NOT exist

Radii:    none, sm, md, lg, full
          ❌ xl, 2xl, 3xl do NOT exist

Shadows:  none, sm, md, lg, xl

Z-Index:  below, base, raised, dropdown, sticky, overlay, modal, popover, toast, tooltip
          ❌ z-10, z-50 do NOT exist
```

Run `just lint-tokens` to catch violations.

---

## Form Components

### Button

**File:** `assets/svelte/components/ui/Button.svelte`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | 'primary' \| 'secondary' \| 'ghost' \| 'danger' | 'primary' | Visual style |
| size | 'sm' \| 'md' \| 'lg' | 'md' | Size |
| disabled | boolean | false | Disabled state |
| loading | boolean | false | Loading state with spinner |
| fullWidth | boolean | false | Full width |
| type | 'button' \| 'submit' \| 'reset' | 'button' | Button type |
| ariaLabel | string \| null | null | For icon-only buttons |

```svelte
<Button variant="primary" on:click={save}>Save</Button>
<Button variant="secondary" size="sm">Cancel</Button>
<Button variant="danger" loading={isDeleting}>Delete</Button>
<Button variant="ghost" fullWidth>Expand</Button>
```

---

### Input

**File:** `assets/svelte/components/ui/Input.svelte`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| type | 'text' \| 'email' \| 'password' \| 'tel' \| 'url' \| 'search' \| 'number' | 'text' | Input type |
| value | string | '' | Bound value |
| size | 'sm' \| 'md' \| 'lg' | 'md' | Size |
| placeholder | string | '' | Placeholder |
| invalid | boolean | false | Error state styling |
| disabled | boolean | false | Disabled state |
| required | boolean | false | Required attribute |

```svelte
<Input type="email" bind:value={email} placeholder="you@example.com" />
<Input size="sm" invalid={!!error} />
<Input type="password" disabled={isLoading} />
```

---

### Select

**File:** `assets/svelte/components/ui/Select.svelte`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| value | string | '' | Selected value |
| options | Array<{value, label, disabled?}> | [] | Options list |
| size | 'sm' \| 'md' \| 'lg' | 'md' | Size |
| placeholder | string | 'Select...' | Placeholder |
| invalid | boolean | false | Error state |
| disabled | boolean | false | Disabled |

```svelte
<Select
  bind:value={country}
  options={[
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
  ]}
  placeholder="Select country"
/>
```

---

### Textarea

**File:** `assets/svelte/components/ui/Textarea.svelte`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| value | string | '' | Bound value |
| size | 'sm' \| 'md' \| 'lg' | 'md' | Padding/text size |
| rows | number | 3 | Number of rows |
| placeholder | string | '' | Placeholder |
| resizable | boolean | true | Allow resize |
| invalid | boolean | false | Error state |

```svelte
<Textarea bind:value={message} rows={5} placeholder="Your message..." />
```

---

### Checkbox

**File:** `assets/svelte/components/ui/Checkbox.svelte`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| checked | boolean | false | Checked state |
| label | string \| null | null | Label text |
| description | string \| null | null | Description below label |
| size | 'sm' \| 'md' \| 'lg' | 'md' | Size |
| disabled | boolean | false | Disabled |

```svelte
<Checkbox bind:checked={agree} label="I agree to terms" />
<Checkbox
  bind:checked={newsletter}
  label="Subscribe to newsletter"
  description="Get weekly updates"
/>
```

---

### FormField

**File:** `assets/svelte/components/ui/FormField.svelte`

Wrapper for form inputs with label, error, and helper text.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| label | string | '' | Label text |
| error | string \| null | null | Error message |
| helper | string \| null | null | Helper text |
| required | boolean | false | Show required indicator |
| disabled | boolean | false | Dim label |

```svelte
<FormField label="Email" error={errors.email} required>
  <Input type="email" bind:value={email} invalid={!!errors.email} />
</FormField>

<FormField label="Bio" helper="Max 500 characters">
  <Textarea bind:value={bio} />
</FormField>
```

---

## Layout Components

### Page

**File:** `assets/svelte/components/ui/Page.svelte`

Page wrapper with max-width and padding.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| size | 'sm' \| 'md' \| 'lg' \| 'xl' \| 'full' | 'lg' | Max width |
| padded | boolean | true | Vertical padding |
| centered | boolean | true | Center content |

```svelte
<Page size="lg">
  <PageHeader title="Dashboard" />
  <!-- content -->
</Page>
```

---

### PageHeader

**File:** `assets/svelte/components/ui/PageHeader.svelte`

Consistent page header with title, description, and action slots.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| title | string | required | Page title |
| description | string \| null | null | Description |
| bordered | boolean | false | Border below |

**Slots:** `actions`, `tabs`

```svelte
<PageHeader title="Settings" description="Manage your account">
  <svelte:fragment slot="actions">
    <Button variant="primary">Save Changes</Button>
  </svelte:fragment>
</PageHeader>
```

---

### Card

**File:** `assets/svelte/components/ui/Card.svelte`

Container with optional header and footer.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | 'default' \| 'raised' \| 'outline' \| 'ghost' | 'default' | Style |
| padding | 'none' \| 'sm' \| 'md' \| 'lg' | 'md' | Padding |
| title | string \| null | null | Card title |
| description | string \| null | null | Card description |

**Slots:** `header`, `footer`, `actions`

```svelte
<Card title="User Profile" description="Edit your information">
  <form>...</form>
  <svelte:fragment slot="footer">
    <Button>Save</Button>
  </svelte:fragment>
</Card>

<Card variant="raised" padding="lg">
  <p>Elevated content</p>
</Card>
```

---

### Section

**File:** `assets/svelte/components/ui/Section.svelte`

Vertical rhythm for page sections.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| title | string \| null | null | Section title |
| description | string \| null | null | Description |
| spacing | 'sm' \| 'md' \| 'lg' | 'md' | Vertical spacing |

**Slots:** `header`, `actions`

```svelte
<Section title="Recent Activity" spacing="lg">
  <Card>...</Card>
  <Card>...</Card>
</Section>
```

---

## Display Components

### Avatar

**File:** `assets/svelte/components/ui/Avatar.svelte`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| size | 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' | 'md' | Size |
| src | string \| null | null | Image URL |
| alt | string | '' | Alt text / name for initials |
| fallback | string \| null | null | Explicit initials |
| shape | 'circle' \| 'rounded' | 'circle' | Shape |
| status | 'online' \| 'offline' \| 'away' \| 'busy' \| null | null | Status dot |

```svelte
<Avatar src="/avatar.jpg" alt="John Doe" size="lg" />
<Avatar alt="Jane Smith" status="online" />
<Avatar fallback="AB" shape="rounded" />
```

**Sizes:** xs=24px, sm=32px, md=40px, lg=48px, xl=64px

---

### Badge

**File:** `assets/svelte/components/ui/Badge.svelte`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | 'default' \| 'primary' \| 'success' \| 'warning' \| 'error' \| 'info' | 'default' | Color |
| size | 'sm' \| 'md' \| 'lg' | 'md' | Size |
| dot | boolean | false | Dot indicator only |

```svelte
<Badge>Default</Badge>
<Badge variant="success">Active</Badge>
<Badge variant="error" size="sm">Failed</Badge>
<Badge variant="primary" dot />
```

---

## Usage Patterns

### Complete Form

```svelte
<script>
  import { FormField, Input, Select, Button } from '$lib/components/ui';

  let name = '';
  let role = '';
  let errors = {};
</script>

<form on:submit|preventDefault={handleSubmit}>
  <FormField label="Name" error={errors.name} required>
    <Input bind:value={name} invalid={!!errors.name} />
  </FormField>

  <FormField label="Role">
    <Select
      bind:value={role}
      options={[
        { value: 'admin', label: 'Admin' },
        { value: 'user', label: 'User' }
      ]}
    />
  </FormField>

  <Button type="submit" variant="primary">Save</Button>
</form>
```

### Complete Page

```svelte
<script>
  import { Page, PageHeader, Section, Card, Button } from '$lib/components/ui';
</script>

<Page size="lg">
  <PageHeader
    title="Dashboard"
    description="Overview of your account"
    bordered
  >
    <svelte:fragment slot="actions">
      <Button variant="primary">New Project</Button>
    </svelte:fragment>
  </PageHeader>

  <Section title="Projects" spacing="md">
    <svelte:fragment slot="actions">
      <Button variant="ghost" size="sm">View All</Button>
    </svelte:fragment>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card title="Project A">
        <p class="text-text-muted">Description here</p>
      </Card>
      <Card title="Project B">
        <p class="text-text-muted">Description here</p>
      </Card>
    </div>
  </Section>
</Page>
```

---

## Creating New Components

### Rules

1. **NO class prop** - Use variant/size props instead
2. **NO $$restProps** - Explicit props only
3. **Use design tokens** - No raw Tailwind colors
4. **Use valid spacing** - 0,1,2,3,4,6,8,12,16,20,24 only
5. **Add JSDoc** - Type all props

### Template

```svelte
<!--
  ComponentName
  Description of the component.
  NO class prop - use variant/size props.
-->
<script>
  /**
   * Visual variant
   * @type {'default' | 'primary'}
   */
  export let variant = 'default';

  /**
   * Size
   * @type {'sm' | 'md' | 'lg'}
   */
  export let size = 'md';

  /** @type {boolean} */
  export let disabled = false;

  // Variant styles - only design tokens
  const variants = {
    default: 'bg-surface text-text border border-border',
    primary: 'bg-primary text-on-primary',
  };

  // Size styles - only valid spacing
  const sizes = {
    sm: 'p-2 text-sm',
    md: 'p-4 text-base',
    lg: 'p-6 text-lg',
  };
</script>

<div
  class="{variants[variant]} {sizes[size]} rounded-md"
  class:opacity-50={disabled}
  class:cursor-not-allowed={disabled}
>
  <slot />
</div>
```

### Export

Add to `assets/svelte/components/ui/index.js`:

```javascript
export { default as NewComponent } from './NewComponent.svelte';
```
