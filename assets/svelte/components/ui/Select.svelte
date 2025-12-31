<!--
  Select Component
  Controlled dropdown select with consistent styling.
  NO class prop - use size prop for customization.
-->
<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  /** @type {string} */
  export let value = '';

  /** @type {Array<{value: string, label: string, disabled?: boolean}>} */
  export let options = [];

  /** @type {string} Placeholder shown when no value selected */
  export let placeholder = 'Select...';

  /** @type {'sm' | 'md' | 'lg'} */
  export let size = 'md';

  /** @type {boolean} */
  export let disabled = false;

  /** @type {boolean} */
  export let required = false;

  /** @type {boolean} - Shows error styling */
  export let invalid = false;

  /** @type {string | null} */
  export let name = null;

  /** @type {string} */
  export let id = `select-${Math.random().toString(36).slice(2, 9)}`;

  /** @type {string | null} - For aria-describedby */
  export let describedBy = null;

  // Size variants
  const sizes = {
    sm: 'h-8 px-2 text-sm',
    md: 'h-10 px-3 text-base',
    lg: 'h-12 px-4 text-lg'
  };

  const baseClasses = `
    w-full appearance-none
    bg-surface
    border border-border
    rounded-md
    text-text
    transition-colors
    focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
    disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-surface-sunken
  `.trim().replace(/\s+/g, ' ');

  $: selectClasses = [
    baseClasses,
    sizes[size],
    invalid ? 'border-error focus:ring-error' : 'hover:border-border-strong'
  ].join(' ');

  function handleChange(e) {
    value = e.target.value;
    dispatch('change', { value });
  }
</script>

<div class="relative">
  <select
    {id}
    {name}
    {value}
    {disabled}
    {required}
    class={selectClasses}
    aria-invalid={invalid}
    aria-describedby={describedBy}
    on:change={handleChange}
    on:focus
    on:blur
  >
    {#if placeholder}
      <option value="" disabled selected={!value}>{placeholder}</option>
    {/if}
    {#each options as option}
      <option
        value={option.value}
        disabled={option.disabled}
        selected={value === option.value}
      >
        {option.label}
      </option>
    {/each}
  </select>

  <!-- Dropdown arrow -->
  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
    <svg class="h-4 w-4 text-text-muted" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
    </svg>
  </div>
</div>
