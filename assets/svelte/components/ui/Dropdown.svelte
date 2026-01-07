<script>
  /**
   * Dropdown Component
   * Menu trigger with keyboard navigation using design tokens.
   *
   * @prop {boolean} [open=false] - Controls visibility
   * @prop {Array<{id: string, label: string, icon?: string, danger?: boolean, disabled?: boolean} | 'divider'>} [items=[]]
   * @prop {'left' | 'right'} [align='left'] - Menu alignment
   * @prop {Snippet} [trigger] - Custom trigger slot
   * @prop {Snippet} [children] - Alternative to items array
   * @prop {(item: {id: string, label: string}) => void} [onselect]
   */

  let {
    open = $bindable(false),
    items = [],
    align = 'left',
    trigger = undefined,
    children = undefined,
    onselect = undefined
  } = $props();

  let focusedIndex = $state(-1);

  function handleToggle() {
    open = !open;
    if (open) {
      focusedIndex = 0;
    }
  }

  function handleClose() {
    open = false;
    focusedIndex = -1;
  }

  function handleSelect(item) {
    if (item.disabled) return;
    onselect?.(item);
    handleClose();
  }

  function handleKeydown(e) {
    if (!open) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        handleToggle();
      }
      return;
    }

    const selectableItems = items.filter(item => item !== 'divider' && !item.disabled);

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        handleClose();
        break;
      case 'ArrowDown':
        e.preventDefault();
        focusedIndex = Math.min(focusedIndex + 1, selectableItems.length - 1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        focusedIndex = Math.max(focusedIndex - 1, 0);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < selectableItems.length) {
          handleSelect(selectableItems[focusedIndex]);
        }
        break;
      case 'Tab':
        handleClose();
        break;
    }
  }

  function handleClickOutside(e) {
    if (open) {
      handleClose();
    }
  }

  const alignClasses = {
    left: 'left-0',
    right: 'right-0'
  };
</script>

<svelte:window onclick={open ? handleClickOutside : undefined} />

<div class="relative inline-block" onkeydown={handleKeydown}>
  <!-- Trigger -->
  <div onclick={(e) => { e.stopPropagation(); handleToggle(); }}>
    {#if trigger}
      {@render trigger()}
    {:else}
      <button
        type="button"
        class="
          p-2 rounded-[var(--radius-md)]
          text-text-muted hover:bg-base-200
          transition-colors duration-[var(--duration-fast)]
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus
        "
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
      </button>
    {/if}
  </div>

  <!-- Menu -->
  {#if open}
    <div
      class="
        absolute z-[var(--z-dropdown)] mt-1 {alignClasses[align]}
        min-w-[160px] max-w-[280px]
        bg-surface rounded-[var(--radius-lg)]
        border border-border shadow-lg
        py-1
        animate-scale-in origin-top
      "
      role="menu"
      onclick={(e) => e.stopPropagation()}
    >
      {#if children}
        {@render children()}
      {:else}
        {#each items as item, i}
          {#if item === 'divider'}
            <div class="h-px bg-border my-1" role="separator"></div>
          {:else}
            {@const selectableIndex = items.slice(0, i).filter(it => it !== 'divider' && !it.disabled).length}
            <button
              type="button"
              class="
                w-full px-3 py-2 text-left text-sm
                flex items-center gap-2
                transition-colors duration-[var(--duration-fast)]
                {item.disabled
                  ? 'text-text-disabled cursor-not-allowed'
                  : item.danger
                    ? 'text-error hover:bg-error-soft'
                    : 'text-text hover:bg-base-200'
                }
                {selectableIndex === focusedIndex && !item.disabled ? 'bg-base-200' : ''}
              "
              role="menuitem"
              disabled={item.disabled}
              onclick={() => handleSelect(item)}
            >
              {item.label}
            </button>
          {/if}
        {/each}
      {/if}
    </div>
  {/if}
</div>
