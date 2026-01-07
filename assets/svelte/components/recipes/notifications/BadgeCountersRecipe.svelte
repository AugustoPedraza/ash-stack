<script>
  /**
   * Badge Counters Recipe
   * Animated badge count changes with various styles and clear behavior.
   *
   * Uses: Button
   */
  import { Button } from '../../ui';

  // Demo counts with animation states
  let counts = $state({
    messages: 3,
    notifications: 12,
    tasks: 5,
    alerts: 99
  });

  let animating = $state({
    messages: false,
    notifications: false,
    tasks: false,
    alerts: false
  });

  function increment(key) {
    animating[key] = true;
    counts[key] = counts[key] + 1;
    setTimeout(() => { animating[key] = false; }, 300);
  }

  function decrement(key) {
    if (counts[key] > 0) {
      animating[key] = true;
      counts[key] = counts[key] - 1;
      setTimeout(() => { animating[key] = false; }, 300);
    }
  }

  function clear(key) {
    if (counts[key] > 0) {
      animating[key] = true;
      counts[key] = 0;
      setTimeout(() => { animating[key] = false; }, 300);
    }
  }

  function formatCount(count) {
    if (count > 99) return '99+';
    return count.toString();
  }
</script>

<div class="h-full bg-surface overflow-y-auto px-5 py-6">
  <div class="max-w-md mx-auto">
    <div class="mb-8">
      <h1 class="text-xl font-semibold text-text mb-2">Badge Counters</h1>
      <p class="text-text-muted text-sm">Animated badges with various styles and interactions.</p>
    </div>

    <!-- Style 1: Icon Badges -->
    <div class="mb-8">
      <h2 class="text-sm font-medium text-text mb-4">Icon Badges</h2>
      <div class="flex items-center gap-6 p-4 bg-surface-sunken/50 rounded-xl">
        <!-- Messages -->
        <div class="relative">
          <button type="button" class="p-2 rounded-lg hover:bg-surface-sunken transition-colors" onclick={() => decrement('messages')} aria-label="Messages">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
          {#if counts.messages > 0}
            <span
              class="absolute -top-1 -right-1 min-w-5 h-5 px-1 flex items-center justify-center text-xs font-medium text-white bg-primary rounded-full transition-transform {animating.messages ? 'scale-125' : 'scale-100'}"
            >
              {formatCount(counts.messages)}
            </span>
          {/if}
        </div>

        <!-- Notifications -->
        <div class="relative">
          <button type="button" class="p-2 rounded-lg hover:bg-surface-sunken transition-colors" onclick={() => decrement('notifications')} aria-label="Notifications">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          {#if counts.notifications > 0}
            <span
              class="absolute -top-1 -right-1 min-w-5 h-5 px-1 flex items-center justify-center text-xs font-medium text-white bg-error rounded-full transition-transform {animating.notifications ? 'scale-125' : 'scale-100'}"
            >
              {formatCount(counts.notifications)}
            </span>
          {/if}
        </div>

        <!-- Tasks -->
        <div class="relative">
          <button type="button" class="p-2 rounded-lg hover:bg-surface-sunken transition-colors" onclick={() => decrement('tasks')} aria-label="Tasks">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </button>
          {#if counts.tasks > 0}
            <span
              class="absolute -top-1 -right-1 min-w-5 h-5 px-1 flex items-center justify-center text-xs font-medium text-white bg-warning rounded-full transition-transform {animating.tasks ? 'scale-125' : 'scale-100'}"
            >
              {formatCount(counts.tasks)}
            </span>
          {/if}
        </div>

        <!-- Alerts (99+) -->
        <div class="relative">
          <button type="button" class="p-2 rounded-lg hover:bg-surface-sunken transition-colors" onclick={() => decrement('alerts')} aria-label="Alerts">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </button>
          {#if counts.alerts > 0}
            <span
              class="absolute -top-1 -right-1 min-w-5 h-5 px-1 flex items-center justify-center text-xs font-medium text-white bg-error rounded-full transition-transform {animating.alerts ? 'scale-125' : 'scale-100'}"
            >
              {formatCount(counts.alerts)}
            </span>
          {/if}
        </div>
      </div>
    </div>

    <!-- Controls -->
    <div class="mb-8 p-4 bg-surface-sunken rounded-xl">
      <p class="text-sm font-medium text-text mb-3">Demo Controls</p>
      <div class="grid grid-cols-2 gap-3">
        <button
          type="button"
          class="px-3 py-2 text-sm font-medium text-success bg-success/10 rounded-lg hover:bg-success/20 transition-colors"
          onclick={() => { increment('messages'); increment('notifications'); increment('tasks'); increment('alerts'); }}
        >
          + Add to all
        </button>
        <button
          type="button"
          class="px-3 py-2 text-sm font-medium text-error bg-error/10 rounded-lg hover:bg-error/20 transition-colors"
          onclick={() => { clear('messages'); clear('notifications'); clear('tasks'); clear('alerts'); }}
        >
          Clear all
        </button>
      </div>
    </div>

    <!-- Style 2: Dot Badges -->
    <div class="mb-8">
      <h2 class="text-sm font-medium text-text mb-4">Dot Badges (Unread Indicator)</h2>
      <div class="space-y-2 p-4 bg-surface-sunken/50 rounded-xl">
        <div class="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-sunken">
          <div class="relative">
            <div class="w-10 h-10 rounded-full bg-primary/15 text-primary flex items-center justify-center text-sm font-semibold">
              SC
            </div>
            {#if counts.messages > 0}
              <span class="absolute top-0 right-0 w-3 h-3 bg-primary rounded-full ring-2 ring-surface"></span>
            {/if}
          </div>
          <div class="flex-1">
            <p class="text-sm font-medium text-text">Sarah Chen</p>
            <p class="text-xs text-text-muted">Sent you a message</p>
          </div>
        </div>
        <div class="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-sunken">
          <div class="relative">
            <div class="w-10 h-10 rounded-full bg-info/15 text-info flex items-center justify-center text-sm font-semibold">
              MJ
            </div>
            {#if counts.notifications > 0}
              <span class="absolute top-0 right-0 w-3 h-3 bg-error rounded-full ring-2 ring-surface"></span>
            {/if}
          </div>
          <div class="flex-1">
            <p class="text-sm font-medium text-text">Mike Johnson</p>
            <p class="text-xs text-text-muted">Mentioned you in a comment</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Style 3: Tab Bar Badges -->
    <div class="mb-8">
      <h2 class="text-sm font-medium text-text mb-4">Tab Bar Style</h2>
      <div class="flex justify-around p-4 bg-surface-sunken/50 rounded-xl">
        <button type="button" class="flex flex-col items-center gap-1 p-2 relative" onclick={() => decrement('messages')}>
          <div class="relative">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {#if counts.messages > 0}
              <span class="absolute -top-2 -right-2 min-w-4 h-4 px-1 flex items-center justify-center text-xs font-medium text-white bg-primary rounded-full">
                {counts.messages}
              </span>
            {/if}
          </div>
          <span class="text-xs text-primary font-medium">Home</span>
        </button>

        <button type="button" class="flex flex-col items-center gap-1 p-2 relative" onclick={() => decrement('notifications')}>
          <div class="relative">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {#if counts.notifications > 0}
              <span class="absolute -top-2 -right-2 min-w-4 h-4 px-1 flex items-center justify-center text-xs font-medium text-white bg-error rounded-full">
                {formatCount(counts.notifications)}
              </span>
            {/if}
          </div>
          <span class="text-xs text-text-muted">Alerts</span>
        </button>

        <button type="button" class="flex flex-col items-center gap-1 p-2 relative" onclick={() => decrement('tasks')}>
          <div class="relative">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            {#if counts.tasks > 0}
              <span class="absolute -top-2 -right-2 w-2 h-2 bg-warning rounded-full"></span>
            {/if}
          </div>
          <span class="text-xs text-text-muted">Tasks</span>
        </button>

        <button type="button" class="flex flex-col items-center gap-1 p-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span class="text-xs text-text-muted">Profile</span>
        </button>
      </div>
    </div>

    <!-- Style 4: List Item Badges -->
    <div class="mb-8">
      <h2 class="text-sm font-medium text-text mb-4">List Item Badges</h2>
      <div class="bg-surface border border-border rounded-xl divide-y divide-border">
        <button type="button" class="w-full flex items-center justify-between p-4 hover:bg-surface-sunken/50 text-left" onclick={() => clear('messages')}>
          <div class="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span class="text-sm text-text">Inbox</span>
          </div>
          {#if counts.messages > 0}
            <span class="px-2 py-0.5 text-xs font-medium text-primary bg-primary/15 rounded-full">
              {counts.messages}
            </span>
          {/if}
        </button>
        <button type="button" class="w-full flex items-center justify-between p-4 hover:bg-surface-sunken/50 text-left" onclick={() => clear('notifications')}>
          <div class="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <span class="text-sm text-text">Updates</span>
          </div>
          {#if counts.notifications > 0}
            <span class="px-2 py-0.5 text-xs font-medium text-error bg-error/15 rounded-full">
              {formatCount(counts.notifications)}
            </span>
          {/if}
        </button>
        <button type="button" class="w-full flex items-center justify-between p-4 hover:bg-surface-sunken/50 text-left" onclick={() => clear('tasks')}>
          <div class="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            <span class="text-sm text-text">Archive</span>
          </div>
        </button>
      </div>
    </div>

    <!-- Mobile UX Note -->
    <div class="p-4 bg-primary/5 border border-primary/20 rounded-lg">
      <h3 class="text-sm font-medium text-primary mb-2">Mobile UX Patterns</h3>
      <ul class="text-xs text-text-secondary space-y-1">
        <li>• Animate badge changes (scale bounce)</li>
        <li>• Cap at 99+ for large numbers</li>
        <li>• Use dots for binary unread state</li>
        <li>• Clear badges on item tap/view</li>
      </ul>
    </div>
  </div>
</div>
