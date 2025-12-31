<!--
  SubmitButton Component
  Form submit button that auto-wires to Form context.
  Shows loading, disabled (when invalid), and success states.
-->
<script>
  import { getContext } from 'svelte';
  import { FORM_CONTEXT } from './Form.svelte';

  /** @type {'primary' | 'secondary' | 'danger'} */
  export let variant = 'primary';

  /** @type {'sm' | 'md' | 'lg'} */
  export let size = 'md';

  /** @type {boolean} */
  export let fullWidth = false;

  /** @type {string} - Text shown while loading */
  export let loadingText = '';

  /** @type {string} - Text shown on success */
  export let successText = 'Done!';

  /** @type {boolean} - Manual disabled override */
  export let disabled = false;

  // Get form context
  const formContext = getContext(FORM_CONTEXT);

  // Derive states from form context
  $: isSubmitting = formContext ? $formContext.isSubmitting : false;
  $: isValid = formContext ? $formContext.isValid : true;
  $: isSuccess = formContext ? $formContext.submitSuccess : false;
  $: shouldDisable = formContext?.disableWhenInvalid?.() ?? true;

  // Computed disabled state
  $: isDisabled = disabled || isSubmitting || (shouldDisable && !isValid);

  // Variant styles
  const variants = {
    primary: {
      base: 'bg-primary text-on-primary',
      hover: 'hover:bg-primary-hover',
      active: 'active:bg-primary-active active:scale-[0.98]',
      success: 'bg-success text-on-success'
    },
    secondary: {
      base: 'bg-surface-raised text-text border border-border',
      hover: 'hover:bg-surface-sunken',
      active: 'active:bg-surface-sunken active:scale-[0.98]',
      success: 'bg-success-soft text-success border-success'
    },
    danger: {
      base: 'bg-error text-on-error',
      hover: 'hover:opacity-90',
      active: 'active:opacity-80 active:scale-[0.98]',
      success: 'bg-success text-on-success'
    }
  };

  // Size styles
  const sizes = {
    sm: 'h-8 px-3 text-sm gap-2 rounded-md',
    md: 'h-10 px-4 text-base gap-2 rounded-md',
    lg: 'h-12 px-6 text-lg gap-3 rounded-lg'
  };

  $: variantStyles = variants[variant];
  $: currentVariant = isSuccess ? variantStyles.success : variantStyles.base;

  $: buttonClasses = [
    'inline-flex items-center justify-center',
    'font-medium',
    'transition-all duration-150',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
    currentVariant,
    !isDisabled && !isSuccess ? variantStyles.hover : '',
    !isDisabled && !isSuccess ? variantStyles.active : '',
    sizes[size],
    fullWidth ? 'w-full' : ''
  ].filter(Boolean).join(' ');
</script>

<button
  type="submit"
  class={buttonClasses}
  disabled={isDisabled}
  aria-busy={isSubmitting}
>
  {#if isSubmitting}
    <!-- Loading spinner -->
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
    <span>{loadingText || ''}</span>
    {#if !loadingText}
      <slot />
    {/if}
  {:else if isSuccess}
    <!-- Success checkmark -->
    <svg
      class="h-4 w-4 animate-success"
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
    <span>{successText}</span>
  {:else}
    <slot />
  {/if}
</button>

<style>
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
</style>
