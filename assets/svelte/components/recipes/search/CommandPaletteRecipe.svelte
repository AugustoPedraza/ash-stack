<script>
  /**
   * Command Palette Recipe
   * Cmd+K quick actions with keyboard navigation and search.
   */

  let isOpen = $state(false);
  let query = $state('');
  let selectedIndex = $state(0);
  let inputElement = $state(null);

  // Command categories and items
  const commands = [
    {
      category: 'Navigation',
      items: [
        { id: 'home', label: 'Go to Home', icon: 'home', shortcut: 'G H' },
        { id: 'dashboard', label: 'Go to Dashboard', icon: 'chart', shortcut: 'G D' },
        { id: 'settings', label: 'Go to Settings', icon: 'cog', shortcut: 'G S' },
        { id: 'profile', label: 'Go to Profile', icon: 'user', shortcut: 'G P' },
      ]
    },
    {
      category: 'Actions',
      items: [
        { id: 'new-project', label: 'Create New Project', icon: 'plus', shortcut: 'N P' },
        { id: 'new-task', label: 'Create New Task', icon: 'clipboard', shortcut: 'N T' },
        { id: 'invite', label: 'Invite Team Member', icon: 'user-plus', shortcut: 'I' },
        { id: 'export', label: 'Export Data', icon: 'download', shortcut: 'E' },
      ]
    },
    {
      category: 'Tools',
      items: [
        { id: 'search', label: 'Search Everything', icon: 'search', shortcut: '/' },
        { id: 'theme', label: 'Toggle Dark Mode', icon: 'moon', shortcut: 'T' },
        { id: 'help', label: 'Open Help Center', icon: 'help', shortcut: '?' },
        { id: 'shortcuts', label: 'Keyboard Shortcuts', icon: 'keyboard', shortcut: 'Ctrl+/' },
      ]
    }
  ];

  // Flatten commands for navigation
  const allCommands = $derived(
    commands.flatMap(cat => cat.items)
  );

  // Filter commands based on query
  const filteredCommands = $derived.by(() => {
    if (!query.trim()) return commands;

    const q = query.toLowerCase();
    return commands
      .map(cat => ({
        ...cat,
        items: cat.items.filter(item =>
          item.label.toLowerCase().includes(q) ||
          item.id.toLowerCase().includes(q)
        )
      }))
      .filter(cat => cat.items.length > 0);
  });

  const flatFiltered = $derived(
    filteredCommands.flatMap(cat => cat.items)
  );

  function openPalette() {
    isOpen = true;
    query = '';
    selectedIndex = 0;
    setTimeout(() => inputElement?.focus(), 50);
  }

  function closePalette() {
    isOpen = false;
    query = '';
  }

  function selectCommand(command) {
    console.log('Selected command:', command.id);
    closePalette();
    // In real app, execute command action here
  }

  function handleKeydown(e) {
    // Global: Open palette
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      isOpen ? closePalette() : openPalette();
      return;
    }

    if (!isOpen) return;

    // Close
    if (e.key === 'Escape') {
      e.preventDefault();
      closePalette();
      return;
    }

    // Navigate
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIndex = (selectedIndex + 1) % flatFiltered.length;
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIndex = (selectedIndex - 1 + flatFiltered.length) % flatFiltered.length;
      return;
    }

    // Select
    if (e.key === 'Enter' && flatFiltered[selectedIndex]) {
      e.preventDefault();
      selectCommand(flatFiltered[selectedIndex]);
    }
  }

  function getIcon(iconName) {
    const icons = {
      home: '<path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />',
      chart: '<path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />',
      cog: '<path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />',
      user: '<path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />',
      plus: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />',
      clipboard: '<path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />',
      'user-plus': '<path stroke-linecap="round" stroke-linejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />',
      download: '<path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />',
      search: '<path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />',
      moon: '<path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />',
      help: '<path stroke-linecap="round" stroke-linejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />',
      keyboard: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />'
    };
    return icons[iconName] || icons.help;
  }

  // Reset selection when query changes
  $effect(() => {
    query;
    selectedIndex = 0;
  });
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="h-full bg-background overflow-y-auto px-5 py-6">
  <div class="max-w-md mx-auto">
    <div class="mb-8">
      <h1 class="text-xl font-semibold text-foreground mb-2">Command Palette</h1>
      <p class="text-muted-foreground text-sm">Quick actions with keyboard navigation.</p>
    </div>

    <!-- Trigger Button -->
    <div class="mb-8">
      <button
        type="button"
        class="w-full flex items-center gap-3 px-4 py-3 bg-surface-sunken/50 border border-border-strong rounded-xl hover:bg-surface-sunken transition-colors text-left"
        onclick={openPalette}
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-text-disabled" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span class="flex-1 text-text-disabled">Search commands...</span>
        <kbd class="px-2 py-1 text-xs bg-border-strong rounded">Cmd+K</kbd>
      </button>
    </div>

    <!-- Command List Preview -->
    <div class="mb-8">
      <h2 class="text-sm font-medium text-foreground mb-4">Available Commands</h2>
      <div class="space-y-4">
        {#each commands as category}
          <div>
            <h3 class="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">{category.category}</h3>
            <div class="space-y-1">
              {#each category.items as item}
                <div class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface-sunken/50 cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    {@html getIcon(item.icon)}
                  </svg>
                  <span class="flex-1 text-sm text-foreground">{item.label}</span>
                  <kbd class="px-1.5 py-0.5 text-xs bg-surface-sunken rounded text-muted-foreground">{item.shortcut}</kbd>
                </div>
              {/each}
            </div>
          </div>
        {/each}
      </div>
    </div>

    <!-- Mobile UX Note -->
    <div class="p-4 bg-primary/5 border border-primary/20 rounded-lg">
      <h3 class="text-sm font-medium text-primary mb-2">Mobile UX Patterns</h3>
      <ul class="text-xs text-muted-foreground space-y-1">
        <li>Show as bottom sheet on mobile</li>
        <li>Support recent commands</li>
        <li>Fuzzy search for typo tolerance</li>
        <li>Group by category</li>
      </ul>
    </div>
  </div>
</div>

<!-- Command Palette Modal -->
{#if isOpen}
  <div
    class="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4"
    onclick={closePalette}
    onkeydown={(e) => e.key === 'Escape' && closePalette()}
    role="dialog"
    aria-modal="true"
    aria-label="Command palette"
    tabindex="-1"
  >
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/50"></div>

    <!-- Palette -->
    <div
      class="relative w-full max-w-lg bg-background rounded-xl shadow-2xl overflow-hidden"
      onclick={(e) => e.stopPropagation()}
      onkeydown={(e) => e.stopPropagation()}
      role="presentation"
    >
      <!-- Search Input -->
      <div class="flex items-center gap-3 px-4 py-3 border-b border-border">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-text-disabled shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          bind:this={inputElement}
          bind:value={query}
          type="text"
          placeholder="Type a command or search..."
          class="flex-1 bg-transparent text-foreground placeholder:text-text-disabled outline-none"
        />
        <kbd class="px-1.5 py-0.5 text-xs bg-surface-sunken rounded text-muted-foreground">Esc</kbd>
      </div>

      <!-- Results -->
      <div class="max-h-[400px] overflow-y-auto p-2">
        {#if flatFiltered.length === 0}
          <div class="px-4 py-8 text-center">
            <p class="text-sm text-muted-foreground">No commands found</p>
          </div>
        {:else}
          {#each filteredCommands as category}
            <div class="mb-2 last:mb-0">
              <h3 class="px-3 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {category.category}
              </h3>
              {#each category.items as item, itemIndex}
                {@const globalIndex = flatFiltered.findIndex(i => i.id === item.id)}
                <button
                  type="button"
                  class="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left
                    {globalIndex === selectedIndex ? 'bg-primary text-white' : 'hover:bg-surface-sunken'}"
                  onclick={() => selectCommand(item)}
                  onmouseenter={() => selectedIndex = globalIndex}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0 {globalIndex === selectedIndex ? 'text-white' : 'text-muted-foreground'}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    {@html getIcon(item.icon)}
                  </svg>
                  <span class="flex-1 text-sm">{item.label}</span>
                  <kbd class="px-1.5 py-0.5 text-xs rounded {globalIndex === selectedIndex ? 'bg-white/20 text-white' : 'bg-surface-sunken text-muted-foreground'}">
                    {item.shortcut}
                  </kbd>
                </button>
              {/each}
            </div>
          {/each}
        {/if}
      </div>

      <!-- Footer -->
      <div class="px-4 py-2 border-t border-border flex items-center gap-4 text-xs text-muted-foreground">
        <div class="flex items-center gap-1">
          <kbd class="px-1 py-0.5 bg-surface-sunken rounded">↑↓</kbd>
          <span>Navigate</span>
        </div>
        <div class="flex items-center gap-1">
          <kbd class="px-1 py-0.5 bg-surface-sunken rounded">Enter</kbd>
          <span>Select</span>
        </div>
        <div class="flex items-center gap-1">
          <kbd class="px-1 py-0.5 bg-surface-sunken rounded">Esc</kbd>
          <span>Close</span>
        </div>
      </div>
    </div>
  </div>
{/if}
