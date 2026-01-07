<script>
  /**
   * Image Preview Recipe
   * Thumbnail grid with full-size preview and zoom.
   */

  // Mock images
  const images = [
    { id: 1, src: 'https://picsum.photos/400/300?random=1', thumb: 'https://picsum.photos/200/150?random=1', alt: 'Nature landscape' },
    { id: 2, src: 'https://picsum.photos/400/500?random=2', thumb: 'https://picsum.photos/200/250?random=2', alt: 'City skyline' },
    { id: 3, src: 'https://picsum.photos/500/400?random=3', thumb: 'https://picsum.photos/250/200?random=3', alt: 'Mountain view' },
    { id: 4, src: 'https://picsum.photos/400/400?random=4', thumb: 'https://picsum.photos/200/200?random=4', alt: 'Beach sunset' },
    { id: 5, src: 'https://picsum.photos/300/400?random=5', thumb: 'https://picsum.photos/150/200?random=5', alt: 'Forest path' },
    { id: 6, src: 'https://picsum.photos/500/300?random=6', thumb: 'https://picsum.photos/250/150?random=6', alt: 'Desert dunes' },
  ];

  let selectedImage = $state(null);
  let isZoomed = $state(false);
  let imageLoading = $state(false);

  function openPreview(image) {
    selectedImage = image;
    imageLoading = true;
    isZoomed = false;
  }

  function closePreview() {
    selectedImage = null;
    isZoomed = false;
  }

  function toggleZoom() {
    isZoomed = !isZoomed;
  }

  function handleImageLoad() {
    imageLoading = false;
  }

  function navigateImage(direction) {
    if (!selectedImage) return;
    const currentIndex = images.findIndex(img => img.id === selectedImage.id);
    const newIndex = (currentIndex + direction + images.length) % images.length;
    selectedImage = images[newIndex];
    imageLoading = true;
    isZoomed = false;
  }

  function handleKeydown(e) {
    if (!selectedImage) return;
    if (e.key === 'Escape') closePreview();
    if (e.key === 'ArrowLeft') navigateImage(-1);
    if (e.key === 'ArrowRight') navigateImage(1);
    if (e.key === ' ') { e.preventDefault(); toggleZoom(); }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="h-full bg-surface overflow-y-auto px-5 py-6">
  <div class="max-w-md mx-auto">
    <div class="mb-8">
      <h1 class="text-xl font-semibold text-text mb-2">Image Preview</h1>
      <p class="text-text-muted text-sm">Thumbnail grid with full-size preview.</p>
    </div>

    <!-- Thumbnail Grid -->
    <div class="grid grid-cols-3 gap-2 mb-8">
      {#each images as image (image.id)}
        <button
          type="button"
          class="aspect-square rounded-lg overflow-hidden bg-surface-sunken hover:opacity-90 transition-opacity focus:ring-2 focus:ring-primary focus:ring-offset-2"
          onclick={() => openPreview(image)}
          aria-label="View {image.alt}"
        >
          <img
            src={image.thumb}
            alt={image.alt}
            class="w-full h-full object-cover"
            loading="lazy"
          />
        </button>
      {/each}
    </div>

    <!-- Preview Styles -->
    <div class="mb-8">
      <h2 class="text-sm font-medium text-text mb-4">Preview Styles</h2>

      <!-- Inline Preview -->
      <div class="p-4 bg-surface-sunken/50 rounded-xl">
        <p class="text-xs text-text-muted mb-3">Inline Preview (tap thumbnail above)</p>
        <div class="aspect-video rounded-lg bg-surface-sunken overflow-hidden flex items-center justify-center">
          {#if selectedImage}
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              class="w-full h-full object-contain"
            />
          {:else}
            <p class="text-sm text-text-disabled">Select an image</p>
          {/if}
        </div>
      </div>
    </div>

    <!-- Mobile UX Note -->
    <div class="p-4 bg-primary/5 border border-primary/20 rounded-lg">
      <h3 class="text-sm font-medium text-primary mb-2">Mobile UX Patterns</h3>
      <ul class="text-xs text-text-secondary space-y-1">
        <li>• Lazy load thumbnails</li>
        <li>• Pinch to zoom on mobile</li>
        <li>• Swipe to navigate gallery</li>
        <li>• Double-tap to zoom</li>
      </ul>
    </div>
  </div>
</div>

<!-- Full Screen Preview Modal -->
{#if selectedImage}
  <div
    class="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
    onclick={closePreview}
    onkeydown={(e) => e.key === 'Escape' && closePreview()}
    role="dialog"
    aria-modal="true"
    aria-label="Image preview"
    tabindex="-1"
  >
    <!-- Close Button -->
    <button
      type="button"
      class="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
      onclick={closePreview}
      aria-label="Close preview"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <!-- Navigation Buttons -->
    <button
      type="button"
      class="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
      onclick={(e) => { e.stopPropagation(); navigateImage(-1); }}
      aria-label="Previous image"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
    </button>

    <button
      type="button"
      class="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
      onclick={(e) => { e.stopPropagation(); navigateImage(1); }}
      aria-label="Next image"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </button>

    <!-- Image Container -->
    <div
      class="max-w-full max-h-full p-4 overflow-auto"
      onclick={(e) => e.stopPropagation()}
      onkeydown={(e) => e.stopPropagation()}
      role="presentation"
    >
      {#if imageLoading}
        <div class="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
      {/if}
      <!-- svelte-ignore a11y_no_noninteractive_element_interactions a11y_click_events_have_key_events -->
      <img
        src={selectedImage.src}
        alt={selectedImage.alt}
        class="max-w-full max-h-[80vh] object-contain transition-transform duration-200 cursor-zoom-in
          {isZoomed ? 'scale-150 cursor-zoom-out' : ''}"
        onclick={(e) => { e.stopPropagation(); toggleZoom(); }}
        onload={handleImageLoad}
        style="display: {imageLoading ? 'none' : 'block'}"
      />
    </div>

    <!-- Image Counter -->
    <div class="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-white/10 rounded-full">
      <span class="text-sm text-white">
        {images.findIndex(img => img.id === selectedImage.id) + 1} / {images.length}
      </span>
    </div>

    <!-- Zoom Hint -->
    <div class="absolute bottom-4 right-4 text-xs text-white/50">
      Press space or tap to zoom
    </div>
  </div>
{/if}
