<!--
  Dropdown Component
  Accessible dropdown menu that becomes a Sheet on mobile.
  Supports keyboard navigation and touch interactions.
-->
<script>
  import { createEventDispatcher, onMount, onDestroy, tick } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import Sheet from './Sheet.svelte';
  import { haptic, HapticType, isTouchDevice } from '../../lib/mobile.js';

  const dispatch = createEventDispatcher();

  /** @type {boolean} */
  export let open = false;

  /**
   * Menu items
   * @type {Array<{ id: string, label: string, icon?: string, disabled?: boolean, danger?: boolean, separator?: boolean }>}
   */
  export let items = [];

  /** @type {'left' | 'right'} - Alignment of dropdown */
  export let align = 'left';

  /** @type {string} - Title for Sheet on mobile */
  export let title = '';

  /** @type {boolean} - Use Sheet on mobile */
  export let mobileSheet = true;

  let triggerEl;
  let menuEl;
  let focusedIndex = -1;
  let useMobile = false;

  // Check if we should use mobile mode
  $: if (typeof window !== 'undefined') {
    useMobile = mobileSheet && (isTouchDevice() || window.innerWidth < 640);
  }

  function toggleOpen() {
    open = !open;
    if (open) {
      haptic(HapticType.LIGHT);
      focusedIndex = -1;
    }
  }

  function close() {
    open = false;
    focusedIndex = -1;
    triggerEl?.focus();
  }

  function selectItem(item) {
    if (item.disabled || item.separator) return;
    haptic(HapticType.SELECTION);
    dispatch('select', { item });
    close();
  }

  function handleKeydown(e) {
    if (!open) return;

    const enabledItems = items.filter(i => !i.disabled && !i.separator);
    const enabledIndices = items.map((item, i) =>
      !item.disabled && !item.separator ? i : -1
    ).filter(i => i !== -1);

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        close();
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (focusedIndex === -1) {
          focusedIndex = enabledIndices[0];
        } else {
          const currentPos = enabledIndices.indexOf(focusedIndex);
          focusedIndex = enabledIndices[(currentPos + 1) % enabledIndices.length];
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (focusedIndex === -1) {
          focusedIndex = enabledIndices[enabledIndices.length - 1];
        } else {
          const currentPos = enabledIndices.indexOf(focusedIndex);
          focusedIndex = enabledIndices[(currentPos - 1 + enabledIndices.length) % enabledIndices.length];
        }
        break;
      case 'Home':
        e.preventDefault();
        focusedIndex = enabledIndices[0];
        break;
      case 'End':
        e.preventDefault();
        focusedIndex = enabledIndices[enabledIndices.length - 1];
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (focusedIndex >= 0) {
          selectItem(items[focusedIndex]);
        }
        break;
      case 'Tab':
        close();
        break;
    }
  }

  function handleClickOutside(e) {
    if (!open) return;
    if (triggerEl?.contains(e.target) || menuEl?.contains(e.target)) return;
    close();
  }

  // Focus management
  $: if (open && menuEl) {
    tick().then(() => {
      menuEl.focus();
    });
  }

  onMount(() => {
    document.addEventListener('click', handleClickOutside);
  });

  onDestroy(() => {
    document.removeEventListener('click', handleClickOutside);
  });
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="dropdown">
  <!-- Trigger -->
  <div
    bind:this={triggerEl}
    class="dropdown-trigger"
    on:click={toggleOpen}
    on:keydown={(e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        toggleOpen();
      }
    }}
    role="button"
    tabindex="0"
    aria-haspopup="menu"
    aria-expanded={open}
  >
    <slot name="trigger">
      <button type="button" class="dropdown-default-trigger">
        Menu
        <svg class="dropdown-chevron" class:open viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </button>
    </slot>
  </div>

  <!-- Desktop dropdown -->
  {#if !useMobile && open}
    <div
      bind:this={menuEl}
      class="dropdown-menu"
      class:align-right={align === 'right'}
      role="menu"
      tabindex="-1"
      in:fly={{ y: -8, duration: 150, easing: quintOut }}
      out:fade={{ duration: 100 }}
    >
      {#each items as item, index (item.id || index)}
        {#if item.separator}
          <div class="dropdown-separator" role="separator" />
        {:else}
          <button
            type="button"
            role="menuitem"
            class="dropdown-item"
            class:danger={item.danger}
            class:focused={focusedIndex === index}
            disabled={item.disabled}
            on:click={() => selectItem(item)}
            on:mouseenter={() => focusedIndex = index}
          >
            {#if item.icon}
              <span class="dropdown-item-icon">{@html item.icon}</span>
            {/if}
            <span>{item.label}</span>
          </button>
        {/if}
      {/each}
    </div>
  {/if}

  <!-- Mobile sheet -->
  {#if useMobile}
    <Sheet bind:open {title} gestureEnabled>
      <div class="sheet-menu" role="menu">
        {#each items as item, index (item.id || index)}
          {#if item.separator}
            <div class="dropdown-separator" role="separator" />
          {:else}
            <button
              type="button"
              role="menuitem"
              class="sheet-item"
              class:danger={item.danger}
              disabled={item.disabled}
              on:click={() => selectItem(item)}
            >
              {#if item.icon}
                <span class="dropdown-item-icon">{@html item.icon}</span>
              {/if}
              <span>{item.label}</span>
            </button>
          {/if}
        {/each}
      </div>
    </Sheet>
  {/if}
</div>

<style>
  .dropdown {
    position: relative;
    display: inline-block;
  }

  .dropdown-trigger {
    cursor: pointer;
  }

  .dropdown-default-trigger {
    display: flex;
    align-items: center;
    gap: var(--spacing-1);
    padding: var(--spacing-2) var(--spacing-3);
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text);
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: background-color 150ms ease, border-color 150ms ease;
  }

  .dropdown-default-trigger:hover {
    background-color: var(--color-surface-raised);
    border-color: var(--color-border-strong);
  }

  .dropdown-chevron {
    width: 1rem;
    height: 1rem;
    transition: transform 150ms ease;
  }

  .dropdown-chevron.open {
    transform: rotate(180deg);
  }

  .dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: var(--z-dropdown, 40);
    min-width: 180px;
    margin-top: var(--spacing-1);
    padding: var(--spacing-1);
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    outline: none;
  }

  .dropdown-menu.align-right {
    left: auto;
    right: 0;
  }

  .dropdown-separator {
    height: 1px;
    margin: var(--spacing-1) 0;
    background-color: var(--color-border);
  }

  .dropdown-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
    width: 100%;
    padding: var(--spacing-2) var(--spacing-3);
    font-size: 0.875rem;
    color: var(--color-text);
    text-align: left;
    background: transparent;
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: background-color 100ms ease;
  }

  .dropdown-item:hover,
  .dropdown-item.focused {
    background-color: var(--color-surface-sunken);
  }

  .dropdown-item:active {
    background-color: var(--color-surface-raised);
  }

  .dropdown-item:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .dropdown-item.danger {
    color: var(--color-error);
  }

  .dropdown-item.danger:hover,
  .dropdown-item.danger.focused {
    background-color: var(--color-error-soft);
  }

  .dropdown-item-icon {
    display: flex;
    align-items: center;
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
  }

  /* Sheet menu styles */
  .sheet-menu {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-1);
  }

  .sheet-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-3);
    width: 100%;
    padding: var(--spacing-4) var(--spacing-2);
    font-size: 1rem;
    color: var(--color-text);
    text-align: left;
    background: transparent;
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: background-color 100ms ease;
    /* Touch target minimum */
    min-height: 44px;
  }

  .sheet-item:active {
    background-color: var(--color-surface-sunken);
  }

  .sheet-item:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .sheet-item.danger {
    color: var(--color-error);
  }
</style>
