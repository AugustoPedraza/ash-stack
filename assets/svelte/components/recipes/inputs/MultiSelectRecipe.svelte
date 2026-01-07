<script>
  /**
   * Multi-Select Recipe
   * Clean multi-select with consistent styling, proper dropdown behavior.
   *
   * Uses: Button, Badge
   */
  import { Button, Badge } from '../../ui';

  // Available options
  const allOptions = [
    { id: 'react', label: 'React' },
    { id: 'vue', label: 'Vue.js' },
    { id: 'svelte', label: 'Svelte' },
    { id: 'angular', label: 'Angular' },
    { id: 'nextjs', label: 'Next.js' },
    { id: 'nuxt', label: 'Nuxt' },
    { id: 'remix', label: 'Remix' },
    { id: 'astro', label: 'Astro' },
    { id: 'solid', label: 'SolidJS' },
    { id: 'qwik', label: 'Qwik' }
  ];

  // State
  let selected = $state([]);
  let searchQuery = $state('');
  let showDropdown = $state(false);
  let inputRef = $state(null);

  const MAX_ITEMS = 5;

  // Filter options based on search
  const filteredOptions = $derived.by(() => {
    let filtered = allOptions;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(opt =>
        opt.label.toLowerCase().includes(query)
      );
    }

    return filtered;
  });

  const isAtMax = $derived(selected.length >= MAX_ITEMS);

  function isSelected(id) {
    return selected.some(s => s.id === id);
  }

  function toggleOption(option) {
    if (isSelected(option.id)) {
      selected = selected.filter(s => s.id !== option.id);
    } else if (!isAtMax) {
      selected = [...selected, option];
    }
    // Keep dropdown open for multi-select
  }

  function removeOption(id) {
    selected = selected.filter(s => s.id !== id);
  }

  function clearAll() {
    selected = [];
    searchQuery = '';
  }

  function openDropdown() {
    showDropdown = true;
    searchQuery = '';
  }

  function closeDropdown() {
    showDropdown = false;
    searchQuery = '';
  }

  function handleKeydown(e) {
    if (e.key === 'Escape') {
      closeDropdown();
    }
  }

  function handleClickOutside(e) {
    // Close if clicking outside
    setTimeout(() => {
      showDropdown = false;
    }, 150);
  }
</script>

