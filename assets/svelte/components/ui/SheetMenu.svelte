<script>
  /**
   * SheetMenu Component
   * Menu list for BottomSheet - follows app's visual patterns.
   *
   * @prop {Array<MenuItem>} items - Menu items
   * @prop {(itemId: string) => void} [onSelect] - Item selection handler
   * @prop {boolean} [showCancel=true] - Show cancel button
   * @prop {() => void} [onCancel] - Cancel handler
   *
   * MenuItem shape:
   * - id: string
   * - label: string
   * - icon?: Snippet
   * - destructive?: boolean
   * - disabled?: boolean
   * - separator?: boolean (starts a new group)
   */

  let {
    items = [],
    onSelect = () => {},
    showCancel = true,
    onCancel = () => {}
  } = $props();

  // Group items by separators
  const groups = $derived.by(() => {
    const result = [[]];
    let currentGroup = 0;

    items.forEach(item => {
      if (item.separator) {
        currentGroup++;
        result[currentGroup] = [];
      } else {
        result[currentGroup].push(item);
      }
    });

    return result.filter(g => g.length > 0);
  });
</script>

<div class="pt-1 pb-2" role="menu">
  <!-- All items in unified list -->
  {#each groups as group, groupIndex}
    {#if groupIndex > 0}
      <div class="h-px bg-border my-1" role="separator"></div>
    {/if}
    {#each group as item}
      <button
        class="w-full flex items-center gap-3 px-4 py-3 transition-colors
          {item.destructive
            ? 'text-destructive hover:bg-destructive/10 active:bg-destructive/15'
            : 'text-foreground hover:bg-accent active:bg-accent'}
          {item.disabled ? 'opacity-40 cursor-not-allowed' : ''}"
        onclick={() => !item.disabled && onSelect(item.id)}
        disabled={item.disabled}
        role="menuitem"
      >
        {#if item.icon}
          <span class="w-5 h-5 flex-shrink-0 {item.destructive ? 'text-destructive' : 'text-muted-foreground'}">
            {@render item.icon()}
          </span>
        {/if}
        <span class="text-sm font-medium">{item.label}</span>
      </button>
    {/each}
  {/each}

  <!-- Cancel as part of the same list -->
  {#if showCancel}
    <div class="h-px bg-border my-1" role="separator"></div>
    <button
      class="w-full flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-accent active:bg-accent transition-colors"
      onclick={onCancel}
      role="menuitem"
    >
      <span class="text-sm font-medium">Cancel</span>
    </button>
  {/if}
</div>
