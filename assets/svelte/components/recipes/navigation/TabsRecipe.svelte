<script>
  /**
   * Tabs Recipe (Mobile-First)
   * Segment controls and scrollable filter pills.
   */

  // Segment control tabs (2-4 options)
  const viewTabs = [
    { id: 'list', label: 'List' },
    { id: 'grid', label: 'Grid' }
  ];

  const statusTabs = [
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active' },
    { id: 'completed', label: 'Done' }
  ];

  // Scrollable filter pills (many options)
  const filterPills = [
    { id: 'all', label: 'All' },
    { id: 'photos', label: 'Photos' },
    { id: 'videos', label: 'Videos' },
    { id: 'documents', label: 'Documents' },
    { id: 'audio', label: 'Audio' },
    { id: 'archives', label: 'Archives' },
    { id: 'recent', label: 'Recent' },
    { id: 'shared', label: 'Shared' }
  ];

  let activeView = $state('list');
  let activeStatus = $state('all');
  let activeFilter = $state('all');

  // Tab content simulation
  const contentMap = {
    all: '24 items',
    active: '12 items',
    completed: '12 items'
  };
</script>

<div class="h-full bg-background overflow-y-auto px-5 py-6">
  <div class="max-w-md mx-auto">
    <div class="mb-8">
      <h1 class="text-xl font-semibold text-foreground mb-2">Tabs</h1>
      <p class="text-muted-foreground text-sm">Mobile patterns: segment controls and scrollable pills.</p>
    </div>

    <div class="flex flex-col gap-6">
      <!-- Segment Control (2 options) -->
      <div class="flex flex-col gap-1.5">
        <span class="text-sm font-medium text-foreground">Segment Control (2 options)</span>
        <p class="text-xs text-muted-foreground mb-2">Toggle between two views. iOS style.</p>

        <div class="p-4 border border-border-strong rounded-lg bg-background">
          <div class="flex p-1 bg-surface-sunken rounded-lg">
            {#each viewTabs as tab}
              <button
                type="button"
                class="flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all
                  {activeView === tab.id
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'}"
                onclick={() => activeView = tab.id}
              >
                {tab.label}
              </button>
            {/each}
          </div>

          <p class="mt-4 text-sm text-muted-foreground text-center">
            Viewing as: {activeView}
          </p>
        </div>
      </div>

      <!-- Segment Control (3 options) -->
      <div class="flex flex-col gap-1.5">
        <span class="text-sm font-medium text-foreground">Segment Control (3 options)</span>
        <p class="text-xs text-muted-foreground mb-2">Filter content by status.</p>

        <div class="p-4 border border-border-strong rounded-lg bg-background">
          <div class="flex p-1 bg-surface-sunken rounded-lg">
            {#each statusTabs as tab}
              <button
                type="button"
                class="flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all
                  {activeStatus === tab.id
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'}"
                onclick={() => activeStatus = tab.id}
              >
                {tab.label}
              </button>
            {/each}
          </div>

          <p class="mt-4 text-sm text-muted-foreground text-center">
            Showing: {contentMap[activeStatus]}
          </p>
        </div>
      </div>

      <!-- Scrollable Filter Pills -->
      <div class="flex flex-col gap-1.5">
        <span class="text-sm font-medium text-foreground">Scrollable Pills</span>
        <p class="text-xs text-muted-foreground mb-2">Horizontal scroll for many filter options. (Airbnb, Google Maps style)</p>

        <div class="border border-border-strong rounded-lg bg-background overflow-hidden">
          <!-- Scrollable area - extends beyond container -->
          <div class="overflow-x-auto -mx-0">
            <div class="flex gap-2 p-4 min-w-max">
              {#each filterPills as pill}
                <button
                  type="button"
                  class="px-4 py-2 text-sm rounded-full whitespace-nowrap transition-colors
                    {activeFilter === pill.id
                      ? 'bg-primary text-white'
                      : 'bg-surface-sunken text-muted-foreground hover:text-foreground hover:bg-border'}"
                  onclick={() => activeFilter = pill.id}
                >
                  {pill.label}
                </button>
              {/each}
            </div>
          </div>

          <div class="px-4 pb-4">
            <p class="text-sm text-muted-foreground">
              Filter: {activeFilter}
            </p>
          </div>
        </div>
      </div>

      <!-- Pills with counts -->
      <div class="flex flex-col gap-1.5">
        <span class="text-sm font-medium text-foreground">Pills with Badges</span>
        <p class="text-xs text-muted-foreground mb-2">Show item counts in filter pills.</p>

        <div class="overflow-x-auto -mx-5 px-5">
          <div class="flex gap-2 min-w-max pb-2">
            {#each [['inbox', 'Inbox', 12], ['sent', 'Sent', 0], ['drafts', 'Drafts', 3], ['trash', 'Trash', 0]] as [id, label, count]}
              <button
                type="button"
                class="flex items-center gap-2 px-4 py-2 text-sm rounded-full whitespace-nowrap transition-colors
                  {id === 'inbox'
                    ? 'bg-primary text-white'
                    : 'bg-surface-sunken text-muted-foreground hover:text-foreground hover:bg-border'}"
              >
                {label}
                {#if count > 0}
                  <span class="px-1.5 py-0.5 text-xs rounded-full {id === 'inbox' ? 'bg-white/20' : 'bg-border'}">
                    {count}
                  </span>
                {/if}
              </button>
            {/each}
          </div>
        </div>
      </div>

      <!-- Current State -->
      <div class="p-4 bg-surface-sunken rounded-lg">
        <h3 class="text-sm font-medium text-foreground mb-2">State</h3>
        <pre class="text-xs text-muted-foreground">{JSON.stringify({
          view: activeView,
          status: activeStatus,
          filter: activeFilter
        }, null, 2)}</pre>
      </div>

      <!-- Mobile UX Note -->
      <div class="p-4 bg-primary/5 border border-primary/20 rounded-lg">
        <h3 class="text-sm font-medium text-primary mb-2">Mobile UX Patterns</h3>
        <ul class="text-xs text-muted-foreground space-y-1">
          <li>• Segment controls: 2-4 mutually exclusive options</li>
          <li>• Scrollable pills: unlimited filter options</li>
          <li>• Large touch targets (44px+ height)</li>
          <li>• Visual feedback on selection</li>
        </ul>
      </div>
    </div>
  </div>
</div>
