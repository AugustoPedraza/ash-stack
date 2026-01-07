<script>
  /**
   * Notification Center Recipe
   * Grouped notifications with mark as read, clear all, and filtering.
   *
   * Uses: Button
   */
  import { Button } from '../../ui';

  // Notification types
  const notificationTypes = {
    message: { icon: 'chat', color: 'bg-primary text-white' },
    mention: { icon: 'at', color: 'bg-info text-white' },
    like: { icon: 'heart', color: 'bg-error text-white' },
    comment: { icon: 'comment', color: 'bg-success text-white' },
    follow: { icon: 'user-plus', color: 'bg-warning text-white' },
    system: { icon: 'info', color: 'bg-text text-surface' }
  };

  // Mock notifications grouped by date
  let notifications = $state([
    {
      id: 1,
      type: 'message',
      title: 'New message from Sarah',
      description: 'Hey, are you free for a call?',
      avatar: 'https://i.pravatar.cc/40?img=1',
      time: new Date(Date.now() - 300000),
      read: false
    },
    {
      id: 2,
      type: 'mention',
      title: 'Mike mentioned you',
      description: 'in Project Updates channel',
      avatar: 'https://i.pravatar.cc/40?img=2',
      time: new Date(Date.now() - 900000),
      read: false
    },
    {
      id: 3,
      type: 'like',
      title: 'Emma liked your post',
      description: 'Design system announcement',
      avatar: 'https://i.pravatar.cc/40?img=3',
      time: new Date(Date.now() - 3600000),
      read: false
    },
    {
      id: 4,
      type: 'comment',
      title: 'New comment on your post',
      description: 'Alex: "Great work on this!"',
      avatar: 'https://i.pravatar.cc/40?img=4',
      time: new Date(Date.now() - 7200000),
      read: true
    },
    {
      id: 5,
      type: 'follow',
      title: 'Lisa started following you',
      description: 'Product Manager at Acme',
      avatar: 'https://i.pravatar.cc/40?img=5',
      time: new Date(Date.now() - 86400000),
      read: true
    },
    {
      id: 6,
      type: 'system',
      title: 'System maintenance',
      description: 'Scheduled for tonight 2-4 AM',
      avatar: null,
      time: new Date(Date.now() - 172800000),
      read: true
    }
  ]);

  let filter = $state('all');

  const filteredNotifications = $derived(
    filter === 'all'
      ? notifications
      : filter === 'unread'
        ? notifications.filter(n => !n.read)
        : notifications.filter(n => n.read)
  );

  const unreadCount = $derived(notifications.filter(n => !n.read).length);

  const todayNotifications = $derived(
    filteredNotifications.filter(n => isToday(n.time))
  );

  const earlierNotifications = $derived(
    filteredNotifications.filter(n => !isToday(n.time))
  );

  function isToday(date) {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  function formatTime(date) {
    const mins = Math.floor((Date.now() - date.getTime()) / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return 'Yesterday';
    return `${days}d ago`;
  }

  function markAsRead(id) {
    notifications = notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    );
  }

  function markAllAsRead() {
    notifications = notifications.map(n => ({ ...n, read: true }));
  }

  function clearAll() {
    notifications = [];
  }

  function deleteNotification(id) {
    notifications = notifications.filter(n => n.id !== id);
  }

  function getTypeIcon(type) {
    const icons = {
      message: '<path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />',
      mention: '<path stroke-linecap="round" stroke-linejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />',
      like: '<path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />',
      comment: '<path stroke-linecap="round" stroke-linejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />',
      follow: '<path stroke-linecap="round" stroke-linejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />',
      system: '<path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />'
    };
    return icons[type] || icons.system;
  }
</script>

<div class="h-full bg-surface flex flex-col overflow-hidden">
  <!-- Header -->
  <div class="shrink-0 px-5 py-4 border-b border-border">
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-2">
        <h1 class="text-lg font-semibold text-text">Notifications</h1>
        {#if unreadCount > 0}
          <span class="px-2 py-0.5 text-xs font-medium text-white bg-primary rounded-full">
            {unreadCount}
          </span>
        {/if}
      </div>
      <div class="flex items-center gap-2">
        {#if unreadCount > 0}
          <button
            type="button"
            class="text-sm text-primary hover:text-primary/80 transition-colors"
            onclick={markAllAsRead}
          >
            Mark all read
          </button>
        {/if}
        {#if notifications.length > 0}
          <button
            type="button"
            class="p-1.5 rounded-lg hover:bg-surface-sunken transition-colors"
            onclick={clearAll}
            aria-label="Clear all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        {/if}
      </div>
    </div>

    <!-- Filter Tabs -->
    <div class="flex gap-1 p-1 bg-surface-sunken rounded-lg">
      <button
        type="button"
        class="flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors
          {filter === 'all' ? 'bg-surface text-text shadow-sm' : 'text-text-muted hover:text-text'}"
        onclick={() => filter = 'all'}
      >
        All
      </button>
      <button
        type="button"
        class="flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors
          {filter === 'unread' ? 'bg-surface text-text shadow-sm' : 'text-text-muted hover:text-text'}"
        onclick={() => filter = 'unread'}
      >
        Unread ({unreadCount})
      </button>
      <button
        type="button"
        class="flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors
          {filter === 'read' ? 'bg-surface text-text shadow-sm' : 'text-text-muted hover:text-text'}"
        onclick={() => filter = 'read'}
      >
        Read
      </button>
    </div>
  </div>

  <!-- Notification List -->
  <div class="flex-1 overflow-y-auto">
    {#if filteredNotifications.length === 0}
      <div class="flex flex-col items-center justify-center h-full text-center px-6">
        <div class="w-16 h-16 rounded-full bg-surface-sunken flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-text-disabled" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
        <p class="text-text font-medium mb-1">No notifications</p>
        <p class="text-sm text-text-muted">You're all caught up!</p>
      </div>
    {:else}
      <!-- Today -->
      {#if todayNotifications.length > 0}
        <div class="px-5 py-3">
          <h2 class="text-xs font-medium text-text-muted uppercase tracking-wider">Today</h2>
        </div>
        <div class="divide-y divide-border">
          {#each todayNotifications as notification (notification.id)}
            <button
              type="button"
              class="w-full flex items-start gap-3 px-5 py-3 hover:bg-surface-sunken/50 transition-colors text-left
                {!notification.read ? 'bg-primary/5' : ''}"
              onclick={() => markAsRead(notification.id)}
            >
              <div class="relative shrink-0">
                {#if notification.avatar}
                  <img src={notification.avatar} alt="" class="w-10 h-10 rounded-full bg-surface-sunken" />
                {:else}
                  <div class="w-10 h-10 rounded-full bg-surface-sunken flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      {@html getTypeIcon(notification.type)}
                    </svg>
                  </div>
                {/if}
                <div class="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full {notificationTypes[notification.type].color} flex items-center justify-center ring-2 ring-surface">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    {@html getTypeIcon(notification.type)}
                  </svg>
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-text truncate">{notification.title}</p>
                <p class="text-xs text-text-muted truncate">{notification.description}</p>
                <p class="text-xs text-text-disabled mt-0.5">{formatTime(notification.time)}</p>
              </div>
              {#if !notification.read}
                <div class="shrink-0 w-2 h-2 bg-primary rounded-full mt-2"></div>
              {/if}
            </button>
          {/each}
        </div>
      {/if}

      <!-- Earlier -->
      {#if earlierNotifications.length > 0}
        <div class="px-5 py-3">
          <h2 class="text-xs font-medium text-text-muted uppercase tracking-wider">Earlier</h2>
        </div>
        <div class="divide-y divide-border">
          {#each earlierNotifications as notification (notification.id)}
            <button
              type="button"
              class="w-full flex items-start gap-3 px-5 py-3 hover:bg-surface-sunken/50 transition-colors text-left
                {!notification.read ? 'bg-primary/5' : ''}"
              onclick={() => markAsRead(notification.id)}
            >
              <div class="relative shrink-0">
                {#if notification.avatar}
                  <img src={notification.avatar} alt="" class="w-10 h-10 rounded-full bg-surface-sunken" />
                {:else}
                  <div class="w-10 h-10 rounded-full bg-surface-sunken flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      {@html getTypeIcon(notification.type)}
                    </svg>
                  </div>
                {/if}
                <div class="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full {notificationTypes[notification.type].color} flex items-center justify-center ring-2 ring-surface">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    {@html getTypeIcon(notification.type)}
                  </svg>
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-text truncate">{notification.title}</p>
                <p class="text-xs text-text-muted truncate">{notification.description}</p>
                <p class="text-xs text-text-disabled mt-0.5">{formatTime(notification.time)}</p>
              </div>
              {#if !notification.read}
                <div class="shrink-0 w-2 h-2 bg-primary rounded-full mt-2"></div>
              {/if}
            </button>
          {/each}
        </div>
      {/if}
    {/if}
  </div>

  <!-- Mobile UX Note (Footer) -->
  <div class="shrink-0 px-5 py-3 border-t border-border bg-surface-sunken/30">
    <p class="text-xs text-text-muted text-center">
      Tap notification to mark as read • Swipe to delete (not implemented)
    </p>
  </div>
</div>
