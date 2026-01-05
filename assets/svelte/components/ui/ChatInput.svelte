<!--
  ChatInput Component
  Message composer with text input, voice recording, and file attachments.
  PWA-optimized with mobile keyboard handling.
-->
<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import VoiceNote from './VoiceNote.svelte';

  const dispatch = createEventDispatcher();

  /** @type {string} - Current text value */
  export let value = '';

  /** @type {string} - Placeholder text */
  export let placeholder = 'Type a message...';

  /** @type {boolean} - Enable voice recording */
  export let enableVoice = true;

  /** @type {boolean} - Enable file attachments */
  export let enableAttachments = true;

  /** @type {string[]} - Accepted file types */
  export let acceptedFiles = ['image/*', 'application/pdf', '.doc', '.docx'];

  /** @type {number} - Max file size in bytes (default 10MB) */
  export let maxFileSize = 10 * 1024 * 1024;

  /** @type {boolean} - Whether the input is disabled */
  export let disabled = false;

  /** @type {boolean} - Show send button even when empty (for voice) */
  export let alwaysShowSend = false;

  /** @type {{ id: string, name: string, avatar?: string } | null} - Replying to message */
  export let replyTo = null;

  // Internal state
  let textareaEl;
  let fileInputEl;
  let isRecording = false;
  let attachments = [];
  let isFocused = false;

  // Auto-resize textarea
  function autoResize() {
    if (!textareaEl) return;
    textareaEl.style.height = 'auto';
    textareaEl.style.height = Math.min(textareaEl.scrollHeight, 150) + 'px';
  }

  function handleInput(e) {
    value = e.target.value;
    autoResize();
    dispatch('input', { value });
  }

  function handleKeyDown(e) {
    // Submit on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleSend() {
    if (disabled) return;

    const hasContent = value.trim() || attachments.length > 0;
    if (!hasContent) return;

    dispatch('send', {
      text: value.trim(),
      attachments: [...attachments],
      replyTo
    });

    // Reset state
    value = '';
    attachments = [];
    if (replyTo) {
      dispatch('cancelreply');
    }
    autoResize();
  }

  function handleVoiceRecorded(e) {
    dispatch('voicesend', e.detail);
  }

  function toggleRecording() {
    isRecording = !isRecording;
  }

  function handleFileSelect(e) {
    const files = Array.from(e.target.files || []);
    processFiles(files);
    fileInputEl.value = '';
  }

  function handleDrop(e) {
    e.preventDefault();
    const files = Array.from(e.dataTransfer?.files || []);
    processFiles(files);
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  function processFiles(files) {
    for (const file of files) {
      if (file.size > maxFileSize) {
        dispatch('error', { message: `File too large: ${file.name}` });
        continue;
      }

      const attachment = {
        id: crypto.randomUUID(),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        preview: null
      };

      // Generate preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          attachment.preview = e.target?.result;
          attachments = [...attachments];
        };
        reader.readAsDataURL(file);
      }

      attachments = [...attachments, attachment];
    }

    dispatch('attachments', { attachments });
  }

  function removeAttachment(id) {
    attachments = attachments.filter(a => a.id !== id);
    dispatch('attachments', { attachments });
  }

  function cancelReply() {
    dispatch('cancelreply');
  }

  function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  function openFilePicker() {
    fileInputEl?.click();
  }

  onMount(() => {
    autoResize();
  });

  $: canSend = value.trim() || attachments.length > 0 || alwaysShowSend;
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="chat-input"
  class:focused={isFocused}
  class:disabled
  on:drop={handleDrop}
  on:dragover={handleDragOver}
  role="region"
  aria-label="Message input"
