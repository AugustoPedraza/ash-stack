<!--
  ChannelPills Component
  Horizontal scrollable pill-style filter tabs.
  Used for filtering messages by channel/category.
-->
<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  /**
   * @typedef {Object} Channel
   * @property {string} id
   * @property {string} label
   * @property {string} [icon] - Optional icon name
   * @property {number} [count] - Optional unread/item count
   * @property {string} [color] - Optional accent color
   * @property {boolean} [disabled]
   */

  /** @type {Channel[]} */
  export let channels = [];

  /** @type {string | null} - Currently active channel ID */
  export let active = null;

  /** @type {boolean} - Allow selecting multiple channels */
  export let multiple = false;

  /** @type {string[]} - Selected channel IDs (for multiple mode) */
  export let selected = [];

  /** @type {'default' | 'compact'} */
  export let variant = 'default';

  /** @type {boolean} - Show "All" option at start */
  export let showAll = true;

  /** @type {string} - Label for "All" option */
  export let allLabel = 'All';

  function isActive(channelId) {
    if (multiple) {
      return selected.includes(channelId);
    }
    return active === channelId;
  }

  function handleClick(channel) {
    if (channel.disabled) return;

    if (multiple) {
      const newSelected = selected.includes(channel.id)
        ? selected.filter(id => id !== channel.id)
        : [...selected, channel.id];
      dispatch('change', { selected: newSelected });
    } else {
      dispatch('change', { active: channel.id });
    }
  }

  function handleAllClick() {
    if (multiple) {
      dispatch('change', { selected: [] });
    } else {
      dispatch('change', { active: null });
    }
  }

  $: isAllActive = multiple ? selected.length === 0 : active === null;
</script>

<div class="channel-pills" class:compact={variant === 'compact'} role="tablist">
  {#if showAll}
    <button
      class="channel-pill"
      class:active={isAllActive}
      role="tab"
      aria-selected={isAllActive}
      on:click={handleAllClick}
    >
      <span class="pill-label">{allLabel}</span>
    </button>
  {/if}

  {#each channels as channel (channel.id)}
    <button
      class="channel-pill"
      class:active={isActive(channel.id)}
      class:disabled={channel.disabled}
      style={channel.color ? `--accent: ${channel.color}` : undefined}
      role="tab"
      aria-selected={isActive(channel.id)}
      disabled={channel.disabled}
      on:click={() => handleClick(channel)}
    >
      {#if channel.icon}
        <span class="pill-icon">
          {#if channel.icon === 'chat'}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          {:else if channel.icon === 'voice'}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            </svg>
          {:else if channel.icon === 'file'}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          {:else if channel.icon === 'decision'}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M9 12l2 2 4-4" />
            </svg>
          {:else if channel.icon === 'task'}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <path d="M9 11l3 3L22 4" />
            </svg>
          {:else if channel.icon === 'star'}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          {:else if channel.icon === 'mention'}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="4" />
              <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94" />
            </svg>
          {:else}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" />
            </svg>
          {/if}
        </span>
      {/if}

      <span class="pill-label">{channel.label}</span>

      {#if channel.count !== undefined && channel.count > 0}
        <span class="pill-count">{channel.count > 99 ? '99+' : channel.count}</span>
      {/if}
    </button>
  {/each}
</div>

<style>
  .channel-pills {
    display: flex;
    gap: var(--space-2);
    padding: var(--space-2) 0;
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
    -webkit-overflow-scrolling: touch;
  }

  .channel-pills::-webkit-scrollbar {
    display: none;
  }

  .channel-pill {
    display: flex;
    align-items: center;
    gap: var(--space-1-5);
    padding: var(--space-2) var(--space-3);
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-full);
    font-size: var(--text-sm);
    font-weight: var(--font-medium);
    color: var(--color-text-muted);
    cursor: pointer;
    white-space: nowrap;
    flex-shrink: 0;
    transition: all var(--duration-fast) var(--ease-primary);
  }

  .channel-pill:hover:not(:disabled) {
    background-color: var(--color-surface-raised);
    border-color: var(--color-border-strong);
    color: var(--color-text);
  }

  .channel-pill:focus-visible {
    outline: 2px solid var(--color-border-focus);
    outline-offset: 2px;
  }

  .channel-pill.active {
    background-color: var(--accent, var(--color-primary));
    border-color: var(--accent, var(--color-primary));
    color: var(--color-on-primary);
  }

  .channel-pill.active:hover {
    background-color: var(--accent, var(--color-primary-hover));
    border-color: var(--accent, var(--color-primary-hover));
  }

  .channel-pill.disabled,
  .channel-pill:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .compact .channel-pill {
    padding: var(--space-1) var(--space-2);
    font-size: var(--text-xs);
  }

  .pill-icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .pill-label {
    line-height: 1;
  }

  .pill-count {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 18px;
    height: 18px;
    padding: 0 var(--space-1);
    background-color: var(--color-error);
    border-radius: var(--radius-full);
    font-size: var(--text-xs);
    font-weight: var(--font-semibold);
    color: var(--color-on-error);
  }

  .channel-pill.active .pill-count {
    background-color: rgba(255, 255, 255, 0.25);
  }

  .compact .pill-count {
    min-width: 14px;
    height: 14px;
    font-size: 10px;
  }

  /* Scroll fade indicators */
  .channel-pills::before,
  .channel-pills::after {
    content: '';
    position: sticky;
    flex-shrink: 0;
    width: 24px;
    pointer-events: none;
  }

  .channel-pills::before {
    left: 0;
    background: linear-gradient(to right, var(--color-background), transparent);
    margin-right: -24px;
  }

  .channel-pills::after {
    right: 0;
    background: linear-gradient(to left, var(--color-background), transparent);
    margin-left: -24px;
  }
</style>
