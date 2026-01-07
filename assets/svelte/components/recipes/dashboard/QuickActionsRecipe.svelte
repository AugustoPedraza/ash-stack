<script>
  /**
   * Quick Actions Recipe
   * Mobile-first action grid with icons and recent items.
   *
   * Uses: Button, Card
   */
  import { Button, Card } from '../../ui';

  let actionFeedback = $state(null);

  const actions = [
    { id: 'new-doc', icon: 'document', label: 'New Doc', color: 'bg-primary/15 text-primary' },
    { id: 'upload', icon: 'upload', label: 'Upload', color: 'bg-info/15 text-info' },
    { id: 'invite', icon: 'user-add', label: 'Invite', color: 'bg-success/15 text-success' },
    { id: 'scan', icon: 'camera', label: 'Scan', color: 'bg-warning/15 text-warning' },
  ];

  const recentItems = [
    { id: 1, name: 'Q4 Report.pdf', type: 'pdf', time: '2 min ago' },
    { id: 2, name: 'Team Meeting Notes', type: 'doc', time: '1 hr ago' },
    { id: 3, name: 'Design Assets', type: 'folder', time: 'Yesterday' },
  ];

  function handleAction(action) {
    actionFeedback = action.label;
    setTimeout(() => { actionFeedback = null; }, 1500);
  }

  function getIcon(icon) {
    switch (icon) {
      case 'document': return 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z';
      case 'upload': return 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12';
      case 'user-add': return 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z';
      case 'camera': return 'M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z';
      default: return 'M12 4v16m8-8H4';
    }
  }

  function getFileIcon(type) {
    switch (type) {
      case 'pdf': return { icon: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z', color: 'text-error' };
      case 'doc': return { icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', color: 'text-primary' };
      case 'folder': return { icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z', color: 'text-warning' };
      default: return { icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', color: 'text-muted-foreground' };
    }
  }
</script>

<div class="h-full bg-background overflow-y-auto">
  <div class="max-w-lg mx-auto px-5 py-6">
    <div class="mb-6">
      <h1 class="text-xl font-semibold text-foreground mb-2">Quick Actions</h1>
      <p class="text-sm text-muted-foreground">Mobile-first action grid with recent items.</p>
    </div>

    <!-- Feedback Toast -->
    {#if actionFeedback}
      <div class="fixed top-4 left-1/2 -translate-x-1/2 z-toast px-4 py-2 bg-text text-surface rounded-lg text-sm font-medium shadow-lg">
        {actionFeedback} tapped!
      </div>
    {/if}

    <!-- Quick Action Grid - 4 columns -->
    <div class="mb-8">
      <h2 class="text-sm font-medium text-foreground mb-3">Actions</h2>
      <div class="grid grid-cols-4 gap-3">
        {#each actions as action}
          <button
            type="button"
            class="flex flex-col items-center gap-2 p-4 rounded-xl border border-border hover:bg-muted/50 active:scale-95 transition-all"
            onclick={() => handleAction(action)}
          >
            <div class="w-12 h-12 rounded-full {action.color} flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d={getIcon(action.icon)} />
              </svg>
            </div>
            <span class="text-xs font-medium text-foreground">{action.label}</span>
          </button>
        {/each}
      </div>
    </div>

    <!-- Recent Items -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-sm font-medium text-foreground">Recent</h2>
        <Button variant="ghost" size="sm">
          See all
        </Button>
      </div>

      <div class="space-y-1">
        {#each recentItems as item}
          {@const fileInfo = getFileIcon(item.type)}
          <button
            type="button"
            class="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 active:bg-muted transition-colors text-left -mx-3"
          >
            <div class="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 {fileInfo.color}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d={fileInfo.icon} />
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-foreground truncate">{item.name}</p>
              <p class="text-xs text-muted-foreground">{item.time}</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-text-disabled shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        {/each}
      </div>
    </div>

    <!-- Alternative: Horizontal Scroll Actions -->
    <div class="mb-8">
      <h2 class="text-sm font-medium text-foreground mb-3">Horizontal Scroll Style</h2>
      <div class="overflow-x-auto -mx-5 px-5">
        <div class="flex gap-3 min-w-max pb-2">
          {#each actions as action}
            <Button
              variant="secondary"
              onclick={() => handleAction(action)}
            >
              <div class="w-10 h-10 rounded-full {action.color} flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d={getIcon(action.icon)} />
                </svg>
              </div>
              {action.label}
            </Button>
          {/each}
        </div>
      </div>
    </div>

    <!-- FAB Style -->
    <div class="mb-8">
      <h2 class="text-sm font-medium text-foreground mb-3">FAB (Floating Action)</h2>
      <div class="relative h-32 bg-muted/50 rounded-xl flex items-center justify-center">
        <p class="text-sm text-text-disabled">Content area</p>
        <button
          type="button"
          class="absolute bottom-4 right-4 w-14 h-14 rounded-full bg-primary text-on-primary shadow-lg hover:bg-primary-hover active:scale-95 transition-all flex items-center justify-center"
          onclick={() => handleAction({ label: 'Create' })}
          aria-label="Create new item"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile UX Note -->
    <div class="p-4 bg-primary/5 border border-primary/20 rounded-lg">
      <h3 class="text-sm font-medium text-primary mb-2">Mobile UX Patterns</h3>
      <ul class="text-xs text-muted-foreground space-y-1">
        <li>• 4-column grid fits thumb zone</li>
        <li>• Large touch targets (48px+)</li>
        <li>• Horizontal scroll for overflow</li>
        <li>• FAB for primary action</li>
      </ul>
    </div>
  </div>
</div>
