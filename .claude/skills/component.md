# /component - Create Component Skill

Create a new UI component (Phoenix or Svelte).

## Usage

```
/component [name] --type [phoenix|svelte]
[describe what it should do]
```

## Instructions

When the user runs `/component`, follow this workflow:

1. **Determine Type**
   - Phoenix: Server-rendered, simple interactions
   - Svelte: Rich interactions, client state, animations

2. **Define Interface**
   - Props/attributes needed
   - Slots for content
   - Events to emit
   - Variants (if any)

3. **Create Component**
   - Follow patterns in CLAUDE.md
   - Use design tokens
   - Add documentation

4. **Register & Document**
   - Add to appropriate module
   - Export from index
   - Add to COMPONENTS.md

## Phoenix Component Template

```elixir
@doc """
[Component description]

## Examples

    <.component_name prop="value">
      Content
    </.component_name>
"""
attr :prop_name, :string, required: true, doc: "Description"
attr :class, :string, default: nil
slot :inner_block, required: true

def component_name(assigns) do
  ~H"""
  <div class={["base-classes", @class]}>
    <%= render_slot(@inner_block) %>
  </div>
  """
end
```

## Svelte Component Template

```svelte
<!--
  ComponentName
  [Description]
-->
<script>
  /** @type {string} Description */
  export let propName = 'default';

  // For LiveView events
  import { pushEvent } from 'live_svelte';
  export let live = null;
</script>

<div class="[design tokens]">
  <slot />
</div>
```

## Checklist

- [ ] Uses design tokens (not hardcoded values)
- [ ] Has documentation/JSDoc
- [ ] Added to exports
- [ ] Added to COMPONENTS.md
- [ ] Has default values for optional props
- [ ] Uses semantic HTML

## Example

User: `/component Badge --type phoenix`

AI Response:
Creating Phoenix Badge component...

1. Props defined:
   - variant: :default | :success | :warning | :error
   - size: :sm | :md
   - class: optional additional classes

2. Component created in ui_components.ex

3. Added to COMPONENTS.md

4. Usage:
```elixir
<.badge variant={:success}>Active</.badge>
<.badge variant={:error} size={:sm}>Failed</.badge>
```
