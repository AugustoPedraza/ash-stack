<!--
  Input Component
  Text input with label, error, and hint support.
-->
<script>
  /**
   * Input type
   * @type {'text' | 'email' | 'password' | 'tel' | 'url' | 'search' | 'number'}
   */
  export let type = 'text';

  /** @type {string} */
  export let value = '';

  /** @type {string} */
  export let placeholder = '';

  /**
   * Label text
   * @type {string | null}
   */
  export let label = null;

  /**
   * Error message
   * @type {string | null}
   */
  export let error = null;

  /**
   * Hint text (shown below input)
   * @type {string | null}
   */
  export let hint = null;

  /** @type {boolean} */
  export let disabled = false;

  /** @type {boolean} */
  export let required = false;

  /**
   * Input name attribute
   * @type {string | null}
   */
  export let name = null;

  /**
   * Input id (auto-generated if not provided)
   * @type {string | null}
   */
  export let id = null;

  // Generate unique ID if not provided
  const inputId = id || `input-${Math.random().toString(36).slice(2, 9)}`;

  // Determine if input has error state
  $: hasError = error !== null && error !== '';
</script>

<div class="w-full" {...$$restProps}>
  {#if label}
    <label
      for={inputId}
      class="block text-sm font-medium text-text mb-1.5"
    >
      {label}
      {#if required}
        <span class="text-error">*</span>
      {/if}
    </label>
  {/if}

  <input
    {type}
    id={inputId}
    {name}
    bind:value
    {placeholder}
    {disabled}
    {required}
    class="
      w-full h-10 px-3
      bg-surface-raised
      border rounded-lg
      text-text text-base
      placeholder:text-text-muted
      transition-colors duration-fast
      focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
      disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-surface-sunken
      {hasError
        ? 'border-error focus:ring-error'
        : 'border-border hover:border-border-strong'}
    "
    aria-invalid={hasError}
    aria-describedby={hasError ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
    on:input
    on:focus
    on:blur
    on:keydown
  />

  {#if hasError}
    <p id="{inputId}-error" class="mt-1.5 text-sm text-error">
      {error}
    </p>
  {:else if hint}
    <p id="{inputId}-hint" class="mt-1.5 text-sm text-text-muted">
      {hint}
    </p>
  {/if}
</div>
