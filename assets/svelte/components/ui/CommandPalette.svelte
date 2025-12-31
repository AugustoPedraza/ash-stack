<!--
  CommandPalette Component
  Keyboard-driven command palette (⌘K / Ctrl+K).
  Supports search, keyboard navigation, and grouped commands.
-->
<script>
  import { onMount, onDestroy, createEventDispatcher, tick } from 'svelte';
  import { fade, scale } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';

  const dispatch = createEventDispatcher();

  /**
   * Whether palette is open
   * @type {boolean}
   */
  export let open = false;

  /**
   * Commands to display
   * @type {Array<{
   *   id: string,
   *   label: string,
   *   description?: string,
   *   icon?: string,
   *   shortcut?: string,
   *   group?: string,
   *   action?: () => void,
   *   href?: string
   * }>}
   */
  export let commands = [];

  /**
   * Placeholder text
   * @type {string}
   */
  export let placeholder = 'Search commands...';

  /**
   * Show recent commands
   * @type {boolean}
   */
  export let showRecent = true;

  /**
   * Maximum recent commands to store
   * @type {number}
   */
  export let maxRecent = 5;

  /**
   * Storage key for recent commands
   * @type {string}
   */
  export let storageKey = 'command-palette-recent';

  /**
   * Custom filter function
   * @type {((command: object, query: string) => boolean) | null}
   */
  export let filter = null;

  /**
   * Close on command select
   * @type {boolean}
   */
  export let closeOnSelect = true;

  let searchQuery = '';
  let selectedIndex = 0;
  let inputEl;
  let listEl;
  let recentIds = [];

  // Load recent commands from storage
  onMount(() => {
    if (showRecent && typeof localStorage !== 'undefined') {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          recentIds = JSON.parse(stored);
        }
      } catch (e) {
        // Ignore storage errors
      }
    }

    // Global keyboard shortcut
    window.addEventListener('keydown', handleGlobalKeydown);
    return () => window.removeEventListener('keydown', handleGlobalKeydown);
  });

  function handleGlobalKeydown(e) {
    // ⌘K or Ctrl+K to open
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      open = !open;
    }
    // Escape to close
    if (e.key === 'Escape' && open) {
      e.preventDefault();
      close();
    }
  }

  // Filter and group commands
  $: filteredCommands = filterCommands(commands, searchQuery);
  $: groupedCommands = groupCommands(filteredCommands);
  $: flatCommands = filteredCommands;

  function filterCommands(cmds, query) {
    if (!query.trim()) {
      // Show recent first when no query
      if (showRecent && recentIds.length > 0) {
        const recent = recentIds
          .map(id => cmds.find(c => c.id === id))
          .filter(Boolean);
        const rest = cmds.filter(c => !recentIds.includes(c.id));
        return [...recent.map(c => ({ ...c, _recent: true })), ...rest];
      }
      return cmds;
    }

    const lowerQuery = query.toLowerCase();

    if (filter) {
      return cmds.filter(c => filter(c, query));
    }

    return cmds.filter(c => {
      const label = c.label.toLowerCase();
      const desc = (c.description || '').toLowerCase();
      const group = (c.group || '').toLowerCase();

      return (
        label.includes(lowerQuery) ||
        desc.includes(lowerQuery) ||
        group.includes(lowerQuery)
      );
    });
  }

  function groupCommands(cmds) {
    const groups = new Map();

    // First add recent group if applicable
    const recent = cmds.filter(c => c._recent);
    if (recent.length > 0) {
      groups.set('Recent', recent);
    }

    // Then group the rest
    cmds.filter(c => !c._recent).forEach(cmd => {
      const group = cmd.group || 'Commands';
      if (!groups.has(group)) {
        groups.set(group, []);
      }
      groups.get(group).push(cmd);
    });

    return groups;
  }

  // Reset selection when results change
  $: if (filteredCommands) {
    selectedIndex = 0;
  }

  // Focus input when opened
  $: if (open) {
    tick().then(() => {
      inputEl?.focus();
      searchQuery = '';
      selectedIndex = 0;
    });
  }

  function close() {
    open = false;
    searchQuery = '';
    dispatch('close');
  }

  function selectCommand(command) {
    // Save to recent
    if (showRecent && typeof localStorage !== 'undefined') {
      recentIds = [command.id, ...recentIds.filter(id => id !== command.id)].slice(0, maxRecent);
      try {
        localStorage.setItem(storageKey, JSON.stringify(recentIds));
      } catch (e) {
        // Ignore storage errors
      }
    }

    dispatch('select', { command });

    if (command.action) {
      command.action();
    }

    if (command.href) {
      window.location.href = command.href;
    }

    if (closeOnSelect) {
      close();
    }
  }

  function handleKeydown(e) {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        selectedIndex = Math.min(selectedIndex + 1, flatCommands.length - 1);
        scrollToSelected();
        break;
      case 'ArrowUp':
        e.preventDefault();
        selectedIndex = Math.max(selectedIndex - 1, 0);
        scrollToSelected();
        break;
      case 'Enter':
        e.preventDefault();
        if (flatCommands[selectedIndex]) {
          selectCommand(flatCommands[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        close();
        break;
    }
  }

  function scrollToSelected() {
    tick().then(() => {
      const selected = listEl?.querySelector('[data-selected="true"]');
      selected?.scrollIntoView({ block: 'nearest' });
    });
  }

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) {
      close();
    }
  }

  function formatShortcut(shortcut) {
    if (!shortcut) return '';

    const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);

    return shortcut
      .replace(/mod/gi, isMac ? '⌘' : 'Ctrl')
      .replace(/ctrl/gi, isMac ? '⌃' : 'Ctrl')
      .replace(/alt/gi, isMac ? '⌥' : 'Alt')
      .replace(/shift/gi, isMac ? '⇧' : 'Shift')
      .replace(/\+/g, '');
  }
