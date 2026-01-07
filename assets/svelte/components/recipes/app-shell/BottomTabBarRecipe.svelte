<script>
  /**
   * Bottom Tab Bar Recipe
   * Full-screen app shell with bottom tab navigation.
   */
  import { BottomTabBar, BottomSheet, SheetMenu } from '../../ui/index.js';

  let activeTab = $state('home');
  let moreSheetOpen = $state(false);
  let badges = $state({
    home: 0,
    search: 0,
    create: 0,
    activity: 3
  });

  const tabs = [
    { id: 'home', label: 'Home', icon: homeIcon },
    { id: 'search', label: 'Search', icon: searchIcon },
    { id: 'create', label: 'Create', icon: createIcon },
    { id: 'activity', label: 'Activity', icon: activityIcon },
    { id: 'more', label: 'More', icon: moreIcon }
  ];

  const tabsWithBadges = $derived(tabs.map(t => ({
    ...t,
    badge: badges[t.id] || 0
  })));

  const moreItems = [
    { id: 'settings', label: 'Settings', icon: settingsIcon },
    { id: 'profile', label: 'Profile', icon: profileIcon },
    { id: 'help', label: 'Help & Support', icon: helpIcon },
    { id: 'about', label: 'About', icon: aboutIcon }
  ];

  function handleTabSelect(tabId) {
    if (tabId === 'more') {
      moreSheetOpen = true;
    } else {
      activeTab = tabId;
    }
  }

  function handleMoreSelect(itemId) {
    moreSheetOpen = false;
    activeTab = itemId;
  }

  function incrementBadge(tabId) {
    badges[tabId] = (badges[tabId] || 0) + 1;
    badges = badges;
  }

  function clearBadge(tabId) {
    badges[tabId] = 0;
    badges = badges;
  }
</script>

{#snippet homeIcon()}
  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
{/snippet}

{#snippet searchIcon()}
  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
{/snippet}

{#snippet createIcon()}
  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
  </svg>
{/snippet}

{#snippet activityIcon()}
  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
{/snippet}

{#snippet moreIcon()}
  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
{/snippet}

{#snippet settingsIcon()}
  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
{/snippet}

{#snippet profileIcon()}
  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
{/snippet}

{#snippet helpIcon()}
  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
{/snippet}

{#snippet aboutIcon()}
  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
{/snippet}

<!-- Full-screen app shell -->
<div class="app-shell">
  <!-- Content Area -->
  <main class="app-content">
    <!-- Page Header -->
    <header class="content-header">
      <h1 class="page-title">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
    </header>

    <!-- Badge Controls (as page content) -->
    <div class="badge-controls">
      <h2 class="section-title">Badge Controls</h2>
      <div class="badge-grid">
        {#each tabs.filter(t => t.id !== 'more') as tab}
          <div class="badge-row">
            <span class="badge-label">{tab.label}</span>
            <div class="badge-actions">
              <button class="badge-btn" onclick={() => incrementBadge(tab.id)}>+1</button>
              <button class="badge-btn ghost" onclick={() => clearBadge(tab.id)}>Clear</button>
              <span class="badge-count" class:has-badge={badges[tab.id] > 0}>
                {badges[tab.id]}
              </span>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </main>

  <!-- Bottom Tab Bar -->
  <BottomTabBar
    tabs={tabsWithBadges}
    bind:activeTab
    onSelect={handleTabSelect}
  />
</div>

<!-- "More" Bottom Sheet (auto-sizes to content) -->
<BottomSheet bind:open={moreSheetOpen} fitContent onClose={() => moreSheetOpen = false}>
  <SheetMenu
    items={moreItems}
    onSelect={handleMoreSelect}
    onCancel={() => moreSheetOpen = false}
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

  .content-header {
    padding: 16px 20px;
    border-bottom: 1px solid var(--color-border, #e5e7eb);
  }

  .page-title {
    font-size: 28px;
    font-weight: 700;
    color: var(--color-text, #1f2937);
    margin: 0;
  }

  .badge-controls {
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

  .badge-grid {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .badge-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    background: var(--color-surface-sunken, #f3f4f6);
    border-radius: 12px;
  }

  .badge-label {
    font-size: 15px;
    font-weight: 500;
    color: var(--color-text, #374151);
  }

  .badge-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .badge-btn {
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
    background: var(--color-primary, #3b82f6);
    color: #fff;
    border: none;
  }

  .badge-btn:hover {
    filter: brightness(1.05);
  }

  .badge-btn:active {
    transform: scale(0.97);
  }

  .badge-btn.ghost {
    background: transparent;
    color: var(--color-text-secondary, #6b7280);
    border: 1px solid var(--color-border-strong, #d1d5db);
  }

  .badge-btn.ghost:hover {
    background: var(--color-border-strong, #e5e7eb);
  }

  .badge-count {
    min-width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 14px;
    font-size: 13px;
    font-weight: 600;
    background: var(--color-border-strong, #e5e7eb);
    color: var(--color-text-secondary, #6b7280);
  }

  .badge-count.has-badge {
    background: var(--color-error, #ef4444);
    color: #fff;
  }
</style>
