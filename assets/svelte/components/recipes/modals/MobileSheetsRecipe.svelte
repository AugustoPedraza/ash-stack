<script>
  /**
   * Mobile Sheets Recipe
   * Bottom sheet with gesture dismiss and snap points.
   *
   * Uses: Button, Card
   */
  import { Button, Card } from '../../ui';

  let showActionSheet = $state(false);
  let showOptionsSheet = $state(false);
  let showShareSheet = $state(false);
  let sheetHeight = $state(0);
  let isDragging = $state(false);
  let startY = $state(0);

  function handleTouchStart(e) {
    isDragging = true;
    startY = e.touches[0].clientY;
    sheetHeight = 0;
  }

  function handleTouchMove(e) {
    if (!isDragging) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY;
    if (diff > 0) {
      sheetHeight = diff;
    }
  }

  function handleTouchEnd() {
    isDragging = false;
    if (sheetHeight > 100) {
      showOptionsSheet = false;
    }
    sheetHeight = 0;
  }

  const shareOptions = [
    { id: 'copy', label: 'Copy Link', icon: 'link' },
    { id: 'message', label: 'Messages', icon: 'chat' },
    { id: 'mail', label: 'Mail', icon: 'mail' },
    { id: 'twitter', label: 'Twitter', icon: 'twitter' },
    { id: 'more', label: 'More...', icon: 'dots' },
  ];

  function getIcon(name) {
    const icons = {
      link: '<path stroke-linecap="round" stroke-linejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />',
      chat: '<path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />',
      mail: '<path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />',
      twitter: '<path stroke-linecap="round" stroke-linejoin="round" d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />',
      dots: '<path stroke-linecap="round" stroke-linejoin="round" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />',
      edit: '<path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />',
      copy: '<path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />',
      archive: '<path stroke-linecap="round" stroke-linejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />',
      trash: '<path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />',
    };
    return icons[name] || '';
  }
</script>

<div class="h-full bg-base-100 overflow-y-auto px-5 py-6">
  <div class="max-w-md mx-auto">
    <div class="mb-8">
      <h1 class="text-xl font-semibold text-foreground mb-2">Mobile Sheets</h1>
      <p class="text-muted-foreground text-sm">Bottom sheets with gestures and snap points.</p>
    </div>

    <!-- Sheet Triggers -->
    <div class="space-y-4 mb-8">
      <Button
        variant="secondary"
        fullWidth
        onclick={() => showActionSheet = true}
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h7" />
        </svg>
        Action Sheet (iOS Style)
      </Button>

      <Button
        variant="secondary"
        fullWidth
        onclick={() => showOptionsSheet = true}
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
        Options Sheet (with drag)
      </Button>

      <Button
        variant="secondary"
        fullWidth
        onclick={() => showShareSheet = true}
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        Share Sheet (Native Style)
      </Button>
    </div>

    <!-- Mobile UX Note -->
    <div class="p-4 bg-primary/5 border border-primary/20 rounded-lg">
      <h3 class="text-sm font-medium text-primary mb-2">Mobile UX Patterns</h3>
      <ul class="text-xs text-muted-foreground space-y-1">
        <li>• Swipe down to dismiss</li>
        <li>• Handle indicator at top</li>
        <li>• Multiple snap points</li>
        <li>• Safe area padding at bottom</li>
      </ul>
    </div>
  </div>
</div>

