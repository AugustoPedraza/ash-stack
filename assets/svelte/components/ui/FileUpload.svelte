<!--
  FileUpload Component
  Drag & drop file upload with preview, progress, and validation.
-->
<script>
  import { createEventDispatcher } from 'svelte';
  import { fade, fly } from 'svelte/transition';

  const dispatch = createEventDispatcher();

  /**
   * Accepted file types (MIME types or extensions)
   * @type {string}
   */
  export let accept = '';

  /**
   * Allow multiple files
   * @type {boolean}
   */
  export let multiple = false;

  /**
   * Maximum file size in bytes (0 = no limit)
   * @type {number}
   */
  export let maxSize = 0;

  /**
   * Maximum number of files (0 = no limit)
   * @type {number}
   */
  export let maxFiles = 0;

  /**
   * Show file previews
   * @type {boolean}
   */
  export let showPreview = true;

  /**
   * Disabled state
   * @type {boolean}
   */
  export let disabled = false;

  /**
   * Current files (for controlled usage)
   * @type {Array<{ file: File, id: string, progress?: number, error?: string, url?: string }>}
   */
  export let files = [];

  /**
   * Upload function (if provided, handles upload automatically)
   * @type {((file: File) => Promise<string>) | null}
   */
  export let uploadFn = null;

  /**
   * Variant style
   * @type {'default' | 'compact' | 'avatar'}
   */
  export let variant = 'default';

  /**
   * Helper text
   * @type {string}
   */
  export let helperText = '';

  let inputEl;
  let dragOver = false;
  let dragCounter = 0;

  $: acceptHint = accept
    ? accept.split(',').map(t => t.trim().replace('image/', '.').replace('/*', '')).join(', ')
    : 'Any file type';

  $: sizeHint = maxSize > 0
    ? `Max ${formatSize(maxSize)}`
    : '';

  function formatSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  }

  function generateId() {
    return Math.random().toString(36).slice(2, 11);
  }

  function validateFile(file) {
    // Check file type
    if (accept) {
      const types = accept.split(',').map(t => t.trim().toLowerCase());
      const fileType = file.type.toLowerCase();
      const fileExt = '.' + file.name.split('.').pop().toLowerCase();

      const valid = types.some(t => {
        if (t.startsWith('.')) return fileExt === t;
        if (t.endsWith('/*')) return fileType.startsWith(t.slice(0, -1));
        return fileType === t;
      });

      if (!valid) {
        return `File type not accepted. Allowed: ${acceptHint}`;
      }
    }

    // Check file size
    if (maxSize > 0 && file.size > maxSize) {
      return `File too large. Maximum size: ${formatSize(maxSize)}`;
    }

    return null;
  }

  async function handleFiles(fileList) {
    if (disabled) return;

    const newFiles = Array.from(fileList);

    // Check max files limit
    if (maxFiles > 0 && files.length + newFiles.length > maxFiles) {
      dispatch('error', { message: `Maximum ${maxFiles} file${maxFiles > 1 ? 's' : ''} allowed` });
      return;
    }

    for (const file of newFiles) {
      const error = validateFile(file);
      const id = generateId();

      const fileEntry = {
        file,
        id,
        progress: 0,
        error: error || undefined,
        url: undefined
      };

      // Generate preview for images
      if (!error && showPreview && file.type.startsWith('image/')) {
        fileEntry.url = URL.createObjectURL(file);
      }

      files = [...files, fileEntry];

      if (!error) {
        dispatch('add', { file, id });

        // Auto-upload if function provided
        if (uploadFn) {
          try {
            const index = files.findIndex(f => f.id === id);
            files[index].progress = 0;

            const url = await uploadFn(file);

            files = files.map(f =>
              f.id === id ? { ...f, progress: 100, url } : f
            );

            dispatch('upload', { file, id, url });
          } catch (err) {
            files = files.map(f =>
              f.id === id ? { ...f, error: err.message || 'Upload failed' } : f
            );
            dispatch('error', { file, id, error: err });
          }
        }
      }
    }

    // Clear input
    if (inputEl) inputEl.value = '';
  }

  function handleDragEnter(e) {
    e.preventDefault();
    dragCounter++;
    dragOver = true;
  }

  function handleDragLeave(e) {
    e.preventDefault();
    dragCounter--;
    if (dragCounter === 0) {
      dragOver = false;
    }
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  function handleDrop(e) {
    e.preventDefault();
    dragCounter = 0;
    dragOver = false;

    if (e.dataTransfer?.files) {
      handleFiles(e.dataTransfer.files);
    }
  }

  function handleInputChange(e) {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  }

  function removeFile(id) {
    const file = files.find(f => f.id === id);
    if (file?.url && file.url.startsWith('blob:')) {
      URL.revokeObjectURL(file.url);
    }
    files = files.filter(f => f.id !== id);
    dispatch('remove', { id });
  }

  function retryFile(id) {
    const fileEntry = files.find(f => f.id === id);
    if (fileEntry && uploadFn) {
      files = files.map(f =>
        f.id === id ? { ...f, error: undefined, progress: 0 } : f
      );
      handleFiles([fileEntry.file]);
    }
  }

  function openFilePicker() {
    inputEl?.click();
  }

  function getFileIcon(file) {
    const type = file.type;
    if (type.startsWith('image/')) return 'image';
    if (type.startsWith('video/')) return 'video';
    if (type.startsWith('audio/')) return 'audio';
    if (type.includes('pdf')) return 'pdf';
    if (type.includes('word') || type.includes('document')) return 'doc';
    if (type.includes('sheet') || type.includes('excel')) return 'sheet';
    if (type.includes('zip') || type.includes('archive')) return 'archive';
    return 'file';
  }
</script>

<div class="file-upload variant-{variant}" class:disabled>
  <!-- Hidden input -->
  <input
    bind:this={inputEl}
    type="file"
    {accept}
    {multiple}
    {disabled}
    class="hidden-input"
    on:change={handleInputChange}
  />

  {#if variant === 'avatar'}
    <!-- Avatar upload variant -->
    <button
      type="button"
      class="avatar-upload"
      class:has-file={files.length > 0}
      on:click={openFilePicker}
      on:dragenter={handleDragEnter}
      on:dragleave={handleDragLeave}
      on:dragover={handleDragOver}
      on:drop={handleDrop}
      {disabled}
    >
      {#if files.length > 0 && files[0].url}
        <img src={files[0].url} alt="Avatar preview" class="avatar-preview" />
        <div class="avatar-overlay">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
        </div>
      {:else}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
          <circle cx="12" cy="13" r="4"/>
        </svg>
      {/if}
    </button>

  {:else}
    <!-- Default/Compact dropzone -->
    <button
      type="button"
      class="dropzone"
      class:drag-over={dragOver}
      class:compact={variant === 'compact'}
      on:click={openFilePicker}
      on:dragenter={handleDragEnter}
      on:dragleave={handleDragLeave}
      on:dragover={handleDragOver}
      on:drop={handleDrop}
      {disabled}
    >
      <div class="dropzone-content">
        <svg class="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="17 8 12 3 7 8"/>
          <line x1="12" y1="3" x2="12" y2="15"/>
        </svg>

        {#if variant === 'compact'}
          <span class="dropzone-text">
            <strong>Choose file</strong> or drag here
          </span>
        {:else}
          <div class="dropzone-text">
            <strong>Click to upload</strong> or drag and drop
          </div>
          <div class="dropzone-hint">
            {acceptHint}{sizeHint ? ` • ${sizeHint}` : ''}
          </div>
        {/if}
      </div>
    </button>
  {/if}

  {#if helperText}
    <p class="helper-text">{helperText}</p>
  {/if}

  <!-- File list -->
  {#if files.length > 0 && variant !== 'avatar'}
    <ul class="file-list">
      {#each files as fileEntry (fileEntry.id)}
        <li class="file-item" transition:fly={{ y: 10, duration: 150 }}>
          <!-- Preview/Icon -->
          <div class="file-preview">
            {#if showPreview && fileEntry.url && fileEntry.file.type.startsWith('image/')}
              <img src={fileEntry.url} alt={fileEntry.file.name} />
            {:else}
              {@const iconType = getFileIcon(fileEntry.file)}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                {#if iconType === 'image'}
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                {:else if iconType === 'video'}
                  <polygon points="23 7 16 12 23 17 23 7"/>
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                {:else if iconType === 'audio'}
                  <path d="M9 18V5l12-2v13"/>
                  <circle cx="6" cy="18" r="3"/>
                  <circle cx="18" cy="16" r="3"/>
                {:else if iconType === 'pdf'}
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                {:else}
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                {/if}
              </svg>
            {/if}
          </div>

          <!-- File info -->
          <div class="file-info">
            <span class="file-name">{fileEntry.file.name}</span>
            <span class="file-size">{formatSize(fileEntry.file.size)}</span>

            {#if fileEntry.error}
              <span class="file-error">{fileEntry.error}</span>
            {:else if fileEntry.progress !== undefined && fileEntry.progress < 100}
              <div class="file-progress">
                <div class="progress-bar" style="width: {fileEntry.progress}%"></div>
              </div>
            {/if}
          </div>

          <!-- Actions -->
          <div class="file-actions">
            {#if fileEntry.error && uploadFn}
              <button
                type="button"
                class="file-action"
                on:click={() => retryFile(fileEntry.id)}
                aria-label="Retry upload"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="23 4 23 10 17 10"/>
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                </svg>
              </button>
            {/if}
            <button
              type="button"
              class="file-action remove"
              on:click={() => removeFile(fileEntry.id)}
              aria-label="Remove file"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .file-upload {
    width: 100%;
  }

  .file-upload.disabled {
    opacity: 0.6;
    pointer-events: none;
  }

  .hidden-input {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  /* Dropzone */
  .dropzone {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: var(--spacing-8);
    background-color: var(--color-surface);
    border: 2px dashed var(--color-border);
    border-radius: var(--radius-lg);
    cursor: pointer;
    transition: border-color 150ms ease, background-color 150ms ease;
  }

  .dropzone:hover,
  .dropzone:focus-visible {
    border-color: var(--color-primary);
    background-color: color-mix(in srgb, var(--color-primary) 5%, var(--color-surface));
  }

  .dropzone:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 20%, transparent);
  }

  .dropzone.drag-over {
    border-color: var(--color-primary);
    background-color: color-mix(in srgb, var(--color-primary) 10%, var(--color-surface));
  }

  .dropzone.compact {
    padding: var(--spacing-4);
  }

  .dropzone-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-2);
    text-align: center;
  }

  .dropzone.compact .dropzone-content {
    flex-direction: row;
    gap: var(--spacing-3);
  }

  .upload-icon {
    width: 2.5rem;
    height: 2.5rem;
    color: var(--color-text-muted);
  }

  .dropzone.compact .upload-icon {
    width: 1.5rem;
    height: 1.5rem;
  }

  .dropzone-text {
    font-size: 0.9375rem;
    color: var(--color-text);
  }

  .dropzone-text strong {
    color: var(--color-primary);
  }

  .dropzone-hint {
    font-size: 0.8125rem;
    color: var(--color-text-muted);
  }

  .helper-text {
    margin-top: var(--spacing-2);
    font-size: 0.8125rem;
    color: var(--color-text-muted);
  }

  /* Avatar variant */
  .avatar-upload {
    position: relative;
    width: 6rem;
    height: 6rem;
    padding: 0;
    background-color: var(--color-surface-raised);
    border: 2px dashed var(--color-border);
    border-radius: 50%;
    cursor: pointer;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text-muted);
    transition: border-color 150ms ease;
  }

  .avatar-upload:hover,
  .avatar-upload:focus-visible {
    border-color: var(--color-primary);
  }

  .avatar-upload:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 20%, transparent);
  }

  .avatar-upload.has-file {
    border-style: solid;
  }

  .avatar-upload svg {
    width: 2rem;
    height: 2rem;
  }

  .avatar-preview {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .avatar-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    opacity: 0;
    transition: opacity 150ms ease;
  }

  .avatar-upload:hover .avatar-overlay {
    opacity: 1;
  }

  .avatar-overlay svg {
    width: 1.5rem;
    height: 1.5rem;
  }

  /* File list */
  .file-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-2);
    margin-top: var(--spacing-4);
    padding: 0;
    list-style: none;
  }

  .file-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-3);
    padding: var(--spacing-3);
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
  }

  .file-preview {
    width: 2.5rem;
    height: 2.5rem;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--color-surface-raised);
    border-radius: var(--radius-sm);
    overflow: hidden;
  }

  .file-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .file-preview svg {
    width: 1.25rem;
    height: 1.25rem;
    color: var(--color-text-muted);
  }

  .file-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-1);
  }

  .file-name {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .file-size {
    font-size: 0.75rem;
    color: var(--color-text-muted);
  }

  .file-error {
    font-size: 0.75rem;
    color: var(--color-error);
  }

  .file-progress {
    width: 100%;
    height: 0.25rem;
    background-color: var(--color-surface-raised);
    border-radius: var(--radius-full);
    overflow: hidden;
  }

  .progress-bar {
    height: 100%;
    background-color: var(--color-primary);
    border-radius: var(--radius-full);
    transition: width 150ms ease;
  }

  .file-actions {
    display: flex;
    gap: var(--spacing-1);
    flex-shrink: 0;
  }

  .file-action {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.75rem;
    height: 1.75rem;
    padding: 0;
    background: none;
    border: none;
    border-radius: var(--radius-sm);
    color: var(--color-text-muted);
    cursor: pointer;
    transition: color 150ms ease, background-color 150ms ease;
  }

  .file-action:hover {
    background-color: var(--color-surface-raised);
    color: var(--color-text);
  }

  .file-action.remove:hover {
    color: var(--color-error);
  }

  .file-action svg {
    width: 1rem;
    height: 1rem;
  }
</style>
