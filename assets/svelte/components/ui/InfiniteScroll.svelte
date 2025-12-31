<!--
  InfiniteScroll Component
  Infinite scrolling with pull-to-refresh support.
  Uses IntersectionObserver for efficient scroll detection.
-->
<script>
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';
  import { haptic, HapticType } from '../../lib/mobile.js';

  const dispatch = createEventDispatcher();

  /** @type {boolean} - Loading more items */
  export let loading = false;

  /** @type {boolean} - No more items to load */
  export let hasMore = true;

  /** @type {boolean} - Enable pull-to-refresh */
  export let pullToRefresh = true;

  /** @type {number} - Threshold in pixels before triggering load */
  export let threshold = 200;

  /** @type {number} - Pull distance required to trigger refresh */
  export let pullThreshold = 80;

  /** @type {string} - Loading text */
  export let loadingText = 'Loading...';

  /** @type {string} - Pull to refresh text */
  export let pullText = 'Pull to refresh';

  /** @type {string} - Release to refresh text */
  export let releaseText = 'Release to refresh';

  /** @type {string} - Refreshing text */
  export let refreshingText = 'Refreshing...';

  let containerEl;
  let sentinelEl;
  let observer;

  // Pull-to-refresh state
  let pullY = 0;
  let isPulling = false;
  let isRefreshing = false;
  let startY = 0;
  let canPull = false;

  $: pullProgress = Math.min(pullY / pullThreshold, 1);
  $: shouldRelease = pullY >= pullThreshold;

  // Set up IntersectionObserver for infinite scroll
  onMount(() => {
    if (!sentinelEl) return;

    observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasMore && !loading) {
          dispatch('loadMore');
        }
      },
      {
        root: null,
        rootMargin: `${threshold}px`,
        threshold: 0
      }
    );

    observer.observe(sentinelEl);
  });

  onDestroy(() => {
    observer?.disconnect();
  });

  // Pull-to-refresh handlers
  function handleTouchStart(e) {
    if (!pullToRefresh || isRefreshing) return;

    // Only allow pull when at top of scroll
    const scrollTop = containerEl?.scrollTop ?? window.scrollY;
    canPull = scrollTop <= 0;

    if (canPull) {
      startY = e.touches[0].clientY;
      isPulling = true;
    }
  }

  function handleTouchMove(e) {
    if (!isPulling || !canPull || isRefreshing) return;

    const currentY = e.touches[0].clientY;
    const delta = currentY - startY;

    if (delta > 0) {
      // Apply resistance
      pullY = Math.min(delta * 0.5, pullThreshold * 1.5);

      // Haptic at threshold
      if (pullY >= pullThreshold && !shouldRelease) {
        haptic(HapticType.LIGHT);
      }
    }
  }

  function handleTouchEnd() {
    if (!isPulling) return;
    isPulling = false;

    if (shouldRelease && !isRefreshing) {
      triggerRefresh();
    } else {
      pullY = 0;
    }
  }

  async function triggerRefresh() {
    isRefreshing = true;
    pullY = pullThreshold;
    haptic(HapticType.MEDIUM);

    dispatch('refresh', {
      done: () => {
        isRefreshing = false;
        pullY = 0;
        haptic(HapticType.SUCCESS);
      }
    });
  }
</script>

<div
  bind:this={containerEl}
  class="infinite-scroll"
  on:touchstart={handleTouchStart}
  on:touchmove={handleTouchMove}
  on:touchend={handleTouchEnd}
>
  <!-- Pull-to-refresh indicator -->
  {#if pullToRefresh && (pullY > 0 || isRefreshing)}
    <div
      class="pull-indicator"
      style="height: {pullY}px"
    >
      <div class="pull-content" style="opacity: {pullProgress}">
        {#if isRefreshing}
          <div class="spinner" />
          <span>{refreshingText}</span>
        {:else if shouldRelease}
          <svg class="pull-arrow release" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
          <span>{releaseText}</span>
        {:else}
          <svg class="pull-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
          <span>{pullText}</span>
        {/if}
      </div>
    </div>
  {/if}

  <!-- Content -->
  <div class="infinite-scroll-content" style={pullY > 0 ? `transform: translateY(${pullY}px)` : ''}>
    <slot />

    <!-- Sentinel for IntersectionObserver -->
    <div bind:this={sentinelEl} class="sentinel" aria-hidden="true" />

    <!-- Loading indicator -->
    {#if loading}
      <div class="loading-indicator" in:fade={{ duration: 150 }}>
        <div class="spinner" />
        <span>{loadingText}</span>
      </div>
    {/if}

    <!-- End of list -->
    {#if !hasMore && !loading}
      <div class="end-indicator">
        <slot name="end">
          <!-- Default empty -->
        </slot>
      </div>
    {/if}
  </div>
</div>

<style>
  .infinite-scroll {
    position: relative;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }

  .infinite-scroll-content {
    will-change: transform;
    transition: transform 0.2s ease-out;
  }

  .pull-indicator {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    overflow: hidden;
    pointer-events: none;
  }

  .pull-content {
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
    padding: var(--spacing-3);
    font-size: 0.875rem;
    color: var(--color-text-muted);
    transition: opacity 0.15s ease;
  }

  .pull-arrow {
    width: 1.25rem;
    height: 1.25rem;
    transition: transform 0.2s ease;
  }

  .pull-arrow.release {
    transform: rotate(180deg);
  }

  .sentinel {
    height: 1px;
    pointer-events: none;
  }

  .loading-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-2);
    padding: var(--spacing-6);
    font-size: 0.875rem;
    color: var(--color-text-muted);
  }

  .end-indicator {
    padding: var(--spacing-4);
    text-align: center;
  }

  .spinner {
    width: 1.25rem;
    height: 1.25rem;
    border: 2px solid var(--color-border);
    border-top-color: var(--color-primary);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .infinite-scroll-content {
      transition: none;
    }

    .spinner {
      animation: none;
      border-top-color: var(--color-border);
      opacity: 0.5;
    }
  }
</style>