</script>

{#if open}
  <div
    class="command-backdrop"
    on:click={handleBackdropClick}
    on:keydown={handleKeydown}
    transition:fade={{ duration: 150 }}
    role="presentation"
  >
    <div
      class="command-dialog"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      transition:scale={{ duration: 200, start: 0.95, easing: quintOut }}
    >
      <div class="command-header">
        <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          bind:this={inputEl}
          bind:value={searchQuery}
          type="text"
          class="command-input"
          {placeholder}
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
        />
        <kbd class="escape-hint">ESC</kbd>
      </div>

      <div class="command-list" bind:this={listEl}>
        {#if flatCommands.length === 0}
          <div class="command-empty">
            <p>No commands found</p>
          </div>
        {:else}
          {#each [...groupedCommands] as [groupName, groupCommands], groupIndex}
            <div class="command-group">
              <div class="group-label">{groupName}</div>
              {#each groupCommands as command, cmdIndex}
                {@const globalIndex = flatCommands.indexOf(command)}
                <button
                  type="button"
                  class="command-item"
                  class:selected={globalIndex === selectedIndex}
                  data-selected={globalIndex === selectedIndex}
                  on:click={() => selectCommand(command)}
                  on:mouseenter={() => selectedIndex = globalIndex}
                >
                  {#if command.icon}
                    <span class="command-icon">{@html command.icon}</span>
                  {:else}
                    <span class="command-icon-placeholder" />
                  {/if}

                  <div class="command-content">
                    <span class="command-label">{command.label}</span>
                    {#if command.description}
                      <span class="command-description">{command.description}</span>
                    {/if}
                  </div>

                  {#if command.shortcut}
                    <div class="command-shortcut">
                      {#each formatShortcut(command.shortcut).split('') as key}
                        <kbd>{key}</kbd>
                      {/each}
                    </div>
                  {/if}
                </button>
              {/each}
            </div>
          {/each}
        {/if}
      </div>

      <div class="command-footer">
        <div class="footer-hint">
          <kbd>↑</kbd><kbd>↓</kbd> to navigate
        </div>
        <div class="footer-hint">
          <kbd>↵</kbd> to select
        </div>
        <div class="footer-hint">
          <kbd>esc</kbd> to close
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .command-backdrop {
    position: fixed;
    inset: 0;
    z-index: var(--z-modal);
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding-top: 15vh;
    background-color: rgba(0, 0, 0, 0.5);
  }

  .command-dialog {
    width: 100%;
    max-width: 40rem;
    max-height: 70vh;
    margin: 0 var(--spacing-4);
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-xl);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .command-header {
    display: flex;
    align-items: center;
    gap: var(--spacing-3);
    padding: var(--spacing-4);
    border-bottom: 1px solid var(--color-border);
  }

  .search-icon {
    width: 1.25rem;
    height: 1.25rem;
    color: var(--color-text-muted);
    flex-shrink: 0;
  }

  .command-input {
    flex: 1;
    border: none;
    background: none;
    font-size: 1rem;
    color: var(--color-text);
    outline: none;
  }

  .command-input::placeholder {
    color: var(--color-text-muted);
  }

  .escape-hint {
    font-size: 0.75rem;
    padding: var(--spacing-1) var(--spacing-2);
    background-color: var(--color-surface-sunken);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    color: var(--color-text-muted);
  }

  .command-list {
    flex: 1;
    overflow-y: auto;
    padding: var(--spacing-2);
  }

  .command-empty {
    padding: var(--spacing-8);
    text-align: center;
    color: var(--color-text-muted);
  }

  .command-group {
    margin-bottom: var(--spacing-2);
  }

  .group-label {
    padding: var(--spacing-2) var(--spacing-3);
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .command-item {
    width: 100%;
    display: flex;
    align-items: center;
    gap: var(--spacing-3);
    padding: var(--spacing-3);
    background: none;
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
    text-align: left;
    color: var(--color-text);
    transition: background-color 100ms ease;
  }

  .command-item:hover,
  .command-item.selected {
    background-color: var(--color-surface-raised);
  }

  .command-item.selected {
    background-color: var(--color-primary);
    color: var(--color-on-primary);
  }

  .command-item.selected .command-description,
  .command-item.selected .command-shortcut kbd {
    color: var(--color-on-primary);
    opacity: 0.8;
  }

  .command-icon {
    width: 1.25rem;
    height: 1.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .command-icon :global(svg) {
    width: 100%;
    height: 100%;
  }

  .command-icon-placeholder {
    width: 1.25rem;
  }

  .command-content {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .command-label {
    font-size: 0.9375rem;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .command-description {
    font-size: 0.8125rem;
    color: var(--color-text-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .command-shortcut {
    display: flex;
    gap: 2px;
    flex-shrink: 0;
  }

  .command-shortcut kbd {
    font-family: inherit;
    font-size: 0.75rem;
    padding: 2px 6px;
    background-color: var(--color-surface-sunken);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    color: var(--color-text-muted);
  }

  .command-footer {
    display: flex;
    gap: var(--spacing-4);
    padding: var(--spacing-3) var(--spacing-4);
    border-top: 1px solid var(--color-border);
    background-color: var(--color-surface-sunken);
  }

  .footer-hint {
    display: flex;
    align-items: center;
    gap: var(--spacing-1);
    font-size: 0.75rem;
    color: var(--color-text-muted);
  }

  .footer-hint kbd {
    font-family: inherit;
    font-size: 0.6875rem;
    padding: 2px 4px;
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
  }

  /* Mobile adjustments */
  @media (max-width: 640px) {
    .command-backdrop {
      padding-top: var(--spacing-4);
      align-items: flex-start;
    }

    .command-dialog {
      max-height: calc(100vh - var(--spacing-8));
      margin: 0 var(--spacing-2);
    }

    .command-footer {
      display: none;
    }
  }
</style>
