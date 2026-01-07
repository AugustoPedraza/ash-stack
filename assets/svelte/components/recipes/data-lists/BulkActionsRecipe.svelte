<script>
  /**
   * Bulk Actions Recipe
   * Select all, batch delete/archive, expandable action bar at top.
   *
   * Uses: Button, Modal
   */
  import { mockSubmit } from '../../../lib/mock/mockApi.js';
  import { Button, Modal } from '../../ui';

  // Mock email data
  function generateEmails() {
    const senders = ['Alice Johnson', 'Bob Smith', 'Carol White', 'David Brown', 'Eve Davis'];
    const subjects = [
      'Q4 Report Ready for Review',
      'Team Meeting Tomorrow',
      'Project Update: Phase 2',
      'Invoice #1234',
      'Quick Question',
      'New Feature Request',
      'Weekly Summary',
      'Action Required: Approval Needed'
    ];

    return Array.from({ length: 12 }, (_, i) => ({
      id: `email-${i + 1}`,
      sender: senders[i % senders.length],
      subject: subjects[i % subjects.length],
      preview: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor...',
      date: new Date(Date.now() - i * 3600000 * 2).toISOString(),
      read: i > 3,
      starred: i === 1 || i === 4,
      archived: false
    }));
  }

  let emails = $state(generateEmails());
  // Use array instead of Set for better reactivity
  let selectedIds = $state([]);
  let loading = $state(false);
  let showDeleteConfirm = $state(false);

  // Filter to only show non-archived
  const visibleEmails = $derived(emails.filter(e => !e.archived));

  // Selection helpers - using array methods for reactivity
  const selectionCount = $derived(selectedIds.length);
  const hasSelection = $derived(selectedIds.length > 0);
  const allSelected = $derived(
    visibleEmails.length > 0 && selectedIds.length === visibleEmails.length
  );
  const someSelected = $derived(selectedIds.length > 0 && selectedIds.length < visibleEmails.length);

  function toggleSelect(id) {
    if (selectedIds.includes(id)) {
      selectedIds = selectedIds.filter(i => i !== id);
    } else {
      selectedIds = [...selectedIds, id];
    }
  }

  function toggleSelectAll() {
    if (allSelected) {
      selectedIds = [];
    } else {
      selectedIds = visibleEmails.map(e => e.id);
    }
  }

  function clearSelection() {
    selectedIds = [];
  }

  async function markAsRead() {
    loading = true;
    await mockSubmit(() => ({ success: true }));
    emails = emails.map(e =>
      selectedIds.includes(e.id) ? { ...e, read: true } : e
    );
    loading = false;
    clearSelection();
  }

  async function markAsUnread() {
    loading = true;
    await mockSubmit(() => ({ success: true }));
    emails = emails.map(e =>
      selectedIds.includes(e.id) ? { ...e, read: false } : e
    );
    loading = false;
    clearSelection();
  }

  async function archiveSelected() {
    loading = true;
    await mockSubmit(() => ({ success: true }));
    emails = emails.map(e =>
      selectedIds.includes(e.id) ? { ...e, archived: true } : e
    );
    loading = false;
    clearSelection();
  }

  async function deleteSelected() {
    loading = true;
    await mockSubmit(() => ({ success: true }));
    emails = emails.filter(e => !selectedIds.includes(e.id));
    loading = false;
    clearSelection();
    showDeleteConfirm = false;
  }

  function toggleStar(id, e) {
    e.stopPropagation();
    emails = emails.map(em =>
      em.id === id ? { ...em, starred: !em.starred } : em
    );
  }

  function resetDemo() {
    emails = generateEmails();
    selectedIds = [];
  }

  function formatDate(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const diffHours = Math.floor((now - date) / 3600000);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
</script>

<div class="h-full bg-background flex flex-col overflow-hidden">
  <!-- Header -->
  <div class="shrink-0 bg-background border-b border-border">
    <div class="flex items-center justify-between px-5 py-4">
      <div class="flex items-center gap-3">
        <!-- Select All Checkbox -->
        <button
          type="button"
          role="checkbox"
          aria-checked={allSelected ? 'true' : someSelected ? 'mixed' : 'false'}
          class="w-5 h-5 shrink-0 rounded border-2 flex items-center justify-center transition-colors cursor-pointer
            {allSelected ? 'bg-primary border-primary' : someSelected ? 'bg-primary border-primary' : 'bg-background border-border hover:border-primary'}"
          onclick={toggleSelectAll}
        >
          {#if allSelected}
            <svg class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          {:else if someSelected}
            <svg class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
              <path stroke-linecap="round" stroke-linejoin="round" d="M20 12H4" />
            </svg>
          {/if}
        </button>
        <div>
          <h1 class="text-xl font-semibold text-foreground">Inbox</h1>
          <p class="text-sm text-muted-foreground">{visibleEmails.length} messages</p>
        </div>
      </div>
      <Button variant="ghost" size="sm" onclick={resetDemo}>
        Reset
      </Button>
    </div>

    <!-- Expandable Action Bar - appears when items selected -->
    {#if hasSelection}
      <div class="px-5 py-3 bg-primary/5 border-t border-primary/20 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="text-sm font-medium text-primary">
            {selectionCount} selected
          </span>
          <Button variant="ghost" size="sm" onclick={clearSelection}>
            Clear
          </Button>
        </div>

        <!-- Contextual actions - all secondary/ghost, only delete has color -->
        <div class="flex items-center gap-1">
          <button
            type="button"
            class="flex items-center gap-1 px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            onclick={markAsRead}
            disabled={loading}
            title="Mark as read"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
            </svg>
            <span class="hidden sm:inline">Read</span>
          </button>

          <button
            type="button"
            class="flex items-center gap-1 px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            onclick={markAsUnread}
            disabled={loading}
            title="Mark as unread"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span class="hidden sm:inline">Unread</span>
          </button>

          <button
            type="button"
            class="flex items-center gap-1 px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            onclick={archiveSelected}
            disabled={loading}
            title="Archive"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            <span class="hidden sm:inline">Archive</span>
          </button>

          <div class="w-px h-5 bg-border mx-1"></div>

          <button
            type="button"
            class="flex items-center gap-1 px-2 py-1.5 text-sm text-destructive hover:bg-destructive/10 rounded transition-colors disabled:opacity-50"
            onclick={() => showDeleteConfirm = true}
            disabled={loading}
            title="Delete"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span class="hidden sm:inline">Delete</span>
          </button>
        </div>
      </div>
    {/if}
  </div>

  <!-- Email List -->
  <div class="flex-1 min-h-0 overflow-y-auto">
    {#if visibleEmails.length === 0}
      <div class="flex flex-col items-center justify-center py-12 text-center px-5">
        <div class="w-16 h-16 rounded-full bg-success/15 text-success flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-foreground mb-2">All done!</h3>
        <p class="text-muted-foreground mb-4">Your inbox is empty.</p>
        <Button variant="ghost" size="sm" onclick={resetDemo}>
          Reset Demo
        </Button>
      </div>
    {:else}
      <div class="divide-y divide-border">
        {#each visibleEmails as email}
          <div
            class="w-full flex items-start gap-3 px-5 py-4 text-left transition-colors cursor-pointer
              {selectedIds.includes(email.id) ? 'bg-primary/5' : 'hover:bg-muted'}
              {!email.read ? 'bg-muted/50' : ''}"
            onclick={() => toggleSelect(email.id)}
            onkeydown={(e) => e.key === 'Enter' && toggleSelect(email.id)}
            role="button"
            tabindex="0"
          >
            <button
              type="button"
              role="checkbox"
              aria-checked={selectedIds.includes(email.id)}
              class="w-5 h-5 mt-1 shrink-0 rounded border-2 flex items-center justify-center transition-colors cursor-pointer
                {selectedIds.includes(email.id) ? 'bg-primary border-primary' : 'bg-background border-border hover:border-primary'}"
              onclick={(e) => { e.stopPropagation(); toggleSelect(email.id); }}
            >
              {#if selectedIds.includes(email.id)}
                <svg class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              {/if}
            </button>

            <button
              type="button"
              class="mt-1 {email.starred ? 'text-warning' : 'text-text-disabled hover:text-warning'}"
              onclick={(e) => toggleStar(email.id, e)}
              aria-label={email.starred ? 'Unstar' : 'Star'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>

            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-1">
                <span class="font-medium text-foreground {!email.read ? 'font-semibold' : ''}">
                  {email.sender}
                </span>
                <span class="text-xs text-muted-foreground">{formatDate(email.date)}</span>
              </div>
              <p class="text-sm {!email.read ? 'text-foreground font-medium' : 'text-muted-foreground'} mb-1 truncate">
                {email.subject}
              </p>
              <p class="text-sm text-muted-foreground truncate">{email.preview}</p>
            </div>

            {#if !email.read}
              <div class="w-2 h-2 rounded-full bg-primary mt-2"></div>
            {/if}
          </div>
        {/each}
      </div>
    {/if}
  </div>

  <!-- Delete Confirmation Modal -->
  <Modal
    bind:open={showDeleteConfirm}
    title="Delete {selectionCount} messages?"
    size="sm"
  >
    <p class="text-muted-foreground mb-6">
      This action cannot be undone. These messages will be permanently deleted.
    </p>
    {#snippet footer()}
      <div class="flex justify-end gap-3">
        <Button
          variant="ghost"
          onclick={() => showDeleteConfirm = false}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          variant="danger"
          onclick={deleteSelected}
          disabled={loading}
          {loading}
        >
          {loading ? 'Deleting...' : 'Delete'}
        </Button>
      </div>
    {/snippet}
  </Modal>
</div>
