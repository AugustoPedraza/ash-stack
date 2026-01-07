<script>
  /**
   * Searchable Select Recipe
   * Async search dropdown with suggestions and selection.
   */

  // Mock data - countries
  const allOptions = [
    { id: 'us', label: 'United States', flag: '🇺🇸' },
    { id: 'gb', label: 'United Kingdom', flag: '🇬🇧' },
    { id: 'ca', label: 'Canada', flag: '🇨🇦' },
    { id: 'au', label: 'Australia', flag: '🇦🇺' },
    { id: 'de', label: 'Germany', flag: '🇩🇪' },
    { id: 'fr', label: 'France', flag: '🇫🇷' },
    { id: 'jp', label: 'Japan', flag: '🇯🇵' },
    { id: 'br', label: 'Brazil', flag: '🇧🇷' },
    { id: 'in', label: 'India', flag: '🇮🇳' },
    { id: 'mx', label: 'Mexico', flag: '🇲🇽' },
    { id: 'es', label: 'Spain', flag: '🇪🇸' },
    { id: 'it', label: 'Italy', flag: '🇮🇹' },
    { id: 'nl', label: 'Netherlands', flag: '🇳🇱' },
    { id: 'kr', label: 'South Korea', flag: '🇰🇷' },
    { id: 'sg', label: 'Singapore', flag: '🇸🇬' },
  ];

  // State
  let isOpen = $state(false);
  let query = $state('');
  let selectedOption = $state(null);
  let highlightedIndex = $state(0);
  let loading = $state(false);
  let inputElement = $state(null);
  let containerElement = $state(null);

  // Simulated async search
  let filteredOptions = $state([]);
  let searchTimeout = null;

  function search(searchQuery) {
    clearTimeout(searchTimeout);

    if (!searchQuery.trim()) {
      filteredOptions = allOptions.slice(0, 8);
      loading = false;
      return;
    }

    loading = true;

    // Simulate API delay
    searchTimeout = setTimeout(() => {
      const q = searchQuery.toLowerCase();
      filteredOptions = allOptions.filter(opt =>
        opt.label.toLowerCase().includes(q) ||
        opt.id.toLowerCase().includes(q)
      );
      loading = false;
      highlightedIndex = 0;
    }, 300);
  }

  function openDropdown() {
    isOpen = true;
    query = '';
    filteredOptions = allOptions.slice(0, 8);
    highlightedIndex = 0;
    setTimeout(() => inputElement?.focus(), 50);
  }

  function closeDropdown() {
    isOpen = false;
    query = '';
  }

  function selectOption(option) {
    selectedOption = option;
    closeDropdown();
  }

  function clearSelection(e) {
    e.stopPropagation();
    selectedOption = null;
  }

  function handleInputChange(e) {
    query = e.target.value;
    search(query);
  }

  function handleKeydown(e) {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        openDropdown();
      }
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      closeDropdown();
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      highlightedIndex = (highlightedIndex + 1) % filteredOptions.length;
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      highlightedIndex = (highlightedIndex - 1 + filteredOptions.length) % filteredOptions.length;
      return;
    }

    if (e.key === 'Enter' && filteredOptions[highlightedIndex]) {
      e.preventDefault();
      selectOption(filteredOptions[highlightedIndex]);
    }
  }

  function handleClickOutside(e) {
    if (containerElement && !containerElement.contains(e.target)) {
      closeDropdown();
    }
  }

  $effect(() => {
    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  });
</script>

