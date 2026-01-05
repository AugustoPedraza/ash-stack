<!--
  ChatMessage Component
  Message bubble with avatar, timestamp, mentions, and rich content.
  Supports text, voice notes, attachments, quotes, decisions, and tasks.
-->
<script>
  import { createEventDispatcher } from 'svelte';
  import Avatar from './Avatar.svelte';

  const dispatch = createEventDispatcher();

  /** @type {{ id: string, name: string, avatar?: string, role?: string }} */
  export let sender;

  /** @type {string} - Message text content */
  export let content = '';

  /** @type {Date | string} - Message timestamp */
  export let timestamp;

  /** @type {boolean} - Is this message from the current user */
  export let isOwn = false;

  /** @type {boolean} - Show avatar (false for consecutive messages) */
  export let showAvatar = true;

  /** @type {boolean} - Show sender name */
  export let showName = true;

  /** @type {'default' | 'voice' | 'image' | 'file'} */
  export let type = 'default';

  /** @type {Array<{ id: string, name: string }>} - Mentioned users */
  export let mentions = [];

  // Format timestamp
  function formatTime(date) {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }

  function formatDate(date) {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString([], { month: 'numeric', day: 'numeric', year: 'numeric' });
  }

  // Parse content for mentions and links
  function parseContent(text) {
    if (!text) return [];

    const parts = [];
    // Regex for mentions (@name) and URLs
    const regex = /(@\w+)|(https?:\/\/[^\s]+)/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      // Add text before match
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          value: text.slice(lastIndex, match.index)
        });
      }

      if (match[1]) {
        // Mention
        const mentionName = match[1].slice(1); // Remove @
        const mentionedUser = mentions.find(m =>
          m.name.toLowerCase().includes(mentionName.toLowerCase())
        );
        parts.push({
          type: 'mention',
          value: match[1],
          user: mentionedUser
        });
      } else if (match[2]) {
        // Link
        parts.push({
          type: 'link',
          value: match[2]
        });
      }

      lastIndex = regex.lastIndex;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push({
        type: 'text',
        value: text.slice(lastIndex)
      });
    }

    return parts.length > 0 ? parts : [{ type: 'text', value: text }];
  }

  function handleMentionClick(user) {
    dispatch('mentionclick', { user });
  }

  function handleLinkClick(url) {
    dispatch('linkclick', { url });
  }

  function handleAvatarClick() {
    dispatch('avatarclick', { user: sender });
  }

  $: parsedContent = parseContent(content);
  $: formattedTime = formatTime(timestamp);
  $: formattedDate = formatDate(timestamp);
</script>

<div class="chat-message" class:own={isOwn} class:no-avatar={!showAvatar}>
  {#if showAvatar && !isOwn}
    <button class="avatar-wrapper" on:click={handleAvatarClick}>
      <Avatar
        src={sender.avatar}
        alt={sender.name}
        size="sm"
      />
    </button>
  {:else if !isOwn}
    <div class="avatar-spacer"></div>
  {/if}

  <div class="message-content">
    {#if showName && !isOwn}
      <div class="message-header">
        <span class="sender-name">{sender.name}</span>
        {#if sender.role}
          <span class="sender-role">{sender.role}</span>
        {/if}
        <span class="timestamp">{formattedTime} {formattedDate}</span>
      </div>
    {/if}

    <div class="message-bubble">
      {#if type === 'default' && content}
        <p class="message-text">
          {#each parsedContent as part}
            {#if part.type === 'text'}
              {part.value}
            {:else if part.type === 'mention'}
              <button
                class="mention"
                on:click={() => handleMentionClick(part.user)}
              >
                {part.value}
              </button>
            {:else if part.type === 'link'}
              <a
                href={part.value}
                class="link"
                target="_blank"
                rel="noopener noreferrer"
                on:click|stopPropagation={() => handleLinkClick(part.value)}
              >
                {part.value}
              </a>
            {/if}
          {/each}
        </p>
      {/if}

      <!-- Slot for voice notes, images, files, quoted messages, etc. -->
      <slot />
    </div>

    {#if isOwn}
      <span class="timestamp own-timestamp">{formattedTime}</span>
    {/if}

    <!-- Slot for decisions, tasks, reactions below the bubble -->
    <slot name="footer" />
  </div>

  {#if showAvatar && isOwn}
    <button class="avatar-wrapper" on:click={handleAvatarClick}>
      <Avatar
        src={sender.avatar}
        alt={sender.name}
        size="sm"
      />
    </button>
  {/if}
</div>

<style>
  .chat-message {
    display: flex;
    gap: var(--space-3);
    padding: var(--space-2) 0;
  }

  .chat-message.own {
    flex-direction: row-reverse;
  }

  .chat-message.no-avatar {
    padding-top: var(--space-1);
  }

  .avatar-wrapper {
    flex-shrink: 0;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    border-radius: var(--radius-full);
    transition: transform var(--duration-fast) var(--ease-primary);
  }

  .avatar-wrapper:hover {
    transform: scale(1.05);
  }

  .avatar-spacer {
    width: 32px;
    flex-shrink: 0;
  }

  .message-content {
    flex: 1;
    min-width: 0;
    max-width: 75%;
  }

  .own .message-content {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  .message-header {
    display: flex;
    align-items: baseline;
    gap: var(--space-2);
    margin-bottom: var(--space-1);
  }

  .sender-name {
    font-size: var(--text-sm);
    font-weight: var(--font-semibold);
    color: var(--color-text);
  }

  .sender-role {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
  }

  .timestamp {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
  }

  .own-timestamp {
    margin-top: var(--space-1);
    text-align: right;
  }

  .message-bubble {
    display: inline-block;
    padding: var(--space-3) var(--space-4);
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    max-width: 100%;
  }

  .own .message-bubble {
    background-color: var(--color-primary);
    border-color: var(--color-primary);
    color: var(--color-on-primary);
  }

  .message-text {
    margin: 0;
    font-size: var(--text-sm);
    line-height: var(--leading-relaxed);
    white-space: pre-wrap;
    word-break: break-word;
  }

  .mention {
    background: none;
    border: none;
    padding: 0;
    font: inherit;
    color: var(--color-primary);
    font-weight: var(--font-medium);
    cursor: pointer;
  }

  .mention:hover {
    text-decoration: underline;
  }

  .own .mention {
    color: var(--color-on-primary);
    opacity: 0.9;
  }

  .link {
    color: var(--color-primary);
    text-decoration: underline;
    word-break: break-all;
  }

  .link:hover {
    text-decoration: none;
  }

  .own .link {
    color: var(--color-on-primary);
    opacity: 0.9;
  }

  /* Empty bubble for voice/image only messages */
  .message-bubble:empty {
    padding: 0;
    background: none;
    border: none;
  }

  /* Mobile adjustments */
  @media (max-width: 640px) {
    .message-content {
      max-width: 85%;
    }
  }
</style>
