<script>
  /**
   * Activity Feed Recipe
   * Grouped activity timeline with avatars, action types, and load more.
   *
   * Uses: Button, Skeleton, Avatar, Card
   */
  import { Button, Skeleton, Avatar, Card } from '../../ui';

  let loading = $state(true);
  let loadingMore = $state(false);

  // Activity data grouped by date
  const allActivities = [
    // Today
    { id: 1, type: 'comment', user: 'Sarah Chen', avatar: 'https://i.pravatar.cc/40?img=1', action: 'commented on', target: 'Project Alpha', time: '2 min ago', date: 'Today' },
    { id: 2, type: 'upload', user: 'Mike Johnson', avatar: 'https://i.pravatar.cc/40?img=2', action: 'uploaded', target: '3 files', time: '15 min ago', date: 'Today' },
    { id: 3, type: 'complete', user: 'Emma Wilson', avatar: 'https://i.pravatar.cc/40?img=3', action: 'completed', target: 'Design Review', time: '1 hr ago', date: 'Today' },
    // Yesterday
    { id: 4, type: 'invite', user: 'Alex Kim', avatar: 'https://i.pravatar.cc/40?img=4', action: 'invited', target: 'John Doe', time: '1 day ago', date: 'Yesterday' },
    { id: 5, type: 'create', user: 'Lisa Park', avatar: 'https://i.pravatar.cc/40?img=5', action: 'created', target: 'Sprint Planning', time: '1 day ago', date: 'Yesterday' },
    // This Week
    { id: 6, type: 'comment', user: 'Tom Brown', avatar: 'https://i.pravatar.cc/40?img=6', action: 'commented on', target: 'Bug #234', time: '3 days ago', date: 'This Week' },
    { id: 7, type: 'complete', user: 'Sarah Chen', avatar: 'https://i.pravatar.cc/40?img=1', action: 'completed', target: 'API Integration', time: '4 days ago', date: 'This Week' },
    { id: 8, type: 'upload', user: 'Mike Johnson', avatar: 'https://i.pravatar.cc/40?img=2', action: 'uploaded', target: 'Logo Assets', time: '5 days ago', date: 'This Week' },
  ];

  let visibleCount = $state(5);
  const activities = $derived(allActivities.slice(0, visibleCount));
  const hasMore = $derived(visibleCount < allActivities.length);

  // Group activities by date
  const groupedActivities = $derived.by(() => {
    const groups = {};
    for (const activity of activities) {
      if (!groups[activity.date]) {
        groups[activity.date] = [];
      }
      groups[activity.date].push(activity);
    }
    return Object.entries(groups);
  });

  // Simulate loading
  $effect(() => {
    const timer = setTimeout(() => {
      loading = false;
    }, 800);
    return () => clearTimeout(timer);
  });

  async function loadMore() {
    loadingMore = true;
    await new Promise(r => setTimeout(r, 600));
    visibleCount = Math.min(visibleCount + 3, allActivities.length);
    loadingMore = false;
  }

  function getTypeIcon(type) {
    switch (type) {
      case 'comment': return 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z';
      case 'upload': return 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12';
      case 'complete': return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z';
      case 'invite': return 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z';
      case 'create': return 'M12 4v16m8-8H4';
      default: return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
    }
  }

  function getTypeColor(type) {
    switch (type) {
      case 'comment': return 'bg-primary text-on-primary';
      case 'upload': return 'bg-info text-on-info';
      case 'complete': return 'bg-success text-on-success';
      case 'invite': return 'bg-warning text-on-warning';
      case 'create': return 'bg-secondary text-on-secondary';
      default: return 'bg-accent text-foreground';
    }
  }
</script>

<div class="h-full bg-base-100 overflow-y-auto">
  <div class="max-w-lg mx-auto px-5 py-6">
    <div class="mb-6">
      <h1 class="text-xl font-semibold text-foreground mb-2">Activity Feed</h1>
      <p class="text-sm text-muted-foreground">Grouped timeline with avatars and action types.</p>
    </div>

    {#if loading}
      <!-- Loading Skeleton -->
      <div class="space-y-4">
        {#each Array(4) as _}
          <div class="flex gap-3">
            <Skeleton variant="circle" class="w-10 h-10" />
            <div class="flex-1 space-y-2">
              <Skeleton variant="text" class="w-3/4" />
              <Skeleton variant="text" class="w-1/4" />
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <!-- Grouped Activity List -->
      <div class="space-y-6">
        {#each groupedActivities as [dateLabel, items]}
          <div>
            <!-- Date Header -->
            <div class="flex items-center gap-3 mb-3">
              <span class="text-xs font-medium text-muted-foreground uppercase tracking-wide">{dateLabel}</span>
              <div class="flex-1 h-px bg-border"></div>
            </div>

            <!-- Activities -->
            <div class="space-y-1">
              {#each items as activity}
                <div class="flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors -mx-3">
                  <!-- Avatar with type indicator -->
                  <div class="relative shrink-0">
                    <Avatar
                      src={activity.avatar}
                      alt={activity.user}
                      size="md"
                    />
                    <div class="absolute -bottom-1 -right-1 w-5 h-5 rounded-full {getTypeColor(activity.type)} flex items-center justify-center ring-2 ring-surface">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d={getTypeIcon(activity.type)} />
                      </svg>
                    </div>
                  </div>

                  <!-- Content -->
                  <div class="flex-1 min-w-0">
                    <p class="text-sm text-foreground">
                      <span class="font-medium">{activity.user}</span>
                      {' '}{activity.action}{' '}
                      <span class="font-medium">{activity.target}</span>
                    </p>
                    <p class="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        {/each}
      </div>

      <!-- Load More -->
      {#if hasMore}
        <div class="mt-6 text-center">
          <Button
            variant="ghost"
            size="sm"
            onclick={loadMore}
            disabled={loadingMore}
            loading={loadingMore}
          >
            {loadingMore ? 'Loading...' : 'Load more activity'}
          </Button>
        </div>
      {:else}
        <div class="mt-6 text-center">
          <p class="text-sm text-text-disabled">All caught up!</p>
        </div>
      {/if}
    {/if}

    <!-- Alternative: Compact Timeline Style -->
    <div class="mt-10 mb-6">
      <h2 class="text-sm font-medium text-foreground mb-3">Compact Timeline Style</h2>
    </div>

    <div class="relative pl-6 border-l-2 border-border space-y-4">
      {#each allActivities.slice(0, 4) as activity}
        <div class="relative">
          <!-- Timeline dot -->
          <div class="absolute -left-[25px] w-3 h-3 rounded-full bg-background border-2 border-border"></div>

          <div class="pb-4">
            <p class="text-sm text-foreground">
              <span class="font-medium">{activity.user}</span>
              {' '}{activity.action}{' '}
              <span class="text-muted-foreground">{activity.target}</span>
            </p>
            <p class="text-xs text-muted-foreground mt-1">{activity.time}</p>
          </div>
        </div>
      {/each}
    </div>

    <!-- Mobile UX Note -->
    <div class="mt-8 p-4 bg-primary/5 border border-primary/20 rounded-lg">
      <h3 class="text-sm font-medium text-primary mb-2">Mobile UX Patterns</h3>
      <ul class="text-xs text-muted-foreground space-y-1">
        <li>• Group by date reduces cognitive load</li>
        <li>• Avatar + icon shows who did what</li>
        <li>• Tap targets are full row width</li>
        <li>• Load more instead of pagination</li>
      </ul>
    </div>
  </div>
</div>
