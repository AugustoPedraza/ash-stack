<!--
  Badge Component
  Status indicators, labels, and tags.
  NO class prop - use variant/size props only.
-->
<script>
  /**
   * Visual variant
   * @type {'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'}
   */
  export let variant = 'default';

  /**
   * Size
   * @type {'sm' | 'md' | 'lg'}
   */
  export let size = 'md';

  /**
   * Make it a dot indicator (no text)
   * @type {boolean}
   */
  export let dot = false;

  // Variant styles
  const variants = {
    default: 'bg-surface-sunken text-text border border-border',
    primary: 'bg-primary text-on-primary',
    success: 'bg-success-soft text-success border border-success',
    warning: 'bg-warning-soft text-warning border border-warning',
    error: 'bg-error-soft text-error border border-error',
    info: 'bg-info-soft text-info border border-info',
  };

  // Size styles
  const sizes = {
    sm: 'px-2 py-0-5 text-xs',
    md: 'px-2 py-1 text-sm',
    lg: 'px-3 py-1 text-base',
  };

  // Dot sizes
  const dotSizes = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };
</script>

{#if dot}
  <span
    class="inline-block rounded-full {dotSizes[size]} {variants[variant]}"
    role="status"
  />
{:else}
  <span
    class="inline-flex items-center font-medium rounded-full {variants[variant]} {sizes[size]}"
  >
    <slot />
  </span>
{/if}
