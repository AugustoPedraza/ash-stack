<script>
  /**
   * Role Gate Recipe
   * Show/hide content based on user role with upgrade prompts.
   */

  // Available roles
  const roles = ['viewer', 'member', 'admin', 'owner'];
  let currentRole = $state('member');

  // Features with role requirements
  const features = [
    { id: 'view', label: 'View Content', minRole: 'viewer', icon: 'eye' },
    { id: 'edit', label: 'Edit Content', minRole: 'member', icon: 'pencil' },
    { id: 'publish', label: 'Publish Changes', minRole: 'member', icon: 'upload' },
    { id: 'analytics', label: 'View Analytics', minRole: 'admin', icon: 'chart' },
    { id: 'settings', label: 'Manage Settings', minRole: 'admin', icon: 'cog' },
    { id: 'billing', label: 'Billing & Subscription', minRole: 'owner', icon: 'credit-card' },
    { id: 'delete', label: 'Delete Workspace', minRole: 'owner', icon: 'trash' },
  ];

  function hasAccess(minRole) {
    const currentIndex = roles.indexOf(currentRole);
    const requiredIndex = roles.indexOf(minRole);
    return currentIndex >= requiredIndex;
  }

  function getRoleBadgeColor(role) {
    switch (role) {
      case 'owner': return 'bg-error text-white';
      case 'admin': return 'bg-warning text-white';
      case 'member': return 'bg-primary text-white';
      default: return 'bg-border-strong text-text';
    }
  }

  function getIcon(name) {
    const icons = {
      eye: '<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />',
      pencil: '<path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />',
      upload: '<path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />',
      chart: '<path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />',
      cog: '<path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />',
      'credit-card': '<path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />',
      trash: '<path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />',
      lock: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />',
    };
    return icons[name] || '';
  }
</script>

<div class="h-full bg-surface overflow-y-auto px-5 py-6">
  <div class="max-w-md mx-auto">
    <div class="mb-8">
      <h1 class="text-xl font-semibold text-text mb-2">Role Gate</h1>
      <p class="text-text-muted text-sm">Show/hide content based on user role.</p>
    </div>

    <!-- Role Selector -->
    <div class="mb-8 p-4 bg-surface-sunken rounded-xl">
      <p class="text-sm font-medium text-text mb-3">Simulate Role:</p>
      <div class="flex flex-wrap gap-2">
        {#each roles as role}
          <button
            type="button"
            class="px-4 py-2 text-sm font-medium rounded-lg transition-colors capitalize
              {currentRole === role
                ? getRoleBadgeColor(role)
                : 'bg-surface text-text-secondary hover:bg-border-strong'}"
            onclick={() => currentRole = role}
          >
            {role}
          </button>
        {/each}
      </div>
      <p class="text-xs text-text-muted mt-3">
        Current role: <span class="font-medium capitalize">{currentRole}</span>
      </p>
    </div>

    <!-- Feature List -->
    <div class="mb-8">
      <h2 class="text-sm font-medium text-text mb-4">Available Features</h2>
      <div class="space-y-2">
        {#each features as feature}
          {@const accessible = hasAccess(feature.minRole)}
          <div
            class="flex items-center gap-3 p-3 rounded-xl border transition-colors
              {accessible
                ? 'bg-surface border-border'
                : 'bg-surface-sunken/50 border-transparent opacity-60'}"
          >
            <div class="w-10 h-10 rounded-lg flex items-center justify-center
              {accessible ? 'bg-primary/10' : 'bg-border-strong'}">
              {#if accessible}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  {@html getIcon(feature.icon)}
                </svg>
              {:else}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-text-disabled" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  {@html getIcon('lock')}
                </svg>
              {/if}
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-text">{feature.label}</p>
              {#if !accessible}
                <p class="text-xs text-text-muted">Requires {feature.minRole} role</p>
              {/if}
            </div>
            {#if accessible}
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            {:else}
              <button
                type="button"
                class="px-3 py-1.5 text-xs font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
              >
                Upgrade
              </button>
            {/if}
          </div>
        {/each}
      </div>
    </div>

    <!-- Upgrade Prompt Example -->
    <div class="mb-8 p-4 border border-warning/30 bg-warning/5 rounded-xl">
      <div class="flex items-start gap-3">
        <div class="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div class="flex-1">
          <h3 class="text-sm font-medium text-text mb-1">Upgrade to Admin</h3>
          <p class="text-xs text-text-muted mb-3">
            Get access to analytics, settings, and team management features.
          </p>
          <button
            type="button"
            class="px-4 py-2 text-sm font-medium text-white bg-warning rounded-lg hover:bg-warning/90 transition-colors"
          >
            Request Access
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile UX Note -->
    <div class="p-4 bg-primary/5 border border-primary/20 rounded-lg">
      <h3 class="text-sm font-medium text-primary mb-2">Mobile UX Patterns</h3>
      <ul class="text-xs text-text-secondary space-y-1">
        <li>• Show locked features, don't hide them</li>
        <li>• Provide clear upgrade path</li>
        <li>• Use visual indicators for access level</li>
        <li>• Cache role on client for instant UI</li>
      </ul>
    </div>
  </div>
</div>
