<!--
  SearchInput Component
  Search input with suggestions dropdown and keyboard navigation.
-->
<script>
  import { createEventDispatcher, tick } from 'svelte';
  import { fade, fly } from 'svelte/transition';

  const dispatch = createEventDispatcher();

  /**
   * Current search value
   * @type {string}
   */
  export let value = '';

  /**
   * Placeholder text
   * @type {string}
   */
  export let placeholder = 'Search...';

  /**
   * Suggestions to display
   * @type {Array<{ id: string | number, label: string, description?: string, icon?: string, group?: string }>}
   */
  export let suggestions = [];

  /**
   * Loading state (fetching suggestions)
   * @type {boolean}
   */
  export let loading = false;

  /**
   * Minimum characters before showing suggestions
   * @type {number}
   */
  export let minChars = 1;

  /**
   * Debounce delay in ms
   * @type {number}
   */
  export let debounce = 300;

  /**
   * Maximum suggestions to show
   * @type {number}
   */
  export let maxSuggestions = 10;

  /**
   * Show clear button
   * @type {boolean}
   */
  export let clearable = true;

  /**
   * Size variant
   * @type {'sm' | 'md' | 'lg'}
   */
  export let size = 'md';

  /**
   * Disabled state
   * @type {boolean}
   */
  export let disabled = false;

  /**
   * Show recent searches
   * @type {boolean}
   */
  export let showRecent = true;

  /**
   * Maximum recent searches
   * @type {number}
   */
  export let maxRecent = 5;

  /**
   * Storage key for recent searches
   * @type {string}
   */
  export let storageKey = 'search-recent';

  let inputEl;
  let open = false;
  let selectedIndex = -1;
  let debounceTimer;
  let recentSearches = [];

  // Load recent searches
  $: if (showRecent && typeof localStorage !== 'undefined') {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) recentSearches = JSON.parse(stored);
    } catch (e) {}
  }

  // Filter and limit suggestions
  $: displaySuggestions = suggestions.slice(0, maxSuggestions);

  // Group suggestions
  $: groupedSuggestions = groupSuggestions(displaySuggestions);

  function groupSuggestions(items) {
    const groups = new Map();
    items.forEach(item => {
      const group = item.group || '';
      if (!groups.has(group)) groups.set(group, []);
      groups.get(group).push(item);
    });
    return groups;
  }

  // Show dropdown conditions
  $: shouldShowDropdown = open && (
    (value.length >= minChars && (displaySuggestions.length > 0 || loading)) ||
    (value.length === 0 && showRecent && recentSearches.length > 0)
  );

  function handleInput(e) {
    value = e.target.value;
    selectedIndex = -1;
    open = true;

    // Debounce search event
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      dispatch('search', { query: value });
    }, debounce);
  }

  function handleFocus() {
    open = true;
  }

  function handleBlur() {
    // Delay to allow click on suggestion
    setTimeout(() => {
      open = false;
      selectedIndex = -1;
    }, 200);
  }

  function handleKeydown(e) {
    const items = displaySuggestions.length > 0
      ? displaySuggestions
      : (showRecent ? recentSearches.map(s => ({ id: s, label: s })) : []);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        selectedIndex = Math.max(selectedIndex - 1, -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && items[selectedIndex]) {
          selectSuggestion(items[selectedIndex]);
        } else {
          submit();
        }
        break;
      case 'Escape':
        e.preventDefault();
        open = false;
        inputEl?.blur();
        break;
    }
  }

  function selectSuggestion(item) {
    value = item.label;
    open = false;
    selectedIndex = -1;
    saveRecent(item.label);
    dispatch('select', { item });
    dispatch('submit', { query: value });
  }

  function submit() {
    if (value.trim()) {
      saveRecent(value);
      dispatch('submit', { query: value });
    }
    open = false;
  }

  function clear() {
    value = '';
    open = false;
    dispatch('clear');
    inputEl?.focus();
  }

  function saveRecent(query) {
    if (!showRecent || !query.trim()) return;

    recentSearches = [
      query,
      ...recentSearches.filter(s => s !== query)
    ].slice(0, maxRecent);

    try {
      localStorage.setItem(storageKey, JSON.stringify(recentSearches));
    } catch (e) {}
  }

  function clearRecent() {
    recentSearches = [];
    try {
      localStorage.removeItem(storageKey);
    } catch (e) {}
  }

  function removeRecent(search, e) {
    e.stopPropagation();
    recentSearches = recentSearches.filter(s => s !== search);
    try {
      localStorage.setItem(storageKey, JSON.stringify(recentSearches));
    } catch (e) {}
  }
</script>

