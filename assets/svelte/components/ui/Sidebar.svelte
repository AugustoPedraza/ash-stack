<!--
  Sidebar Component
  Responsive navigation sidebar with collapsible sections.
  Collapses to icon-only on tablet, bottom sheet on mobile.
-->
<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import { fly, fade } from 'svelte/transition';
  import { swipe } from '../../lib/gestures.js';

  const dispatch = createEventDispatcher();

  /**
   * Navigation items
   * @type {Array<{
   *   id: string,
   *   label: string,
   *   href?: string,
   *   icon?: string,
   *   badge?: string | number,
   *   active?: boolean,
   *   children?: Array<{ id: string, label: string, href?: string, active?: boolean }>
   * }>}
   */
  export let items = [];

  /**
   * Currently active item ID
   * @type {string | null}
   */
  export let activeId = null;

  /**
   * Whether sidebar is collapsed (icon-only)
   * @type {boolean}
   */
  export let collapsed = false;

  /**
   * Whether mobile menu is open
   * @type {boolean}
   */
  export let mobileOpen = false;

  /**
   * Header content
   * @type {{ logo?: string, title?: string, href?: string } | null}
   */
  export let header = null;

  /**
   * Footer content slot
   * @type {boolean}
   */
  export let showFooter = false;

  /**
   * Enable gesture to close on mobile
   * @type {boolean}
   */
  export let gestureEnabled = true;

  /**
   * Width when expanded
   * @type {string}
   */
  export let width = '16rem';

  /**
   * Width when collapsed
   * @type {string}
   */
  export let collapsedWidth = '4rem';

  // Track expanded sections
  let expandedSections = new Set();

  // Screen size detection
  let isMobile = false;
  let isTablet = false;

  onMount(() => {
    const checkSize = () => {
      isMobile = window.innerWidth < 768;
      isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    };

    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  });

  function toggleSection(id) {
    if (expandedSections.has(id)) {
      expandedSections.delete(id);
    } else {
      expandedSections.add(id);
    }
    expandedSections = expandedSections;
  }

  function handleItemClick(item, e) {
    if (item.children?.length && !collapsed) {
      e.preventDefault();
      toggleSection(item.id);
    } else {
      dispatch('navigate', { item });
      if (isMobile) {
        mobileOpen = false;
      }
    }
  }

  function handleChildClick(parent, child, e) {
    dispatch('navigate', { item: child, parent });
    if (isMobile) {
      mobileOpen = false;
    }
  }

  function closeMobile() {
    mobileOpen = false;
  }

  function handleSwipe(e) {
    if (gestureEnabled && e.detail.direction === 'left') {
      closeMobile();
    }
  }

  function toggleCollapse() {
    collapsed = !collapsed;
    dispatch('collapse', { collapsed });
  }

  $: isItemActive = (item) => {
    if (item.id === activeId) return true;
    if (item.children?.some(c => c.id === activeId)) return true;
    return item.active || false;
  };

  $: sidebarWidth = collapsed ? collapsedWidth : width;
</script>