>
  <!-- Reply preview -->
  {#if replyTo}
    <div class="reply-preview">
      <div class="reply-bar"></div>
      <div class="reply-content">
        <span class="reply-label">Replying to</span>
        <span class="reply-name">{replyTo.name}</span>
      </div>
      <button class="reply-cancel" on:click={cancelReply} aria-label="Cancel reply">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  {/if}

  <!-- Attachments preview -->
  {#if attachments.length > 0}
    <div class="attachments-preview">
      {#each attachments as attachment (attachment.id)}
        <div class="attachment-item">
          {#if attachment.preview}
            <img src={attachment.preview} alt={attachment.name} class="attachment-thumb" />
          {:else}
            <div class="attachment-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
          {/if}
          <div class="attachment-info">
            <span class="attachment-name">{attachment.name}</span>
            <span class="attachment-size">{formatFileSize(attachment.size)}</span>
          </div>
          <button class="attachment-remove" on:click={() => removeAttachment(attachment.id)} aria-label="Remove attachment">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      {/each}
    </div>
  {/if}

  <!-- Voice recording mode -->
  {#if isRecording}
    <div class="recording-mode">
      <VoiceNote
        allowRecording
        state="recording"
        on:recorded={handleVoiceRecorded}
        on:recordingcancel={toggleRecording}
        on:recordingstop={toggleRecording}
      />
    </div>
  {:else}
    <!-- Main input area -->
    <div class="input-area">
      <!-- Attachment button -->
      {#if enableAttachments}
        <button
          class="action-btn"
          on:click={openFilePicker}
          {disabled}
          aria-label="Add attachment"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
          </svg>
        </button>
        <input
          bind:this={fileInputEl}
          type="file"
          accept={acceptedFiles.join(',')}
          multiple
          class="hidden-input"
          on:change={handleFileSelect}
        />
      {/if}

      <!-- Text input -->
      <textarea
        bind:this={textareaEl}
        {placeholder}
        {disabled}
        rows="1"
        class="text-input"
        bind:value
        on:input={handleInput}
        on:keydown={handleKeyDown}
        on:focus={() => isFocused = true}
        on:blur={() => isFocused = false}
      ></textarea>

      <!-- Voice / Send buttons -->
      <div class="action-buttons">
        {#if enableVoice && !value.trim() && attachments.length === 0}
          <button
            class="action-btn voice"
            on:click={toggleRecording}
            {disabled}
            aria-label="Record voice message"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          </button>
        {:else}
          <button
            class="action-btn send"
            class:active={canSend}
            on:click={handleSend}
            disabled={disabled || !canSend}
            aria-label="Send message"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
  .chat-input {
    display: flex;
    flex-direction: column;
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    transition: border-color var(--duration-fast) var(--ease-primary);
  }

  .chat-input.focused {
    border-color: var(--color-border-focus);
  }

  .chat-input.disabled {
    opacity: 0.6;
    pointer-events: none;
  }

  /* Reply preview */
  .reply-preview {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-3);
    border-bottom: 1px solid var(--color-border);
    background-color: var(--color-surface-sunken);
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  }

  .reply-bar {
    width: 3px;
    height: 24px;
    background-color: var(--color-primary);
    border-radius: var(--radius-full);
  }

  .reply-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--space-0-5);
  }

  .reply-label {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
  }

  .reply-name {
    font-size: var(--text-sm);
    font-weight: var(--font-medium);
    color: var(--color-primary);
  }

  .reply-cancel {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    background: none;
    border: none;
    border-radius: var(--radius-full);
    color: var(--color-text-muted);
    cursor: pointer;
    transition: all var(--duration-fast) var(--ease-primary);
  }

  .reply-cancel:hover {
    background-color: var(--color-surface);
    color: var(--color-text);
  }

  /* Attachments preview */
  .attachments-preview {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-3);
    border-bottom: 1px solid var(--color-border);
  }

  .attachment-item {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2);
    background-color: var(--color-surface-sunken);
    border-radius: var(--radius-md);
    max-width: 200px;
  }

  .attachment-thumb {
    width: 40px;
    height: 40px;
    border-radius: var(--radius-sm);
    object-fit: cover;
  }

  .attachment-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background-color: var(--color-surface);
    border-radius: var(--radius-sm);
    color: var(--color-text-muted);
  }

  .attachment-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
  }

  .attachment-name {
    font-size: var(--text-xs);
    font-weight: var(--font-medium);
    color: var(--color-text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .attachment-size {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
  }

  .attachment-remove {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    background: none;
    border: none;
    border-radius: var(--radius-full);
    color: var(--color-text-muted);
    cursor: pointer;
    transition: all var(--duration-fast) var(--ease-primary);
  }

  .attachment-remove:hover {
    background-color: var(--color-error-soft);
    color: var(--color-error);
  }

  /* Recording mode */
  .recording-mode {
    padding: var(--space-3);
  }

  /* Input area */
  .input-area {
    display: flex;
    align-items: flex-end;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-3);
  }

  .action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    background: none;
    border: none;
    border-radius: var(--radius-full);
    color: var(--color-text-muted);
    cursor: pointer;
    flex-shrink: 0;
    transition: all var(--duration-fast) var(--ease-primary);
  }

  .action-btn:hover:not(:disabled) {
    background-color: var(--color-surface-sunken);
    color: var(--color-text);
  }

  .action-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .action-btn.voice:hover {
    color: var(--color-error);
  }

  .action-btn.send {
    background-color: var(--color-surface-sunken);
  }

  .action-btn.send.active {
    background-color: var(--color-primary);
    color: var(--color-on-primary);
  }

  .action-btn.send.active:hover {
    background-color: var(--color-primary-hover);
  }

  .text-input {
    flex: 1;
    min-height: 36px;
    max-height: 150px;
    padding: var(--space-2) 0;
    background: none;
    border: none;
    font-family: inherit;
    font-size: var(--text-sm);
    color: var(--color-text);
    resize: none;
    line-height: var(--leading-relaxed);
  }

  .text-input::placeholder {
    color: var(--color-text-muted);
  }

  .text-input:focus {
    outline: none;
  }

  .action-buttons {
    display: flex;
    align-items: center;
    gap: var(--space-1);
  }

  .hidden-input {
    display: none;
  }

  /* Mobile adjustments */
  @media (max-width: 640px) {
    .chat-input {
      border-radius: var(--radius-lg) var(--radius-lg) 0 0;
      border-bottom: none;
    }

    .attachment-item {
      max-width: 150px;
    }
  }
</style>
