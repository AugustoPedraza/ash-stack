<!--
  Breadcrumbs Component
  Navigation breadcrumb trail with responsive collapse.
-->
<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  /**
   * Breadcrumb items
   * @type {Array<{ label: string, href?: string, icon?: string }>}
   */
  export let items = [];

  /**
   * Separator style
   * @type {'slash' | 'chevron' | 'arrow' | 'dot'}
   */
  export let separator = 'chevron';

  /**
   * Maximum items to show before collapsing (0 = no collapse)
   * @type {number}
   */
  export let maxItems = 0;

  /**
   * Home icon/link config
   * @type {{ href?: string, icon?: string, label?: string } | null}
   */
  export let home = null;

  /**
   * Size variant
   * @type {'sm' | 'md' | 'lg'}
   */
  export let size = 'md';

  let showCollapsed = false;

  // Compute visible items
  $: visibleItems = computeVisibleItems(items, maxItems, showCollapsed);

  function computeVisibleItems(allItems, max, expanded) {
    if (max <= 0 || allItems.length <= max || expanded) {
      return allItems.map((item, i) => ({ ...item, _index: i }));
    }

    // Show first, collapsed, and last (max - 1) items
    const first = allItems[0];
    const lastItems = allItems.slice(-(max - 1));

    return [
      { ...first, _index: 0 },
      { _collapsed: true, _count: allItems.length - max },
      ...lastItems.map((item, i) => ({
        ...item,
        _index: allItems.length - (max - 1) + i
      }))
    ];
  }

  function handleClick(item, e) {
    if (item._collapsed) {
      e.preventDefault();
      showCollapsed = true;
      return;
    }

    dispatch('navigate', { item, index: item._index });
  }

  const separators = {
    slash: '/',
    chevron: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>`,
    arrow: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>`,
    dot: '•'
  };

  $: separatorContent = separators[separator] || separators.chevron;
  $: isHtml = separator === 'chevron' || separator === 'arrow';
</script>

<nav class="breadcrumbs size-{size}" aria-label="Breadcrumb">
  <ol class="breadcrumb-list">
    {#if home}
      <li class="breadcrumb-item">
        <a
          href={home.href || '/'}
          class="breadcrumb-link home-link"
          aria-label={home.label || 'Home'}
        >
          {#if home.icon}
            <span class="breadcrumb-icon">{@html home.icon}</span>
          {:else}
            <svg class="home-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          {/if}
        </a>
        <span class="separator" aria-hidden="true">
          {#if isHtml}
            {@html separatorContent}
          {:else}
            {separatorContent}
          {/if}
        </span>
      </li>
    {/if}

    {#each visibleItems as item, i (item._collapsed ? 'collapsed' : item._index)}
      <li class="breadcrumb-item">
        {#if item._collapsed}
          <button
            type="button"
            class="breadcrumb-link collapsed-link"
            on:click={(e) => handleClick(item, e)}
            aria-label="Show {item._count} hidden items"
          >
            <span class="collapsed-dots">•••</span>
          </button>
        {:else if i === visibleItems.length - 1 && !item.href}
          <!-- Current page (last item, no link) -->
          <span class="breadcrumb-current" aria-current="page">
            {#if item.icon}
              <span class="breadcrumb-icon">{@html item.icon}</span>
            {/if}
            {item.label}
          </span>
        {:else if item.href}
          <a
            href={item.href}
            class="breadcrumb-link"
            on:click={(e) => handleClick(item, e)}
          >
            {#if item.icon}
              <span class="breadcrumb-icon">{@html item.icon}</span>
            {/if}
            {item.label}
          </a>
        {:else}
          <span class="breadcrumb-text">
            {#if item.icon}
              <span class="breadcrumb-icon">{@html item.icon}</span>
            {/if}
            {item.label}
          </span>
        {/if}

        {#if i < visibleItems.length - 1}
          <span class="separator" aria-hidden="true">
            {#if isHtml}
              {@html separatorContent}
            {:else}
              {separatorContent}
            {/if}
          </span>
        {/if}
      </li>
    {/each}
  </ol>
</nav>

<style>
  .breadcrumbs {
    width: 100%;
  }

  .breadcrumb-list {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--spacing-1);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .breadcrumb-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-1);
  }

  .breadcrumb-link,
  .breadcrumb-text,
  .breadcrumb-current {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-1);
    text-decoration: none;
    white-space: nowrap;
    transition: color 150ms ease;
  }

  .breadcrumb-link {
    color: var(--color-text-muted);
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
    font: inherit;
  }

  .breadcrumb-link:hover {
    color: var(--color-primary);
  }

  .breadcrumb-link:focus-visible {
    outline: 2px solid var(--color-border-focus);
    outline-offset: 2px;
    border-radius: var(--radius-sm);
  }

  .breadcrumb-text {
    color: var(--color-text-muted);
  }

  .breadcrumb-current {
    color: var(--color-text);
    font-weight: 500;
  }

  .separator {
    display: flex;
    align-items: center;
    color: var(--color-text-disabled);
    user-select: none;
  }

  .separator :global(svg) {
    width: 1em;
    height: 1em;
  }

  .breadcrumb-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1em;
    height: 1em;
  }

  .breadcrumb-icon :global(svg) {
    width: 100%;
    height: 100%;
  }

  .home-link {
    padding: var(--spacing-1);
    margin: calc(-1 * var(--spacing-1));
  }

  .home-icon {
    width: 1.25em;
    height: 1.25em;
  }

  .collapsed-link {
    padding: var(--spacing-1) var(--spacing-2);
    margin: calc(-1 * var(--spacing-1)) 0;
    border-radius: var(--radius-sm);
  }

  .collapsed-link:hover {
    background-color: var(--color-surface-raised);
  }

  .collapsed-dots {
    letter-spacing: 0.1em;
  }

  /* Sizes */
  .size-sm {
    font-size: 0.8125rem;
  }

  .size-md {
    font-size: 0.875rem;
  }

  .size-lg {
    font-size: 1rem;
  }

  /* Mobile: truncate long labels */
  @media (max-width: 640px) {
    .breadcrumb-link,
    .breadcrumb-text,
    .breadcrumb-current {
      max-width: 8rem;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .home-link {
      max-width: none;
    }
  }
</style>
