<!--
  Tabs Component
  Animated tabs with sliding indicator.
  Supports both controlled and uncontrolled modes.
-->
<script>
  import { createEventDispatcher, onMount, tick } from 'svelte';
  import { spring } from 'svelte/motion';
  import { haptic, HapticType } from '../../lib/mobile.js';

  const dispatch = createEventDispatcher();

  /**
   * Tab items
   * @type {Array<{ id: string, label: string, disabled?: boolean, icon?: string }>}
   */
  export let tabs = [];

  /** @type {string} - Active tab id */
  export let value = '';

  /** @type {'underline' | 'pill' | 'segment'} */
  export let variant = 'underline';

  /** @type {'sm' | 'md' | 'lg'} */
  export let size = 'md';

  /** @type {boolean} - Full width tabs */
  export let fullWidth = false;

  let tabsContainer;
  let tabElements = {};
  let mounted = false;

  // Indicator position spring
  const indicatorX = spring(0, { stiffness: 0.3, damping: 0.8 });
  const indicatorWidth = spring(0, { stiffness: 0.3, damping: 0.8 });

  // Size classes
  const sizeClasses = {
    sm: 'text-sm py-1 px-2',
    md: 'text-sm py-2 px-3',
    lg: 'text-base py-2 px-4'
  };

  // Variant styles
  const variantClasses = {
    underline: {
      container: 'border-b border-border',
      tab: 'border-b-2 border-transparent -mb-px',
      activeTab: 'border-primary text-primary',
      indicator: 'bottom-0 h-0.5 bg-primary'
    },
    pill: {
      container: 'gap-1',
      tab: 'rounded-md',
      activeTab: 'bg-primary text-on-primary',
      indicator: 'inset-y-0 rounded-md bg-primary'
    },
    segment: {
      container: 'p-1 bg-surface-sunken rounded-lg',
      tab: 'rounded-md',
      activeTab: '',
      indicator: 'inset-y-1 rounded-md bg-surface shadow-sm'
    }
  };

  $: styles = variantClasses[variant];

  // Set initial value if not provided
  $: if (!value && tabs.length > 0) {
    value = tabs[0].id;
  }

  // Update indicator position when value changes
  $: if (mounted && value && tabElements[value]) {
    updateIndicator();
  }

  async function updateIndicator() {
    await tick();
    const activeTab = tabElements[value];
    if (activeTab && tabsContainer) {
      const containerRect = tabsContainer.getBoundingClientRect();
      const tabRect = activeTab.getBoundingClientRect();
      indicatorX.set(tabRect.left - containerRect.left);
      indicatorWidth.set(tabRect.width);
    }
  }

  function selectTab(tab) {
    if (tab.disabled) return;
    haptic(HapticType.SELECTION);
    value = tab.id;
    dispatch('change', { value: tab.id, tab });
  }

  function handleKeydown(e, index) {
    let newIndex = index;

    if (e.key === 'ArrowLeft') {
      newIndex = index - 1;
      if (newIndex < 0) newIndex = tabs.length - 1;
    } else if (e.key === 'ArrowRight') {
      newIndex = index + 1;
      if (newIndex >= tabs.length) newIndex = 0;
    } else if (e.key === 'Home') {
      newIndex = 0;
    } else if (e.key === 'End') {
      newIndex = tabs.length - 1;
    } else {
      return;
    }

    e.preventDefault();

    // Skip disabled tabs
    while (tabs[newIndex]?.disabled) {
      newIndex = e.key === 'ArrowLeft' || e.key === 'Home'
        ? (newIndex - 1 + tabs.length) % tabs.length
        : (newIndex + 1) % tabs.length;
    }

    const newTab = tabs[newIndex];
    if (newTab && !newTab.disabled) {
      selectTab(newTab);
      tabElements[newTab.id]?.focus();
    }
  }

  onMount(() => {
    mounted = true;
    updateIndicator();

    // Update on resize
    const resizeObserver = new ResizeObserver(() => {
      if (value) updateIndicator();
    });
    resizeObserver.observe(tabsContainer);

    return () => resizeObserver.disconnect();
  });
