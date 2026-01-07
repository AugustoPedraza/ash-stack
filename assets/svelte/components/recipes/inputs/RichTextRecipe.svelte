<script>
  /**
   * Rich Text Recipe
   * Minimal formatting toolbar (Apple Notes / Notion style).
   *
   * Uses: Button, Modal, Input
   */
  import { Button, Modal, Input } from '../../ui';

  let content = $state('');
  let showLinkModal = $state(false);
  let linkUrl = $state('');
  let linkText = $state('');
  let showMentionDropdown = $state(false);
  let mentionQuery = $state('');
  let mentionPosition = $state({ top: 0, left: 0 });
  let textareaRef = $state(null);
  let selectionStart = $state(0);
  let selectionEnd = $state(0);

  const MAX_CHARS = 500;

  // Mock users for mentions
  const users = [
    { id: 'user1', name: 'Alice Johnson', avatar: 'AJ' },
    { id: 'user2', name: 'Bob Smith', avatar: 'BS' },
    { id: 'user3', name: 'Carol White', avatar: 'CW' },
    { id: 'user4', name: 'David Brown', avatar: 'DB' },
    { id: 'user5', name: 'Eve Davis', avatar: 'ED' }
  ];

  const filteredUsers = $derived.by(() => {
    if (!mentionQuery) return users.slice(0, 5);
    const query = mentionQuery.toLowerCase();
    return users.filter(u => u.name.toLowerCase().includes(query)).slice(0, 5);
  });

  const charCount = $derived(content.length);
  const isOverLimit = $derived(charCount > MAX_CHARS);

  function applyFormat(prefix, suffix = prefix) {
    if (!textareaRef) return;

    const start = textareaRef.selectionStart;
    const end = textareaRef.selectionEnd;
    const text = content;
    const selectedText = text.substring(start, end);

    const newText = text.substring(0, start) + prefix + selectedText + suffix + text.substring(end);
    content = newText;

    setTimeout(() => {
      textareaRef.focus();
      textareaRef.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  }

  function handleBold() { applyFormat('**'); }
  function handleItalic() { applyFormat('_'); }
  function handleCode() { applyFormat('`'); }

  function handleList() {
    if (!textareaRef) return;
    const start = textareaRef.selectionStart;
    const text = content;

    let lineStart = start;
    while (lineStart > 0 && text[lineStart - 1] !== '\n') {
      lineStart--;
    }

    const newText = text.substring(0, lineStart) + '- ' + text.substring(lineStart);
    content = newText;

    setTimeout(() => {
      textareaRef.focus();
      textareaRef.setSelectionRange(start + 2, start + 2);
    }, 0);
  }

  function openLinkModal() {
    if (!textareaRef) return;
    selectionStart = textareaRef.selectionStart;
    selectionEnd = textareaRef.selectionEnd;
    linkText = content.substring(selectionStart, selectionEnd);
    linkUrl = '';
    showLinkModal = true;
  }

  function insertLink() {
    if (!linkUrl) return;

    const text = linkText || linkUrl;
    const markdown = `[${text}](${linkUrl})`;

    const newContent = content.substring(0, selectionStart) + markdown + content.substring(selectionEnd);
    content = newContent;

    showLinkModal = false;
    linkUrl = '';
    linkText = '';
  }

  function handleInput(e) {
    const text = e.target.value;
    const cursorPos = e.target.selectionStart;

    const textBeforeCursor = text.substring(0, cursorPos);
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/);

    if (mentionMatch) {
      mentionQuery = mentionMatch[1];
      showMentionDropdown = true;

      const rect = textareaRef.getBoundingClientRect();
      mentionPosition = {
        top: rect.top + 40,
        left: rect.left + 10
      };
    } else {
      showMentionDropdown = false;
      mentionQuery = '';
    }

    content = text;
  }

  function insertMention(user) {
    const cursorPos = textareaRef.selectionStart;
    const textBeforeCursor = content.substring(0, cursorPos);
    const textAfterCursor = content.substring(cursorPos);

    const newTextBefore = textBeforeCursor.replace(/@\w*$/, `@${user.name.replace(' ', '')} `);
    content = newTextBefore + textAfterCursor;

    showMentionDropdown = false;
    mentionQuery = '';

    setTimeout(() => {
      textareaRef.focus();
      textareaRef.setSelectionRange(newTextBefore.length, newTextBefore.length);
    }, 0);
  }

  function handleKeydown(e) {
    if (showMentionDropdown && (e.key === 'Escape' || e.key === 'Tab')) {
      showMentionDropdown = false;
    }
  }
</script>

<div class="h-full bg-background overflow-y-auto px-5 py-6">
  <div class="max-w-md mx-auto">
    <div class="mb-8">
      <h1 class="text-xl font-semibold text-foreground mb-2">Rich Text Editor</h1>
      <p class="text-muted-foreground text-sm">Minimal formatting with @mentions and links.</p>
    </div>

    <div class="flex flex-col gap-6">
      <!-- Editor -->
      <div class="flex flex-col gap-1.5">
        <span class="text-sm font-medium text-foreground">Message</span>

        <div class="border border-border-strong rounded-lg overflow-hidden">
          <!-- Minimal Toolbar -->
          <div class="flex items-center gap-0.5 px-2 py-1.5 border-b border-border">
            <button
              type="button"
              class="w-8 h-8 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-surface-sunken transition-colors"
              onclick={handleBold}
              title="Bold (**text**)"
            >
              <span class="text-sm font-bold">B</span>
            </button>
            <button
              type="button"
              class="w-8 h-8 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-surface-sunken transition-colors"
              onclick={handleItalic}
              title="Italic (_text_)"
            >
              <span class="text-sm italic">I</span>
            </button>
            <button
              type="button"
              class="w-8 h-8 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-surface-sunken transition-colors"
              onclick={handleCode}
              title="Code (`text`)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </button>
            <button
              type="button"
              class="w-8 h-8 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-surface-sunken transition-colors"
              onclick={handleList}
              title="List"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
            <div class="w-px h-4 bg-border mx-1"></div>
            <button
              type="button"
              class="w-8 h-8 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-surface-sunken transition-colors"
              onclick={openLinkModal}
              title="Link"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </button>
          </div>

          <!-- Textarea -->
          <textarea
            bind:this={textareaRef}
            class="w-full min-h-32 p-3 text-sm bg-background text-foreground resize-none"
            style="outline: none !important; box-shadow: none !important; border: none !important;"
            placeholder="Type your message... Use @ to mention someone"
            oninput={handleInput}
            onkeydown={handleKeydown}
            value={content}
          ></textarea>

          <!-- Footer -->
          <div class="flex items-center justify-between px-3 py-2 border-t border-border">
            <span class="text-xs text-text-disabled">
              @ to mention
            </span>
            <span class="text-xs {isOverLimit ? 'text-destructive' : 'text-text-disabled'}">
              {charCount}/{MAX_CHARS}
            </span>
          </div>
        </div>

        {#if isOverLimit}
          <p class="text-xs text-destructive">Character limit exceeded</p>
        {/if}
      </div>

      <!-- Preview -->
      {#if content.trim()}
        <div class="flex flex-col gap-1.5">
          <span class="text-sm font-medium text-foreground">Preview</span>
          <div class="p-4 bg-surface-sunken rounded-lg text-sm text-foreground">
            {#each content.split('\n') as line}
              <p class="mb-1">
                {@html line
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/_(.*?)_/g, '<em>$1</em>')
                  .replace(/`(.*?)`/g, '<code class="px-1 bg-border rounded text-sm">$1</code>')
                  .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary underline">$1</a>')
                  .replace(/@(\w+)/g, '<span class="text-primary">@$1</span>')
                  .replace(/^- (.*)$/, '<span class="flex items-start gap-2"><span class="text-text-disabled">•</span><span>$1</span></span>')
                }
              </p>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>

<!-- Mention Dropdown -->
{#if showMentionDropdown}
  <div
    class="fixed bg-background border border-border-strong rounded-lg shadow-lg z-50 w-48 overflow-hidden"
    style="top: {mentionPosition.top}px; left: {mentionPosition.left}px;"
  >
    {#each filteredUsers as user}
      <button
        type="button"
        class="w-full flex items-center gap-2 px-3 py-2 text-left text-sm hover:bg-surface-sunken transition-colors"
        onclick={() => insertMention(user)}
      >
        <span class="w-6 h-6 rounded-full bg-surface-sunken text-muted-foreground flex items-center justify-center text-xs">
          {user.avatar}
        </span>
        <span class="text-foreground truncate">{user.name}</span>
      </button>
    {:else}
      <div class="px-3 py-2 text-sm text-muted-foreground">No users found</div>
    {/each}
  </div>
{/if}

<!-- Link Modal -->
<Modal
  bind:open={showLinkModal}
  title="Insert Link"
  size="sm"
>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-1.5">
      <label class="text-sm text-muted-foreground" for="link-text">Text</label>
      <Input
        id="link-text"
        type="text"
        placeholder="Link text"
        bind:value={linkText}
      />
    </div>

    <div class="flex flex-col gap-1.5">
      <label class="text-sm text-muted-foreground" for="link-url">URL</label>
      <Input
        id="link-url"
        type="url"
        placeholder="https://example.com"
        bind:value={linkUrl}
      />
    </div>
  </div>
  {#snippet footer()}
    <div class="flex justify-end gap-2">
      <Button variant="ghost" onclick={() => showLinkModal = false}>
        Cancel
      </Button>
      <Button variant="primary" onclick={insertLink} disabled={!linkUrl}>
        Insert
      </Button>
    </div>
  {/snippet}
</Modal>
