<script>
  /**
   * FormField Component
   * Label + input wrapper with error message display.
   *
   * @prop {string} [label] - Field label text
   * @prop {string} [error] - Error message to display
   * @prop {string} [helper] - Helper text below input
   * @prop {boolean} [required=false] - Shows required indicator
   * @prop {string} [id] - ID for label-input association
   * @prop {Snippet} [children] - Input element slot
   */

  let {
    label = '',
    error = '',
    helper = '',
    required = false,
    id = undefined,
    children
  } = $props();

  // Generate unique ID if not provided
  const fieldId = id || `field-${Math.random().toString(36).slice(2, 9)}`;
</script>

<div class="space-y-1.5">
  {#if label}
    <label
      for={fieldId}
      class="block text-sm font-medium text-text"
    >
      {label}
      {#if required}
        <span class="text-error ml-0.5" aria-hidden="true">*</span>
      {/if}
    </label>
  {/if}

  <div>
    {@render children?.()}
  </div>

  {#if error}
    <p
      class="text-xs text-error flex items-center gap-1"
      role="alert"
      aria-live="polite"
    >
      <svg class="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {error}
    </p>
  {:else if helper}
    <p class="text-xs text-text-muted">
      {helper}
    </p>
  {/if}
</div>