</script>

<div class="tabs-wrapper">
  <!-- Tab list -->
  <div
    bind:this={tabsContainer}
    class="tabs-list {styles.container}"
    class:full-width={fullWidth}
    role="tablist"
    aria-orientation="horizontal"
  >
    <!-- Sliding indicator -->
    {#if variant !== 'underline'}
      <div
        class="tabs-indicator {styles.indicator}"
        style="left: {$indicatorX}px; width: {$indicatorWidth}px"
      />
    {/if}

    {#each tabs as tab, index (tab.id)}
      <button
        bind:this={tabElements[tab.id]}
        type="button"
        role="tab"
        id="tab-{tab.id}"
        aria-selected={value === tab.id}
        aria-controls="panel-{tab.id}"
        tabindex={value === tab.id ? 0 : -1}
        disabled={tab.disabled}
        class="tab {sizeClasses[size]} {styles.tab}"
        class:active={value === tab.id}
        class:full-width={fullWidth}
        on:click={() => selectTab(tab)}
        on:keydown={(e) => handleKeydown(e, index)}
      >
        {#if tab.icon}
          <span class="tab-icon">{@html tab.icon}</span>
        {/if}
        <span>{tab.label}</span>
      </button>
    {/each}

    <!-- Underline indicator (rendered inline) -->
    {#if variant === 'underline'}
      <div
        class="tabs-indicator-underline"
        style="left: {$indicatorX}px; width: {$indicatorWidth}px"
      />
    {/if}
  </div>

  <!-- Tab panels -->
  <div class="tabs-panels">
    {#each tabs as tab (tab.id)}
      <div
        id="panel-{tab.id}"
        role="tabpanel"
        aria-labelledby="tab-{tab.id}"
        hidden={value !== tab.id}
        tabindex="0"
      >
        {#if value === tab.id}
          <slot name={tab.id} />
        {/if}
      </div>
    {/each}
  </div>
</div>

<style>
  .tabs-wrapper {
    display: flex;
    flex-direction: column;
  }

  .tabs-list {
    position: relative;
    display: flex;
    align-items: center;
  }

  .tabs-list.full-width {
    width: 100%;
  }

  .tab {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
    font-weight: 500;
    color: var(--color-text-muted);
    background: transparent;
    border: none;
    cursor: pointer;
    transition: color 150ms ease, background-color 150ms ease;
    white-space: nowrap;
  }

  .tab.full-width {
    flex: 1;
    justify-content: center;
  }

  .tab:hover:not(:disabled) {
    color: var(--color-text);
  }

  .tab:focus-visible {
    outline: 2px solid var(--color-border-focus);
    outline-offset: -2px;
    border-radius: var(--radius-sm);
  }

  .tab:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .tab.active {
    color: var(--color-text);
  }

  .tab-icon {
    display: flex;
    align-items: center;
    width: 1em;
    height: 1em;
  }

  /* Indicators */
  .tabs-indicator {
    position: absolute;
    z-index: 0;
    will-change: left, width;
  }

  .tabs-indicator-underline {
    position: absolute;
    bottom: 0;
    height: 2px;
    background-color: var(--color-primary);
    will-change: left, width;
  }

  /* Tab panels */
  .tabs-panels {
    margin-top: var(--spacing-4);
  }

  .tabs-panels [role="tabpanel"] {
    outline: none;
  }

  .tabs-panels [role="tabpanel"]:focus-visible {
    outline: 2px solid var(--color-border-focus);
    outline-offset: 2px;
    border-radius: var(--radius-sm);
  }

  /* Utility classes for indicator styling */
  :global(.h-0\.5) { height: 0.125rem; }
  :global(.inset-y-0) { top: 0; bottom: 0; }
  :global(.inset-y-1) { top: 0.25rem; bottom: 0.25rem; }
</style>
