<script>
  /**
   * Infinite Scroll Recipe
   * Auto-loads more items when user scrolls near bottom (no button).
   * Shows skeleton placeholders while loading (not spinners).
   * Includes: pull-to-refresh, end of list indicator.
   *
   * Uses: Button, Skeleton, Avatar, Card
   */
  import { mockPaginatedFetch } from '../../../lib/mock/mockApi.js';
  import { Button, Skeleton, Avatar, Card } from '../../ui';

  const ITEMS_PER_PAGE = 10;
  const TOTAL_ITEMS = 47;

  // Generate mock posts
  function generatePosts(page, limit) {
    const start = (page - 1) * limit;
    const avatarSeeds = ['Alex', 'Sam', 'Jordan', 'Taylor', 'Casey', 'Morgan', 'Riley', 'Drew'];
    const titles = [
      'Just launched our new product!',
      'Great team meeting today',
      'Working on something exciting',
      'Coffee and code',
      'Weekend project update',
      'Learning something new',
      'Celebrating a milestone',
      'Design inspiration'
    ];

    return Array.from({ length: Math.min(limit, TOTAL_ITEMS - start) }, (_, i) => ({
      id: `post-${start + i + 1}`,
      author: avatarSeeds[(start + i) % avatarSeeds.length],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeeds[(start + i) % avatarSeeds.length]}`,
      title: titles[(start + i) % titles.length],
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.',
      likes: Math.floor(Math.random() * 100),
      comments: Math.floor(Math.random() * 20),
      createdAt: new Date(Date.now() - (start + i) * 3600000).toISOString()
    }));
  }

  let items = $state([]);
  let page = $state(1);
  let loading = $state(false);
  let loadingMore = $state(false);
  let refreshing = $state(false);
  let hasMore = $state(true);
  let error = $state(null);

  // Container ref for scroll detection
  let containerRef = $state(null);

  // Initial load
  $effect(() => {
    loadInitial();
  });

  async function loadInitial() {
    loading = true;
    error = null;

    const result = await mockPaginatedFetch(generatePosts, 1, ITEMS_PER_PAGE, TOTAL_ITEMS);

    loading = false;
    if (result.error) {
      error = result.error.message;
      return;
    }
    items = result.data;
    hasMore = result.pagination.hasMore;
    page = 1;
  }

  async function loadMore() {
    if (loadingMore || !hasMore) return;

    loadingMore = true;
    const nextPage = page + 1;

    const result = await mockPaginatedFetch(generatePosts, nextPage, ITEMS_PER_PAGE, TOTAL_ITEMS);

    loadingMore = false;
    if (result.error) {
      // Silently fail for load more, keep existing data
      return;
    }
    items = [...items, ...result.data];
    hasMore = result.pagination.hasMore;
    page = nextPage;
  }

  async function refresh() {
    refreshing = true;
    error = null;

    const result = await mockPaginatedFetch(generatePosts, 1, ITEMS_PER_PAGE, TOTAL_ITEMS);

    refreshing = false;
    if (result.error) {
      error = result.error.message;
      return;
    }
    items = result.data;
    hasMore = result.pagination.hasMore;
    page = 1;
  }

  function handleScroll(e) {
    const target = e.target;
    const scrollBottom = target.scrollHeight - target.scrollTop - target.clientHeight;

    // Load more when within 100px of bottom
    if (scrollBottom < 100 && !loadingMore && hasMore) {
      loadMore();
    }
  }

  function formatTimeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  }
</script>

<div class="h-full bg-base-100 flex flex-col overflow-hidden">
  <!-- Header -->
  <div class="shrink-0 bg-base-100 border-b border-border px-5 py-4">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-semibold text-text">Feed</h1>
        <p class="text-sm text-text-muted">{items.length} of {TOTAL_ITEMS} posts</p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onclick={refresh}
        disabled={refreshing}
        loading={refreshing}
        aria-label="Refresh"
      >
        {#if !refreshing}
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        {/if}
      </Button>
    </div>
  </div>

  <!-- Scrollable Content - flex-1 + min-h-0 ensures proper scroll containment -->
  <div
    bind:this={containerRef}
    class="flex-1 min-h-0 overflow-y-auto"
    onscroll={handleScroll}
  >
    {#if loading && items.length === 0}
      <!-- Loading Skeleton -->
      <div class="p-5 space-y-4">
        {#each Array(3) as _}
          <Card variant="outlined" padding="md">
            <div class="flex items-center gap-3 mb-3">
              <Skeleton variant="circle" class="w-10 h-10" />
              <div class="flex-1 space-y-2">
                <Skeleton variant="text" class="w-24" />
                <Skeleton variant="text" class="w-16 h-3" />
              </div>
            </div>
            <div class="space-y-2">
              <Skeleton variant="text" class="w-full" />
              <Skeleton variant="text" class="w-3/4" />
            </div>
          </Card>
        {/each}
      </div>
    {:else if error}
      <!-- Error State -->
      <div class="flex flex-col items-center justify-center py-12 text-center px-5">
        <div class="w-16 h-16 rounded-full bg-error/15 text-error flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-text mb-2">Failed to load</h3>
        <p class="text-text-muted mb-4">{error}</p>
        <Button variant="ghost" size="sm" onclick={loadInitial}>
          Try Again
        </Button>
      </div>
    {:else if items.length === 0}
      <!-- Empty State -->
      <div class="flex flex-col items-center justify-center py-12 text-center px-5">
        <div class="w-16 h-16 rounded-full bg-surface-sunken text-text-disabled flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-text mb-2">No posts yet</h3>
        <p class="text-text-muted">Posts will appear here when published.</p>
      </div>
    {:else}
      <!-- Posts List -->
      <div class="p-5 space-y-4">
        <!-- Pull to refresh indicator -->
        {#if refreshing}
          <div class="flex justify-center py-2">
            <span class="loading loading-spinner loading-sm text-primary"></span>
          </div>
        {/if}

        {#each items as post}
          <Card variant="outlined" padding="md">
            <!-- Author Header -->
            <div class="flex items-center gap-3 mb-3">
              <Avatar src={post.avatar} alt={post.author} size="md" />
              <div class="flex-1 min-w-0">
                <p class="font-medium text-text truncate">{post.author}</p>
                <p class="text-sm text-text-muted">{formatTimeAgo(post.createdAt)}</p>
              </div>
              <Button variant="ghost" size="sm" ariaLabel="More options">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </Button>
            </div>

            <!-- Content -->
            <h2 class="font-semibold text-text mb-2">{post.title}</h2>
            <p class="text-text-secondary text-sm mb-4">{post.content}</p>

            <!-- Actions -->
            <div class="flex items-center gap-4 pt-3 border-t border-border">
              <button class="flex items-center gap-1.5 text-sm text-text-muted hover:text-error transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {post.likes}
              </button>
              <button class="flex items-center gap-1.5 text-sm text-text-muted hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {post.comments}
              </button>
              <button class="flex items-center gap-1.5 text-sm text-text-muted hover:text-primary transition-colors ml-auto" aria-label="Share">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
            </div>
          </Card>
        {/each}

        <!-- Loading More: Skeleton Placeholders -->
        {#if loadingMore}
          {#each Array(2) as _}
            <Card variant="outlined" padding="md">
              <div class="flex items-center gap-3 mb-3">
                <Skeleton variant="circle" class="w-10 h-10" />
                <div class="flex-1 space-y-2">
                  <Skeleton variant="text" class="w-24" />
                  <Skeleton variant="text" class="w-16 h-3" />
                </div>
              </div>
              <div class="space-y-2">
                <Skeleton variant="text" class="w-full" />
                <Skeleton variant="text" class="w-3/4" />
              </div>
            </Card>
          {/each}
        {:else if !hasMore}
          <!-- End of List Indicator -->
          <div class="text-center py-6">
            <div class="inline-flex items-center gap-2 text-sm text-text-disabled">
              <div class="w-8 h-px bg-border"></div>
              <span>You've reached the end</span>
              <div class="w-8 h-px bg-border"></div>
            </div>
          </div>
        {/if}
      </div>
    {/if}
  </div>
</div>
