<script>
  /**
   * BottomTabBar Component
   * Primary mobile navigation with tabs and badges.
   *
   * @prop {Array<{id: string, label: string, icon: Snippet, badge?: number}>} tabs
   * @prop {string} activeTab - Currently active tab ID
   * @prop {(tabId: string) => void} [onSelect] - Tab selection handler
   */

  let {
    tabs = [],
    activeTab = $bindable(''),
    onSelect = () => {}
  } = $props();

  function handleSelect(tabId) {
    activeTab = tabId;
    onSelect(tabId);
  }
</script>

<nav class="bg-base-100 border-t border-accent pb-safe">
  <div class="flex justify-around">
    {#each tabs as tab}
      <button
        class="flex flex-col items-center gap-1 px-4 py-2 min-w-[64px] transition-colors relative
          {activeTab === tab.id ? 'text-primary' : 'text-muted-foreground hover:text-foreground/70'}"
        onclick={() => handleSelect(tab.id)}
        aria-current={activeTab === tab.id ? 'page' : undefined}
      >
        <div class="relative">
          {@render tab.icon?.()}
          {#if tab.badge && tab.badge > 0}
            <span class="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold bg-destructive text-white rounded-full px-1">
              {tab.badge > 99 ? '99+' : tab.badge}
            </span>
          {/if}
        </div>
        <span class="text-[11px] font-medium">{tab.label}</span>
      </button>
    {/each}
  </div>
</nav>
