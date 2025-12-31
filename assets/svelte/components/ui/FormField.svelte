<!--
  FormField
  Consistent wrapper for form inputs with label, error, and helper text.
  Enforces consistent spacing and layout for all form elements.
-->
<script>
  /** @type {string} Label text for the field */
  export let label = '';

  /** @type {string} Unique ID for the input (auto-generated if not provided) */
  export let id = `field-${Math.random().toString(36).slice(2, 9)}`;

  /** @type {string | null} Error message to display */
  export let error = null;

  /** @type {string | null} Helper text below the input */
  export let helper = null;

  /** @type {boolean} Whether the field is required */
  export let required = false;

  /** @type {boolean} Whether the field is disabled */
  export let disabled = false;
</script>

<div class="flex flex-col gap-1">
  {#if label}
    <label
      for={id}
      class="text-sm font-medium text-text"
      class:text-text-disabled={disabled}
    >
      {label}
      {#if required}
        <span class="text-error ml-0-5">*</span>
      {/if}
    </label>
  {/if}

  <div class="relative">
    <slot {id} {error} {disabled} />
  </div>

  {#if error}
    <p class="text-sm text-error" role="alert">{error}</p>
  {:else if helper}
    <p class="text-sm text-text-muted">{helper}</p>
  {/if}
</div>
