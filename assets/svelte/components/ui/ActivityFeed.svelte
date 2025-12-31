<!--
  ActivityFeed Component
  Timeline-style activity/event feed with grouping and real-time support.
-->
<script>
  import { createEventDispatcher } from 'svelte';
  import { fade, fly } from 'svelte/transition';

  const dispatch = createEventDispatcher();

  /**
   * Activity items
   * @type {Array<{
   *   id: string | number,
   *   type: string,
   *   title: string,
   *   description?: string,
   *   timestamp: Date | string,
   *   user?: { name: string, avatar?: string },
   *   icon?: string,
   *   metadata?: Record<string, any>,
   *   href?: string
   * }>}
   */
  export let items = [];

  /**
   * Group items by date
   * @type {boolean}
   */
  export let groupByDate = true;

  /**
   * Show user avatars
   * @type {boolean}
   */
  export let showAvatars = true;

  /**
   * Show timeline connector
   * @type {boolean}
   */
  export let showTimeline = true;

  /**
   * Loading state
   * @type {boolean}
   */
  export let loading = false;

  /**
   * Empty state message
   * @type {string}
   */
  export let emptyMessage = 'No activity yet';

  /**
   * Compact mode
   * @type {boolean}
   */
  export let compact = false;

  /**
   * Activity type icons/colors mapping
   * @type {Record<string, { icon?: string, color?: string }>}
   */
  export let typeConfig = {};

  // Default type configurations
  const defaultTypeConfig = {
    created: { icon: 'plus', color: 'success' },
    updated: { icon: 'edit', color: 'info' },
    deleted: { icon: 'trash', color: 'error' },
    commented: { icon: 'message', color: 'info' },
    assigned: { icon: 'user', color: 'warning' },
    completed: { icon: 'check', color: 'success' },
    shared: { icon: 'share', color: 'info' },
    uploaded: { icon: 'upload', color: 'info' },
    downloaded: { icon: 'download', color: 'info' },
    login: { icon: 'login', color: 'info' },
    logout: { icon: 'logout', color: 'info' }
  };

  $: mergedTypeConfig = { ...defaultTypeConfig, ...typeConfig };

  // Group items by date
  $: groupedItems = groupByDate ? groupItemsByDate(items) : [{ label: '', items }];

  function groupItemsByDate(items) {
    const groups = new Map();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    items.forEach(item => {
      const date = new Date(item.timestamp);
      date.setHours(0, 0, 0, 0);

      let label;
      if (date.getTime() === today.getTime()) {
        label = 'Today';
      } else if (date.getTime() === yesterday.getTime()) {
        label = 'Yesterday';
      } else if (date.getTime() > today.getTime() - 7 * 24 * 60 * 60 * 1000) {
        label = date.toLocaleDateString(undefined, { weekday: 'long' });
      } else {
        label = date.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
      }

      if (!groups.has(label)) {
        groups.set(label, []);
      }
      groups.get(label).push(item);
    });

    return Array.from(groups.entries()).map(([label, items]) => ({ label, items }));
  }

  function formatTime(timestamp) {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    return date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  }

  function getTypeConfig(type) {
    return mergedTypeConfig[type] || { icon: 'activity', color: 'info' };
  }

  function getIcon(type) {
    const config = getTypeConfig(type);
    const iconType = config.icon || 'activity';

    const icons = {
      plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
      edit: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
      trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
      message: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
      user: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
      check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`,
      share: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`,
      upload: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>`,
      download: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
      login: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>`,
      logout: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
      activity: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`
    };

    return icons[iconType] || icons.activity;
  }

  function handleItemClick(item) {
    dispatch('click', { item });
  }
</script>

<div class="activity-feed" class:compact class:has-timeline={showTimeline}>
  {#if loading}
    <div class="loading-state">
      <span class="spinner" />
      <span>Loading activity...</span>
    </div>
  {:else if items.length === 0}
    <div class="empty-state">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
      <span>{emptyMessage}</span>
    </div>
  {:else}
    {#each groupedItems as group, groupIndex}
      {#if group.label}
        <div class="date-group">
          <span class="date-label">{group.label}</span>
        </div>
      {/if}

      <ul class="activity-list">
        {#each group.items as item, itemIndex (item.id)}
          {@const config = getTypeConfig(item.type)}
          {@const isLast = groupIndex === groupedItems.length - 1 && itemIndex === group.items.length - 1}

          <li
            class="activity-item"
            class:has-link={item.href}
            transition:fly={{ y: 20, duration: 200, delay: itemIndex * 50 }}
          >
            {#if showTimeline}
              <div class="timeline">
                <div class="timeline-icon color-{config.color}">
                  {#if item.icon}
                    {@html item.icon}
                  {:else}
                    {@html getIcon(item.type)}
                  {/if}
                </div>
                {#if !isLast}
                  <div class="timeline-line" />
                {/if}
              </div>
            {/if}

            <div class="activity-content">
              {#if item.href}
                <a href={item.href} class="activity-link" on:click={() => handleItemClick(item)}>
                  <div class="activity-header">
                    {#if showAvatars && item.user}
                      <div class="user-avatar">
                        {#if item.user.avatar}
                          <img src={item.user.avatar} alt={item.user.name} />
                        {:else}
                          <span class="avatar-fallback">
                            {item.user.name.charAt(0).toUpperCase()}
                          </span>
                        {/if}
                      </div>
                    {/if}

                    <div class="activity-text">
                      {#if item.user}
                        <span class="user-name">{item.user.name}</span>
                      {/if}
                      <span class="activity-title">{item.title}</span>
                    </div>

                    <time class="activity-time">{formatTime(item.timestamp)}</time>
                  </div>

                  {#if item.description && !compact}
                    <p class="activity-description">{item.description}</p>
                  {/if}
                </a>
              {:else}
                <div class="activity-body" on:click={() => handleItemClick(item)} role="button" tabindex="0" on:keydown={(e) => e.key === 'Enter' && handleItemClick(item)}>
                  <div class="activity-header">
                    {#if showAvatars && item.user}
                      <div class="user-avatar">
                        {#if item.user.avatar}
                          <img src={item.user.avatar} alt={item.user.name} />
                        {:else}
                          <span class="avatar-fallback">
                            {item.user.name.charAt(0).toUpperCase()}
                          </span>
                        {/if}
                      </div>
                    {/if}

                    <div class="activity-text">
                      {#if item.user}
                        <span class="user-name">{item.user.name}</span>
                      {/if}
                      <span class="activity-title">{item.title}</span>
                    </div>

                    <time class="activity-time">{formatTime(item.timestamp)}</time>
                  </div>

                  {#if item.description && !compact}
                    <p class="activity-description">{item.description}</p>
                  {/if}
                </div>
              {/if}

              {#if item.metadata && !compact}
                <slot name="metadata" {item}>
                  <div class="activity-metadata">
                    {#each Object.entries(item.metadata) as [key, value]}
                      <span class="metadata-item">
                        <span class="metadata-key">{key}:</span>
                        <span class="metadata-value">{value}</span>
                      </span>
                    {/each}
                  </div>
                </slot>
              {/if}
            </div>
          </li>
        {/each}
      </ul>
    {/each}
  {/if}
</div>

<style>
  .activity-feed {
    width: 100%;
  }

  /* States */
  .loading-state,
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-3);
    padding: var(--spacing-8);
    color: var(--color-text-muted);
    text-align: center;
  }

  .empty-state svg {
    width: 3rem;
    height: 3rem;
    opacity: 0.5;
  }

  .spinner {
    width: 1.5rem;
    height: 1.5rem;
    border: 2px solid var(--color-border);
    border-top-color: var(--color-primary);
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* Date groups */
  .date-group {
    padding: var(--spacing-4) 0 var(--spacing-2);
  }

  .date-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  /* Activity list */
  .activity-list {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .activity-item {
    display: flex;
    gap: var(--spacing-4);
  }

  /* Timeline */
  .timeline {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-shrink: 0;
    width: 2rem;
  }

  .timeline-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: var(--radius-full);
    flex-shrink: 0;
  }

  .timeline-icon :global(svg) {
    width: 1rem;
    height: 1rem;
  }

  .timeline-icon.color-info {
    background-color: var(--color-info-soft);
    color: var(--color-info);
  }

  .timeline-icon.color-success {
    background-color: var(--color-success-soft);
    color: var(--color-success);
  }

  .timeline-icon.color-warning {
    background-color: var(--color-warning-soft);
    color: var(--color-warning);
  }

  .timeline-icon.color-error {
    background-color: var(--color-error-soft);
    color: var(--color-error);
  }

  .timeline-line {
    flex: 1;
    width: 2px;
    min-height: var(--spacing-4);
    margin: var(--spacing-2) 0;
    background-color: var(--color-border);
  }

  /* Activity content */
  .activity-content {
    flex: 1;
    min-width: 0;
    padding-bottom: var(--spacing-4);
  }

  .activity-link,
  .activity-body {
    display: block;
    text-decoration: none;
    color: inherit;
    cursor: pointer;
  }

  .activity-link:hover .activity-title,
  .activity-body:hover .activity-title {
    color: var(--color-primary);
  }

  .activity-header {
    display: flex;
    align-items: flex-start;
    gap: var(--spacing-2);
  }

  .user-avatar {
    width: 1.5rem;
    height: 1.5rem;
    flex-shrink: 0;
    border-radius: var(--radius-full);
    overflow: hidden;
  }

  .user-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .avatar-fallback {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--color-on-primary);
    background-color: var(--color-primary);
  }

  .activity-text {
    flex: 1;
    min-width: 0;
    font-size: 0.875rem;
    line-height: 1.4;
  }

  .user-name {
    font-weight: 600;
    color: var(--color-text);
  }

  .activity-title {
    color: var(--color-text);
    transition: color 150ms ease;
  }

  .activity-time {
    flex-shrink: 0;
    font-size: 0.75rem;
    color: var(--color-text-muted);
  }

  .activity-description {
    margin: var(--spacing-2) 0 0;
    font-size: 0.8125rem;
    color: var(--color-text-muted);
    line-height: 1.5;
  }

  .activity-metadata {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-2);
    margin-top: var(--spacing-2);
  }

  .metadata-item {
    display: inline-flex;
    gap: var(--spacing-1);
    padding: var(--spacing-1) var(--spacing-2);
    font-size: 0.75rem;
    background-color: var(--color-surface-raised);
    border-radius: var(--radius-sm);
  }

  .metadata-key {
    color: var(--color-text-muted);
  }

  .metadata-value {
    color: var(--color-text);
    font-weight: 500;
  }

  /* Compact mode */
  .compact .activity-content {
    padding-bottom: var(--spacing-2);
  }

  .compact .activity-text {
    font-size: 0.8125rem;
  }

  .compact .timeline-icon {
    width: 1.5rem;
    height: 1.5rem;
  }

  .compact .timeline-icon :global(svg) {
    width: 0.75rem;
    height: 0.75rem;
  }

  .compact .user-avatar {
    width: 1.25rem;
    height: 1.25rem;
  }

  /* Without timeline */
  .activity-feed:not(.has-timeline) .activity-item {
    padding: var(--spacing-3);
    border-radius: var(--radius-md);
    transition: background-color 150ms ease;
  }

  .activity-feed:not(.has-timeline) .activity-item:hover {
    background-color: var(--color-surface-raised);
  }

  .activity-feed:not(.has-timeline) .activity-content {
    padding-bottom: 0;
  }
</style>
