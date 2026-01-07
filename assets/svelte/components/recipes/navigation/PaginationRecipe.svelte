<script>
  /**
   * Pagination Recipe (Mobile-First)
   * Load More pattern - the mobile standard. No page numbers.
   *
   * Uses: Button
   */
  import { Button } from '../../ui';

  // Simulated data loading
  let items = $state([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  let loading = $state(false);
  let hasMore = $state(true);
  const totalItems = 50;
  const pageSize = 10;

  const loadedCount = $derived(items.length);
  const progress = $derived((loadedCount / totalItems) * 100);

  async function loadMore() {
    if (loading || !hasMore) return;

    loading = true;

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const nextItems = Array.from(
      { length: Math.min(pageSize, totalItems - items.length) },
      (_, i) => items.length + i + 1
    );

    items = [...items, ...nextItems];
    hasMore = items.length < totalItems;
    loading = false;
  }

  function reset() {
    items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    hasMore = true;
  }
</script>

<div class="h-full bg-surface overflow-y-auto px-5 py-6">
  <div class="max-w-md mx-auto">
    <div class="mb-8">
      <h1 class="text-xl font-semibold text-text mb-2">Load More</h1>
      <p class="text-text-muted text-sm">Mobile standard for loading additional content. No page numbers.</p>
    </div>

    <div class="flex flex-col gap-6">
      <!-- Load More Button -->
      <div class="flex flex-col gap-1.5">
        <span class="text-sm font-medium text-text">Load More Button</span>
        <p class="text-xs text-text-muted mb-2">User-triggered loading. Best for most cases.</p>

        <div class="border border-border-strong rounded-lg bg-surface overflow-hidden">
          <!-- Item list -->
          <div class="divide-y divide-border max-h-64 overflow-y-auto">
            {#each items as item}
              <div class="px-4 py-3 text-sm text-text">
                Item {item}
              </div>
            {/each}
          </div>

          <!-- Load more footer -->
          <div class="p-4 border-t border-border bg-surface-sunken">
            {#if hasMore}
              <Button
                variant="secondary"
                fullWidth
                onclick={loadMore}
                disabled={loading}
                {loading}
              >
                {loading ? 'Loading...' : 'Load More'}
              </Button>
            {:else}
              <p class="text-sm text-text-muted text-center">All items loaded</p>
            {/if}

            <p class="mt-3 text-xs text-text-disabled text-center">
              Showing {loadedCount} of {totalItems}
            </p>
          </div>
        </div>
      </div>

      <!-- With Progress Indicator -->
      <div class="flex flex-col gap-1.5">
        <span class="text-sm font-medium text-text">With Progress</span>
        <p class="text-xs text-text-muted mb-2">Show how much content remains.</p>

        <div class="p-4 border border-border-strong rounded-lg bg-surface">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-text-muted">{loadedCount} of {totalItems} items</span>
            <span class="text-xs text-text-disabled">{Math.round(progress)}%</span>
          </div>
          <div class="h-1.5 bg-surface-sunken rounded-full overflow-hidden">
            <div
              class="h-full bg-primary rounded-full transition-all duration-300"
              style="width: {progress}%"
            ></div>
          </div>

          {#if hasMore}
            <div class="mt-4">
              <Button
                variant="secondary"
                fullWidth
                onclick={loadMore}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Load More'}
              </Button>
            </div>
          {/if}
        </div>
      </div>

      <!-- Minimal Style -->
      <div class="flex flex-col gap-1.5">
        <span class="text-sm font-medium text-text">Minimal Style</span>
        <p class="text-xs text-text-muted mb-2">Text link instead of button.</p>

        <div class="p-4 border border-border-strong rounded-lg bg-surface text-center">
          {#if hasMore}
            <button
              type="button"
              class="text-sm text-primary hover:text-primary/80 transition-colors disabled:opacity-50"
              onclick={loadMore}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Show more results'}
            </button>
          {:else}
            <span class="text-sm text-text-disabled">No more results</span>
          {/if}
        </div>
      </div>

      <!-- End of List Indicator -->
      <div class="flex flex-col gap-1.5">
        <span class="text-sm font-medium text-text">End of List</span>
        <p class="text-xs text-text-muted mb-2">What to show when all items are loaded.</p>

        <div class="p-4 border border-border-strong rounded-lg bg-surface">
          <div class="flex flex-col items-center gap-2 py-4">
            <div class="w-8 h-0.5 bg-border rounded-full"></div>
            <p class="text-sm text-text-disabled">You've reached the end</p>
          </div>
        </div>
      </div>

      <!-- Reset Demo -->
      <div class="flex justify-center">
        <Button variant="ghost" size="sm" onclick={reset}>
          Reset Demo
        </Button>
      </div>

      <!-- Current State -->
      <div class="p-4 bg-surface-sunken rounded-lg">
        <h3 class="text-sm font-medium text-text mb-2">State</h3>
        <pre class="text-xs text-text-secondary">{JSON.stringify({
          loaded: loadedCount,
          total: totalItems,
          hasMore,
          loading
        }, null, 2)}</pre>
      </div>

      <!-- Mobile UX Note -->
      <div class="p-4 bg-primary/5 border border-primary/20 rounded-lg">
        <h3 class="text-sm font-medium text-primary mb-2">Mobile UX Patterns</h3>
        <ul class="text-xs text-text-secondary space-y-1">
          <li>• Page numbers are desktop patterns</li>
          <li>• Load More is thumb-friendly</li>
          <li>• Infinite scroll can be disorienting</li>
          <li>• Always show loading state</li>
          <li>• Indicate when list ends</li>
        </ul>
      </div>
    </div>
  </div>
</div>
