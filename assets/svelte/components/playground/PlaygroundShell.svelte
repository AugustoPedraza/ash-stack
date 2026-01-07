<script>
  /**
   * PlaygroundShell
   * Responsive layout for the dev playground.
   * - Desktop: Max-width container with sidebar
   * - Mobile: Hamburger menu with drawer sidebar
   */
  import Sidebar from './Sidebar.svelte';
  import RecipePage from './RecipePage.svelte';

  let {
    categories = [],
    activeCategory = $bindable(null),
    activeRecipe = $bindable(null),
    children
  } = $props();

  // Mobile drawer state
  let mobileMenuOpen = $state(false);

  function handleNavigate(categoryId, recipeId) {
    activeCategory = categoryId;
    activeRecipe = recipeId;
    // Close mobile menu after navigation
    mobileMenuOpen = false;
  }

  // Get current recipe data
  const currentRecipe = $derived.by(() => {
    if (!activeCategory || !activeRecipe) return null;
    const category = categories.find(c => c.id === activeCategory);
    if (!category) return null;
    return category.recipes.find(r => r.id === activeRecipe);
  });

  // Close drawer on escape
  function handleKeydown(e) {
    if (e.key === 'Escape' && mobileMenuOpen) {
      mobileMenuOpen = false;
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- Outer container with max-width for desktop - h-screen ensures scroll containment -->
<div class="h-screen bg-accent overflow-hidden">
  <div class="max-w-7xl mx-auto bg-background h-full shadow-xl flex flex-col overflow-hidden">

    <!-- Mobile Header (visible on small screens) -->
    <header class="lg:hidden shrink-0 flex items-center h-14 px-4 border-b border-accent bg-background z-30">
      <button
        class="p-2 -ml-2 rounded-lg hover:bg-muted active:bg-accent transition-colors"
        onclick={() => mobileMenuOpen = true}
        aria-label="Open menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <h1 class="ml-3 text-lg font-semibold text-foreground">Dev Playground</h1>
    </header>

    <!-- Main layout - min-h-0 prevents flex items from overflowing -->
    <div class="flex flex-1 min-h-0 overflow-hidden">
      <!-- Desktop Sidebar (hidden on mobile) -->
      <aside class="hidden lg:flex flex-col w-64 border-r border-accent bg-muted overflow-hidden">
        <Sidebar
          {categories}
          {activeCategory}
          {activeRecipe}
          onNavigate={handleNavigate}
        />
      </aside>

      <!-- Main Content - min-h-0 ensures proper scroll containment -->
      <main class="flex-1 min-h-0 flex flex-col overflow-hidden">
        {#if currentRecipe}
          <RecipePage
            title={currentRecipe.name}
            description={currentRecipe.description}
            patterns={currentRecipe.patterns || []}
            components={currentRecipe.components || []}
          >
            {@render children?.()}
          </RecipePage>
        {:else}
          <!-- Welcome screen -->
          <div class="flex-1 flex items-center justify-center p-6">
            <div class="text-center max-w-md">
              <h1 class="text-xl lg:text-2xl font-semibold text-foreground mb-4">
                Dev Playground
              </h1>
              <p class="text-muted-foreground mb-8 text-sm lg:text-base">
                Select a recipe from the {window.innerWidth < 1024 ? 'menu' : 'sidebar'} to see fully working UI patterns.
              </p>
              <div class="grid grid-cols-2 gap-3 text-left">
                <div class="card bg-muted p-3 lg:p-4">
                  <h3 class="font-semibold text-sm">53 Recipes</h3>
                  <p class="text-xs text-muted-foreground">Copy-paste ready</p>
                </div>
                <div class="card bg-muted p-3 lg:p-4">
                  <h3 class="font-semibold text-sm">13 Categories</h3>
                  <p class="text-xs text-muted-foreground">Auth, Forms, etc.</p>
                </div>
                <div class="card bg-muted p-3 lg:p-4">
                  <h3 class="font-semibold text-sm">6 Scenarios</h3>
                  <p class="text-xs text-muted-foreground">Test all states</p>
                </div>
                <div class="card bg-muted p-3 lg:p-4">
                  <h3 class="font-semibold text-sm">Mock API</h3>
                  <p class="text-xs text-muted-foreground">Simulates backend</p>
                </div>
              </div>

              <!-- Mobile: Show button to open menu -->
              <button
                class="lg:hidden btn btn-primary mt-6"
                onclick={() => mobileMenuOpen = true}
              >
                Browse Recipes
              </button>
            </div>
          </div>
        {/if}
      </main>
    </div>
  </div>
</div>

<!-- Mobile Drawer Overlay -->
{#if mobileMenuOpen}
  <div class="lg:hidden fixed inset-0 z-50">
    <!-- Backdrop -->
    <button
      class="absolute inset-0 bg-black/50"
      onclick={() => mobileMenuOpen = false}
      aria-label="Close menu"
    ></button>

    <!-- Drawer -->
    <aside class="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-background shadow-2xl flex flex-col animate-slide-in-left">
      <!-- Drawer Header -->
      <div class="flex items-center justify-between h-14 px-4 border-b border-accent">
        <h2 class="text-lg font-bold text-foreground">Recipes</h2>
        <button
          class="p-2 -mr-2 rounded-lg hover:bg-muted active:bg-accent transition-colors"
          onclick={() => mobileMenuOpen = false}
          aria-label="Close menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Drawer Content -->
      <Sidebar
        {categories}
        {activeCategory}
        {activeRecipe}
        onNavigate={handleNavigate}
        mobile={true}
      />
    </aside>
  </div>
{/if}

<style>
  @keyframes slide-in-left {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(0);
    }
  }

  .animate-slide-in-left {
    animation: slide-in-left 0.25s cubic-bezier(0.32, 0.72, 0, 1) forwards;
  }
</style>
