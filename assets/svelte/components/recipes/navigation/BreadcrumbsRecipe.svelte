<script>
  /**
   * Breadcrumbs Recipe (Mobile-First)
   * Simple back navigation - the mobile standard.
   *
   * Uses: Button
   */
  import { Button } from '../../ui';

  // Navigation history simulation
  const navigationStack = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Electronics', href: '/products/electronics' },
    { label: 'Headphones', href: '/products/electronics/headphones' }
  ];

  let currentDepth = $state(3);

  const currentPage = $derived(navigationStack[currentDepth]);
  const previousPage = $derived(currentDepth > 0 ? navigationStack[currentDepth - 1] : null);

  function goBack() {
    if (currentDepth > 0) {
      currentDepth--;
    }
  }

  function goForward() {
    if (currentDepth < navigationStack.length - 1) {
      currentDepth++;
    }
  }
</script>

<div class="h-full bg-surface overflow-y-auto px-5 py-6">
  <div class="max-w-md mx-auto">
    <div class="mb-8">
      <h1 class="text-xl font-semibold text-text mb-2">Back Navigation</h1>
      <p class="text-text-muted text-sm">Mobile standard: simple back link instead of breadcrumb trail.</p>
    </div>

    <div class="flex flex-col gap-6">
      <!-- Mobile Back Pattern (Primary) -->
      <div class="flex flex-col gap-1.5">
        <span class="text-sm font-medium text-text">Standard Back Link</span>
        <p class="text-xs text-text-muted mb-2">Used in screen headers or at top of content.</p>

        <div class="p-4 border border-border-strong rounded-lg bg-surface">
          {#if previousPage}
            <button
              type="button"
              class="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-primary transition-colors"
              onclick={goBack}
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              {previousPage.label}
            </button>
          {:else}
            <span class="text-sm text-text-disabled">At root level</span>
          {/if}
        </div>
      </div>

      <!-- Header Integration Example -->
      <div class="flex flex-col gap-1.5">
        <span class="text-sm font-medium text-text">In Screen Header</span>
        <p class="text-xs text-text-muted mb-2">Back button integrated with page title.</p>

        <div class="border border-border-strong rounded-lg bg-surface overflow-hidden">
          <!-- Simulated header -->
          <div class="flex items-center justify-between px-4 py-3 border-b border-border">
            <div class="flex items-center gap-3">
              {#if previousPage}
                <button
                  type="button"
                  class="w-8 h-8 flex items-center justify-center rounded-full text-text-muted hover:text-text hover:bg-surface-sunken transition-colors"
                  onclick={goBack}
                  aria-label="Go back"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              {/if}
              <h2 class="text-base font-semibold text-text">{currentPage.label}</h2>
            </div>
            <Button variant="ghost" size="sm">
              Save
            </Button>
          </div>

          <!-- Content area -->
          <div class="p-4">
            <p class="text-sm text-text-muted">Page content for {currentPage.label}</p>
          </div>
        </div>
      </div>

      <!-- Navigation Simulation -->
      <div class="flex flex-col gap-1.5">
        <span class="text-sm font-medium text-text">Simulate Navigation</span>
        <div class="flex items-center justify-between">
          <button
            type="button"
            class="text-sm text-text-muted hover:text-text transition-colors disabled:opacity-30"
            onclick={goBack}
            disabled={currentDepth === 0}
          >
            ← Back
          </button>
          <span class="text-xs text-text-muted">
            Depth: {currentDepth + 1}/{navigationStack.length}
          </span>
          <button
            type="button"
            class="text-sm text-text-muted hover:text-text transition-colors disabled:opacity-30"
            onclick={goForward}
            disabled={currentDepth === navigationStack.length - 1}
          >
            Forward →
          </button>
        </div>
      </div>

      <!-- Path Display (for context, not navigation) -->
      <div class="flex flex-col gap-1.5">
        <span class="text-sm font-medium text-text">Path Context</span>
        <p class="text-xs text-text-muted mb-2">Show location context without making it clickable.</p>

        <div class="p-4 border border-border-strong rounded-lg bg-surface">
          <p class="text-xs text-text-disabled">
            {navigationStack.slice(0, currentDepth + 1).map(p => p.label).join(' / ')}
          </p>
        </div>
      </div>

      <!-- Current State -->
      <div class="p-4 bg-surface-sunken rounded-lg">
        <h3 class="text-sm font-medium text-text mb-2">Navigation State</h3>
        <pre class="text-xs text-text-secondary">{JSON.stringify({
          current: currentPage.label,
          previous: previousPage?.label || null,
          depth: currentDepth
        }, null, 2)}</pre>
      </div>

      <!-- Mobile UX Note -->
      <div class="p-4 bg-primary/5 border border-primary/20 rounded-lg">
        <h3 class="text-sm font-medium text-primary mb-2">Mobile UX Pattern</h3>
        <ul class="text-xs text-text-secondary space-y-1">
          <li>• Full breadcrumb trails waste horizontal space</li>
          <li>• Users understand back button universally</li>
          <li>• iOS/Android both use this pattern</li>
          <li>• Combine with screen title for context</li>
        </ul>
      </div>
    </div>
  </div>
</div>
