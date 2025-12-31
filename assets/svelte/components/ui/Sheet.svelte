<!--
  Sheet Component (iOS-style)
  Bottom sheet with gesture dismiss, snap points, and spring animation.
  Mobile-first, works on desktop too.
-->
<script>
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  import { spring } from 'svelte/motion';
  import { fade } from 'svelte/transition';
  import { lockScroll, unlockScroll, haptic, HapticType } from '../../lib/mobile.js';
  import { pan } from '../../lib/gestures.js';

  const dispatch = createEventDispatcher();

  /** @type {boolean} - Open state */
  export let open = false;

  /** @type {string} - Sheet title */
  export let title = '';

  /** @type {boolean} - Show close button */
  export let showClose = true;

  /** @type {boolean} - Close on backdrop click */
  export let closeOnBackdrop = true;

  /** @type {boolean} - Close on escape key */
  export let closeOnEscape = true;

  /** @type {boolean} - Enable gesture dismiss */
  export let gestureEnabled = true;

  /** @type {number} - Dismiss threshold (0-1, percentage of height) */
  export let dismissThreshold = 0.3;

  /** @type {Array<number>} - Snap points as percentages (e.g., [0.5, 1] for half and full) */
  export let snapPoints = [1];

  /** @type {number} - Initial snap point index */
  export let initialSnap = 0;

  // Sheet state
  let sheetEl;
  let sheetHeight = 0;
  let currentSnapIndex = initialSnap;
  let isDragging = false;

  // Spring animation for smooth movement
  const translateY = spring(0, {
    stiffness: 0.15,
    damping: 0.8
  });

  // Calculate actual snap positions
  $: snapPositions = snapPoints.map(p => (1 - p) * sheetHeight);

  // Handle open/close
  $: if (open) {
    lockScroll();
    translateY.set(snapPositions[currentSnapIndex] || 0);
    haptic(HapticType.LIGHT);
  } else {
    unlockScroll();
    translateY.set(sheetHeight);
  }

  onMount(() => {
    if (sheetEl) {
      sheetHeight = sheetEl.offsetHeight;
    }
  });

  onDestroy(() => {
    if (open) unlockScroll();
  });

  // Handle escape key
  function handleKeydown(e) {
    if (e.key === 'Escape' && closeOnEscape && open) {
      close();
    }
  }

  function close() {
    open = false;
    dispatch('close');
  }

  function handleBackdropClick() {
    if (closeOnBackdrop) {
      close();
    }
  }

  // Gesture handling
  let dragStartY = 0;
  let dragStartTranslate = 0;

  function handlePanStart(e) {
    if (!gestureEnabled) return;
    isDragging = true;
    dragStartY = e.detail.y;
    dragStartTranslate = $translateY;
    translateY.stiffness = 1;
    translateY.damping = 1;
  }

  function handlePanMove(e) {
    if (!gestureEnabled || !isDragging) return;

    const deltaY = e.detail.deltaY;
    const newTranslate = Math.max(0, dragStartTranslate + deltaY);
    translateY.set(newTranslate, { hard: true });
  }

  function handlePanEnd(e) {
    if (!gestureEnabled || !isDragging) return;

    isDragging = false;
    translateY.stiffness = 0.15;
    translateY.damping = 0.8;

    const currentPosition = $translateY;
    const velocity = e.detail.velocityY || 0;

    // Check if should dismiss
    const dismissPosition = sheetHeight * dismissThreshold;
    if (currentPosition > dismissPosition || velocity > 10) {
      haptic(HapticType.LIGHT);
      close();
      return;
    }

    // Find closest snap point
    let closestIndex = 0;
    let closestDistance = Infinity;

    snapPositions.forEach((pos, i) => {
      const distance = Math.abs(currentPosition - pos);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = i;
      }
    });

    // Apply velocity bias
    if (velocity > 5 && closestIndex < snapPositions.length - 1) {
      closestIndex++;
    } else if (velocity < -5 && closestIndex > 0) {
      closestIndex--;
    }

    currentSnapIndex = closestIndex;
    translateY.set(snapPositions[closestIndex]);

    if (closestIndex !== currentSnapIndex) {
      haptic(HapticType.SELECTION);
    }

    dispatch('snap', { index: closestIndex, position: snapPoints[closestIndex] });
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if open}
  <!-- Backdrop -->
  <div
    class="fixed inset-0 z-modal bg-black/50 backdrop-blur-ios"
    transition:fade={{ duration: 200 }}
    on:click={handleBackdropClick}
    role="button"
    tabindex="-1"
    aria-label="Close sheet"
  />

  <!-- Sheet -->
  <div
    bind:this={sheetEl}
    class="
      fixed inset-x-0 bottom-0 z-modal
      bg-surface rounded-t-2xl shadow-xl
      safe-bottom
      max-h-[90vh]
      flex flex-col
    "
    style="transform: translateY({$translateY}px)"
    role="dialog"
    aria-modal="true"
    aria-labelledby={title ? 'sheet-title' : undefined}
    use:pan={{ direction: 'vertical' }}
    on:panstart={handlePanStart}
    on:panmove={handlePanMove}
    on:panend={handlePanEnd}
  >
    <!-- Drag handle -->
    {#if gestureEnabled}
      <div class="flex justify-center pt-3 pb-2">
        <div class="w-10 h-1 rounded-full bg-border-strong" />
      </div>
    {/if}

    <!-- Header -->
    {#if title || showClose}
      <header class="flex items-center justify-between px-4 py-3 border-b border-border">
        {#if title}
          <h2 id="sheet-title" class="text-lg font-semibold text-text">
            {title}
          </h2>
        {:else}
          <div />
        {/if}

        {#if showClose}
          <button
            class="p-2 -mr-2 rounded-full text-text-muted hover:bg-surface-sunken transition-colors touch-target"
            on:click={close}
            aria-label="Close"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        {/if}
      </header>
    {/if}

    <!-- Content -->
    <div class="flex-1 overflow-y-auto scroll-ios p-4">
      <slot />
    </div>

    <!-- Footer slot -->
    {#if $$slots.footer}
      <footer class="px-4 py-4 border-t border-border safe-bottom">
        <slot name="footer" />
      </footer>
    {/if}
  </div>
{/if}

<style>
  /* Prevent content from being selectable while dragging */
  :global(.sheet-dragging) {
    user-select: none;
    -webkit-user-select: none;
  }
</style>
