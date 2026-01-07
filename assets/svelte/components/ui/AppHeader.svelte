<script>
  /**
   * AppHeader Component
   * iOS-style navigation header with centered title and proper button hierarchy.
   *
   * @prop {string} title - Page title (centered)
   * @prop {boolean} [showBack=false] - Show back button
   * @prop {string} [backLabel='Back'] - Back button label
   * @prop {() => void} [onBack] - Back button handler
   * @prop {Snippet} [actions] - Right-side action buttons
   */

  let {
    title = '',
    showBack = false,
    backLabel = 'Back',
    onBack = () => {},
    actions
  } = $props();
</script>

<header class="bg-background border-b border-accent">
  <div class="relative flex items-center justify-center h-14 px-4">
    <!-- Left side: Back button (ghost style) -->
    <div class="absolute left-2 flex items-center">
      {#if showBack}
        <button
          class="flex items-center gap-1 px-2 py-1.5 -ml-2 rounded-lg text-primary hover:bg-muted active:bg-accent transition-colors"
          onclick={onBack}
          aria-label="Go back"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span class="text-base font-medium">{backLabel}</span>
        </button>
      {/if}
    </div>

    <!-- Center: Title -->
    <h1 class="text-base font-semibold text-foreground truncate max-w-[50%]">
      {title}
    </h1>

    <!-- Right side: Actions -->
    <div class="absolute right-2 flex items-center gap-1">
      {@render actions?.()}
    </div>
  </div>
</header>
