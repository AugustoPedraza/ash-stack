<!--
  Pagination Component
  Accessible pagination with various display modes.
  Optimized for both desktop and mobile.
-->
<script>
  import { createEventDispatcher } from 'svelte';
  import { haptic, HapticType } from '../../lib/mobile.js';

  const dispatch = createEventDispatcher();

  /** @type {number} - Current page (1-indexed) */
  export let page = 1;

  /** @type {number} - Total number of pages */
  export let totalPages = 1;

  /** @type {number} - Total number of items (for display) */
  export let totalItems = 0;

  /** @type {number} - Items per page */
  export let pageSize = 10;

  /** @type {'full' | 'simple' | 'minimal'} - Display mode */
  export let mode = 'full';

  /** @type {number} - Number of page buttons to show (for full mode) */
  export let siblingCount = 1;

  /** @type {boolean} - Show page size selector */
  export let showPageSize = false;

  /** @type {number[]} - Available page sizes */
  export let pageSizes = [10, 25, 50, 100];

  /** @type {boolean} - Show item count */
  export let showCount = true;

  // Derived values
  $: startItem = (page - 1) * pageSize + 1;
  $: endItem = Math.min(page * pageSize, totalItems);
  $: canGoPrev = page > 1;
  $: canGoNext = page < totalPages;

  // Generate page numbers for full mode
  $: pageNumbers = generatePageNumbers(page, totalPages, siblingCount);

  function generatePageNumbers(current, total, siblings) {
    const range = [];

    // Always show first page
    range.push(1);

    // Calculate range around current page
    const leftSibling = Math.max(2, current - siblings);
    const rightSibling = Math.min(total - 1, current + siblings);

    // Add ellipsis if needed
    if (leftSibling > 2) {
      range.push('...');
    }

    // Add middle pages
    for (let i = leftSibling; i <= rightSibling; i++) {
      if (i !== 1 && i !== total) {
        range.push(i);
      }
    }

    // Add ellipsis if needed
    if (rightSibling < total - 1) {
      range.push('...');
    }

    // Always show last page (if more than 1 page)
    if (total > 1) {
      range.push(total);
    }

    return range;
  }

  function goToPage(newPage) {
    if (newPage < 1 || newPage > totalPages || newPage === page) return;

    haptic(HapticType.LIGHT);
    page = newPage;
    dispatch('change', { page, pageSize });
  }

  function handlePageSizeChange(e) {
    const newSize = parseInt(e.target.value, 10);
    haptic(HapticType.SELECTION);

    // Reset to page 1 when changing page size
    page = 1;
    pageSize = newSize;
    dispatch('change', { page, pageSize });
  }
</script>

