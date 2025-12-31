<!--
  Checkbox Component
  Controlled checkbox with label support.
  NO class prop - consistent styling enforced.
-->
<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  /** @type {boolean} */
  export let checked = false;

  /** @type {string | null} - Label text */
  export let label = null;

  /** @type {'sm' | 'md' | 'lg'} */
  export let size = 'md';

  /** @type {boolean} */
  export let disabled = false;

  /** @type {string | null} */
  export let name = null;

  /** @type {string} */
  export let id = `checkbox-${Math.random().toString(36).slice(2, 9)}`;

  /** @type {string | null} - Description text below label */
  export let description = null;

  // Size variants
  const sizes = {
    sm: { box: 'h-4 w-4', text: 'text-sm', gap: 'gap-2' },
    md: { box: 'h-4 w-4', text: 'text-base', gap: 'gap-3' },
    lg: { box: 'h-6 w-6', text: 'text-lg', gap: 'gap-3' }
  };

  $: sizeConfig = sizes[size];

  function handleChange(e) {
    checked = e.target.checked;
    dispatch('change', { checked });
  }
</script>

<div class="flex items-start {sizeConfig.gap}">
  <input
    type="checkbox"
    {id}
    {name}
    {checked}
    {disabled}
    class="
      {sizeConfig.box}
      mt-0-5
      rounded-sm
      border border-border
      bg-surface
      text-primary
      transition-colors
      focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
      checked:bg-primary checked:border-primary
    "
    on:change={handleChange}
  />

  {#if label || description}
    <div class="flex flex-col">
      {#if label}
        <label
          for={id}
          class="{sizeConfig.text} font-medium text-text cursor-pointer"
          class:text-text-disabled={disabled}
        >
          {label}
        </label>
      {/if}
      {#if description}
        <span class="text-sm text-text-muted">{description}</span>
      {/if}
    </div>
  {/if}
</div>
