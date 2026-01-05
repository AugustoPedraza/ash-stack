<!--
  MessageThread Component
  Groups messages into a thread with date separators, reply counts, and actions.
  Container for ChatMessage components.
-->
<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  /** @type {string | null} - Thread title (if threaded/topic discussion) */
  export let title = null;

  /** @type {Date | string | null} - Thread start date */
  export let date = null;

  /** @type {number} - Total reply count in thread */
  export let replyCount = 0;

  /** @type {number} - Unread count */
  export let unreadCount = 0;

  /** @type {boolean} - Is this thread collapsed */
  export let collapsed = false;

  /** @type {boolean} - Show date separator */
  export let showDate = true;

  /** @type {boolean} - Enable collapsible behavior */
  export let collapsible = false;

  /** @type {boolean} - Show thread actions (reply, etc.) */
  export let showActions = true;

  /** @type {boolean} - Is thread loading more messages */
  export let loading = false;

  /** @type {boolean} - Has more messages to load */
  export let hasMore = false;

  // Format date for separator
  function formatDateSeparator(date) {
    if (!date) return null;
    const d = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const msgDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());

    if (msgDate.getTime() === today.getTime()) return 'Today';
    if (msgDate.getTime() === yesterday.getTime()) return 'Yesterday';

    // Check if same year
    if (d.getFullYear() === now.getFullYear()) {
      return d.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
    }

    return d.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  }

  function toggleCollapse() {
    if (!collapsible) return;
    dispatch('toggle', { collapsed: !collapsed });
  }

  function handleReply() {
    dispatch('reply');
  }

  function handleLoadMore() {
    if (!loading && hasMore) {
      dispatch('loadmore');
    }
  }

  $: formattedDate = formatDateSeparator(date);
</script>

<div class="message-thread" class:collapsed class:has-title={!!title}>
  <!-- Date separator -->
  {#if showDate && formattedDate}
    <div class="date-separator">
      <span class="date-line"></span>
      <span class="date-text">{formattedDate}</span>
      <span class="date-line"></span>
    </div>
  {/if}

  <!-- Thread header (for topic threads) -->
  {#if title}
    <div class="thread-header">
      <button
        class="thread-title-row"
        on:click={toggleCollapse}
        disabled={!collapsible}
        aria-expanded={!collapsed}
      >
        {#if collapsible}
          <span class="collapse-icon" class:collapsed>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
        {/if}
        <h3 class="thread-title">{title}</h3>
        {#if replyCount > 0}
          <span class="reply-count">{replyCount} {replyCount === 1 ? 'reply' : 'replies'}</span>
        {/if}
        {#if unreadCount > 0}
          <span class="unread-badge">{unreadCount}</span>
        {/if}
      </button>
    </div>
  {/if}

  <!-- Load more button (at top for infinite scroll up) -->
  {#if hasMore && !collapsed}
    <button class="load-more" on:click={handleLoadMore} disabled={loading}>
      {#if loading}
        <span class="loading-spinner"></span>
        <span>Loading...</span>
      {:else}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="18 15 12 9 6 15" />
        </svg>
        <span>Load earlier messages</span>
      {/if}
    </button>
  {/if}

  <!-- Messages container -->
  {#if !collapsed}
    <div class="thread-messages">
      <slot />
    </div>
  {/if}

  <!-- Thread footer with actions -->
  {#if showActions && !collapsed}
    <div class="thread-footer">
      <button class="action-btn reply-btn" on:click={handleReply}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 17 4 12 9 7" />
          <path d="M20 18v-2a4 4 0 0 0-4-4H4" />
        </svg>
        <span>Reply</span>
      </button>

      <slot name="actions" />
    </div>
  {/if}
</div>

<style>
  .message-thread {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .message-thread.has-title {
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: var(--space-4);
  }

  /* Date separator */
  .date-separator {
    display: flex;
    align-items: center;
    gap: var(--space-4);
    padding: var(--space-4) 0;
  }

  .date-line {
    flex: 1;
    height: 1px;
    background-color: var(--color-border);
  }

  .date-text {
    font-size: var(--text-xs);
    font-weight: var(--font-medium);
    color: var(--color-text-muted);
    white-space: nowrap;
  }

  /* Thread header */
  .thread-header {
    margin-bottom: var(--space-2);
  }

  .thread-title-row {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    width: 100%;
    padding: 0;
    background: none;
    border: none;
    text-align: left;
    cursor: pointer;
  }

  .thread-title-row:disabled {
    cursor: default;
  }

  .collapse-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text-muted);
    transition: transform var(--duration-fast) var(--ease-primary);
  }

  .collapse-icon.collapsed {
    transform: rotate(-90deg);
  }

  .thread-title {
    margin: 0;
    font-size: var(--text-base);
    font-weight: var(--font-semibold);
    color: var(--color-text);
  }

  .reply-count {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
  }

  .unread-badge {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 18px;
    height: 18px;
    padding: 0 var(--space-1);
    background-color: var(--color-primary);
    border-radius: var(--radius-full);
    font-size: var(--text-xs);
    font-weight: var(--font-semibold);
    color: var(--color-on-primary);
  }

  /* Load more */
  .load-more {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    padding: var(--space-2);
    background-color: var(--color-surface-sunken);
    border: none;
    border-radius: var(--radius-md);
    font-size: var(--text-xs);
    color: var(--color-text-muted);
    cursor: pointer;
    transition: all var(--duration-fast) var(--ease-primary);
  }

  .load-more:hover:not(:disabled) {
    background-color: var(--color-surface);
    color: var(--color-text);
  }

  .load-more:disabled {
    cursor: wait;
  }

  .loading-spinner {
    width: 14px;
    height: 14px;
    border: 2px solid var(--color-border);
    border-top-color: var(--color-primary);
    border-radius: var(--radius-full);
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* Messages container */
  .thread-messages {
    display: flex;
    flex-direction: column;
  }

  /* Thread footer */
  .thread-footer {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding-top: var(--space-2);
    border-top: 1px solid var(--color-border);
  }

  .action-btn {
    display: flex;
    align-items: center;
    gap: var(--space-1);
    padding: var(--space-1) var(--space-2);
    background: none;
    border: none;
    border-radius: var(--radius-md);
    font-size: var(--text-xs);
    color: var(--color-text-muted);
    cursor: pointer;
    transition: all var(--duration-fast) var(--ease-primary);
  }

  .action-btn:hover {
    background-color: var(--color-surface-sunken);
    color: var(--color-text);
  }

  .reply-btn:hover {
    color: var(--color-primary);
  }

  /* Collapsed state */
  .collapsed .thread-messages,
  .collapsed .thread-footer,
  .collapsed .load-more {
    display: none;
  }
</style>