<nav class="pagination" class:simple={mode === 'simple'} class:minimal={mode === 'minimal'} aria-label="Pagination">
  <!-- Item count (left side) -->
  {#if showCount && mode !== 'minimal'}
    <div class="pagination-info">
      {#if totalItems > 0}
        <span class="item-count">
          {startItem}–{endItem} of {totalItems.toLocaleString()}
        </span>
      {:else}
        <span class="item-count">No items</span>
      {/if}
    </div>
  {/if}

  <!-- Page controls (center/right) -->
  <div class="pagination-controls">
    <!-- Previous button -->
    <button
      type="button"
      class="pagination-btn"
      disabled={!canGoPrev}
      on:click={() => goToPage(page - 1)}
      aria-label="Previous page"
    >
      <svg viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
      </svg>
      {#if mode === 'simple'}
        <span>Previous</span>
      {/if}
    </button>

    <!-- Page numbers (full mode only) -->
    {#if mode === 'full'}
      <div class="pagination-pages">
        {#each pageNumbers as pageNum}
          {#if pageNum === '...'}
            <span class="pagination-ellipsis">…</span>
          {:else}
            <button
              type="button"
              class="pagination-page"
              class:active={pageNum === page}
              on:click={() => goToPage(pageNum)}
              aria-current={pageNum === page ? 'page' : undefined}
              aria-label={`Page ${pageNum}`}
            >
              {pageNum}
            </button>
          {/if}
        {/each}
      </div>
    {:else if mode === 'simple' || mode === 'minimal'}
      <span class="pagination-current">
        {page} / {totalPages}
      </span>
    {/if}

    <!-- Next button -->
    <button
      type="button"
      class="pagination-btn"
      disabled={!canGoNext}
      on:click={() => goToPage(page + 1)}
      aria-label="Next page"
    >
      {#if mode === 'simple'}
        <span>Next</span>
      {/if}
      <svg viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
      </svg>
    </button>
  </div>

  <!-- Page size selector -->
  {#if showPageSize && mode !== 'minimal'}
    <div class="pagination-size">
      <label for="page-size">Show</label>
      <select id="page-size" bind:value={pageSize} on:change={handlePageSizeChange}>
        {#each pageSizes as size}
          <option value={size}>{size}</option>
        {/each}
      </select>
    </div>
  {/if}
</nav>

<style>
  .pagination {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: var(--spacing-4);
    padding: var(--spacing-3) 0;
  }

  .pagination.simple {
    justify-content: center;
  }

  .pagination.minimal {
    justify-content: center;
    gap: var(--spacing-2);
  }

  .pagination-info {
    flex-shrink: 0;
  }

  .item-count {
    font-size: 0.875rem;
    color: var(--color-text-muted);
  }

  .pagination-controls {
    display: flex;
    align-items: center;
    gap: var(--spacing-1);
  }

  .pagination-btn {
    display: flex;
    align-items: center;
    gap: var(--spacing-1);
    padding: var(--spacing-2);
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text);
    background: transparent;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: background-color 100ms ease, border-color 100ms ease;
    min-height: 36px;
    min-width: 36px;
    justify-content: center;
  }

  .pagination-btn:hover:not(:disabled) {
    background-color: var(--color-surface-sunken);
    border-color: var(--color-border-strong);
  }

  .pagination-btn:active:not(:disabled) {
    transform: scale(0.97);
  }

  .pagination-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .pagination-btn svg {
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
  }

  .pagination-pages {
    display: flex;
    align-items: center;
    gap: var(--spacing-0-5);
  }

  .pagination-page {
    min-width: 36px;
    height: 36px;
    padding: var(--spacing-1) var(--spacing-2);
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text);
    background: transparent;
    border: 1px solid transparent;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: background-color 100ms ease, border-color 100ms ease, color 100ms ease;
  }

  .pagination-page:hover {
    background-color: var(--color-surface-sunken);
  }

  .pagination-page.active {
    color: var(--color-on-primary);
    background-color: var(--color-primary);
    border-color: var(--color-primary);
  }

  .pagination-page:focus-visible {
    outline: 2px solid var(--color-border-focus);
    outline-offset: 2px;
  }

  .pagination-ellipsis {
    padding: 0 var(--spacing-1);
    color: var(--color-text-muted);
  }

  .pagination-current {
    padding: 0 var(--spacing-3);
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text);
  }

  .pagination-size {
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
    flex-shrink: 0;
  }

  .pagination-size label {
    font-size: 0.875rem;
    color: var(--color-text-muted);
  }

  .pagination-size select {
    padding: var(--spacing-1) var(--spacing-2);
    font-size: 0.875rem;
    color: var(--color-text);
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    cursor: pointer;
  }

  /* Mobile adjustments */
  @media (max-width: 640px) {
    .pagination {
      flex-direction: column;
      gap: var(--spacing-3);
    }

    .pagination-pages {
      display: none;
    }

    .pagination-controls {
      width: 100%;
      justify-content: space-between;
    }

    .pagination-btn {
      flex: 1;
      max-width: 120px;
    }
  }
</style>
