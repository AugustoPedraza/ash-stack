<script>
  /**
   * Read/Unread Recipe
   * Visual states for read/unread items with batch operations.
   *
   * Uses: Button
   */
  import { Button } from '../../ui';

  // Mock email-like items
  let items = $state([
    {
      id: 1,
      sender: 'Sarah Chen',
      avatar: 'https://i.pravatar.cc/40?img=1',
      subject: 'Project kickoff meeting',
      preview: 'Hi team, I wanted to schedule our project kickoff meeting for next week...',
      time: new Date(Date.now() - 300000),
      read: false,
      starred: true,
      selected: false
    },
    {
      id: 2,
      sender: 'Mike Johnson',
      avatar: 'https://i.pravatar.cc/40?img=2',
      subject: 'Design review feedback',
      preview: 'I reviewed the latest mockups and have some suggestions for the navigation...',
      time: new Date(Date.now() - 3600000),
      read: false,
      starred: false,
      selected: false
    },
    {
      id: 3,
      sender: 'Emma Wilson',
      avatar: 'https://i.pravatar.cc/40?img=3',
      subject: 'Weekly report submitted',
      preview: 'Here is my weekly progress report for the dashboard feature...',
      time: new Date(Date.now() - 7200000),
      read: true,
      starred: false,
      selected: false
    },
    {
      id: 4,
      sender: 'Alex Kim',
      avatar: 'https://i.pravatar.cc/40?img=4',
      subject: 'Code review requested',
      preview: 'Can you review my PR for the authentication module? Link: ...',
      time: new Date(Date.now() - 14400000),
      read: true,
      starred: true,
      selected: false
    },
    {
      id: 5,
      sender: 'Lisa Park',
      avatar: 'https://i.pravatar.cc/40?img=5',
      subject: 'Deployment successful',
      preview: 'The latest release has been deployed to staging. Please verify...',
      time: new Date(Date.now() - 28800000),
      read: true,
      starred: false,
      selected: false
    },
    {
      id: 6,
      sender: 'Tom Brown',
      avatar: 'https://i.pravatar.cc/40?img=6',
      subject: 'Quick question about API',
      preview: 'Hey, I was wondering about the rate limiting on the API endpoints...',
      time: new Date(Date.now() - 86400000),
      read: false,
      starred: false,
      selected: false
    }
  ]);

  let selectMode = $state(false);

  const selectedItems = $derived(items.filter(i => i.selected));
  const selectedCount = $derived(selectedItems.length);
  const unreadCount = $derived(items.filter(i => !i.read).length);
  const allSelected = $derived(items.length > 0 && items.every(i => i.selected));

  function formatTime(date) {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const mins = Math.floor(diff / 60000);

    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h`;

    if (date.toDateString() === new Date(now - 86400000).toDateString()) {
      return 'Yesterday';
    }

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  function toggleItem(id) {
    if (selectMode) {
      items = items.map(i => i.id === id ? { ...i, selected: !i.selected } : i);
    } else {
      items = items.map(i => i.id === id ? { ...i, read: true } : i);
    }
  }

  function toggleSelectAll() {
    const newSelected = !allSelected;
    items = items.map(i => ({ ...i, selected: newSelected }));
  }

  function toggleStar(id, e) {
    e.stopPropagation();
    items = items.map(i => i.id === id ? { ...i, starred: !i.starred } : i);
  }

  function markSelectedAsRead() {
    items = items.map(i => i.selected ? { ...i, read: true, selected: false } : i);
    selectMode = false;
  }

  function markSelectedAsUnread() {
    items = items.map(i => i.selected ? { ...i, read: false, selected: false } : i);
    selectMode = false;
  }

  function deleteSelected() {
    items = items.filter(i => !i.selected);
    selectMode = false;
  }

  function cancelSelection() {
    items = items.map(i => ({ ...i, selected: false }));
    selectMode = false;
  }
</script>

<div class="h-full bg-surface flex flex-col overflow-hidden">
  <!-- Header -->
  <div class="shrink-0 px-5 py-4 border-b border-border">
    {#if selectMode}
      <!-- Selection Mode Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <button
            type="button"
            class="p-1.5 rounded-lg hover:bg-surface-sunken transition-colors"
            onclick={cancelSelection}
            aria-label="Cancel selection"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-text" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <span class="text-sm font-medium text-text">{selectedCount} selected</span>
        </div>
        <div class="flex items-center gap-1">
          <button
            type="button"
            class="p-2 rounded-lg hover:bg-surface-sunken transition-colors"
            onclick={markSelectedAsRead}
            disabled={selectedCount === 0}
            aria-label="Mark as read"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
            </svg>
          </button>
          <button
            type="button"
            class="p-2 rounded-lg hover:bg-surface-sunken transition-colors"
            onclick={markSelectedAsUnread}
            disabled={selectedCount === 0}
            aria-label="Mark as unread"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </button>
          <button
            type="button"
            class="p-2 rounded-lg hover:bg-error/10 text-error transition-colors"
            onclick={deleteSelected}
            disabled={selectedCount === 0}
            aria-label="Delete selected"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    {:else}
      <!-- Normal Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <h1 class="text-lg font-semibold text-text">Inbox</h1>
          {#if unreadCount > 0}
            <span class="px-2 py-0.5 text-xs font-medium text-white bg-primary rounded-full">
              {unreadCount}
            </span>
          {/if}
        </div>
        <button
          type="button"
          class="px-3 py-1.5 text-sm font-medium text-text-secondary hover:text-text bg-surface-sunken rounded-lg transition-colors"
          onclick={() => selectMode = true}
        >
          Select
        </button>
      </div>
    {/if}
  </div>

  <!-- Select All Bar -->
  {#if selectMode}
    <div class="shrink-0 px-5 py-2 border-b border-border bg-surface-sunken/30">
      <button
        type="button"
        class="flex items-center gap-2 text-sm text-text-secondary hover:text-text"
        onclick={toggleSelectAll}
      >
        <div class="w-5 h-5 rounded border-2 flex items-center justify-center transition-colors
          {allSelected ? 'border-primary bg-primary' : 'border-border-strong'}">
          {#if allSelected}
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          {/if}
        </div>
        <span>{allSelected ? 'Deselect all' : 'Select all'}</span>
      </button>
    </div>
  {/if}

  <!-- Message List -->
  <div class="flex-1 overflow-y-auto divide-y divide-border">
    {#each items as item (item.id)}
      <div
        class="w-full flex items-start gap-3 px-5 py-4 hover:bg-surface-sunken/50 transition-colors cursor-pointer
          {!item.read ? 'bg-primary/5' : ''}"
        role="button"
        tabindex="0"
        onclick={() => toggleItem(item.id)}
        onkeydown={(e) => e.key === 'Enter' && toggleItem(item.id)}
      >
        <!-- Checkbox or Avatar -->
        {#if selectMode}
          <div class="shrink-0 mt-1">
            <div class="w-5 h-5 rounded border-2 flex items-center justify-center transition-colors
              {item.selected ? 'border-primary bg-primary' : 'border-border-strong'}">
              {#if item.selected}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              {/if}
            </div>
          </div>
        {:else}
          <div class="relative shrink-0">
            <img src={item.avatar} alt={item.sender} class="w-10 h-10 rounded-full bg-surface-sunken" />
            {#if !item.read}
              <div class="absolute -top-0.5 -right-0.5 w-3 h-3 bg-primary rounded-full ring-2 ring-surface"></div>
            {/if}
          </div>
        {/if}

        <!-- Content -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-0.5">
            <span class="text-sm truncate {!item.read ? 'font-semibold text-text' : 'font-medium text-text-secondary'}">
              {item.sender}
            </span>
            <span class="text-xs text-text-disabled shrink-0">{formatTime(item.time)}</span>
          </div>
          <p class="text-sm truncate {!item.read ? 'font-medium text-text' : 'text-text-secondary'}">
            {item.subject}
          </p>
          <p class="text-xs text-text-muted truncate mt-0.5">{item.preview}</p>
        </div>

        <!-- Star -->
        {#if !selectMode}
          <button
            type="button"
            class="shrink-0 p-1 -mr-1 rounded transition-colors"
            onclick={(e) => toggleStar(item.id, e)}
            aria-label={item.starred ? 'Unstar' : 'Star'}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 transition-colors {item.starred ? 'text-warning fill-warning' : 'text-text-disabled hover:text-text-muted'}"
              fill={item.starred ? 'currentColor' : 'none'}
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </button>
        {/if}
      </div>
    {/each}
  </div>

  <!-- Legend / Mobile UX Note -->
  <div class="shrink-0 px-5 py-3 border-t border-border bg-surface-sunken/30">
    <div class="flex items-center justify-between text-xs text-text-muted">
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-1.5">
          <div class="w-2 h-2 bg-primary rounded-full"></div>
          <span>Unread</span>
        </div>
        <div class="flex items-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-warning fill-warning" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
          <span>Starred</span>
        </div>
      </div>
      <span>Tap item to read • Long press to select</span>
    </div>
  </div>
</div>
