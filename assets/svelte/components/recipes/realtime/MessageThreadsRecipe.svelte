<script>
  /**
   * Message Threads Recipe
   * Nested message replies with expand/collapse functionality.
   *
   * Uses: Button
   */
  import { Button } from '../../ui';

  // Thread data
  let threads = $state([
    {
      id: 1,
      user: 'Sarah Chen',
      avatar: 'https://i.pravatar.cc/40?img=1',
      text: 'Has anyone reviewed the new design specs? I think there are some issues with the mobile layout.',
      time: new Date(Date.now() - 7200000),
      expanded: true,
      replies: [
        {
          id: 11,
          user: 'Mike Johnson',
          avatar: 'https://i.pravatar.cc/40?img=2',
          text: 'I looked at them yesterday. The header seems too tall on smaller screens.',
          time: new Date(Date.now() - 5400000),
        },
        {
          id: 12,
          user: 'Emma Wilson',
          avatar: 'https://i.pravatar.cc/40?img=3',
          text: 'Agreed. I\'ll update the spacing. Should have a fix ready by EOD.',
          time: new Date(Date.now() - 3600000),
        },
        {
          id: 13,
          user: 'Sarah Chen',
          avatar: 'https://i.pravatar.cc/40?img=1',
          text: 'Perfect, thanks Emma!',
          time: new Date(Date.now() - 1800000),
        },
      ]
    },
    {
      id: 2,
      user: 'Alex Kim',
      avatar: 'https://i.pravatar.cc/40?img=4',
      text: 'Quick reminder: standup in 15 minutes!',
      time: new Date(Date.now() - 900000),
      expanded: false,
      replies: [
        {
          id: 21,
          user: 'Lisa Park',
          avatar: 'https://i.pravatar.cc/40?img=5',
          text: 'On my way!',
          time: new Date(Date.now() - 600000),
        },
      ]
    },
    {
      id: 3,
      user: 'Tom Brown',
      avatar: 'https://i.pravatar.cc/40?img=6',
      text: 'The deployment pipeline is fixed. All green now.',
      time: new Date(Date.now() - 300000),
      expanded: false,
      replies: []
    }
  ]);

  let replyingTo = $state(null);
  let replyText = $state('');

  function toggleThread(threadId) {
    threads = threads.map(t =>
      t.id === threadId ? { ...t, expanded: !t.expanded } : t
    );
  }

  function startReply(threadId) {
    replyingTo = threadId;
    replyText = '';
  }

  function cancelReply() {
    replyingTo = null;
    replyText = '';
  }

  function submitReply() {
    if (!replyText.trim() || !replyingTo) return;

    const newReply = {
      id: Date.now(),
      user: 'You',
      avatar: 'https://i.pravatar.cc/40?img=8',
      text: replyText.trim(),
      time: new Date(),
    };

    threads = threads.map(t =>
      t.id === replyingTo
        ? { ...t, replies: [...t.replies, newReply], expanded: true }
        : t
    );

    replyingTo = null;
    replyText = '';
  }

  function formatTime(date) {
    const mins = Math.floor((Date.now() - date.getTime()) / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
</script>

<div class="h-full bg-background overflow-y-auto px-5 py-6">
  <div class="max-w-lg mx-auto">
    <div class="mb-6">
      <h1 class="text-xl font-semibold text-foreground mb-2">Message Threads</h1>
      <p class="text-muted-foreground text-sm">Nested replies with expand/collapse.</p>
    </div>

    <!-- Threads List -->
    <div class="space-y-4">
      {#each threads as thread (thread.id)}
        <div class="bg-background border border-border rounded-xl overflow-hidden">
          <!-- Main Message -->
          <div class="p-4">
            <div class="flex gap-3">
              <img
                src={thread.avatar}
                alt={thread.user}
                class="w-10 h-10 rounded-full bg-surface-sunken shrink-0"
              />
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-sm font-medium text-foreground">{thread.user}</span>
                  <span class="text-xs text-text-disabled">{formatTime(thread.time)}</span>
                </div>
                <p class="text-sm text-muted-foreground">{thread.text}</p>

                <!-- Thread Actions -->
                <div class="flex items-center gap-4 mt-3">
                  {#if thread.replies.length > 0}
                    <button
                      type="button"
                      class="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors"
                      onclick={() => toggleThread(thread.id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform {thread.expanded ? 'rotate-90' : ''}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                      {thread.replies.length} {thread.replies.length === 1 ? 'reply' : 'replies'}
                    </button>
                  {/if}
                  <button
                    type="button"
                    class="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    onclick={() => startReply(thread.id)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                    Reply
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Replies -->
          {#if thread.expanded && thread.replies.length > 0}
            <div class="border-t border-border bg-surface-sunken/30">
              {#each thread.replies as reply (reply.id)}
                <div class="p-4 pl-16 border-b border-border last:border-b-0">
                  <div class="flex gap-3">
                    <img
                      src={reply.avatar}
                      alt={reply.user}
                      class="w-8 h-8 rounded-full bg-surface-sunken shrink-0"
                    />
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2 mb-1">
                        <span class="text-sm font-medium text-foreground">{reply.user}</span>
                        <span class="text-xs text-text-disabled">{formatTime(reply.time)}</span>
                      </div>
                      <p class="text-sm text-muted-foreground">{reply.text}</p>
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          {/if}

          <!-- Reply Input -->
          {#if replyingTo === thread.id}
            <div class="p-4 border-t border-border bg-surface-sunken/50">
              <div class="flex gap-3">
                <img
                  src="https://i.pravatar.cc/40?img=8"
                  alt="You"
                  class="w-8 h-8 rounded-full bg-surface-sunken shrink-0"
                />
                <div class="flex-1">
                  <textarea
                    bind:value={replyText}
                    placeholder="Write a reply..."
                    rows="2"
                    class="w-full px-3 py-2 text-sm bg-background border border-border-strong rounded-lg resize-none outline-none focus:border-primary"
                  ></textarea>
                  <div class="flex justify-end gap-2 mt-2">
                    <Button variant="ghost" size="sm" onclick={cancelReply}>
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onclick={submitReply}
                      disabled={!replyText.trim()}
                    >
                      Reply
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          {/if}
        </div>
      {/each}
    </div>

    <!-- Compact Thread Style -->
    <div class="mt-10 mb-6">
      <h2 class="text-sm font-medium text-foreground mb-3">Compact Style (Slack-like)</h2>
    </div>

    <div class="space-y-1 p-4 bg-surface-sunken/30 rounded-xl">
      {#each threads.slice(0, 2) as thread}
        <div class="group">
          <div class="flex items-start gap-2 py-1 px-2 rounded hover:bg-surface-sunken/50">
            <img src={thread.avatar} alt={thread.user} class="w-6 h-6 rounded mt-0.5" />
            <div class="flex-1 min-w-0">
              <span class="text-sm font-medium text-foreground">{thread.user}</span>
              <span class="text-xs text-text-disabled ml-2">{formatTime(thread.time)}</span>
              <p class="text-sm text-muted-foreground">{thread.text}</p>
            </div>
          </div>
          {#if thread.replies.length > 0}
            <button
              type="button"
              class="ml-8 mt-1 flex items-center gap-2 px-2 py-1 text-xs text-primary hover:bg-primary/10 rounded transition-colors"
            >
              <div class="flex -space-x-1">
                {#each thread.replies.slice(0, 3) as reply}
                  <img src={reply.avatar} alt={reply.user} class="w-4 h-4 rounded ring-1 ring-background" />
                {/each}
              </div>
              {thread.replies.length} {thread.replies.length === 1 ? 'reply' : 'replies'}
            </button>
          {/if}
        </div>
      {/each}
    </div>

    <!-- Mobile UX Note -->
    <div class="mt-8 p-4 bg-primary/5 border border-primary/20 rounded-lg">
      <h3 class="text-sm font-medium text-primary mb-2">Mobile UX Patterns</h3>
      <ul class="text-xs text-muted-foreground space-y-1">
        <li>• Collapse threads by default on mobile</li>
        <li>• Show reply count before expanding</li>
        <li>• Indent replies for visual hierarchy</li>
        <li>• Inline reply input to reduce navigation</li>
      </ul>
    </div>
  </div>
</div>
