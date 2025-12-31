<!--
  TypingIndicator Component
  Shows who is currently typing with animated dots.
-->
<script>
  import { fade } from 'svelte/transition';

  /**
   * Users who are typing
   * @type {Array<{ id: string | number, name: string }>}
   */
  export let users = [];

  /**
   * Maximum names to show before "and X others"
   * @type {number}
   */
  export let maxNames = 2;

  /**
   * Custom format function
   * @type {((users: Array<{ name: string }>) => string) | null}
   */
  export let format = null;

  // Build display text
  $: typingText = formatTypingText(users);

  function formatTypingText(typingUsers) {
    if (typingUsers.length === 0) return '';

    if (format) {
      return format(typingUsers);
    }

    const names = typingUsers.map((u) => u.name);

    if (names.length === 1) {
      return `${names[0]} is typing`;
    }

    if (names.length <= maxNames) {
      const last = names.pop();
      return `${names.join(', ')} and ${last} are typing`;
    }

    const shown = names.slice(0, maxNames);
    const remaining = names.length - maxNames;
    return `${shown.join(', ')} and ${remaining} other${remaining > 1 ? 's are' : ' is'} typing`;
  }
</script>

{#if users.length > 0}
  <div class="typing-indicator" in:fade={{ duration: 150 }} out:fade={{ duration: 100 }}>
    <div class="typing-dots">
      <span class="dot" style="animation-delay: 0ms" />
      <span class="dot" style="animation-delay: 150ms" />
      <span class="dot" style="animation-delay: 300ms" />
    </div>
    <span class="typing-text">{typingText}</span>
  </div>
{/if}

<style>
  .typing-indicator {
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
    padding: var(--spacing-2) var(--spacing-3);
    font-size: 0.8125rem;
    color: var(--color-text-muted);
  }

  .typing-dots {
    display: flex;
    align-items: center;
    gap: 3px;
  }

  .dot {
    width: 6px;
    height: 6px;
    background-color: var(--color-text-muted);
    border-radius: 50%;
    animation: bounce 1s infinite ease-in-out;
  }

  @keyframes bounce {
    0%, 60%, 100% {
      transform: translateY(0);
    }
    30% {
      transform: translateY(-4px);
    }
  }

  .typing-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .dot {
      animation: none;
      opacity: 0.6;
    }

    .dot:nth-child(2) {
      opacity: 0.8;
    }

    .dot:nth-child(3) {
      opacity: 1;
    }
  }
</style>
