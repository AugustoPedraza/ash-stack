<script>
  /**
   * Tabs in Modal Recipe
   * Modal with tabbed content for organizing related information.
   *
   * Uses: Button, Modal, Badge, Avatar, Toggle, Card
   */
  import { Button, Modal, Badge, Avatar, Toggle, Card } from '../../ui';

  let showModal = $state(false);
  let activeTab = $state('details');

  const tabs = [
    { id: 'details', label: 'Details' },
    { id: 'activity', label: 'Activity' },
    { id: 'settings', label: 'Settings' },
  ];

  // Mock data
  const itemDetails = {
    name: 'Q4 Marketing Campaign',
    description: 'End of year marketing push focusing on holiday promotions and brand awareness.',
    status: 'In Progress',
    progress: 65,
    dueDate: new Date(Date.now() + 86400000 * 14),
    owner: { name: 'Sarah Chen', avatar: 'https://i.pravatar.cc/40?img=1' },
    team: [
      { name: 'Mike Johnson', avatar: 'https://i.pravatar.cc/40?img=2' },
      { name: 'Emma Wilson', avatar: 'https://i.pravatar.cc/40?img=3' },
    ]
  };

  const activities = [
    { id: 1, user: 'Sarah Chen', action: 'updated the description', time: '2 hours ago' },
    { id: 2, user: 'Mike Johnson', action: 'added a comment', time: '5 hours ago' },
    { id: 3, user: 'Emma Wilson', action: 'changed status to In Progress', time: '1 day ago' },
    { id: 4, user: 'Sarah Chen', action: 'created this item', time: '3 days ago' },
  ];

  let notifyOnComplete = $state(true);
  let notifyOnComments = $state(true);
  let visibility = $state('team');

  function formatDate(date) {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
</script>

<div class="h-full bg-background overflow-y-auto px-5 py-6">
  <div class="max-w-md mx-auto">
    <div class="mb-8">
      <h1 class="text-xl font-semibold text-foreground mb-2">Tabs in Modal</h1>
      <p class="text-muted-foreground text-sm">Modal with tabbed content organization.</p>
    </div>

    <!-- Trigger -->
    <Button
      variant="secondary"
      fullWidth
      onclick={() => { showModal = true; activeTab = 'details'; }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      View Campaign Details
    </Button>

    <!-- Tab Variants -->
    <Card variant="flat" padding="md" class="mt-8">
      <h3 class="text-sm font-medium text-foreground mb-4">Tab Variants</h3>

      <!-- Underline Tabs -->
      <div class="mb-4">
        <p class="text-xs text-muted-foreground mb-2">Underline Style</p>
        <div class="flex border-b border-border">
          <button type="button" class="px-4 py-2 text-sm font-medium text-primary border-b-2 border-primary">Details</button>
          <button type="button" class="px-4 py-2 text-sm font-medium text-muted-foreground">Activity</button>
          <button type="button" class="px-4 py-2 text-sm font-medium text-muted-foreground">Settings</button>
        </div>
      </div>

      <!-- Pill Tabs -->
      <div>
        <p class="text-xs text-muted-foreground mb-2">Pill Style</p>
        <div class="flex gap-1 p-1 bg-muted rounded-lg">
          <button type="button" class="flex-1 px-3 py-1.5 text-sm font-medium bg-background text-foreground rounded-md shadow-sm">Details</button>
          <button type="button" class="flex-1 px-3 py-1.5 text-sm font-medium text-muted-foreground">Activity</button>
          <button type="button" class="flex-1 px-3 py-1.5 text-sm font-medium text-muted-foreground">Settings</button>
        </div>
      </div>
    </Card>

    <!-- Mobile UX Note -->
    <div class="mt-8 p-4 bg-primary/5 border border-primary/20 rounded-lg">
      <h3 class="text-sm font-medium text-primary mb-2">Mobile UX Patterns</h3>
      <ul class="text-xs text-muted-foreground space-y-1">
        <li>• Keep tab count to 2-4 max</li>
        <li>• Scrollable tabs for more items</li>
        <li>• Persist tab state on close</li>
        <li>• Lazy load tab content</li>
      </ul>
    </div>
  </div>
</div>

<!-- Tabbed Modal -->
<Modal bind:open={showModal} title={itemDetails.name} size="lg">
  {#snippet header()}
    <!-- Tabs -->
    <div class="flex border-b border-border -mx-6 px-6">
      {#each tabs as tab}
        <button
          type="button"
          class="px-4 py-2.5 text-sm font-medium transition-colors relative
            {activeTab === tab.id ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}"
          onclick={() => activeTab = tab.id}
        >
          {tab.label}
          {#if activeTab === tab.id}
            <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
          {/if}
        </button>
      {/each}
    </div>
  {/snippet}

  {#if activeTab === 'details'}
    <div class="space-y-6">
      <!-- Status & Progress -->
      <div>
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-medium text-muted-foreground uppercase">Progress</span>
          <Badge variant="info" size="sm">{itemDetails.status}</Badge>
        </div>
        <div class="h-2 bg-muted rounded-full overflow-hidden">
          <div class="h-full bg-primary rounded-full" style="width: {itemDetails.progress}%"></div>
        </div>
        <p class="text-xs text-muted-foreground mt-1">{itemDetails.progress}% complete</p>
      </div>

      <!-- Description -->
      <div>
        <span class="text-xs font-medium text-muted-foreground uppercase">Description</span>
        <p class="text-sm text-muted-foreground mt-2">{itemDetails.description}</p>
      </div>

      <!-- Due Date -->
      <div>
        <span class="text-xs font-medium text-muted-foreground uppercase">Due Date</span>
        <p class="text-sm text-foreground mt-2">{formatDate(itemDetails.dueDate)}</p>
      </div>

      <!-- Team -->
      <div>
        <span class="text-xs font-medium text-muted-foreground uppercase">Team</span>
        <div class="flex items-center gap-3 mt-2">
          <div class="flex items-center gap-2">
            <Avatar src={itemDetails.owner.avatar} alt={itemDetails.owner.name} size="sm" />
            <div>
              <p class="text-sm font-medium text-foreground">{itemDetails.owner.name}</p>
              <p class="text-xs text-muted-foreground">Owner</p>
            </div>
          </div>
          <div class="flex -space-x-2 ml-auto">
            {#each itemDetails.team as member}
              <Avatar src={member.avatar} alt={member.name} size="sm" class="ring-2 ring-surface" />
            {/each}
          </div>
        </div>
      </div>
    </div>

  {:else if activeTab === 'activity'}
    <div class="space-y-4">
      {#each activities as activity (activity.id)}
        <div class="flex items-start gap-3">
          <div class="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p class="text-sm text-foreground">
              <span class="font-medium">{activity.user}</span>
              <span class="text-muted-foreground"> {activity.action}</span>
            </p>
            <p class="text-xs text-muted-foreground">{activity.time}</p>
          </div>
        </div>
      {/each}
    </div>

  {:else if activeTab === 'settings'}
    <div class="space-y-6">
      <!-- Notifications -->
      <div>
        <h4 class="text-sm font-medium text-foreground mb-4">Notifications</h4>
        <div class="space-y-4">
          <Toggle
            bind:checked={notifyOnComplete}
            label="Notify when completed"
          />
          <Toggle
            bind:checked={notifyOnComments}
            label="Notify on new comments"
          />
        </div>
      </div>

      <!-- Visibility -->
      <div>
        <h4 class="text-sm font-medium text-foreground mb-4">Visibility</h4>
        <div class="space-y-2">
          <label class="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-muted/50 transition-colors">
            <input
              type="radio"
              name="visibility"
              value="team"
              bind:group={visibility}
              class="w-5 h-5 text-primary border-border focus:ring-primary"
            />
            <div>
              <p class="text-sm text-foreground">Team only</p>
              <p class="text-xs text-muted-foreground">Only team members can view</p>
            </div>
          </label>
          <label class="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-muted/50 transition-colors">
            <input
              type="radio"
              name="visibility"
              value="public"
              bind:group={visibility}
              class="w-5 h-5 text-primary border-border focus:ring-primary"
            />
            <div>
              <p class="text-sm text-foreground">Public</p>
              <p class="text-xs text-muted-foreground">Anyone in the organization can view</p>
            </div>
          </label>
        </div>
      </div>
    </div>
  {/if}

  {#snippet footer()}
    <div class="flex gap-3 w-full">
      <Button variant="secondary" fullWidth onclick={() => showModal = false}>
        Close
      </Button>
      <Button variant="primary" fullWidth>
        Save Changes
      </Button>
    </div>
  {/snippet}
</Modal>
