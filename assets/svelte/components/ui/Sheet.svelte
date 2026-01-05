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
  let _dragStartY = 0;
  let dragStartTranslate = 0;

  function handlePanStart(e) {
    if (!gestureEnabled) return;
    isDragging = true;
    _dragStartY = e.detail.y;
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
    class="sheet-backdrop"
    transition:fade={{ duration: 200 }}
    on:click={handleBackdropClick}
    on:keydown={(e) => e.key === 'Escape' && close()}
    role="button"
    tabindex="-1"
    aria-label="Close sheet"
  ></div>

  <!-- Sheet -->
  <div
    bind:this={sheetEl}
    class="sheet-container"
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
      <div class="sheet-drag-handle">
        <div class="sheet-drag-handle-bar"></div>
      </div>
    {/if}

    <!-- Header -->
    {#if title || showClose}
      <header class="sheet-header">
        {#if title}
          <h2 id="sheet-title" class="sheet-title">
            {title}
          </h2>
        {:else}
          <div></div>
        {/if}

        {#if showClose}
          <button
            class="sheet-close"
            on:click={close}
            aria-label="Close"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        {/if}
      </header>
    {/if}

    <!-- Content -->
    <div class="sheet-content">
      <slot />
    </div>

    <!-- Footer slot -->
    {#if $$slots.footer}
      <footer class="sheet-footer">
        <slot name="footer" />
      </footer>
    {/if}
  </div>
{/if}

<style>
  .sheet-backdrop {
    position: fixed;
    inset: 0;
    z-index: var(--z-modal, 50);
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
  }

  .sheet-container {
    position: fixed;
    inset-inline: 0;
    bottom: 0;
    z-index: var(--z-modal, 50);
    background-color: var(--color-surface);
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    box-shadow: var(--shadow-xl);
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    padding-bottom: env(safe-area-inset-bottom, 0);
  }

  .sheet-drag-handle {
    display: flex;
    justify-content: center;
    padding-top: var(--spacing-3);
    padding-bottom: var(--spacing-2);
  }

  .sheet-drag-handle-bar {
    width: 2.5rem;
    height: 0.25rem;
    border-radius: var(--radius-full);
    background-color: var(--color-border-strong);
  }

  .sheet-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-3) var(--spacing-4);
    border-bottom: 1px solid var(--color-border);
  }

  .sheet-title {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--color-text);
  }

  .sheet-close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    margin-right: calc(var(--spacing-2) * -1);
    padding: 0;
    background: transparent;
    border: none;
    border-radius: var(--radius-full);
    color: var(--color-text-muted);
    cursor: pointer;
    transition: background-color 150ms ease, color 150ms ease;
  }

  .sheet-close:hover {
    background-color: var(--color-surface-sunken);
    color: var(--color-text);
  }

  .sheet-content {
    flex: 1;
    overflow-y: auto;
    padding: var(--spacing-4);
    -webkit-overflow-scrolling: touch;
  }

  .sheet-footer {
    padding: var(--spacing-4);
    border-top: 1px solid var(--color-border);
    padding-bottom: env(safe-area-inset-bottom, var(--spacing-4));
  }

  /* Prevent content from being selectable while dragging */
  :global(.sheet-dragging) {
    user-select: none;
    -webkit-user-select: none;
  }
</style>