<div class="search-input size-{size}" class:disabled>
  <div class="input-wrapper">
    <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>

    <input
      bind:this={inputEl}
      type="text"
      {value}
      {placeholder}
      {disabled}
      class="input"
      on:input={handleInput}
      on:focus={handleFocus}
      on:blur={handleBlur}
      on:keydown={handleKeydown}
      role="combobox"
      aria-expanded={shouldShowDropdown}
      aria-haspopup="listbox"
      aria-autocomplete="list"
      autocomplete="off"
    />

    {#if loading}
      <span class="spinner" />
    {:else if clearable && value}
      <button
        type="button"
        class="clear-button"
        on:click={clear}
        aria-label="Clear search"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
    {/if}
  </div>

  {#if shouldShowDropdown}
    <div
      class="dropdown"
      role="listbox"
      transition:fly={{ y: -10, duration: 150 }}
    >
      {#if value.length === 0 && showRecent && recentSearches.length > 0}
        <!-- Recent searches -->
        <div class="dropdown-header">
          <span>Recent searches</span>
          <button type="button" class="clear-recent" on:click={clearRecent}>
            Clear all
          </button>
        </div>
        {#each recentSearches as search, i}
          <button
            type="button"
            class="suggestion-item recent"
            class:selected={i === selectedIndex}
            on:click={() => selectSuggestion({ id: search, label: search })}
          >
            <svg class="recent-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span class="suggestion-label">{search}</span>
            <button
              type="button"
              class="remove-recent"
              on:click={(e) => removeRecent(search, e)}
              aria-label="Remove from recent"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </button>
        {/each}
      {:else if loading}
        <div class="dropdown-loading">
          <span class="spinner" />
          <span>Searching...</span>
        </div>
      {:else if displaySuggestions.length === 0}
        <div class="dropdown-empty">
          No results found
        </div>
      {:else}
        {#each [...groupedSuggestions] as [groupName, items]}
          {#if groupName}
            <div class="dropdown-group">{groupName}</div>
          {/if}
          {#each items as item, i}
            {@const globalIndex = displaySuggestions.indexOf(item)}
            <button
              type="button"
              class="suggestion-item"
              class:selected={globalIndex === selectedIndex}
              on:click={() => selectSuggestion(item)}
              on:mouseenter={() => selectedIndex = globalIndex}
              role="option"
              aria-selected={globalIndex === selectedIndex}
            >
              {#if item.icon}
                <span class="suggestion-icon">{@html item.icon}</span>
              {/if}
              <div class="suggestion-content">
                <span class="suggestion-label">{item.label}</span>
                {#if item.description}
                  <span class="suggestion-description">{item.description}</span>
                {/if}
              </div>
            </button>
          {/each}
        {/each}
      {/if}
    </div>
  {/if}
</div>

<style>
  .search-input {
    position: relative;
    width: 100%;
  }

  .search-input.disabled {
    opacity: 0.6;
    pointer-events: none;
  }

  .input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .search-icon {
    position: absolute;
    left: var(--spacing-3);
    width: 1.25rem;
    height: 1.25rem;
    color: var(--color-text-muted);
    pointer-events: none;
  }

  .input {
    width: 100%;
    padding-left: calc(var(--spacing-3) + 1.25rem + var(--spacing-2));
    padding-right: calc(var(--spacing-3) + 1.25rem + var(--spacing-2));
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background-color: var(--color-surface);
    color: var(--color-text);
    font-family: inherit;
    transition: border-color 150ms ease, box-shadow 150ms ease;
  }

  .input::placeholder {
    color: var(--color-text-muted);
  }

  .input:focus {
    outline: none;
    border-color: var(--color-border-focus);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 20%, transparent);
  }

  /* Sizes */
  .size-sm .input {
    height: 2rem;
    font-size: 0.875rem;
  }

  .size-md .input {
    height: 2.5rem;
    font-size: 0.9375rem;
  }

  .size-lg .input {
    height: 3rem;
    font-size: 1rem;
  }

  .clear-button {
    position: absolute;
    right: var(--spacing-2);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;
    padding: 0;
    background: none;
    border: none;
    border-radius: var(--radius-sm);
    color: var(--color-text-muted);
    cursor: pointer;
    transition: color 150ms ease, background-color 150ms ease;
  }

  .clear-button:hover {
    color: var(--color-text);
    background-color: var(--color-surface-raised);
  }

  .clear-button svg {
    width: 1rem;
    height: 1rem;
  }

  .spinner {
    position: absolute;
    right: var(--spacing-3);
    width: 1rem;
    height: 1rem;
    border: 2px solid var(--color-border);
    border-top-color: var(--color-primary);
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* Dropdown */
  .dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    z-index: var(--z-dropdown);
    margin-top: var(--spacing-1);
    max-height: 20rem;
    overflow-y: auto;
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);
  }

  .dropdown-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-2) var(--spacing-3);
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 1px solid var(--color-border);
  }

  .clear-recent {
    font-size: 0.75rem;
    font-weight: 400;
    text-transform: none;
    letter-spacing: normal;
    color: var(--color-primary);
    background: none;
    border: none;
    cursor: pointer;
  }

  .clear-recent:hover {
    text-decoration: underline;
  }

  .dropdown-group {
    padding: var(--spacing-2) var(--spacing-3);
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .dropdown-loading,
  .dropdown-empty {
    padding: var(--spacing-4);
    text-align: center;
    color: var(--color-text-muted);
    font-size: 0.875rem;
  }

  .dropdown-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-2);
  }

  .suggestion-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-3);
    width: 100%;
    padding: var(--spacing-2) var(--spacing-3);
    background: none;
    border: none;
    text-align: left;
    cursor: pointer;
    transition: background-color 100ms ease;
  }

  .suggestion-item:hover,
  .suggestion-item.selected {
    background-color: var(--color-surface-raised);
  }

  .suggestion-item.recent {
    color: var(--color-text-muted);
  }

  .recent-icon {
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
  }

  .remove-recent {
    margin-left: auto;
    padding: var(--spacing-1);
    background: none;
    border: none;
    color: var(--color-text-disabled);
    cursor: pointer;
    opacity: 0;
    transition: opacity 150ms ease, color 150ms ease;
  }

  .suggestion-item:hover .remove-recent {
    opacity: 1;
  }

  .remove-recent:hover {
    color: var(--color-error);
  }

  .remove-recent svg {
    width: 0.875rem;
    height: 0.875rem;
  }

  .suggestion-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.25rem;
    height: 1.25rem;
    flex-shrink: 0;
    color: var(--color-text-muted);
  }

  .suggestion-icon :global(svg) {
    width: 100%;
    height: 100%;
  }

  .suggestion-content {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
  }

  .suggestion-label {
    font-size: 0.9375rem;
    color: var(--color-text);
  }

  .suggestion-description {
    font-size: 0.8125rem;
    color: var(--color-text-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
