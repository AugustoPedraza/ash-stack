<script>
  /**
   * Feature Flag Recipe
   * Conditional feature rendering with coming soon states.
   */

  // Feature flags state
  let flags = $state({
    darkMode: true,
    notifications: true,
    analytics: false,
    aiAssistant: false,
    collaboration: false,
    exportPdf: true,
    customBranding: false,
    apiAccess: false
  });

  // Feature metadata
  const features = [
    {
      id: 'darkMode',
      name: 'Dark Mode',
      description: 'Switch between light and dark themes',
      category: 'UI',
      released: true
    },
    {
      id: 'notifications',
      name: 'Push Notifications',
      description: 'Get notified about important updates',
      category: 'Communication',
      released: true
    },
    {
      id: 'analytics',
      name: 'Analytics Dashboard',
      description: 'Track usage and performance metrics',
      category: 'Insights',
      released: false,
      beta: true
    },
    {
      id: 'aiAssistant',
      name: 'AI Assistant',
      description: 'Get smart suggestions powered by AI',
      category: 'AI',
      released: false,
      comingSoon: true
    },
    {
      id: 'collaboration',
      name: 'Real-time Collaboration',
      description: 'Work together with your team in real-time',
      category: 'Teamwork',
      released: false,
      comingSoon: true
    },
    {
      id: 'exportPdf',
      name: 'PDF Export',
      description: 'Export your work as PDF documents',
      category: 'Export',
      released: true
    },
    {
      id: 'customBranding',
      name: 'Custom Branding',
      description: 'Add your logo and custom colors',
      category: 'Customization',
      released: false,
      beta: true
    },
    {
      id: 'apiAccess',
      name: 'API Access',
      description: 'Connect with external services via API',
      category: 'Developer',
      released: false,
      comingSoon: true
    }
  ];

  function toggleFlag(id) {
    flags[id] = !flags[id];
  }

  function getStatusBadge(feature) {
    if (feature.comingSoon) return { label: 'Coming Soon', color: 'bg-info/10 text-info' };
    if (feature.beta) return { label: 'Beta', color: 'bg-warning/10 text-warning' };
    if (feature.released) return { label: 'Live', color: 'bg-success/10 text-success' };
    return { label: 'Disabled', color: 'bg-surface-sunken text-muted-foreground' };
  }

  const enabledCount = $derived(Object.values(flags).filter(Boolean).length);
</script>

<div class="h-full bg-background overflow-y-auto px-5 py-6">
  <div class="max-w-md mx-auto">
    <div class="mb-8">
      <h1 class="text-xl font-semibold text-foreground mb-2">Feature Flags</h1>
      <p class="text-muted-foreground text-sm">Conditional features with status indicators.</p>
    </div>

    <!-- Summary -->
    <div class="mb-6 p-4 bg-surface-sunken/50 rounded-xl">
      <div class="flex items-center justify-between">
        <span class="text-sm text-muted-foreground">Active features</span>
        <span class="text-lg font-semibold text-foreground">{enabledCount} / {features.length}</span>
      </div>
    </div>

    <!-- Feature List -->
    <div class="space-y-3 mb-8">
      {#each features as feature (feature.id)}
        {@const badge = getStatusBadge(feature)}
        <div class="p-4 bg-background border border-border rounded-xl">
          <div class="flex items-start gap-3">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <h3 class="text-sm font-medium text-foreground">{feature.name}</h3>
                <span class="px-2 py-0.5 text-xs font-medium rounded-full {badge.color}">
                  {badge.label}
                </span>
              </div>
              <p class="text-xs text-muted-foreground">{feature.description}</p>
              <p class="text-xs text-text-disabled mt-1">{feature.category}</p>
            </div>

            {#if feature.comingSoon}
              <!-- Coming Soon State -->
              <button
                type="button"
                class="px-3 py-1.5 text-xs font-medium text-info bg-info/10 rounded-lg cursor-not-allowed"
                disabled
              >
                Notify Me
              </button>
            {:else if feature.beta}
              <!-- Beta Toggle -->
              <button
                type="button"
                class="relative w-11 h-6 rounded-full transition-colors
                  {flags[feature.id] ? 'bg-warning' : 'bg-surface-sunken border border-border-strong'}"
                onclick={() => toggleFlag(feature.id)}
                aria-label="Toggle {feature.name}"
              >
                <span
                  class="absolute top-1 left-1 w-4 h-4 rounded-full transition-transform shadow-sm
                    {flags[feature.id] ? 'translate-x-5 bg-white' : 'bg-white border border-border-strong'}"
                ></span>
              </button>
            {:else}
              <!-- Regular Toggle -->
              <button
                type="button"
                class="relative w-11 h-6 rounded-full transition-colors
                  {flags[feature.id] ? 'bg-primary' : 'bg-surface-sunken border border-border-strong'}"
                onclick={() => toggleFlag(feature.id)}
                aria-label="Toggle {feature.name}"
              >
                <span
                  class="absolute top-1 left-1 w-4 h-4 rounded-full transition-transform shadow-sm
                    {flags[feature.id] ? 'translate-x-5 bg-white' : 'bg-white border border-border-strong'}"
                ></span>
              </button>
            {/if}
          </div>
        </div>
      {/each}
    </div>

    <!-- Coming Soon Card -->
    <div class="mb-8 p-4 bg-gradient-to-br from-primary/10 to-info/10 border border-primary/20 rounded-xl">
      <div class="flex items-start gap-3">
        <div class="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div class="flex-1">
          <h3 class="text-sm font-medium text-foreground mb-1">AI Assistant is coming!</h3>
          <p class="text-xs text-muted-foreground mb-3">
            Be the first to try our new AI-powered assistant. Join the waitlist to get early access.
          </p>
          <div class="flex items-center gap-2">
            <input
              type="email"
              placeholder="your@email.com"
              class="flex-1 px-3 py-2 text-sm bg-background border border-border rounded-lg outline-none focus:border-primary"
            />
            <button
              type="button"
              class="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
            >
              Join
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Conditional Rendering Example -->
    <div class="mb-8">
      <h2 class="text-sm font-medium text-foreground mb-4">Live Preview</h2>
      <div class="p-4 bg-surface-sunken/50 rounded-xl space-y-3">
        {#if flags.darkMode}
          <div class="flex items-center gap-2 text-sm text-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Dark mode available
          </div>
        {/if}

        {#if flags.notifications}
          <div class="flex items-center gap-2 text-sm text-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Notifications enabled
          </div>
        {/if}

        {#if flags.analytics}
          <div class="flex items-center gap-2 text-sm text-warning">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Analytics (Beta) enabled
          </div>
        {/if}

        {#if flags.exportPdf}
          <div class="flex items-center gap-2 text-sm text-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            PDF export available
          </div>
        {/if}

        {#if !flags.darkMode && !flags.notifications && !flags.analytics && !flags.exportPdf}
          <p class="text-sm text-muted-foreground">No features enabled</p>
        {/if}
      </div>
    </div>

    <!-- Mobile UX Note -->
    <div class="p-4 bg-primary/5 border border-primary/20 rounded-lg">
      <h3 class="text-sm font-medium text-primary mb-2">Mobile UX Patterns</h3>
      <ul class="text-xs text-muted-foreground space-y-1">
        <li>• Show coming soon with notify option</li>
        <li>• Mark beta features clearly</li>
        <li>• Instant toggle feedback</li>
        <li>• Group by category for clarity</li>
      </ul>
    </div>
  </div>
</div>
