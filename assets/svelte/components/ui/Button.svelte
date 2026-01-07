<script>
  /**
   * Button Component
   * Primary interactive element using shadcn-compatible design tokens.
   *
   * @prop {'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'} [variant='primary']
   * @prop {'sm' | 'md' | 'lg' | 'icon'} [size='md']
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

  // Size classes - using 8px grid spacing
  const sizes = {
    sm: 'h-8 px-3 text-sm gap-1.5 rounded-md',
    md: 'h-10 px-4 text-sm gap-2 rounded-md',
    lg: 'h-12 px-6 text-base gap-2 rounded-lg',
    icon: 'h-10 w-10 rounded-md'
  };

  // Variant classes using shadcn-compatible tokens
  const variants = {
    primary: `
      bg-primary text-primary-foreground shadow-sm
      hover:bg-primary/90
      disabled:opacity-50
    `,
    secondary: `
      bg-secondary text-secondary-foreground shadow-sm
      hover:bg-secondary/80
      disabled:opacity-50
    `,
    outline: `
      bg-background text-foreground shadow-sm
      border border-input
      hover:bg-accent hover:text-accent-foreground
      disabled:opacity-50
    `,
    ghost: `
      text-foreground
      hover:bg-accent hover:text-accent-foreground
      disabled:opacity-50
    `,
    danger: `
      bg-destructive text-white shadow-sm
      hover:bg-destructive/90
      disabled:opacity-50
    `
  };

  const baseClasses = `
    inline-flex items-center justify-center
    font-medium whitespace-nowrap
    transition-colors duration-150
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
    disabled:pointer-events-none
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
