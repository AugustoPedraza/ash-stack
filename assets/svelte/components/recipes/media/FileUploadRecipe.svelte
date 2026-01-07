<script>
  /**
   * File Upload Recipe
   * Drag and drop with progress, preview, and error states.
   */

  let files = $state([]);
  let isDragging = $state(false);
  let uploadError = $state(null);

  function generateId() {
    return Math.random().toString(36).substr(2, 9);
  }

  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  function getFileIcon(type) {
    if (type.startsWith('image/')) return 'image';
    if (type.startsWith('video/')) return 'video';
    if (type.startsWith('audio/')) return 'audio';
    if (type.includes('pdf')) return 'pdf';
    if (type.includes('spreadsheet') || type.includes('excel')) return 'spreadsheet';
    if (type.includes('document') || type.includes('word')) return 'document';
    return 'file';
  }

  function handleDrop(e) {
    e.preventDefault();
    isDragging = false;
    uploadError = null;

    const droppedFiles = Array.from(e.dataTransfer?.files || []);
    processFiles(droppedFiles);
  }

  function handleFileSelect(e) {
    uploadError = null;
    const selectedFiles = Array.from(e.target.files || []);
    processFiles(selectedFiles);
  }

  function processFiles(newFiles) {
    // Validate files
    const maxSize = 10 * 1024 * 1024; // 10MB
    const validFiles = [];

    for (const file of newFiles) {
      if (file.size > maxSize) {
        uploadError = `File "${file.name}" exceeds 10MB limit`;
        continue;
      }
      validFiles.push(file);
    }

    // Add files with initial state
    const fileEntries = validFiles.map(file => ({
      id: generateId(),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
      status: 'uploading',
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    }));

    files = [...files, ...fileEntries];

    // Simulate upload for each file
    fileEntries.forEach(entry => simulateUpload(entry.id));
  }

  function simulateUpload(fileId) {
    const duration = 2000 + Math.random() * 3000;
    const startTime = Date.now();

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, (elapsed / duration) * 100);

      files = files.map(f => {
        if (f.id === fileId) {
          if (progress >= 100) {
            // Simulate occasional failures
            const shouldFail = Math.random() < 0.1;
            return { ...f, progress: 100, status: shouldFail ? 'error' : 'complete' };
          }
          return { ...f, progress };
        }
        return f;
      });

      if (progress < 100) {
        requestAnimationFrame(updateProgress);
      }
    };

    requestAnimationFrame(updateProgress);
  }

  function retryUpload(fileId) {
    files = files.map(f =>
      f.id === fileId ? { ...f, progress: 0, status: 'uploading' } : f
    );
    simulateUpload(fileId);
  }

  function removeFile(fileId) {
    const file = files.find(f => f.id === fileId);
    if (file?.preview) {
      URL.revokeObjectURL(file.preview);
    }
    files = files.filter(f => f.id !== fileId);
  }

  function clearAll() {
    files.forEach(f => {
      if (f.preview) URL.revokeObjectURL(f.preview);
    });
    files = [];
  }
</script>

<div class="h-full bg-background overflow-y-auto px-5 py-6">
  <div class="max-w-md mx-auto">
    <div class="mb-8">
      <h1 class="text-xl font-semibold text-foreground mb-2">File Upload</h1>
      <p class="text-muted-foreground text-sm">Drag and drop with progress tracking.</p>
    </div>

    <!-- Drop Zone -->
    <div
      class="mb-6 relative border-2 border-dashed rounded-xl p-8 text-center transition-colors
        {isDragging ? 'border-primary bg-primary/5' : 'border-border-strong hover:border-text/30'}"
      ondragover={(e) => { e.preventDefault(); isDragging = true; }}
      ondragleave={() => isDragging = false}
      ondrop={handleDrop}
      role="button"
      tabindex="0"
    >
      <input
        type="file"
        multiple
        class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onchange={handleFileSelect}
        aria-label="Select files to upload"
      />

      <div class="pointer-events-none">
        <div class="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <p class="text-sm font-medium text-foreground mb-1">
          {isDragging ? 'Drop files here' : 'Drag files here or click to browse'}
        </p>
        <p class="text-xs text-muted-foreground">Maximum file size: 10MB</p>
      </div>
    </div>

    <!-- Error Message -->
    {#if uploadError}
      <div class="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-destructive shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-sm text-destructive">{uploadError}</p>
        <button
          type="button"
          class="ml-auto p-1 rounded hover:bg-destructive/10"
          onclick={() => uploadError = null}
          aria-label="Dismiss error"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    {/if}

    <!-- File List Header -->
    {#if files.length > 0}
      <div class="flex items-center justify-between mb-3">
        <span class="text-sm font-medium text-foreground">{files.length} file{files.length !== 1 ? 's' : ''}</span>
        <button
          type="button"
          class="text-sm text-muted-foreground hover:text-destructive transition-colors"
          onclick={clearAll}
        >
          Clear all
        </button>
      </div>
    {/if}

    <!-- File List -->
    <div class="space-y-3">
      {#each files as file (file.id)}
        <div class="bg-background border border-border rounded-xl p-3 {file.status === 'error' ? 'border-destructive/30' : ''}">
          <div class="flex items-start gap-3">
            <!-- Preview or Icon -->
            <div class="shrink-0 w-12 h-12 rounded-lg bg-surface-sunken overflow-hidden flex items-center justify-center">
              {#if file.preview}
                <img src={file.preview} alt={file.name} class="w-full h-full object-cover" />
              {:else}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-text-disabled" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              {/if}
            </div>

            <!-- File Info -->
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-foreground truncate">{file.name}</p>
              <p class="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>

              <!-- Progress Bar -->
              {#if file.status === 'uploading'}
                <div class="mt-2">
                  <div class="h-1.5 bg-surface-sunken rounded-full overflow-hidden">
                    <div
                      class="h-full bg-primary rounded-full transition-all duration-300"
                      style="width: {file.progress}%"
                    ></div>
                  </div>
                  <p class="text-xs text-text-disabled mt-1">{Math.round(file.progress)}%</p>
                </div>
              {:else if file.status === 'error'}
                <div class="mt-2 flex items-center gap-2">
                  <span class="text-xs text-destructive">Upload failed</span>
                  <button
                    type="button"
                    class="text-xs text-primary hover:underline"
                    onclick={() => retryUpload(file.id)}
                  >
                    Retry
                  </button>
                </div>
              {:else}
                <div class="mt-2 flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span class="text-xs text-success">Complete</span>
                </div>
              {/if}
            </div>

            <!-- Remove Button -->
            <button
              type="button"
              class="shrink-0 p-1 rounded hover:bg-surface-sunken transition-colors"
              onclick={() => removeFile(file.id)}
              aria-label="Remove file"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-text-disabled" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      {/each}
    </div>

    <!-- Empty State -->
    {#if files.length === 0}
      <div class="text-center py-8 text-text-disabled">
        <p class="text-sm">No files uploaded yet</p>
      </div>
    {/if}

    <!-- Mobile UX Note -->
    <div class="mt-8 p-4 bg-primary/5 border border-primary/20 rounded-lg">
      <h3 class="text-sm font-medium text-primary mb-2">Mobile UX Patterns</h3>
      <ul class="text-xs text-muted-foreground space-y-1">
        <li>• Support camera/gallery on mobile</li>
        <li>• Show file previews for images</li>
        <li>• Allow retry on failed uploads</li>
        <li>• Display progress during upload</li>
      </ul>
    </div>
  </div>
</div>
