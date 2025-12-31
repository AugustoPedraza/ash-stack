<!--
  Toast Component
  Individual toast notification with animation.
-->
<script>
  import { createEventDispatcher } from 'svelte';
  import { fly, fade } from 'svelte/transition';

  const dispatch = createEventDispatcher();

  /** @type {string} */
  export let message = '';

  /** @type {'success' | 'error' | 'warning' | 'info'} */
  export let variant = 'info';

  /** @type {boolean} */
  export let dismissible = true;

  /** @type {{ label: string, onClick: () => void } | null} */
  export let action = null;

  // Variant styles and icons
  const variants = {
    success: {
      bg: 'bg-success-soft',
      border: 'border-success',
      text: 'text-success',
      icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />`
    },
    error: {
      bg: 'bg-error-soft',
      border: 'border-error',
      text: 'text-error',
      icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />`
    },
    warning: {
      bg: 'bg-warning-soft',
      border: 'border-warning',
      text: 'text-warning',
      icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />`
    },
    info: {
      bg: 'bg-info-soft',
      border: 'border-info',
      text: 'text-info',
      icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />`
    }
  };

  $: style = variants[variant];

  function handleDismiss() {
    dispatch('dismiss');
  }

  function handleAction() {
    if (action?.onClick) {
      action.onClick();
    }
    dispatch('dismiss');
  }
</script>

<div
  class="
    flex items-start gap-3 p-4
    {style.bg} border {style.border}
    rounded-lg shadow-lg
    min-w-[300px] max-w-[420px]
  "
  role="alert"
  in:fly={{ y: -20, duration: 300 }}
  out:fade={{ duration: 200 }}
>
  <!-- Icon -->
  <svg
    class="w-6 h-6 flex-shrink-0 {style.text}"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="currentColor"
  >
    {@html style.icon}
  </svg>

  <!-- Content -->
  <div class="flex-1 pt-0-5">
    <p class="text-sm font-medium text-text">{message}</p>

    {#if action}
      <button
        class="mt-2 text-sm font-medium {style.text} hover:underline"
        on:click={handleAction}
      >
        {action.label}
      </button>
    {/if}
  </div>

  <!-- Dismiss button -->
  {#if dismissible}
    <button
      class="flex-shrink-0 p-1 rounded-md text-text-muted hover:text-text hover:bg-surface-sunken transition-colors"
      on:click={handleDismiss}
      aria-label="Dismiss"
    >
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  {/if}
</div>
