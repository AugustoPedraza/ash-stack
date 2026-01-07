<script>
  /**
   * Filter & Sort Recipe
   * Combined filtering UI with active filter chips, clear all, result count.
   *
   * Uses: Button, Input, Badge, Card
   */
  import { Button, Input, Badge, Card } from '../../ui';

  // Mock product data
  const allProducts = [
    { id: 1, name: 'Wireless Headphones', category: 'electronics', price: 199, rating: 4.5, inStock: true },
    { id: 2, name: 'Running Shoes', category: 'sports', price: 129, rating: 4.2, inStock: true },
    { id: 3, name: 'Coffee Maker', category: 'home', price: 79, rating: 4.8, inStock: false },
    { id: 4, name: 'Yoga Mat', category: 'sports', price: 49, rating: 4.0, inStock: true },
    { id: 5, name: 'Smart Watch', category: 'electronics', price: 299, rating: 4.6, inStock: true },
    { id: 6, name: 'Desk Lamp', category: 'home', price: 59, rating: 4.3, inStock: true },
    { id: 7, name: 'Bluetooth Speaker', category: 'electronics', price: 89, rating: 4.4, inStock: false },
    { id: 8, name: 'Tennis Racket', category: 'sports', price: 149, rating: 4.1, inStock: true },
    { id: 9, name: 'Air Purifier', category: 'home', price: 249, rating: 4.7, inStock: true },
    { id: 10, name: 'Fitness Tracker', category: 'electronics', price: 149, rating: 4.3, inStock: true },
    { id: 11, name: 'Dumbbells Set', category: 'sports', price: 99, rating: 4.5, inStock: false },
    { id: 12, name: 'Stand Mixer', category: 'home', price: 349, rating: 4.9, inStock: true }
  ];

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'sports', label: 'Sports' },
    { value: 'home', label: 'Home' }
  ];

  const priceRanges = [
    { value: '', label: 'Any Price' },
    { value: '0-50', label: 'Under $50' },
    { value: '50-100', label: '$50 - $100' },
    { value: '100-200', label: '$100 - $200' },
    { value: '200+', label: 'Over $200' }
  ];

  const sortOptions = [
    { value: 'name-asc', label: 'Name A-Z' },
    { value: 'name-desc', label: 'Name Z-A' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating-desc', label: 'Highest Rated' }
  ];

  // Filter state
  let searchQuery = $state('');
  let categoryFilter = $state('');
  let priceFilter = $state('');
  let inStockOnly = $state(false);
  let sortBy = $state('name-asc');
  let showFilters = $state(false);

  // Dropdown states
  let showCategoryDropdown = $state(false);
  let showPriceDropdown = $state(false);
  let showSortDropdown = $state(false);

  // Active filters for display
  const activeFilters = $derived.by(() => {
    const filters = [];
    if (categoryFilter) {
      filters.push({ key: 'category', label: categories.find(c => c.value === categoryFilter)?.label || categoryFilter });
    }
    if (priceFilter) {
      filters.push({ key: 'price', label: priceRanges.find(p => p.value === priceFilter)?.label || priceFilter });
    }
    if (inStockOnly) {
      filters.push({ key: 'stock', label: 'In Stock' });
    }
    return filters;
  });

  // Filtered and sorted products
  const filteredProducts = $derived.by(() => {
    let result = [...allProducts];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(query));
    }

    // Category filter
    if (categoryFilter) {
      result = result.filter(p => p.category === categoryFilter);
    }

    // Price filter
    if (priceFilter) {
      result = result.filter(p => {
        switch (priceFilter) {
          case '0-50': return p.price < 50;
          case '50-100': return p.price >= 50 && p.price < 100;
          case '100-200': return p.price >= 100 && p.price < 200;
          case '200+': return p.price >= 200;
          default: return true;
        }
      });
    }

    // Stock filter
    if (inStockOnly) {
      result = result.filter(p => p.inStock);
    }

    // Sort
    const [sortField, sortDir] = sortBy.split('-');
    result.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();
      if (sortDir === 'asc') return aVal > bVal ? 1 : -1;
      return aVal < bVal ? 1 : -1;
    });

    return result;
  });

  // Label getters
  const categoryLabel = $derived(categories.find(c => c.value === categoryFilter)?.label || 'All Categories');
  const priceLabel = $derived(priceRanges.find(p => p.value === priceFilter)?.label || 'Any Price');
  const sortLabel = $derived(sortOptions.find(s => s.value === sortBy)?.label || 'Name A-Z');

  function selectCategory(value) {
    categoryFilter = value;
    showCategoryDropdown = false;
  }

  function selectPrice(value) {
    priceFilter = value;
    showPriceDropdown = false;
  }

  function selectSort(value) {
    sortBy = value;
    showSortDropdown = false;
  }

  function removeFilter(key) {
    switch (key) {
      case 'category': categoryFilter = ''; break;
      case 'price': priceFilter = ''; break;
      case 'stock': inStockOnly = false; break;
    }
  }

  function clearAllFilters() {
    searchQuery = '';
    categoryFilter = '';
    priceFilter = '';
    inStockOnly = false;
    sortBy = 'name-asc';
  }

  function formatPrice(price) {
    return `$${price.toFixed(0)}`;
  }

  function closeAllDropdowns() {
    showCategoryDropdown = false;
    showPriceDropdown = false;
    showSortDropdown = false;
  }