<div class="h-full bg-background overflow-y-auto px-5 py-6">
  <div class="max-w-md mx-auto">
    <div class="mb-8">
      <h1 class="text-xl font-semibold text-foreground mb-2">Multi-Select</h1>
      <p class="text-muted-foreground text-sm">Select multiple options from a dropdown list.</p>
    </div>

    <div class="flex flex-col gap-6">
      <!-- Multi-Select Field -->
      <div class="flex flex-col gap-1.5">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-foreground">Technologies</span>
          <span class="text-xs text-muted-foreground">{selected.length}/{MAX_ITEMS}</span>
        </div>

        <!-- Trigger Button -->
        <div class="relative">
          <button
            type="button"
            class="w-full flex items-center justify-between px-3 py-2.5 border border-border-strong rounded-lg bg-background text-left hover:border-primary transition-colors"
            onclick={openDropdown}
          >
            <span class="{selected.length > 0 ? 'text-foreground' : 'text-muted-foreground'}">
              {#if selected.length === 0}
                Select technologies...
              {:else if selected.length === 1}
                {selected[0].label}
              {:else}
                {selected.length} selected
              {/if}
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-muted-foreground transition-transform {showDropdown ? 'rotate-180' : ''}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- Dropdown -->
          {#if showDropdown}
            <div class="absolute top-full left-0 right-0 mt-1 bg-background border border-border-strong rounded-lg shadow-lg z-20 overflow-hidden">
              <!-- Search (minimal, embedded style) -->
              <div class="px-3 py-2 border-b border-border">
                <input
                  bind:this={inputRef}
                  type="text"
                  class="w-full text-sm bg-transparent outline-none placeholder:text-text-disabled text-foreground"
                  placeholder="Search..."
                  bind:value={searchQuery}
                  onkeydown={handleKeydown}
                />
              </div>

              <!-- Options List -->
              <div class="max-h-48 overflow-y-auto">
                {#each filteredOptions as option}
                  {@const checked = isSelected(option.id)}
                  {@const disabled = !checked && isAtMax}
                  <button
                    type="button"
                    class="w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm transition-colors
                      {disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-surface-sunken'}
                      {checked ? 'bg-primary/5' : ''}"
                    onclick={() => !disabled && toggleOption(option)}
                    disabled={disabled}
                  >
                    <span class="w-5 h-5 flex items-center justify-center rounded border-2 transition-colors
                      {checked ? 'bg-primary border-primary' : 'border-border-strong'}">
                      {#if checked}
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      {/if}
                    </span>
                    <span class="text-foreground">{option.label}</span>
                  </button>
                {:else}
                  <div class="px-3 py-4 text-center text-sm text-muted-foreground">
                    No results found
                  </div>
                {/each}
              </div>

              <!-- Footer -->
              <div class="flex items-center justify-between p-2 border-t border-border bg-surface-sunken">
                {#if selected.length > 0}
                  <button
                    type="button"
                    class="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    onclick={clearAll}
                  >
                    Clear all
                  </button>
                {:else}
                  <span></span>
                {/if}
                <Button variant="ghost" size="sm" onclick={closeDropdown}>
                  Done
                </Button>
              </div>
            </div>
          {/if}
        </div>

        {#if isAtMax}
          <p class="text-xs text-muted-foreground">Maximum {MAX_ITEMS} items</p>
        {/if}
      </div>

      <!-- Selected Items Display (outside the input) -->
      {#if selected.length > 0}
        <div class="flex flex-col gap-1.5">
          <span class="text-sm font-medium text-foreground">Selected</span>
          <div class="flex flex-wrap gap-2">
            {#each selected as item}
              <span class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-surface-sunken text-foreground rounded-lg text-sm">
                {item.label}
                <button
                  type="button"
                  class="hover:bg-border rounded p-0.5 transition-colors"
                  onclick={() => removeOption(item.id)}
                  aria-label="Remove {item.label}"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            {/each}
          </div>
        </div>
      {/if}

      <!-- Alternative: Checkbox List Style -->
      <div class="pt-6 border-t border-border">
        <h3 class="text-sm font-medium text-foreground mb-3">Alternative: Inline Checkboxes</h3>
        <p class="text-xs text-muted-foreground mb-3">For shorter lists, inline checkboxes can be clearer.</p>

        <div class="flex flex-col gap-2">
          {#each allOptions.slice(0, 5) as option}
            {@const checked = isSelected(option.id)}
            {@const disabled = !checked && isAtMax}
            <button
              type="button"
              class="flex items-center gap-3 p-3 border border-border-strong rounded-lg transition-colors text-left
                {disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-surface-sunken cursor-pointer'}
                {checked ? 'border-primary bg-primary/5' : ''}"
              onclick={() => !disabled && toggleOption(option)}
              disabled={disabled}
            >
              <span
                class="w-5 h-5 shrink-0 rounded border-2 flex items-center justify-center transition-colors
                  {checked ? 'bg-primary border-primary' : 'bg-background border-border-strong'}"
              >
                {#if checked}
                  <svg class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                {/if}
              </span>
              <span class="text-sm text-foreground">{option.label}</span>
            </button>
          {/each}
        </div>
      </div>

      <!-- Selected Values Display -->
      {#if selected.length > 0}
        <div class="p-4 bg-surface-sunken rounded-lg">
          <h3 class="text-sm font-medium text-foreground mb-2">Form Value</h3>
          <pre class="text-xs text-muted-foreground overflow-x-auto">{JSON.stringify(selected.map(s => s.id), null, 2)}</pre>
        </div>
      {/if}
    </div>
  </div>
</div>

<!-- Click outside handler -->
{#if showDropdown}
  <button
    class="fixed inset-0 z-10"
    onclick={closeDropdown}
    aria-label="Close dropdown"
  ></button>
{/if}