<div class="h-full bg-background overflow-y-auto px-5 py-6">
  <div class="max-w-md mx-auto">
    <div class="mb-8">
      <h1 class="text-xl font-semibold text-foreground mb-2">Searchable Select</h1>
      <p class="text-muted-foreground text-sm">Async search dropdown with suggestions.</p>
    </div>

    <!-- Single Select -->
    <div class="mb-8">
      <span id="country-label" class="block text-sm font-medium text-foreground mb-2">Select Country</span>
      <div bind:this={containerElement} class="relative">
        <!-- Trigger -->
        <div class="flex items-center gap-2">
          <div
            class="flex-1 flex items-center gap-2 px-4 py-3 bg-background border border-border-strong rounded-xl hover:border-foreground/30 transition-colors cursor-pointer
              {isOpen ? 'border-primary ring-2 ring-primary/20' : ''}"
            role="combobox"
            tabindex="0"
            onclick={openDropdown}
            onkeydown={handleKeydown}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-controls="country-listbox"
            aria-labelledby="country-label"
          >
            {#if selectedOption}
              <span class="text-xl">{selectedOption.flag}</span>
              <span class="flex-1 text-foreground">{selectedOption.label}</span>
            {:else}
              <span class="flex-1 text-text-disabled">Choose a country...</span>
            {/if}
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-text-disabled shrink-0 transition-transform {isOpen ? 'rotate-180' : ''}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          {#if selectedOption}
            <button
              type="button"
              class="p-2 rounded-lg hover:bg-surface-sunken transition-colors"
              onclick={clearSelection}
              aria-label="Clear selection"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          {/if}
        </div>

        <!-- Dropdown -->
        {#if isOpen}
          <div class="absolute z-10 w-full mt-2 bg-background border border-border rounded-xl shadow-lg overflow-hidden">
            <!-- Search Input -->
            <div class="p-2 border-b border-border">
              <div class="flex items-center gap-2 px-3 py-2 bg-surface-sunken/50 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-text-disabled shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  bind:this={inputElement}
                  type="text"
                  value={query}
                  oninput={handleInputChange}
                  onkeydown={handleKeydown}
                  placeholder="Search countries..."
                  class="flex-1 bg-transparent text-sm text-foreground placeholder:text-text-disabled outline-none"
                />
                {#if loading}
                  <div class="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                {/if}
              </div>
            </div>

            <!-- Options List -->
            <div class="max-h-60 overflow-y-auto p-1" role="listbox">
              {#if filteredOptions.length === 0}
                <div class="px-4 py-8 text-center">
                  <p class="text-sm text-muted-foreground">No countries found</p>
                </div>
              {:else}
                {#each filteredOptions as option, index (option.id)}
                  <button
                    type="button"
                    class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left
                      {index === highlightedIndex ? 'bg-primary text-white' : 'hover:bg-surface-sunken'}
                      {selectedOption?.id === option.id ? 'font-medium' : ''}"
                    onclick={() => selectOption(option)}
                    onmouseenter={() => highlightedIndex = index}
                    role="option"
                    aria-selected={selectedOption?.id === option.id}
                  >
                    <span class="text-xl">{option.flag}</span>
                    <span class="flex-1 text-sm">{option.label}</span>
                    {#if selectedOption?.id === option.id}
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    {/if}
                  </button>
                {/each}
              {/if}
            </div>
          </div>
        {/if}
      </div>
      <p class="mt-2 text-xs text-muted-foreground">
        Selected: {selectedOption ? selectedOption.label : 'None'}
      </p>
    </div>

    <!-- Multiple Select Style Preview -->
    <div class="mb-8">
      <h2 class="text-sm font-medium text-foreground mb-4">Multi-Select Preview</h2>
      <div class="p-4 bg-surface-sunken/50 rounded-xl">
        <div class="flex flex-wrap gap-2 p-3 bg-background border border-border-strong rounded-lg min-h-[48px]">
          <!-- Sample chips -->
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary rounded-full text-sm">
            🇺🇸 United States
            <button type="button" class="p-0.5 rounded-full hover:bg-primary/20" aria-label="Remove">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </span>
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary rounded-full text-sm">
            🇬🇧 United Kingdom
            <button type="button" class="p-0.5 rounded-full hover:bg-primary/20" aria-label="Remove">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </span>
          <input
            type="text"
            placeholder="Add more..."
            class="flex-1 min-w-[100px] bg-transparent text-sm outline-none placeholder:text-text-disabled"
          />
        </div>
        <p class="text-xs text-muted-foreground mt-2">Multi-select with chip display</p>
      </div>
    </div>

    <!-- Mobile UX Note -->
    <div class="p-4 bg-primary/5 border border-primary/20 rounded-lg">
      <h3 class="text-sm font-medium text-primary mb-2">Mobile UX Patterns</h3>
      <ul class="text-xs text-muted-foreground space-y-1">
        <li>Debounce search input (300ms)</li>
        <li>Show loading during search</li>
        <li>Keyboard navigation support</li>
        <li>Clear selection with X button</li>
      </ul>
    </div>
  </div>
</div>
