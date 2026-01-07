<script>
  /**
   * Badge Component
   * Status indicators using design tokens.
   *
   * @prop {'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral'} [variant='neutral']
   * @prop {'sm' | 'md'} [size='sm']
   * @prop {boolean} [dot=false] - Show dot indicator instead of text
   * @prop {Snippet} [children] - Badge content
   */

  let {
    variant = 'neutral',
    size = 'sm',
    dot = false,
    children
  } = $props();

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm'
  };

  const variants = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    success: 'bg-success-soft text-success',
    warning: 'bg-warning-soft text-warning',
    error: 'bg-error-soft text-error',
    info: 'bg-info-soft text-info',
    neutral: 'bg-base-200 text-text-secondary'
  };

  const dotColors = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    success: 'bg-success',
    warning: 'bg-warning',
    error: 'bg-error',
    info: 'bg-info',
    neutral: 'bg-text-muted'
  };

  const baseClasses = 'inline-flex items-center font-medium rounded-full';
</script>

{#if dot}
  <span class="inline-flex items-center gap-1.5 {sizes[size]}">
    <span class="w-2 h-2 rounded-full {dotColors[variant]}" aria-hidden="true"></span>
    {@render children?.()}
  </span>
{:else}
  <span class="{baseClasses} {sizes[size]} {variants[variant]}">
    {@render children?.()}
  </span>
{/if}