<!-- Action Sheet (iOS Style) -->
{#if showActionSheet}
  <div
    class="fixed inset-0 z-modal flex items-end justify-center"
    role="dialog"
    aria-modal="true"
  >
    <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
    <div class="absolute inset-0 bg-black/50" onclick={() => showActionSheet = false} role="presentation"></div>
    <div class="relative w-full max-w-md mx-4 mb-4 space-y-2">
      <!-- Actions -->
      <div class="bg-background rounded-xl overflow-hidden">
        <Button
          variant="ghost"
          fullWidth
          onclick={() => showActionSheet = false}
        >
          Save to Photos
        </Button>
        <div class="border-t border-border"></div>
        <Button
          variant="ghost"
          fullWidth
          onclick={() => showActionSheet = false}
        >
          Copy Link
        </Button>
        <div class="border-t border-border"></div>
        <Button
          variant="ghost"
          fullWidth
          onclick={() => showActionSheet = false}
        >
          Share to Story
        </Button>
      </div>

      <!-- Cancel -->
      <Button
        variant="secondary"
        fullWidth
        onclick={() => showActionSheet = false}
      >
        Cancel
      </Button>
    </div>
  </div>
{/if}

<!-- Options Sheet with Drag -->
{#if showOptionsSheet}
  <div
    class="fixed inset-0 z-modal flex items-end justify-center"
    role="dialog"
    aria-modal="true"
  >
    <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
    <div
      class="absolute inset-0 bg-black/50 transition-opacity"
      style="opacity: {1 - sheetHeight / 300}"
      onclick={() => showOptionsSheet = false}
      role="presentation"
    ></div>
    <div
      class="relative w-full max-w-md bg-background rounded-t-2xl transition-transform"
      style="transform: translateY({sheetHeight}px)"
      ontouchstart={handleTouchStart}
      ontouchmove={handleTouchMove}
      ontouchend={handleTouchEnd}
    >
      <!-- Handle -->
      <div class="flex justify-center py-3">
        <div class="w-10 h-1 bg-border rounded-full"></div>
      </div>

      <!-- Options -->
      <div class="px-4 pb-8 space-y-1">
        <Button
          variant="ghost"
          fullWidth
          onclick={() => showOptionsSheet = false}
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            {@html getIcon('edit')}
          </svg>
          Edit
        </Button>
        <Button
          variant="ghost"
          fullWidth
          onclick={() => showOptionsSheet = false}
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            {@html getIcon('copy')}
          </svg>
          Duplicate
        </Button>
        <Button
          variant="ghost"
          fullWidth
          onclick={() => showOptionsSheet = false}
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            {@html getIcon('archive')}
          </svg>
          Archive
        </Button>
        <Button
          variant="danger"
          fullWidth
          onclick={() => showOptionsSheet = false}
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            {@html getIcon('trash')}
          </svg>
          Delete
        </Button>
      </div>
    </div>
  </div>
{/if}

<!-- Share Sheet -->
{#if showShareSheet}
  <div
    class="fixed inset-0 z-modal flex items-end justify-center"
    role="dialog"
    aria-modal="true"
  >
    <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
    <div class="absolute inset-0 bg-black/50" onclick={() => showShareSheet = false} role="presentation"></div>
    <div class="relative w-full max-w-md bg-background rounded-t-2xl">
      <!-- Handle -->
      <div class="flex justify-center py-3">
        <div class="w-10 h-1 bg-border rounded-full"></div>
      </div>

      <!-- Title -->
      <div class="px-4 pb-4 border-b border-border">
        <h3 class="text-lg font-semibold text-foreground text-center">Share</h3>
      </div>

      <!-- Share Options Grid -->
      <div class="px-4 py-6">
        <div class="flex justify-around mb-6">
          {#each shareOptions as option}
            <button
              type="button"
              class="flex flex-col items-center gap-2"
              onclick={() => showShareSheet = false}
            >
              <div class="w-14 h-14 rounded-full bg-muted flex items-center justify-center hover:bg-accent transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  {@html getIcon(option.icon)}
                </svg>
              </div>
              <span class="text-xs text-muted-foreground">{option.label}</span>
            </button>
          {/each}
        </div>
      </div>

      <!-- Cancel -->
      <div class="px-4 pb-8">
        <Button
          variant="secondary"
          fullWidth
          onclick={() => showShareSheet = false}
        >
          Cancel
        </Button>
      </div>
    </div>
  </div>
{/if}
