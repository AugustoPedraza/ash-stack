<!--
  Button Component
  Primary interactive element for user actions.
  NO class prop or restProps - use variant/size props only.
-->
<script>
  /**
   * Visual style variant
   * @type {'primary' | 'secondary' | 'ghost' | 'danger'}
   */
  export let variant = 'primary';

  /**
   * Size of the button
   * @type {'sm' | 'md' | 'lg'}
   */
  export let size = 'md';

  /** @type {boolean} */
  export let disabled = false;

  /** @type {boolean} */
  export let loading = false;

  /** @type {boolean} */
  export let fullWidth = false;

  /**
   * HTML button type
   * @type {'button' | 'submit' | 'reset'}
   */
  export let type = 'button';

  /** @type {string | null} - For icon-only buttons */
  export let ariaLabel = null;

  // Variant styles using design tokens
  const variants = {
    primary: 'bg-primary text-on-primary hover:bg-primary-hover active:bg-primary-active',
    secondary: 'bg-surface-raised text-text border border-border hover:bg-surface-sunken',
    ghost: 'bg-transparent text-text hover:bg-surface-sunken',
    danger: 'bg-error text-on-error hover:opacity-90 active:opacity-80',
  };

  // Size styles - only using allowed spacing values
  const sizes = {
    sm: 'h-8 px-3 text-sm gap-2 rounded-md',
    md: 'h-10 px-4 text-base gap-2 rounded-md',
    lg: 'h-12 px-6 text-lg gap-3 rounded-lg',
  };

  $: buttonClasses = [
    'inline-flex items-center justify-center',
    'font-medium',
    'transition-colors',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
    variants[variant],
    sizes[size],
    fullWidth ? 'w-full' : ''
  ].filter(Boolean).join(' ');
</script>

<button
  {type}
  class={buttonClasses}
  disabled={disabled || loading}
  aria-label={ariaLabel}
  aria-busy={loading}
  on:click
  on:focus
  on:blur
>
  {#if loading}
    <svg
      class="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  {/if}
  <slot />
</button>
