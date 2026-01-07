<script>
  /**
   * Sidebar
   * Navigation sidebar for the playground.
   * Used in both desktop (always visible) and mobile (drawer) modes.
   */

  let {
    categories = [],
    activeCategory = null,
    activeRecipe = null,
    onNavigate = () => {},
    mobile = false
  } = $props();

  let expandedCategories = $state(new Set());

  function toggleCategory(categoryId) {
    if (expandedCategories.has(categoryId)) {
      expandedCategories.delete(categoryId);
    } else {
      expandedCategories.add(categoryId);
    }
    expandedCategories = new Set(expandedCategories);
  }

  function handleRecipeClick(categoryId, recipeId) {
    onNavigate(categoryId, recipeId);
  }
</script>

<div class="flex flex-col h-full">
  <!-- Header (desktop only - mobile has its own header) -->
  {#if !mobile}
    <div class="p-4 border-b border-base-300">
      <h1 class="text-lg font-bold text-base-content">Dev Playground</h1>
    </div>
  {/if}

  <!-- Navigation -->
  <nav class="flex-1 overflow-y-auto p-2">
    {#each categories as category}
      <div class="mb-1">
        <button
          class="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
            {activeCategory === category.id ? 'bg-primary text-primary-content' : 'hover:bg-base-300 text-base-content'}"
          onclick={() => toggleCategory(category.id)}
        >
          <span class="flex-1 text-left">{category.label}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 transition-transform {expandedCategories.has(category.id) ? 'rotate-90' : ''}"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {#if expandedCategories.has(category.id)}
          <div class="ml-3 mt-1 space-y-0.5 border-l-2 border-base-300 pl-3">
            {#each category.recipes as recipe}
              <button
                class="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors
                  {activeRecipe === recipe.id
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-base-content/70 hover:text-base-content hover:bg-base-200'}"
                onclick={() => handleRecipeClick(category.id, recipe.id)}
              >
                {recipe.name}
              </button>
            {/each}
          </div>
        {/if}
      </div>
    {/each}
  </nav>

  <!-- Footer -->
  <div class="p-4 border-t border-base-300">
    <p class="text-xs text-base-content/50">
      53 recipes across 13 categories
    </p>
  </div>
</div>
