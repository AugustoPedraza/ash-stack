<!--
  QuotedMessage Component
  Nested reply block showing the quoted/original message being replied to.
  Used inside ChatMessage for reply threads.
-->
<script>
  import { createEventDispatcher } from 'svelte';
  import Avatar from './Avatar.svelte';

  const dispatch = createEventDispatcher();

  /** @type {{ id: string, name: string, avatar?: string }} */
  export let sender;

  /** @type {string} - Preview text of the quoted message */
  export let content = '';

  /** @type {'text' | 'voice' | 'image' | 'file'} - Type of the quoted message */
  export let type = 'text';

  /** @type {string | null} - Thumbnail URL for image/file quotes */
  export let thumbnail = null;

  /** @type {number | null} - Duration in seconds for voice quotes */
  export let duration = null;

  /** @type {string | null} - File name for file quotes */
  export let fileName = null;

  /** @type {boolean} - Whether the quote is clickable to scroll to original */
  export let clickable = true;

  /** @type {number} - Max length before truncating content */
  export let maxLength = 100;

  // Truncate content if needed
  function truncate(text, max) {
    if (!text || text.length <= max) return text;
    return text.slice(0, max).trim() + '...';
  }

  function formatDuration(seconds) {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  function handleClick() {
    if (clickable) {
      dispatch('click', { sender });
    }
  }

  function handleKeyDown(e) {
    if (clickable && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      handleClick();
    }
  }

  $: truncatedContent = truncate(content, maxLength);
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
  class="quoted-message"
  class:clickable
  role={clickable ? 'button' : undefined}
  tabindex={clickable ? 0 : -1}
  on:click={handleClick}
  on:keydown={handleKeyDown}
>
  <div class="quote-bar"></div>

  <div class="quote-content">
    <span class="quote-sender">{sender.name}</span>

    {#if type === 'voice'}
      <div class="quote-preview voice">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="23" />
          <line x1="8" y1="23" x2="16" y2="23" />
        </svg>
        <span>Voice message</span>
        {#if duration}
          <span class="quote-duration">{formatDuration(duration)}</span>
        {/if}
      </div>
    {:else if type === 'image'}
      <div class="quote-preview image">
        {#if thumbnail}
          <img src={thumbnail} alt="" class="quote-thumbnail" />
        {:else}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        {/if}
        <span>Photo</span>
      </div>
    {:else if type === 'file'}
      <div class="quote-preview file">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
        <span>{fileName || 'File'}</span>
      </div>
    {:else}
      <p class="quote-text">{truncatedContent}</p>
    {/if}
  </div>
</div>

<style>
  .quoted-message {
    display: flex;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-3);
    background-color: var(--color-surface-sunken);
    border-radius: var(--radius-md);
    margin-bottom: var(--space-2);
    max-width: 100%;
    overflow: hidden;
  }

  .quoted-message.clickable {
    cursor: pointer;
    transition: background-color var(--duration-fast) var(--ease-primary);
  }

  .quoted-message.clickable:hover {
    background-color: var(--color-surface);
  }

  .quoted-message.clickable:focus-visible {
    outline: 2px solid var(--color-border-focus);
    outline-offset: 2px;
  }

  .quote-bar {
    width: 3px;
    flex-shrink: 0;
    background-color: var(--color-primary);
    border-radius: var(--radius-full);
  }

  .quote-content {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: var(--space-0-5);
  }

  .quote-sender {
    font-size: var(--text-xs);
    font-weight: var(--font-semibold);
    color: var(--color-primary);
  }

  .quote-text {
    margin: 0;
    font-size: var(--text-xs);
    color: var(--color-text-muted);
    line-height: var(--leading-snug);
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .quote-preview {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--text-xs);
    color: var(--color-text-muted);
  }

  .quote-preview svg {
    flex-shrink: 0;
    color: var(--color-text-muted);
  }

  .quote-duration {
    color: var(--color-text-disabled);
  }

  .quote-thumbnail {
    width: 32px;
    height: 32px;
    border-radius: var(--radius-sm);
    object-fit: cover;
  }
</style>
