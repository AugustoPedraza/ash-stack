<script>
  /**
   * BottomSheet Component
   * Mobile-friendly modal with drag gestures and native feel.
   *
   * @prop {boolean} open - Controls visibility
   * @prop {string} [title] - Optional header title
   * @prop {number[]} [snapPoints] - Height percentages [0.4, 0.9] (ignored if fitContent=true)
   * @prop {boolean} [fitContent=false] - Auto-size to content instead of snap points
   * @prop {boolean} [showHandle=true] - Show drag handle indicator
   * @prop {Snippet} [children] - Sheet content
   * @prop {() => void} [onClose] - Called when sheet is dismissed
   */

  let {
    open = $bindable(false),
    title = '',
    snapPoints = [0.5],
    fitContent = false,
    showHandle = true,
    children,
    onClose = () => {}
  } = $props();

  // State
  let sheetEl = $state(null);
  let contentEl = $state(null);
  let isDragging = $state(false);
  let isClosing = $state(false);
  let isVisible = $state(false);
  let isAnimatingIn = $state(false);
  let dragStartY = $state(0);
  let dragCurrentY = $state(0);
  let currentSnapIndex = $state(0);
  let contentHeight = $state(0);
  let windowHeight = $state(typeof window !== 'undefined' ? window.innerHeight : 800);

  // Computed
  const maxHeight = $derived(windowHeight * 0.92);
  const sheetHeight = $derived.by(() => {
    if (fitContent) {
      // Auto-size: content height + handle + safe area, capped at max
      const autoHeight = contentHeight + 60; // 60px for handle + padding
      return Math.min(autoHeight, maxHeight);
    }
    return windowHeight * (snapPoints[currentSnapIndex] || 0.5);
  });

  // Calculate translateY based on state
  const translateY = $derived.by(() => {
    if (isAnimatingIn) return sheetHeight;
    if (isClosing) return sheetHeight;
    if (isDragging) {
      const delta = dragCurrentY - dragStartY;
      if (delta > 0) return delta * 0.4;
      const maxPull = maxHeight - sheetHeight;
      if (-delta > maxPull) return -maxPull - ((-delta - maxPull) * 0.2);
      return delta;
    }
    return 0;
  });

  function handleClose() {
    if (isClosing) return;
    isClosing = true;
    document.body.style.overflow = '';

    setTimeout(() => {
      isClosing = false;
      isVisible = false;
      open = false;
      onClose();
    }, 300);
  }

  function handleKeydown(e) {
    if (e.key === 'Escape' && open && !isClosing) {
      handleClose();
    }
  }

  function handleDragStart(e) {
    if (isClosing || isAnimatingIn) return;
    isDragging = true;
    const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
    dragStartY = clientY;
    dragCurrentY = clientY;
  }

  function handleDragMove(e) {
    if (!isDragging) return;
    const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
    dragCurrentY = clientY;
  }

  function handleDragEnd() {
    if (!isDragging) return;
    isDragging = false;

    const delta = dragCurrentY - dragStartY;
    const velocity = delta / 100;

    if (delta > 80 || velocity > 1.2) {
      handleClose();
      return;
    }

    // Snap logic for non-fitContent mode
    if (!fitContent && snapPoints.length > 1) {
      const currentHeight = sheetHeight - delta;
      let nearestIndex = 0;
      let nearestDist = Infinity;

      snapPoints.forEach((point, index) => {
        const pointHeight = windowHeight * point;
        const dist = Math.abs(currentHeight - pointHeight);
        if (dist < nearestDist) {
          nearestDist = dist;
          nearestIndex = index;
        }
      });

      currentSnapIndex = nearestIndex;
    }
  }

  // Measure content height
  $effect(() => {
    if (!contentEl || !fitContent) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        contentHeight = entry.contentRect.height;
      }
    });

    observer.observe(contentEl);
    return () => observer.disconnect();
  });

  // Watch open prop
  $effect(() => {
    if (open && !isVisible && !isClosing) {
      isVisible = true;
      isAnimatingIn = true;
      currentSnapIndex = 0;
      isDragging = false;
      document.body.style.overflow = 'hidden';

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          isAnimatingIn = false;
        });
      });
    } else if (!open && isVisible && !isClosing) {
      handleClose();
    }
  });

  $effect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  });

  $effect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => { windowHeight = window.innerHeight; };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  });
</script>

<svelte:window
  onkeydown={handleKeydown}
  onmousemove={isDragging ? handleDragMove : undefined}
  onmouseup={isDragging ? handleDragEnd : undefined}
  ontouchmove={isDragging ? handleDragMove : undefined}
  ontouchend={isDragging ? handleDragEnd : undefined}
/>

{#if isVisible}
  <!-- Backdrop -->
  <button
    class="fixed inset-0 z-40 bg-black transition-opacity duration-300 cursor-default
      {isClosing || isAnimatingIn ? 'opacity-0' : 'opacity-40'}"
    onclick={handleClose}
    aria-label="Close"
    tabindex="-1"
  ></button>

  <!-- Sheet -->
  <div
    bind:this={sheetEl}
    class="fixed inset-x-0 bottom-0 z-50 flex flex-col bg-base-100 rounded-t-xl shadow-2xl
      {isDragging ? '' : 'transition-transform duration-300 ease-out'}"
    style="height: {sheetHeight}px; max-height: {maxHeight}px; transform: translateY({translateY}px);"
    role="dialog"
    aria-modal="true"
    aria-labelledby={title ? 'sheet-title' : undefined}
  >
    <!-- Handle -->
    <div
      class="flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing touch-none select-none shrink-0"
      onmousedown={handleDragStart}
      ontouchstart={handleDragStart}
      role="button"
      tabindex="0"
      aria-label="Drag to dismiss"
    >
      {#if showHandle}
        <div class="w-9 h-1 bg-accent rounded-full"></div>
      {/if}
    </div>

    <!-- Header -->
    {#if title}
      <div class="px-5 pb-3 border-b border-muted shrink-0">
        <h3 id="sheet-title" class="text-lg font-semibold text-foreground text-center">
          {title}
        </h3>
      </div>
    {/if}

    <!-- Content -->
    <div
      bind:this={contentEl}
      class="{fitContent ? '' : 'flex-1 overflow-y-auto'} overscroll-contain"
    >
      {@render children?.()}
    </div>

    <!-- Safe area (only adds padding on devices with home indicator) -->
    <div class="shrink-0 pb-safe"></div>
  </div>
{/if}

<style>
  .pb-safe {
    padding-bottom: env(safe-area-inset-bottom, 0);
  }
</style>
