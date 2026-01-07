<script>
  /**
   * Presence Recipe
   * Online user list with status indicators and join/leave animations.
   *
   * Uses: Button
   */
  import { Button } from '../../ui';

  // All possible users
  const allUsers = [
    { id: 1, name: 'Sarah Chen', avatar: 'https://i.pravatar.cc/40?img=1', role: 'Designer' },
    { id: 2, name: 'Mike Johnson', avatar: 'https://i.pravatar.cc/40?img=2', role: 'Developer' },
    { id: 3, name: 'Emma Wilson', avatar: 'https://i.pravatar.cc/40?img=3', role: 'Product Manager' },
    { id: 4, name: 'Alex Kim', avatar: 'https://i.pravatar.cc/40?img=4', role: 'Developer' },
    { id: 5, name: 'Lisa Park', avatar: 'https://i.pravatar.cc/40?img=5', role: 'QA Engineer' },
    { id: 6, name: 'Tom Brown', avatar: 'https://i.pravatar.cc/40?img=6', role: 'DevOps' },
  ];

  // Online users with status
  let onlineUsers = $state([
    { ...allUsers[0], status: 'active', joinedAt: new Date(Date.now() - 3600000) },
    { ...allUsers[1], status: 'active', joinedAt: new Date(Date.now() - 1800000) },
    { ...allUsers[2], status: 'away', joinedAt: new Date(Date.now() - 900000) },
  ]);

  // Recently joined/left for animations
  let recentActivity = $state([]);

  const offlineUsers = $derived(
    allUsers.filter(u => !onlineUsers.find(o => o.id === u.id))
  );

  const onlineCount = $derived(onlineUsers.length);
  const activeCount = $derived(onlineUsers.filter(u => u.status === 'active').length);

  function simulateJoin() {
    if (offlineUsers.length === 0) return;

    const user = offlineUsers[Math.floor(Math.random() * offlineUsers.length)];
    const newUser = { ...user, status: 'active', joinedAt: new Date() };

    onlineUsers = [...onlineUsers, newUser];
    recentActivity = [{ type: 'join', user: newUser, time: new Date() }, ...recentActivity.slice(0, 4)];

    // Clear activity after animation
    setTimeout(() => {
      recentActivity = recentActivity.filter(a => a.user.id !== user.id || a.type !== 'join');
    }, 3000);
  }

  function simulateLeave() {
    if (onlineUsers.length === 0) return;

    const user = onlineUsers[Math.floor(Math.random() * onlineUsers.length)];
    onlineUsers = onlineUsers.filter(u => u.id !== user.id);
    recentActivity = [{ type: 'leave', user, time: new Date() }, ...recentActivity.slice(0, 4)];

    // Clear activity after animation
    setTimeout(() => {
      recentActivity = recentActivity.filter(a => a.user.id !== user.id || a.type !== 'leave');
    }, 3000);
  }

  function toggleStatus(userId) {
    onlineUsers = onlineUsers.map(u =>
      u.id === userId
        ? { ...u, status: u.status === 'active' ? 'away' : 'active' }
        : u
    );
  }

  function getStatusColor(status) {
    return status === 'active' ? 'bg-success' : 'bg-warning';
  }

  function formatJoinTime(date) {
    const mins = Math.floor((Date.now() - date.getTime()) / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    return `${Math.floor(mins / 60)}h ago`;
  }

  // Auto-simulate
  let autoSimulate = $state(false);
  let simulateInterval = null;

  function toggleAutoSimulate() {
    autoSimulate = !autoSimulate;
    if (autoSimulate) {
      simulateInterval = setInterval(() => {
        if (Math.random() > 0.5) {
          simulateJoin();
        } else {
          simulateLeave();
        }
      }, 3000);
    } else {
      clearInterval(simulateInterval);
    }
  }

  $effect(() => {
    return () => {
      if (simulateInterval) clearInterval(simulateInterval);
    };
  });
</script>

<div class="h-full bg-background overflow-y-auto px-5 py-6">
  <div class="max-w-md mx-auto">
    <div class="mb-8">
      <h1 class="text-xl font-semibold text-foreground mb-2">Presence</h1>
      <p class="text-muted-foreground text-sm">Online user list with status and join/leave activity.</p>
    </div>

    <!-- Demo Controls -->
    <div class="mb-6 flex flex-wrap gap-2">
      <button
        type="button"
        class="px-3 py-2 text-sm font-medium text-success bg-success/10 rounded-lg hover:bg-success/20 transition-colors"
        onclick={simulateJoin}
      >
        + Simulate Join
      </button>
      <button
        type="button"
        class="px-3 py-2 text-sm font-medium text-destructive bg-destructive/10 rounded-lg hover:bg-destructive/20 transition-colors"
        onclick={simulateLeave}
      >
        - Simulate Leave
      </button>
      <button
        type="button"
        class="px-3 py-2 text-sm font-medium transition-colors rounded-lg
          {autoSimulate ? 'text-primary bg-primary/10' : 'text-muted-foreground bg-surface-sunken hover:bg-border'}"
        onclick={toggleAutoSimulate}
      >
        {autoSimulate ? 'Stop Auto' : 'Auto Simulate'}
      </button>
    </div>

    <!-- Online Count Header -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <div class="w-2 h-2 bg-success rounded-full animate-pulse"></div>
        <span class="text-sm font-medium text-foreground">{onlineCount} Online</span>
        <span class="text-sm text-muted-foreground">({activeCount} active)</span>
      </div>
    </div>

    <!-- Online Users List -->
    <div class="bg-background border border-border rounded-xl divide-y divide-border mb-6">
      {#if onlineUsers.length === 0}
        <div class="p-6 text-center">
          <p class="text-sm text-muted-foreground">No one is online</p>
        </div>
      {:else}
        {#each onlineUsers as user (user.id)}
          <button
            type="button"
            class="w-full flex items-center gap-3 p-3 hover:bg-surface-sunken/50 transition-colors text-left"
            onclick={() => toggleStatus(user.id)}
          >
            <div class="relative shrink-0">
              <img src={user.avatar} alt={user.name} class="w-10 h-10 rounded-full bg-surface-sunken" />
              <div class="absolute -bottom-0.5 -right-0.5 w-3 h-3 {getStatusColor(user.status)} rounded-full ring-2 ring-background"></div>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-foreground truncate">{user.name}</p>
              <p class="text-xs text-muted-foreground">{user.role}</p>
            </div>
            <div class="text-right shrink-0">
              <p class="text-xs text-text-disabled">{formatJoinTime(user.joinedAt)}</p>
              <p class="text-xs {user.status === 'active' ? 'text-success' : 'text-warning'}">{user.status}</p>
            </div>
          </button>
        {/each}
      {/if}
    </div>

    <!-- Recent Activity -->
    {#if recentActivity.length > 0}
      <div class="mb-6">
        <h2 class="text-sm font-medium text-foreground mb-3">Recent Activity</h2>
        <div class="space-y-2">
          {#each recentActivity as activity (activity.user.id + activity.type + activity.time.getTime())}
            <div class="flex items-center gap-3 p-2 rounded-lg animate-fade-in
              {activity.type === 'join' ? 'bg-success/10' : 'bg-destructive/10'}">
              <img src={activity.user.avatar} alt={activity.user.name} class="w-8 h-8 rounded-full" />
              <div class="flex-1">
                <span class="text-sm text-foreground">{activity.user.name}</span>
                <span class="text-sm {activity.type === 'join' ? 'text-success' : 'text-destructive'}">
                  {activity.type === 'join' ? ' joined' : ' left'}
                </span>
              </div>
              <span class="text-xs text-text-disabled">Just now</span>
            </div>
          {/each}
        </div>
      </div>
    {/if}

    <!-- Compact Style: Avatars Only -->
    <div class="mb-6">
      <h2 class="text-sm font-medium text-foreground mb-3">Compact Style (Avatars)</h2>
      <div class="flex items-center gap-2">
        <div class="flex -space-x-2">
          {#each onlineUsers.slice(0, 5) as user}
            <div class="relative">
              <img
                src={user.avatar}
                alt={user.name}
                class="w-8 h-8 rounded-full ring-2 ring-background"
              />
              <div class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 {getStatusColor(user.status)} rounded-full ring-2 ring-background"></div>
            </div>
          {/each}
          {#if onlineUsers.length > 5}
            <div class="w-8 h-8 rounded-full bg-surface-sunken ring-2 ring-background flex items-center justify-center">
              <span class="text-xs text-muted-foreground">+{onlineUsers.length - 5}</span>
            </div>
          {/if}
        </div>
        <span class="text-sm text-muted-foreground">{onlineCount} online</span>
      </div>
    </div>

    <!-- Mobile UX Note -->
    <div class="p-4 bg-primary/5 border border-primary/20 rounded-lg">
      <h3 class="text-sm font-medium text-primary mb-2">Mobile UX Patterns</h3>
      <ul class="text-xs text-muted-foreground space-y-1">
        <li>• Animate join/leave for awareness</li>
        <li>• Show status dot on avatars</li>
        <li>• Tap to toggle own status</li>
        <li>• Compact view for limited space</li>
      </ul>
    </div>
  </div>
</div>

<style>
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fade-in 0.3s ease-out;
  }
</style>
