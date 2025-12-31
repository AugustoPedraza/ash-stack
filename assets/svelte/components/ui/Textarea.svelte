<!--
  Textarea Component
  Controlled textarea with consistent styling.
  NO class prop - use size prop for customization.
-->
<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  /** @type {string} */
  export let value = '';

  /** @type {string} */
  export let placeholder = '';

  /** @type {'sm' | 'md' | 'lg'} - Affects padding/text size, not height */
  export let size = 'md';

  /** @type {number} */
  export let rows = 3;

  /** @type {boolean} */
  export let disabled = false;

  /** @type {boolean} */
  export let required = false;

  /** @type {boolean} - Shows error styling */
  export let invalid = false;

  /** @type {boolean} - Allow manual resize */
  export let resizable = true;

  /** @type {string | null} */
  export let name = null;

  /** @type {string} */
  export let id = `textarea-${Math.random().toString(36).slice(2, 9)}`;

  /** @type {string | null} - For aria-describedby */
  export let describedBy = null;

  // Size variants (padding/text only, not height)
  const sizes = {
    sm: 'p-2 text-sm',
    md: 'p-3 text-base',
    lg: 'p-4 text-lg'
  };

  const baseClasses = `
    w-full
    bg-surface
    border border-border
    rounded-md
    text-text
    placeholder:text-text-muted
    transition-colors
    focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
    disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-surface-sunken
  `.trim().replace(/\s+/g, ' ');

  $: textareaClasses = [
    baseClasses,
    sizes[size],
    invalid ? 'border-error focus:ring-error' : 'hover:border-border-strong',
    resizable ? 'resize-y' : 'resize-none'
  ].join(' ');

  function handleInput(e) {
    value = e.target.value;
    dispatch('input', { value });
  }
</script>

<textarea
  {id}
  {name}
  {rows}
  {placeholder}
  {disabled}
  {required}
  class={textareaClasses}
  aria-invalid={invalid}
  aria-describedby={describedBy}
  on:input={handleInput}
  on:focus
  on:blur
  on:keydown
>{value}</textarea>