</script>

<div class="h-full bg-base-100 flex flex-col overflow-hidden">
  <!-- Header with Search -->
  <div class="sticky top-0 z-10 bg-base-100 border-b border-border px-5 py-4">
    <div class="flex items-center gap-3">
      <div class="flex-1 flex items-center gap-2 px-3 h-12 border border-border-strong rounded-lg focus-within:border-primary">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-text-disabled shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search products..."
          class="flex-1 bg-transparent text-sm text-text"
          style="outline: none !important; border: none !important; box-shadow: none !important;"
          bind:value={searchQuery}
        />
      </div>
      <button
        type="button"
        class="w-12 h-12 flex items-center justify-center rounded-lg text-text-muted hover:text-text hover:bg-surface-sunken transition-colors relative"
        onclick={() => showFilters = !showFilters}
        aria-label="Toggle filters"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        {#if activeFilters.length > 0}
          <Badge variant="primary" size="sm" class="absolute -top-1 -right-1">
            {activeFilters.length}
          </Badge>
        {/if}
      </button>
    </div>

    <!-- Filter Panel -->
    {#if showFilters}
      <div class="mt-4 pt-4 border-t border-border space-y-4">
        <div class="grid grid-cols-2 gap-3">
          <!-- Category Dropdown -->
          <div class="flex flex-col gap-1.5">
            <span class="text-sm font-medium text-text">Category</span>
            <div class="relative">
              <button
                type="button"
                class="w-full flex items-center justify-between px-3 py-2 text-sm border border-border-strong rounded-lg bg-surface text-left hover:border-primary transition-colors"
                onclick={() => { closeAllDropdowns(); showCategoryDropdown = !showCategoryDropdown; }}
              >
                <span class="{categoryFilter ? 'text-text' : 'text-text-disabled'}">{categoryLabel}</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-text-disabled" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {#if showCategoryDropdown}
                <div class="absolute top-full left-0 right-0 mt-1 bg-surface border border-border-strong rounded-lg shadow-lg z-20 overflow-hidden">
                  {#each categories as cat}
                    <button
                      type="button"
                      class="w-full px-3 py-2 text-left text-sm transition-colors
                        {categoryFilter === cat.value ? 'bg-primary/10 text-primary font-medium' : 'text-text hover:bg-surface-sunken'}"
                      onclick={() => selectCategory(cat.value)}
                    >
                      {cat.label}
                    </button>
                  {/each}
                </div>
              {/if}
            </div>
          </div>

          <!-- Price Dropdown -->
          <div class="flex flex-col gap-1.5">
            <span class="text-sm font-medium text-text">Price Range</span>
            <div class="relative">
              <button
                type="button"
                class="w-full flex items-center justify-between px-3 py-2 text-sm border border-border-strong rounded-lg bg-surface text-left hover:border-primary transition-colors"
                onclick={() => { closeAllDropdowns(); showPriceDropdown = !showPriceDropdown; }}
              >
                <span class="{priceFilter ? 'text-text' : 'text-text-disabled'}">{priceLabel}</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-text-disabled" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {#if showPriceDropdown}
                <div class="absolute top-full left-0 right-0 mt-1 bg-surface border border-border-strong rounded-lg shadow-lg z-20 overflow-hidden">
                  {#each priceRanges as range}
                    <button
                      type="button"
                      class="w-full px-3 py-2 text-left text-sm transition-colors
                        {priceFilter === range.value ? 'bg-primary/10 text-primary font-medium' : 'text-text hover:bg-surface-sunken'}"
                      onclick={() => selectPrice(range.value)}
                    >
                      {range.label}
                    </button>
                  {/each}
                </div>
              {/if}
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" class="w-4 h-4 rounded border-border-strong accent-primary" bind:checked={inStockOnly} />
            <span class="text-sm text-text">In Stock Only</span>
          </label>

          <!-- Sort Dropdown -->
          <div class="flex items-center gap-2">
            <span class="text-sm text-text-muted">Sort:</span>
            <div class="relative">
              <button
                type="button"
                class="flex items-center gap-1 px-3 py-1.5 text-sm border border-border-strong rounded-lg bg-surface hover:border-primary transition-colors"
                onclick={() => { closeAllDropdowns(); showSortDropdown = !showSortDropdown; }}
              >
                <span class="text-text">{sortLabel}</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-text-disabled" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {#if showSortDropdown}
                <div class="absolute top-full right-0 mt-1 bg-surface border border-border-strong rounded-lg shadow-lg z-20 overflow-hidden min-w-40">
                  {#each sortOptions as opt}
                    <button
                      type="button"
                      class="w-full px-3 py-2 text-left text-sm transition-colors
                        {sortBy === opt.value ? 'bg-primary/10 text-primary font-medium' : 'text-text hover:bg-surface-sunken'}"
                      onclick={() => selectSort(opt.value)}
                    >
                      {opt.label}
                    </button>
                  {/each}
                </div>
              {/if}
            </div>
          </div>
        </div>
      </div>
    {/if}
  </div>

  <div class="px-5 py-4">
    <!-- Active Filters & Result Count -->
    <div class="flex items-center justify-between mb-4">
      <p class="text-sm text-text-muted">
        <span class="font-medium text-text">{filteredProducts.length}</span>
        {filteredProducts.length === 1 ? 'result' : 'results'}
        {#if searchQuery.trim()}
          for "{searchQuery}"
        {/if}
      </p>

      {#if activeFilters.length > 0}
        <Button variant="ghost" size="sm" onclick={clearAllFilters}>
          Clear All
        </Button>
      {/if}
    </div>

    <!-- Active Filter Chips -->
    {#if activeFilters.length > 0}
      <div class="flex flex-wrap gap-2 mb-4">
        {#each activeFilters as filter}
          <span class="inline-flex items-center gap-1 px-3 py-1 bg-surface-sunken text-text rounded-full text-sm">
            {filter.label}
            <button
              type="button"
              class="hover:bg-border rounded-full p-0.5 transition-colors"
              onclick={() => removeFilter(filter.key)}
              aria-label="Remove filter"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </span>
        {/each}
      </div>
    {/if}

    <!-- Product Grid -->
    {#if filteredProducts.length === 0}
      <div class="flex flex-col items-center justify-center py-12 text-center">
        <div class="w-16 h-16 rounded-full bg-surface-sunken text-text-disabled flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-text mb-2">No products found</h3>
        <p class="text-text-muted mb-4">Try adjusting your filters or search term.</p>
        <Button variant="secondary" size="sm" onclick={clearAllFilters}>
          Clear Filters
        </Button>
      </div>
    {:else}
      <div class="grid grid-cols-2 gap-3">
        {#each filteredProducts as product}
          <Card variant="outlined" padding="md">
            <!-- Product Image Placeholder -->
            <div class="aspect-square bg-surface-sunken rounded-lg mb-3 flex items-center justify-center text-text-disabled">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
                <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>

            <!-- Product Info -->
            <h3 class="font-medium text-text text-sm mb-1 line-clamp-2">{product.name}</h3>

            <div class="flex items-center gap-1 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-warning" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span class="text-xs text-text-muted">{product.rating}</span>
            </div>

            <div class="flex items-center justify-between">
              <span class="font-semibold text-text">{formatPrice(product.price)}</span>
              {#if !product.inStock}
                <Badge variant="error" size="sm">Out of Stock</Badge>
              {/if}
            </div>
          </Card>
        {/each}
      </div>
    {/if}
  </div>
</div>

<!-- Click outside handlers -->
{#if showCategoryDropdown}
  <button class="fixed inset-0 z-10" onclick={() => showCategoryDropdown = false} aria-label="Close"></button>
{/if}
{#if showPriceDropdown}
  <button class="fixed inset-0 z-10" onclick={() => showPriceDropdown = false} aria-label="Close"></button>
{/if}
{#if showSortDropdown}
  <button class="fixed inset-0 z-10" onclick={() => showSortDropdown = false} aria-label="Close"></button>
{/if}