<!-- Mobile Overlay -->
{#if isMobile && mobileOpen}
  <div
    class="sidebar-overlay"
    on:click={closeMobile}
    on:keydown={(e) => e.key === 'Escape' && closeMobile()}
    transition:fade={{ duration: 200 }}
    role="presentation"
  />
{/if}

<!-- Sidebar -->
<aside
  class="sidebar"
  class:collapsed
  class:mobile-open={mobileOpen}
  class:is-mobile={isMobile}
  style="--sidebar-width: {sidebarWidth}"
  use:swipe
  on:swipeleft={handleSwipe}
  role="navigation"
  aria-label="Main navigation"
>
  {#if header}
    <div class="sidebar-header">
      <a href={header.href || '/'} class="header-link">
        {#if header.logo}
          <span class="header-logo">{@html header.logo}</span>
        {/if}
        {#if header.title && !collapsed}
          <span class="header-title" transition:fade={{ duration: 150 }}>
            {header.title}
          </span>
        {/if}
      </a>

      {#if !isMobile}
        <button
          type="button"
          class="collapse-toggle"
          on:click={toggleCollapse}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            {#if collapsed}
              <path d="m9 18 6-6-6-6"/>
            {:else}
              <path d="m15 18-6-6 6-6"/>
            {/if}
          </svg>
        </button>
      {/if}
    </div>
  {/if}

  <nav class="sidebar-nav">
    <ul class="nav-list">
      {#each items as item (item.id)}
        {@const active = isItemActive(item)}
        {@const expanded = expandedSections.has(item.id)}
        {@const hasChildren = item.children?.length > 0}

        <li class="nav-item">
          <a
            href={item.href || '#'}
            class="nav-link"
            class:active
            class:has-children={hasChildren}
            on:click={(e) => handleItemClick(item, e)}
            aria-current={active ? 'page' : undefined}
            title={collapsed ? item.label : undefined}
          >
            {#if item.icon}
              <span class="nav-icon">{@html item.icon}</span>
            {/if}

            {#if !collapsed}
              <span class="nav-label" transition:fade={{ duration: 100 }}>
                {item.label}
              </span>

              {#if item.badge}
                <span class="nav-badge">{item.badge}</span>
              {/if}

              {#if hasChildren}
                <svg
                  class="nav-chevron"
                  class:expanded
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              {/if}
            {/if}
          </a>

          {#if hasChildren && expanded && !collapsed}
            <ul class="nav-children" transition:fly={{ y: -10, duration: 150 }}>
              {#each item.children as child (child.id)}
                <li>
                  <a
                    href={child.href || '#'}
                    class="nav-child-link"
                    class:active={child.id === activeId || child.active}
                    on:click={(e) => handleChildClick(item, child, e)}
                    aria-current={child.id === activeId ? 'page' : undefined}
                  >
                    {child.label}
                  </a>
                </li>
              {/each}
            </ul>
          {/if}
        </li>
      {/each}
    </ul>
  </nav>

  {#if showFooter}
    <div class="sidebar-footer">
      <slot name="footer" />
    </div>
  {/if}
</aside>

<style>
  .sidebar {
    display: flex;
    flex-direction: column;
    width: var(--sidebar-width);
    height: 100%;
    background-color: var(--color-surface);
    border-right: 1px solid var(--color-border);
    transition: width 200ms ease;
    overflow: hidden;
  }

  /* Mobile styles */
  .sidebar.is-mobile {
    position: fixed;
    top: 0;
    left: 0;
    z-index: var(--z-modal);
    width: 80%;
    max-width: 20rem;
    transform: translateX(-100%);
    transition: transform 300ms ease;
  }

  .sidebar.is-mobile.mobile-open {
    transform: translateX(0);
  }

  .sidebar-overlay {
    position: fixed;
    inset: 0;
    z-index: calc(var(--z-modal) - 1);
    background-color: rgba(0, 0, 0, 0.5);
  }

  /* Header */
  .sidebar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-4);
    border-bottom: 1px solid var(--color-border);
  }

  .header-link {
    display: flex;
    align-items: center;
    gap: var(--spacing-3);
    text-decoration: none;
    color: var(--color-text);
    min-width: 0;
  }

  .header-logo {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    flex-shrink: 0;
  }

  .header-logo :global(svg),
  .header-logo :global(img) {
    width: 100%;
    height: 100%;
  }

  .header-title {
    font-weight: 600;
    font-size: 1.125rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .collapse-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.75rem;
    height: 1.75rem;
    padding: 0;
    background: none;
    border: none;
    border-radius: var(--radius-sm);
    color: var(--color-text-muted);
    cursor: pointer;
    transition: color 150ms ease, background-color 150ms ease;
  }

  .collapse-toggle:hover {
    color: var(--color-text);
    background-color: var(--color-surface-raised);
  }

  .collapse-toggle svg {
    width: 1rem;
    height: 1rem;
  }

  .collapsed .collapse-toggle {
    margin: 0 auto;
  }

  /* Navigation */
  .sidebar-nav {
    flex: 1;
    overflow-y: auto;
    padding: var(--spacing-2);
  }

  .nav-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-1);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .nav-link {
    display: flex;
    align-items: center;
    gap: var(--spacing-3);
    padding: var(--spacing-2) var(--spacing-3);
    text-decoration: none;
    color: var(--color-text-muted);
    border-radius: var(--radius-md);
    transition: color 150ms ease, background-color 150ms ease;
    cursor: pointer;
  }

  .nav-link:hover {
    color: var(--color-text);
    background-color: var(--color-surface-raised);
  }

  .nav-link.active {
    color: var(--color-primary);
    background-color: var(--color-primary);
    background-color: color-mix(in srgb, var(--color-primary) 10%, transparent);
  }

  .nav-link:focus-visible {
    outline: 2px solid var(--color-border-focus);
    outline-offset: -2px;
  }

  .collapsed .nav-link {
    justify-content: center;
    padding: var(--spacing-3);
  }

  .nav-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.25rem;
    height: 1.25rem;
    flex-shrink: 0;
  }

  .nav-icon :global(svg) {
    width: 100%;
    height: 100%;
  }

  .nav-label {
    flex: 1;
    font-size: 0.9375rem;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .nav-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 1.25rem;
    height: 1.25rem;
    padding: 0 var(--spacing-1);
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--color-on-primary);
    background-color: var(--color-primary);
    border-radius: var(--radius-full);
  }

  .nav-chevron {
    width: 1rem;
    height: 1rem;
    transition: transform 200ms ease;
    flex-shrink: 0;
  }

  .nav-chevron.expanded {
    transform: rotate(180deg);
  }

  /* Children */
  .nav-children {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-1);
    margin: var(--spacing-1) 0 0;
    padding: 0 0 0 calc(var(--spacing-3) + 1.25rem + var(--spacing-3));
    list-style: none;
  }

  .nav-child-link {
    display: block;
    padding: var(--spacing-2) var(--spacing-3);
    font-size: 0.875rem;
    color: var(--color-text-muted);
    text-decoration: none;
    border-radius: var(--radius-md);
    transition: color 150ms ease, background-color 150ms ease;
  }

  .nav-child-link:hover {
    color: var(--color-text);
    background-color: var(--color-surface-raised);
  }

  .nav-child-link.active {
    color: var(--color-primary);
    font-weight: 500;
  }

  /* Footer */
  .sidebar-footer {
    padding: var(--spacing-4);
    border-top: 1px solid var(--color-border);
  }

  .collapsed .sidebar-footer {
    padding: var(--spacing-2);
  }
</style>
