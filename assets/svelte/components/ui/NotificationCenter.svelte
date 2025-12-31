<!--
  NotificationCenter Component
  Notification bell with dropdown panel showing notifications.
-->
<script>
  import { createEventDispatcher } from 'svelte';
  import { fade, fly } from 'svelte/transition';

  const dispatch = createEventDispatcher();

  /**
   * Notifications list
   * @type {Array<{
   *   id: string | number,
   *   title: string,
   *   message?: string,
   *   type?: 'info' | 'success' | 'warning' | 'error',
   *   read?: boolean,
   *   timestamp?: Date | string,
   *   href?: string,
   *   avatar?: string,
   *   icon?: string
   * }>}
   */
  export let notifications = [];

  /**
   * Whether panel is open
   * @type {boolean}
   */
  export let open = false;

  /**
   * Panel position
   * @type {'left' | 'right'}
   */
  export let position = 'right';

  /**
   * Show unread count badge
   * @type {boolean}
   */
  export let showBadge = true;

  /**
   * Maximum notifications to show before "View all"
   * @type {number}
   */
  export let maxVisible = 5;

  /**
   * Empty state message
   * @type {string}
   */
  export let emptyMessage = 'No notifications';

  /**
   * Loading state
   * @type {boolean}
   */
  export let loading = false;

  let panelEl;

  $: unreadCount = notifications.filter(n => !n.read).length;
  $: visibleNotifications = notifications.slice(0, maxVisible);
  $: hasMore = notifications.length > maxVisible;

  function toggle() {
    open = !open;
    if (open) {
      dispatch('open');
    }
  }

  function close() {
    open = false;
  }

  function handleClickOutside(e) {
    if (panelEl && !panelEl.contains(e.target)) {
      close();
    }
  }

  function handleKeydown(e) {
    if (e.key === 'Escape') {
      close();
    }
  }

  function handleNotificationClick(notification) {
    if (!notification.read) {
      dispatch('read', { notification });
    }
    dispatch('click', { notification });
    close();
  }

  function markAllAsRead() {
    dispatch('markAllRead');
  }

  function formatTime(timestamp) {
    if (!timestamp) return '';

    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }

  function getTypeIcon(type) {
    switch (type) {
      case 'success':
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
      case 'warning':
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
      case 'error':
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;
      default:
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
    }
  }
</script>

<svelte:window on:click={handleClickOutside} on:keydown={handleKeydown} />

