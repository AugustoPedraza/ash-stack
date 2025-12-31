<!--
  Button Component
  Primary interactive element with loading, success states, and iOS-style press feedback.
  NO class prop - use variant/size props only.
-->
<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  /** @type {'primary' | 'secondary' | 'ghost' | 'danger'} */
  export let variant = 'primary';

  /** @type {'sm' | 'md' | 'lg'} */
  export let size = 'md';

  /** @type {boolean} */
  export let disabled = false;

  /** @type {boolean} */
  export let loading = false;

  /** @type {boolean} - Show success state */
  export let success = false;

  /** @type {boolean} */
  export let fullWidth = false;

  /** @type {'button' | 'submit' | 'reset'} */
  export let type = 'button';

  /** @type {string | null} - For icon-only buttons */
  export let ariaLabel = null;

  // Track press state for iOS-style feedback
  let isPressed = false;

  // Variant styles
  const variants = {
    primary: {
      base: 'bg-primary text-on-primary',
      hover: 'hover:bg-primary-hover',
      active: 'active:bg-primary-active',
      success: 'bg-success text-on-success'
    },
    secondary: {
      base: 'bg-surface-raised text-text border border-border',
      hover: 'hover:bg-surface-sunken',
      active: 'active:bg-surface-sunken',
      success: 'bg-success-soft text-success border-success'
    },
    ghost: {
      base: 'bg-transparent text-text',
      hover: 'hover:bg-surface-sunken',
      active: 'active:bg-surface-sunken',
      success: 'bg-success-soft text-success'
    },
    danger: {
      base: 'bg-error text-on-error',
      hover: 'hover:opacity-90',
      active: 'active:opacity-80',
      success: 'bg-success text-on-success'
    }
  };

  // Size styles
  const sizes = {
    sm: 'h-8 px-3 text-sm gap-2 rounded-md min-w-[64px]',
    md: 'h-10 px-4 text-base gap-2 rounded-md min-w-[80px]',
    lg: 'h-12 px-6 text-lg gap-3 rounded-lg min-w-[96px]'
  };

  $: variantStyles = variants[variant];
  $: isDisabled = disabled || loading;

  // Current background based on state
  $: currentBg = success ? variantStyles.success : variantStyles.base;

  $: buttonClasses = [
    'inline-flex items-center justify-center',
    'font-medium',
    'select-none',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'transition-all duration-150',
    currentBg,
    !isDisabled && !success ? variantStyles.hover : '',
    !isDisabled && !success ? variantStyles.active : '',
    sizes[size],
    fullWidth ? 'w-full' : '',
    // iOS-style press scale
    isPressed && !isDisabled ? 'scale-[0.97]' : 'scale-100'
  ].filter(Boolean).join(' ');

  function handlePointerDown() {
    if (!isDisabled) isPressed = true;
  }

  function handlePointerUp() {
    isPressed = false;
  }

  function handlePointerLeave() {
    isPressed = false;
  }
</script>

<button
  {type}
  class={buttonClasses}
  disabled={isDisabled}
  aria-label={ariaLabel}
  aria-busy={loading}
  on:click
  on:focus
  on:blur
  on:pointerdown={handlePointerDown}
  on:pointerup={handlePointerUp}
  on:pointerleave={handlePointerLeave}
>
  <span
    class="inline-flex items-center justify-center gap-2 transition-opacity duration-150"
    class:opacity-0={loading || success}
  >
    <slot />
  </span>

  <!-- Loading overlay -->
  {#if loading}
    <span class="absolute inset-0 flex items-center justify-center">
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
    </span>
  {/if}

  <!-- Success overlay -->
  {#if success}
    <span class="absolute inset-0 flex items-center justify-center animate-success">
      <svg
        class="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="3"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M5 13l4 4L19 7"
          class="check-path"
        />
      </svg>
    </span>
  {/if}
</button>

<style>
  button {
    position: relative;
    overflow: hidden;
  }

  .animate-success {
    animation: scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.5);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .check-path {
    stroke-dasharray: 24;
    stroke-dashoffset: 24;
    animation: drawCheck 0.3s ease-out 0.1s forwards;
  }

  @keyframes drawCheck {
    to {
      stroke-dashoffset: 0;
    }
  }

  /* Touch ripple effect for mobile */
  @media (hover: none) {
    button:active {
      transform: scale(0.97);
    }
  }
</style>
