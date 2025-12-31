<!--
  Modal Component
  iOS-style modal with spring animations and gesture dismiss.
  Accessible, keyboard navigable, with backdrop blur.
-->
<script>
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  import { fade, scale } from 'svelte/transition';
  import { quintOut, backOut } from 'svelte/easing';
  import { lockScroll, unlockScroll, haptic, HapticType } from '../../lib/mobile.js';

  const dispatch = createEventDispatcher();

  /** @type {boolean} */
  export let open = false;

  /** @type {string} */
  export let title = '';

  /** @type {'sm' | 'md' | 'lg' | 'full'} */
  export let size = 'md';

  /** @type {boolean} */
  export let showClose = true;

  /** @type {boolean} */
  export let closeOnBackdrop = true;

  /** @type {boolean} */
  export let closeOnEscape = true;

  /** @type {boolean} */
  export let preventScroll = true;

  /** @type {boolean} - Enable swipe down to dismiss on mobile */
  export let gestureEnabled = false;

  let modalElement;
  let dragY = 0;
  let isDragging = false;
  let startY = 0;

  // Size classes
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    full: 'max-w-full mx-4'
  };

  // Spring-like easing for iOS feel
  const springIn = (node, { duration = 400, delay = 0 }) => {
    return {
      duration,
      delay,
      css: (t) => {
        const eased = backOut(t);
        return `
          opacity: ${t};
          transform: scale(${0.95 + 0.05 * eased}) translateY(${(1 - eased) * 20}px);
        `;
      }
    };
  };

  const springOut = (node, { duration = 200 }) => {
    return {
      duration,
      css: (t) => `
        opacity: ${t};
        transform: scale(${0.95 + 0.05 * t});
      `
    };
  };

  function close() {
    haptic(HapticType.LIGHT);
    open = false;
    dispatch('close');
  }

  function handleBackdropClick(e) {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      close();
    }
  }

  function handleKeydown(e) {
    if (closeOnEscape && e.key === 'Escape') {
      close();
    }
  }

  // Gesture handling for swipe dismiss
  function handleTouchStart(e) {
    if (!gestureEnabled) return;
    isDragging = true;
    startY = e.touches[0].clientY;
    dragY = 0;
  }

  function handleTouchMove(e) {
    if (!isDragging || !gestureEnabled) return;
    const currentY = e.touches[0].clientY;
    const delta = currentY - startY;

    // Only allow dragging down
    if (delta > 0) {
      dragY = delta;
    }
  }

  function handleTouchEnd() {
    if (!isDragging || !gestureEnabled) return;
    isDragging = false;

    // If dragged more than 100px, close
    if (dragY > 100) {
      close();
    }
    dragY = 0;
  }

  // Manage scroll lock
  $: if (open && preventScroll) {
    lockScroll();
  } else if (!open && preventScroll) {
    unlockScroll();
  }

  // Focus trap
  onMount(() => {
    if (open && modalElement) {
      modalElement.focus();
    }
  });

  onDestroy(() => {
    if (preventScroll) {
      unlockScroll();
    }
  });
</script>

<svelte:window on:keydown={handleKeydown} />

{#if open}
  <!-- Backdrop -->
  <div
    class="modal-backdrop"
    on:click={handleBackdropClick}
    on:keydown={(e) => e.key === 'Enter' && handleBackdropClick(e)}
    role="button"
    tabindex="-1"
    transition:fade={{ duration: 200 }}
  >
    <!-- Modal -->
    <div
      bind:this={modalElement}
      class="modal {sizeClasses[size]}"
      style={dragY > 0 ? `transform: translateY(${dragY}px); opacity: ${1 - dragY / 300}` : ''}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      tabindex="-1"
      in:springIn
      out:springOut
      on:touchstart={handleTouchStart}
      on:touchmove={handleTouchMove}
      on:touchend={handleTouchEnd}
    >
      <!-- Drag indicator for gesture-enabled modals -->
      {#if gestureEnabled}
        <div class="drag-indicator" />
      {/if}

      <!-- Header -->
      {#if title || showClose || $$slots.header}
        <div class="modal-header">
          {#if $$slots.header}
            <slot name="header" />
          {:else}
            <h2 id="modal-title" class="modal-title">{title}</h2>
          {/if}

          {#if showClose}
            <button
              type="button"
              class="modal-close"
              on:click={close}
              aria-label="Close modal"
            >
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          {/if}
        </div>
      {/if}

      <!-- Body -->
      <div class="modal-body">
        <slot />
      </div>

      <!-- Footer -->
      {#if $$slots.footer}
        <div class="modal-footer">
          <slot name="footer" />
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    inset: 0;
    z-index: var(--z-modal, 50);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-4);
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
  }

  .modal {
    position: relative;
    width: 100%;
    max-height: calc(100vh - var(--spacing-8));
    overflow: hidden;
    background-color: var(--color-surface);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-xl);
    display: flex;
    flex-direction: column;
    outline: none;
  }

  .drag-indicator {
    width: 36px;
    height: 4px;
    margin: var(--spacing-2) auto var(--spacing-1);
    background-color: var(--color-border);
    border-radius: var(--radius-full);
    flex-shrink: 0;
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-4) var(--spacing-6);
    border-bottom: 1px solid var(--color-border);
    flex-shrink: 0;
  }

  .modal-title {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--color-text);
  }

  .modal-close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    margin: calc(var(--spacing-1) * -1);
    padding: 0;
    color: var(--color-text-muted);
    background: transparent;
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: background-color 150ms ease, color 150ms ease;
  }

  .modal-close:hover {
    background-color: var(--color-surface-sunken);
    color: var(--color-text);
  }

  .modal-close:active {
    transform: scale(0.95);
  }

  .modal-body {
    flex: 1;
    overflow-y: auto;
    padding: var(--spacing-6);
    -webkit-overflow-scrolling: touch;
  }

  .modal-footer {
    display: flex;
    gap: var(--spacing-3);
    justify-content: flex-end;
    padding: var(--spacing-4) var(--spacing-6);
    border-top: 1px solid var(--color-border);
    flex-shrink: 0;
  }

  /* Full size modal */
  :global(.max-w-full) {
    max-height: calc(100vh - var(--spacing-8));
    height: calc(100vh - var(--spacing-8));
  }

  /* Mobile adjustments */
  @media (max-width: 640px) {
    .modal-backdrop {
      padding: var(--spacing-2);
      align-items: flex-end;
    }

    .modal {
      max-height: calc(100vh - var(--spacing-4));
      border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    }
  }
</style>