<div class="notification-center" bind:this={panelEl}>
  <!-- Trigger button -->
  <button
    type="button"
    class="trigger-button"
    on:click={toggle}
    aria-label="Notifications"
    aria-expanded={open}
    aria-haspopup="true"
  >
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>

    {#if showBadge && unreadCount > 0}
      <span class="badge" transition:fade={{ duration: 150 }}>
        {unreadCount > 99 ? '99+' : unreadCount}
      </span>
    {/if}
  </button>

  <!-- Dropdown panel -->
  {#if open}
    <div
      class="panel position-{position}"
      transition:fly={{ y: -10, duration: 150 }}
      role="menu"
    >
      <!-- Header -->
      <div class="panel-header">
        <h3 class="panel-title">Notifications</h3>
        {#if unreadCount > 0}
          <button
            type="button"
            class="mark-read-btn"
            on:click={markAllAsRead}
          >
            Mark all read
          </button>
        {/if}
      </div>

      <!-- Content -->
      <div class="panel-content">
        {#if loading}
          <div class="loading-state">
            <span class="spinner" />
            <span>Loading...</span>
          </div>
        {:else if notifications.length === 0}
          <div class="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <span>{emptyMessage}</span>
          </div>
        {:else}
          <ul class="notification-list">
            {#each visibleNotifications as notification (notification.id)}
              <li>
                <button
                  type="button"
                  class="notification-item"
                  class:unread={!notification.read}
                  on:click={() => handleNotificationClick(notification)}
                >
                  <!-- Icon/Avatar -->
                  <div class="notification-icon type-{notification.type || 'info'}">
                    {#if notification.avatar}
                      <img src={notification.avatar} alt="" />
                    {:else if notification.icon}
                      {@html notification.icon}
                    {:else}
                      {@html getTypeIcon(notification.type)}
                    {/if}
                  </div>

                  <!-- Content -->
                  <div class="notification-content">
                    <span class="notification-title">{notification.title}</span>
                    {#if notification.message}
                      <span class="notification-message">{notification.message}</span>
                    {/if}
                    {#if notification.timestamp}
                      <span class="notification-time">{formatTime(notification.timestamp)}</span>
                    {/if}
                  </div>

                  <!-- Unread indicator -->
                  {#if !notification.read}
                    <span class="unread-dot" />
                  {/if}
                </button>
              </li>
            {/each}
          </ul>
        {/if}
      </div>

      <!-- Footer -->
      {#if hasMore || notifications.length > 0}
        <div class="panel-footer">
          <button
            type="button"
            class="view-all-btn"
            on:click={() => { dispatch('viewAll'); close(); }}
          >
            View all notifications
          </button>
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .notification-center {
    position: relative;
  }

  /* Trigger button */
  .trigger-button {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    padding: 0;
    background: none;
    border: none;
    border-radius: var(--radius-md);
    color: var(--color-text-muted);
    cursor: pointer;
    transition: color 150ms ease, background-color 150ms ease;
  }

  .trigger-button:hover {
    color: var(--color-text);
    background-color: var(--color-surface-raised);
  }

  .trigger-button:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px var(--color-border-focus);
  }

  .trigger-button svg {
    width: 1.25rem;
    height: 1.25rem;
  }

  .badge {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 1.125rem;
    height: 1.125rem;
    padding: 0 var(--spacing-1);
    font-size: 0.625rem;
    font-weight: 600;
    color: var(--color-on-primary);
    background-color: var(--color-error);
    border-radius: var(--radius-full);
    transform: translate(25%, -25%);
  }

  /* Panel */
  .panel {
    position: absolute;
    top: 100%;
    z-index: var(--z-dropdown);
    width: 22rem;
    max-width: calc(100vw - var(--spacing-4));
    margin-top: var(--spacing-2);
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-xl);
    overflow: hidden;
  }

  .panel.position-right {
    right: 0;
  }

  .panel.position-left {
    left: 0;
  }

  .panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-3) var(--spacing-4);
    border-bottom: 1px solid var(--color-border);
  }

  .panel-title {
    margin: 0;
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--color-text);
  }

  .mark-read-btn {
    padding: 0;
    font-size: 0.8125rem;
    color: var(--color-primary);
    background: none;
    border: none;
    cursor: pointer;
  }

  .mark-read-btn:hover {
    text-decoration: underline;
  }

  .panel-content {
    max-height: 24rem;
    overflow-y: auto;
  }

  .panel-footer {
    padding: var(--spacing-3) var(--spacing-4);
    border-top: 1px solid var(--color-border);
  }

  .view-all-btn {
    width: 100%;
    padding: var(--spacing-2);
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-primary);
    background: none;
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: background-color 150ms ease;
  }

  .view-all-btn:hover {
    background-color: color-mix(in srgb, var(--color-primary) 10%, transparent);
  }

  /* States */
  .loading-state,
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-3);
    padding: var(--spacing-8);
    color: var(--color-text-muted);
    text-align: center;
  }

  .empty-state svg {
    width: 2.5rem;
    height: 2.5rem;
    opacity: 0.5;
  }

  .spinner {
    width: 1.5rem;
    height: 1.5rem;
    border: 2px solid var(--color-border);
    border-top-color: var(--color-primary);
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* Notification list */
  .notification-list {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .notification-item {
    display: flex;
    align-items: flex-start;
    gap: var(--spacing-3);
    width: 100%;
    padding: var(--spacing-3) var(--spacing-4);
    text-align: left;
    background: none;
    border: none;
    cursor: pointer;
    transition: background-color 150ms ease;
  }

  .notification-item:hover {
    background-color: var(--color-surface-raised);
  }

  .notification-item.unread {
    background-color: color-mix(in srgb, var(--color-primary) 5%, var(--color-surface));
  }

  .notification-item.unread:hover {
    background-color: color-mix(in srgb, var(--color-primary) 10%, var(--color-surface));
  }

  .notification-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    flex-shrink: 0;
    border-radius: var(--radius-full);
    overflow: hidden;
  }

  .notification-icon img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .notification-icon :global(svg) {
    width: 1rem;
    height: 1rem;
  }

  .notification-icon.type-info {
    background-color: var(--color-info-soft);
    color: var(--color-info);
  }

  .notification-icon.type-success {
    background-color: var(--color-success-soft);
    color: var(--color-success);
  }

  .notification-icon.type-warning {
    background-color: var(--color-warning-soft);
    color: var(--color-warning);
  }

  .notification-icon.type-error {
    background-color: var(--color-error-soft);
    color: var(--color-error);
  }

  .notification-content {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-1);
  }

  .notification-title {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text);
  }

  .notification-message {
    font-size: 0.8125rem;
    color: var(--color-text-muted);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .notification-time {
    font-size: 0.75rem;
    color: var(--color-text-disabled);
  }

  .unread-dot {
    width: 0.5rem;
    height: 0.5rem;
    flex-shrink: 0;
    margin-top: var(--spacing-1);
    background-color: var(--color-primary);
    border-radius: var(--radius-full);
  }
</style>
