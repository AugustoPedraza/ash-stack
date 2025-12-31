<!--
  ToastContainer Component
  Container for toast notifications. Place once in your layout.

  Usage:
  <script>
    import { ToastContainer } from '$lib/components/ui';
  </script>

  <ToastContainer />

  // Then from anywhere:
  import { toast } from '$lib/toast';
  toast.success('Saved!');
-->
<script>
  import { toast } from '../../lib/toast.js';
  import Toast from './Toast.svelte';

  /** @type {'top-right' | 'top-left' | 'top-center' | 'bottom-right' | 'bottom-left' | 'bottom-center'} */
  export let position = 'top-right';

  // Position classes
  const positions = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2'
  };

  // Stack direction based on position
  $: isBottom = position.startsWith('bottom');
</script>

{#if $toast.length > 0}
  <div
    class="
      fixed z-toast
      flex flex-col gap-2
      pointer-events-none
      {positions[position]}
    "
    class:flex-col-reverse={isBottom}
    aria-live="polite"
    aria-label="Notifications"
  >
    {#each $toast as t (t.id)}
      <div class="pointer-events-auto">
        <Toast
          message={t.message}
          variant={t.variant}
          dismissible={t.dismissible}
          action={t.action}
          on:dismiss={() => toast.dismiss(t.id)}
        />
      </div>
    {/each}
  </div>
{/if}

<style>
  /* Safe area support for iOS */
  @supports (padding: env(safe-area-inset-top)) {
    div[class*="top-"] {
      padding-top: env(safe-area-inset-top);
    }
    div[class*="bottom-"] {
      padding-bottom: env(safe-area-inset-bottom);
    }
    div[class*="right-"] {
      padding-right: env(safe-area-inset-right);
    }
    div[class*="left-"] {
      padding-left: env(safe-area-inset-left);
    }
  }
</style>
