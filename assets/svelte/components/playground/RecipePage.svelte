<script>
  /**
   * RecipePage
   * Full-screen component demo with bottom drawer for docs/controls/code.
   */
  import { BottomSheet } from '../ui/index.js';
  import ScenarioControls from './ScenarioControls.svelte';

  let {
    title = '',
    description = '',
    patterns = [],
    components = [],
    code = '',
    docs = '',
    children
  } = $props();

  // Drawer state
  let drawerOpen = $state(false);
  let activeTab = $state('controls');

  const tabs = [
    { id: 'controls', label: 'Controls' },
    { id: 'code', label: 'Code' },
    { id: 'docs', label: 'Docs' }
  ];
</script>

<!-- Full-screen container -->
<div class="recipe-page">
  <!-- Minimal floating header -->
  <header class="recipe-header">
    <h1 class="recipe-title">{title}</h1>
    <button
      class="recipe-info-btn"
      onclick={() => drawerOpen = true}
      aria-label="Show recipe info"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </button>
  </header>

  <!-- Full-screen demo area -->
  <main class="recipe-demo">
    {@render children?.()}
  </main>

  <!-- Floating hint to open drawer -->
  {#if !drawerOpen}
    <button
      class="recipe-drawer-hint"
      onclick={() => drawerOpen = true}
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
      </svg>
      <span>Controls & Docs</span>
    </button>
  {/if}
</div>

<!-- Bottom Drawer -->
<BottomSheet bind:open={drawerOpen} snapPoints={[0.45, 0.85]} onClose={() => drawerOpen = false}>
  <div class="drawer-content">
    <!-- Tabs -->
    <div class="drawer-tabs">
      {#each tabs as tab}
        <button
          class="drawer-tab"
          class:active={activeTab === tab.id}
          onclick={() => activeTab = tab.id}
        >
          {tab.label}
        </button>
      {/each}
    </div>

    <!-- Tab Content -->
    <div class="drawer-body">
      {#if activeTab === 'controls'}
        <div class="drawer-section">
          <h3 class="drawer-section-title">Scenario</h3>
          <ScenarioControls />
        </div>

        {#if patterns.length > 0 || components.length > 0}
          <div class="drawer-section">
            <h3 class="drawer-section-title">Tags</h3>
            <div class="drawer-tags">
              {#each patterns as pattern}
                <span class="tag tag-outline">{pattern}</span>
              {/each}
              {#each components as comp}
                <span class="tag tag-primary">{comp}</span>
              {/each}
            </div>
          </div>
        {/if}
      {:else if activeTab === 'code'}
        <div class="drawer-code">
          {#if code}
            <pre><code>{code}</code></pre>
          {:else}
            <p class="drawer-empty">Code preview coming soon</p>
          {/if}
        </div>
      {:else if activeTab === 'docs'}
        <div class="drawer-docs">
          {#if description}
            <p class="drawer-description">{description}</p>
          {/if}
          {#if docs}
            <div class="drawer-docs-content">
              {@html docs}
            </div>
          {:else}
            <p class="drawer-empty">Documentation coming soon</p>
          {/if}
        </div>
      {/if}
    </div>
  </div>
</BottomSheet>

<style>
  /* Full-screen layout */
  .recipe-page {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: var(--color-base-100, #fff);
    position: relative;
  }

  /* Floating header - minimal, semi-transparent */
  .recipe-header {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    background: linear-gradient(
      to bottom,
      var(--color-base-100, #fff) 0%,
      transparent 100%
    );
  }

  .recipe-title {
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-base-content, #1f2937);
    margin: 0;
  }

  .recipe-info-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: var(--color-base-200, #f3f4f6);
    border: none;
    cursor: pointer;
    color: var(--color-base-content, #6b7280);
    transition: background 0.15s, color 0.15s;
  }

  .recipe-info-btn:hover {
    background: var(--color-base-300, #e5e7eb);
    color: var(--color-base-content, #374151);
  }

  /* Full-screen demo area */
  .recipe-demo {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding-top: 60px; /* Space for floating header */
  }

  /* Floating hint button */
  .recipe-drawer-hint {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    background: var(--color-base-200, #f3f4f6);
    border: 1px solid var(--color-base-300, #e5e7eb);
    border-radius: 20px;
    font-size: 13px;
    font-weight: 500;
    color: var(--color-base-content, #6b7280);
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  }

  .recipe-drawer-hint:hover {
    background: var(--color-base-100, #fff);
    box-shadow: 0 4px 12px rgba(0,0,0,0.12);
    transform: translateX(-50%) translateY(-2px);
  }

  /* Drawer content */
  .drawer-content {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  /* Tabs */
  .drawer-tabs {
    display: flex;
    gap: 4px;
    padding: 0 16px 12px;
    border-bottom: 1px solid var(--color-base-200, #e5e7eb);
  }

  .drawer-tab {
    flex: 1;
    padding: 10px 16px;
    border: none;
    background: transparent;
    font-size: 14px;
    font-weight: 500;
    color: var(--color-base-content, #6b7280);
    opacity: 0.6;
    cursor: pointer;
    border-radius: 8px;
    transition: all 0.15s;
  }

  .drawer-tab:hover {
    opacity: 0.8;
    background: var(--color-base-200, #f3f4f6);
  }

  .drawer-tab.active {
    opacity: 1;
    color: var(--color-primary, #3b82f6);
    background: var(--color-primary, #3b82f6);
    background: oklch(from var(--color-primary, #3b82f6) l c h / 0.1);
  }

  /* Body */
  .drawer-body {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
  }

  .drawer-section {
    margin-bottom: 20px;
  }

  .drawer-section-title {
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-base-content, #9ca3af);
    opacity: 0.7;
    margin: 0 0 10px;
  }

  /* Tags */
  .drawer-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .tag {
    display: inline-flex;
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
  }

  .tag-outline {
    background: transparent;
    border: 1px solid var(--color-base-300, #d1d5db);
    color: var(--color-base-content, #6b7280);
  }

  .tag-primary {
    background: var(--color-primary, #3b82f6);
    background: oklch(from var(--color-primary, #3b82f6) l c h / 0.15);
    color: var(--color-primary, #3b82f6);
  }

  /* Code */
  .drawer-code {
    background: var(--color-base-200, #f3f4f6);
    border-radius: 8px;
    padding: 16px;
    overflow-x: auto;
  }

  .drawer-code pre {
    margin: 0;
    font-size: 13px;
    line-height: 1.5;
  }

  .drawer-code code {
    font-family: 'SF Mono', 'Fira Code', monospace;
    color: var(--color-base-content, #374151);
  }

  /* Docs */
  .drawer-docs {
    font-size: 14px;
    line-height: 1.6;
    color: var(--color-base-content, #4b5563);
  }

  .drawer-description {
    margin: 0 0 16px;
    font-size: 15px;
  }

  .drawer-empty {
    color: var(--color-base-content, #9ca3af);
    opacity: 0.6;
    text-align: center;
    padding: 24px;
  }
</style>
