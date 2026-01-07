<script>
  /**
   * Button Component
   * Primary interactive element using design tokens.
   *
   * @prop {'primary' | 'secondary' | 'ghost' | 'danger'} [variant='primary']
   * @prop {'sm' | 'md' | 'lg'} [size='md']
   * @prop {boolean} [loading=false] - Shows loading spinner
   * @prop {boolean} [disabled=false]
   * @prop {boolean} [fullWidth=false]
   * @prop {'button' | 'submit' | 'reset'} [type='button']
   * @prop {string} [ariaLabel] - For icon-only buttons
   * @prop {() => void} [onclick]
   * @prop {Snippet} [children]
   */

  let {
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    fullWidth = false,
    type = 'button',
    ariaLabel = undefined,
    onclick = undefined,
    children
  } = $props();

  // Size classes using design tokens
  const sizes = {
    sm: 'min-h-[var(--button-sm)] px-3 py-1.5 text-xs gap-1.5',
    md: 'min-h-[var(--button-md)] px-4 py-2 text-sm gap-2',
    lg: 'min-h-[var(--button-lg)] px-6 py-3 text-base gap-2.5'
  };

  // Variant classes using semantic colors
  const variants = {
    primary: `
      bg-primary text-white
      hover:bg-primary-hover active:bg-primary-active
      disabled:bg-surface-sunken disabled:text-text-disabled
    `,
    secondary: `
      bg-surface text-text
      hover:bg-surface-sunken active:bg-surface-sunken
      border border-border
      disabled:bg-surface-sunken disabled:text-text-disabled
    `,
    ghost: `
      bg-transparent text-text
      hover:bg-surface-sunken active:bg-surface-sunken
      disabled:text-text-disabled
    `,
    danger: `
      bg-error text-white
      hover:bg-error/90 active:bg-error/80
      disabled:bg-surface-sunken disabled:text-text-disabled
    `
  };

  const baseClasses = `
    inline-flex items-center justify-center
    font-medium rounded-[var(--radius-md)]
    transition-[background-color,border-color,transform]
    duration-[var(--duration-fast)]
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2
    active:scale-[var(--scale-press)]
    disabled:cursor-not-allowed disabled:active:scale-100
    select-none
  `;
</script>

<button
  {type}
  class="{baseClasses} {sizes[size]} {variants[variant]} {fullWidth ? 'w-full' : ''}"
  disabled={disabled || loading}
  aria-label={ariaLabel}
  aria-busy={loading}
  {onclick}
>
  {#if loading}
    <svg
      class="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  {/if}
  {@render children?.()}
</button>
