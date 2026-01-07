<script>
  /**
   * Screen Header Recipe
   * Full-screen demo of iOS-style header with configurable options.
   */
  import { AppHeader, BottomSheet, SheetMenu, IconButton } from '../../ui/index.js';

  let title = $state('Contact Details');
  let showBackButton = $state(true);
  let showCta = $state(true);
  let showContextMenu = $state(true);
  let ctaLabel = $state('Save');
  let ctaLoading = $state(false);
  let sheetOpen = $state(false);

  function handleBack() {
    alert('Back button pressed');
  }

  async function handleCta() {
    ctaLoading = true;
    await new Promise(r => setTimeout(r, 1000));
    ctaLoading = false;
    alert('Saved!');
  }

  function handleContextAction(itemId) {
    sheetOpen = false;
    alert(`Action: ${itemId}`);
  }

  const menuItems = [
    { id: 'edit', label: 'Edit', icon: editIcon },
    { id: 'share', label: 'Share', icon: shareIcon },
    { id: 'duplicate', label: 'Duplicate', icon: duplicateIcon },
    { separator: true },
    { id: 'delete', label: 'Delete', icon: deleteIcon, destructive: true }
  ];
</script>

{#snippet editIcon()}
  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
{/snippet}

{#snippet shareIcon()}
  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
  </svg>
{/snippet}

{#snippet duplicateIcon()}
  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
{/snippet}

{#snippet deleteIcon()}
  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
{/snippet}

{#snippet moreIcon()}
  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <circle cx="12" cy="5" r="1.5" fill="currentColor" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    <circle cx="12" cy="19" r="1.5" fill="currentColor" />
  </svg>
{/snippet}

<!-- Full-screen app -->
<div class="app-shell">
  <!-- Dynamic Header -->
  <AppHeader
    {title}
    showBack={showBackButton}
    onBack={handleBack}
  >
    {#snippet actions()}
      {#if showCta}
        <button
          class="cta-btn"
          onclick={handleCta}
          disabled={ctaLoading}
        >
          {#if ctaLoading}
            <span class="spinner"></span>
          {:else}
            {ctaLabel}
          {/if}
        </button>
      {/if}

      {#if showContextMenu}
        <IconButton label="More options" onclick={() => sheetOpen = true}>
          {@render moreIcon()}
        </IconButton>
      {/if}
    {/snippet}
  </AppHeader>

  <!-- Page Content with Controls -->
  <main class="app-content">
    <div class="config-section">
      <h2 class="section-title">Header Configuration</h2>

      <div class="config-grid">
        <!-- Title Input -->
        <div class="config-item full-width">
          <label class="config-label" for="header-title">Title</label>
          <input
            id="header-title"
            type="text"
            class="config-input"
            bind:value={title}
            placeholder="Page title"
          />
        </div>

        <!-- Toggle Options -->
        <div class="toggle-row">
          <span class="toggle-label">Back Button</span>
          <button
            class="toggle"
            class:active={showBackButton}
            onclick={() => showBackButton = !showBackButton}
            aria-label="Toggle back button"
            aria-pressed={showBackButton}
          >
            <span class="toggle-thumb"></span>
          </button>
        </div>

        <div class="toggle-row">
          <span class="toggle-label">Primary CTA</span>
          <button
            class="toggle"
            class:active={showCta}
            onclick={() => showCta = !showCta}
            aria-label="Toggle primary CTA"
            aria-pressed={showCta}
          >
            <span class="toggle-thumb"></span>
          </button>
        </div>

        <div class="toggle-row">
          <span class="toggle-label">Context Menu</span>
          <button
            class="toggle"
            class:active={showContextMenu}
            onclick={() => showContextMenu = !showContextMenu}
            aria-label="Toggle context menu"
            aria-pressed={showContextMenu}
          >
            <span class="toggle-thumb"></span>
          </button>
        </div>

        <!-- CTA Label -->
        {#if showCta}
          <div class="config-item full-width">
            <label class="config-label" for="cta-label">CTA Label</label>
            <input
              id="cta-label"
              type="text"
              class="config-input"
              bind:value={ctaLabel}
              placeholder="Button text"
            />
          </div>
        {/if}
      </div>
    </div>
  </main>
</div>

<!-- Context Menu Sheet (auto-sizes to content) -->
<BottomSheet bind:open={sheetOpen} fitContent onClose={() => sheetOpen = false}>
  <SheetMenu
    items={menuItems}
    onSelect={handleContextAction}
    onCancel={() => sheetOpen = false}
  />
</BottomSheet>

<style>
  .app-shell {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: var(--color-surface, #fff);
  }

  .app-content {
    flex: 1;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }

  .config-section {
    padding: 20px;
  }

  .section-title {
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-text-muted, #6b7280);
    margin: 0 0 16px;
  }

  .config-grid {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .config-item {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .config-item.full-width {
    width: 100%;
  }

  .config-label {
    font-size: 13px;
    font-weight: 500;
    color: var(--color-text-secondary, #6b7280);
  }

  .config-input {
    width: 100%;
    padding: 12px 14px;
    border: 1px solid var(--color-border-strong, #d1d5db);
    border-radius: 10px;
    font-size: 15px;
    background: var(--color-surface, #fff);
    color: var(--color-text, #374151);
    transition: border-color 0.15s, box-shadow 0.15s;
  }

  .config-input:focus {
    outline: none;
    border-color: var(--color-primary, #3b82f6);
    box-shadow: 0 0 0 3px oklch(from var(--color-primary, #3b82f6) l c h / 0.15);
  }

  /* Toggle Row */
  .toggle-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    background: var(--color-surface-sunken, #f3f4f6);
    border-radius: 12px;
    cursor: pointer;
  }

  .toggle-label {
    font-size: 15px;
    font-weight: 500;
    color: var(--color-text, #374151);
  }

  /* iOS-style Toggle */
  .toggle {
    position: relative;
    width: 51px;
    height: 31px;
    border-radius: 16px;
    background: var(--color-border-strong, #d1d5db);
    border: none;
    cursor: pointer;
    transition: background 0.2s;
    padding: 2px;
  }

  .toggle.active {
    background: var(--color-primary, #3b82f6);
  }

  .toggle-thumb {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 27px;
    height: 27px;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    transition: transform 0.2s;
  }

  .toggle.active .toggle-thumb {
    transform: translateX(20px);
  }

  /* CTA Button in Header */
  .cta-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 6px 14px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    background: var(--color-primary, #3b82f6);
    color: #fff;
    border: none;
    cursor: pointer;
    transition: all 0.15s;
    min-width: 60px;
  }

  .cta-btn:hover:not(:disabled) {
    filter: brightness(1.05);
  }

  .cta-btn:active:not(:disabled) {
    transform: scale(0.97);
  }

  .cta-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  /* Spinner */
  .spinner {
    width: 14px;
    height: 14px;
    border: 2px solid transparent;
    border-top-color: currentColor;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
</style>
