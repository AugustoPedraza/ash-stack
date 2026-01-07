<script>
  /**
   * Chat Recipe
   * Real-time message list with input, own vs others styling, timestamps.
   *
   * Uses: Button
   */
  import { Button } from '../../ui';

  let newMessage = $state('');
  let messagesContainer = $state(null);

  // Current user
  const currentUser = { id: 'me', name: 'You', avatar: 'https://i.pravatar.cc/40?img=8' };

  // Mock messages
  let messages = $state([
    { id: 1, userId: 'user1', user: 'Sarah Chen', avatar: 'https://i.pravatar.cc/40?img=1', text: 'Hey! How\'s the project going?', time: new Date(Date.now() - 3600000 * 2) },
    { id: 2, userId: 'me', user: 'You', avatar: currentUser.avatar, text: 'Pretty good! Just finished the dashboard components.', time: new Date(Date.now() - 3600000 * 1.5) },
    { id: 3, userId: 'user1', user: 'Sarah Chen', avatar: 'https://i.pravatar.cc/40?img=1', text: 'Nice! Can you share a preview?', time: new Date(Date.now() - 3600000) },
    { id: 4, userId: 'me', user: 'You', avatar: currentUser.avatar, text: 'Sure, I\'ll send it over in a bit.', time: new Date(Date.now() - 1800000) },
    { id: 5, userId: 'user2', user: 'Mike Johnson', avatar: 'https://i.pravatar.cc/40?img=2', text: 'Hey team! Just joined the chat.', time: new Date(Date.now() - 900000) },
  ]);

  // Typing simulation
  let othersTyping = $state([]);

  function formatTime(date) {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }

  function isOwnMessage(msg) {
    return msg.userId === 'me';
  }

  function sendMessage() {
    if (!newMessage.trim()) return;

    const msg = {
      id: Date.now(),
      userId: 'me',
      user: 'You',
      avatar: currentUser.avatar,
      text: newMessage.trim(),
      time: new Date()
    };

    messages = [...messages, msg];
    newMessage = '';

    // Scroll to bottom
    setTimeout(() => {
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }, 10);

    // Simulate reply after delay
    simulateReply();
  }

  function simulateReply() {
    // Show typing indicator
    othersTyping = [{ name: 'Sarah Chen', avatar: 'https://i.pravatar.cc/40?img=1' }];

    setTimeout(() => {
      othersTyping = [];

      const replies = [
        'Sounds good!',
        'Got it, thanks!',
        'Let me know if you need any help.',
        'Looking forward to seeing it!',
        'Great work!'
      ];

      messages = [...messages, {
        id: Date.now(),
        userId: 'user1',
        user: 'Sarah Chen',
        avatar: 'https://i.pravatar.cc/40?img=1',
        text: replies[Math.floor(Math.random() * replies.length)],
        time: new Date()
      }];

      // Scroll to bottom
      setTimeout(() => {
        if (messagesContainer) {
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
      }, 10);
    }, 1500 + Math.random() * 1000);
  }

  function handleKeydown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  // Scroll to bottom on mount
  $effect(() => {
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  });
</script>

<div class="h-full bg-surface flex flex-col overflow-hidden">
  <!-- Chat Header -->
  <div class="shrink-0 px-5 py-4 border-b border-border">
    <div class="flex items-center gap-3">
      <div class="relative">
        <div class="w-10 h-10 rounded-full bg-primary/15 text-primary flex items-center justify-center text-sm font-semibold">
          PC
        </div>
        <div class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full ring-2 ring-surface"></div>
      </div>
      <div class="flex-1 min-w-0">
        <h1 class="text-base font-semibold text-text">Project Chat</h1>
        <p class="text-xs text-text-muted">3 members online</p>
      </div>
      <button type="button" class="p-2 rounded-lg hover:bg-surface-sunken transition-colors" aria-label="More options">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
      </button>
    </div>
  </div>

  <!-- Messages -->
  <div
    bind:this={messagesContainer}
    class="flex-1 overflow-y-auto px-5 py-4 space-y-4"
  >
    {#each messages as msg (msg.id)}
      {#if isOwnMessage(msg)}
        <!-- Own message - right aligned -->
        <div class="flex justify-end">
          <div class="max-w-[75%]">
            <div class="bg-primary text-white px-4 py-2.5 rounded-t-2xl rounded-bl-2xl rounded-br-sm">
              <p class="text-sm">{msg.text}</p>
            </div>
            <p class="text-xs text-text-disabled mt-1 text-right">{formatTime(msg.time)}</p>
          </div>
        </div>
      {:else}
        <!-- Other's message - left aligned -->
        <div class="flex gap-2">
          <img
            src={msg.avatar}
            alt={msg.user}
            class="w-8 h-8 rounded-full bg-surface-sunken shrink-0 mt-1"
          />
          <div class="max-w-[75%]">
            <p class="text-xs text-text-muted mb-1">{msg.user}</p>
            <div class="bg-surface-sunken px-4 py-2.5 rounded-t-2xl rounded-br-2xl rounded-bl-sm">
              <p class="text-sm text-text">{msg.text}</p>
            </div>
            <p class="text-xs text-text-disabled mt-1">{formatTime(msg.time)}</p>
          </div>
        </div>
      {/if}
    {/each}

    <!-- Typing indicator -->
    {#if othersTyping.length > 0}
      <div class="flex gap-2">
        <img
          src={othersTyping[0].avatar}
          alt={othersTyping[0].name}
          class="w-8 h-8 rounded-full bg-surface-sunken shrink-0 mt-1"
        />
        <div>
          <p class="text-xs text-text-muted mb-1">{othersTyping[0].name}</p>
          <div class="bg-surface-sunken px-4 py-3 rounded-t-2xl rounded-br-2xl rounded-bl-sm inline-flex gap-1">
            <span class="w-2 h-2 bg-text-disabled rounded-full animate-bounce" style="animation-delay: 0ms"></span>
            <span class="w-2 h-2 bg-text-disabled rounded-full animate-bounce" style="animation-delay: 150ms"></span>
            <span class="w-2 h-2 bg-text-disabled rounded-full animate-bounce" style="animation-delay: 300ms"></span>
          </div>
        </div>
      </div>
    {/if}
  </div>

  <!-- Message Input -->
  <div class="shrink-0 px-4 py-3 border-t border-border bg-surface">
    <div class="flex items-end gap-2">
      <button type="button" class="p-2 rounded-full hover:bg-surface-sunken transition-colors shrink-0" aria-label="Attach file">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
        </svg>
      </button>

      <div class="flex-1 flex items-end gap-2 px-4 py-2 bg-surface-sunken rounded-2xl">
        <textarea
          bind:value={newMessage}
          onkeydown={handleKeydown}
          placeholder="Type a message..."
          rows="1"
          class="flex-1 bg-transparent resize-none outline-none text-sm text-text placeholder:text-text-disabled max-h-32"
        ></textarea>
      </div>

      <button
        type="button"
        class="p-2.5 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors shrink-0 disabled:opacity-50"
        onclick={sendMessage}
        disabled={!newMessage.trim()}
        aria-label="Send message"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      </button>
    </div>
  </div>
</div>
