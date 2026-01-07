<script>
  /**
   * Lightbox Recipe
   * Full-screen gallery with navigation, keyboard support, and gestures.
   */

  // Gallery images with metadata
  const gallery = [
    { id: 1, src: 'https://picsum.photos/800/600?random=10', thumb: 'https://picsum.photos/200/150?random=10', title: 'Mountain Lake', description: 'Serene mountain lake at sunset' },
    { id: 2, src: 'https://picsum.photos/600/800?random=11', thumb: 'https://picsum.photos/150/200?random=11', title: 'City Lights', description: 'Downtown skyline at night' },
    { id: 3, src: 'https://picsum.photos/800/800?random=12', thumb: 'https://picsum.photos/200/200?random=12', title: 'Forest Trail', description: 'Autumn colors in the forest' },
    { id: 4, src: 'https://picsum.photos/800/500?random=13', thumb: 'https://picsum.photos/200/125?random=13', title: 'Ocean Waves', description: 'Crashing waves on rocky shore' },
    { id: 5, src: 'https://picsum.photos/700/800?random=14', thumb: 'https://picsum.photos/175/200?random=14', title: 'Desert Sunset', description: 'Golden hour in the desert' },
    { id: 6, src: 'https://picsum.photos/800/600?random=15', thumb: 'https://picsum.photos/200/150?random=15', title: 'Snow Peaks', description: 'Alpine mountains in winter' },
  ];

  let lightboxOpen = $state(false);
  let currentIndex = $state(0);
  let showInfo = $state(true);
  let loading = $state(false);
  let touchStartX = $state(0);

  const currentImage = $derived(gallery[currentIndex]);

  function openLightbox(index) {
    currentIndex = index;
    lightboxOpen = true;
    loading = true;
  }

  function closeLightbox() {
    lightboxOpen = false;
  }

  function navigate(direction) {
    loading = true;
    currentIndex = (currentIndex + direction + gallery.length) % gallery.length;
  }

  function goTo(index) {
    if (index !== currentIndex) {
      loading = true;
      currentIndex = index;
    }
  }

  function handleKeydown(e) {
    if (!lightboxOpen) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
    if (e.key === 'i') showInfo = !showInfo;
  }

  function handleTouchStart(e) {
    touchStartX = e.touches[0].clientX;
  }

  function handleTouchEnd(e) {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) navigate(1);
      else navigate(-1);
    }
  }

  function handleImageLoad() {
    loading = false;
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="h-full bg-surface overflow-y-auto px-5 py-6">
  <div class="max-w-md mx-auto">
    <div class="mb-8">
      <h1 class="text-xl font-semibold text-text mb-2">Lightbox Gallery</h1>
      <p class="text-text-muted text-sm">Full-screen gallery with navigation and gestures.</p>
    </div>

    <!-- Gallery Grid -->
    <div class="grid grid-cols-2 gap-3 mb-8">
      {#each gallery as image, index (image.id)}
        <button
          type="button"
          class="group relative aspect-[4/3] rounded-xl overflow-hidden bg-surface-sunken focus:ring-2 focus:ring-primary focus:ring-offset-2"
          onclick={() => openLightbox(index)}
        >
          <img
            src={image.thumb}
            alt={image.title}
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <div class="absolute bottom-0 left-0 right-0 p-3">
              <p class="text-sm font-medium text-white">{image.title}</p>
            </div>
          </div>
        </button>
      {/each}
    </div>

    <!-- Usage Hints -->
    <div class="p-4 bg-surface-sunken/50 rounded-xl mb-8">
      <h3 class="text-sm font-medium text-text mb-2">Keyboard Shortcuts</h3>
      <div class="grid grid-cols-2 gap-2 text-xs text-text-muted">
        <div class="flex items-center gap-2">
          <kbd class="px-1.5 py-0.5 bg-border-strong rounded text-xs">←</kbd>
          <span>Previous</span>
        </div>
        <div class="flex items-center gap-2">
          <kbd class="px-1.5 py-0.5 bg-border-strong rounded text-xs">→</kbd>
          <span>Next</span>
        </div>
        <div class="flex items-center gap-2">
          <kbd class="px-1.5 py-0.5 bg-border-strong rounded text-xs">Esc</kbd>
          <span>Close</span>
        </div>
        <div class="flex items-center gap-2">
          <kbd class="px-1.5 py-0.5 bg-border-strong rounded text-xs">i</kbd>
          <span>Toggle info</span>
        </div>
      </div>
    </div>

    <!-- Mobile UX Note -->
    <div class="p-4 bg-primary/5 border border-primary/20 rounded-lg">
      <h3 class="text-sm font-medium text-primary mb-2">Mobile UX Patterns</h3>
      <ul class="text-xs text-text-secondary space-y-1">
        <li>• Swipe left/right to navigate</li>
        <li>• Tap to toggle info overlay</li>
        <li>• Pinch to zoom (full implementation)</li>
        <li>• Dots indicator for position</li>
      </ul>
    </div>
  </div>
</div>

<!-- Lightbox Modal -->
{#if lightboxOpen}
  <div
    class="fixed inset-0 z-50 bg-black flex flex-col"
    ontouchstart={handleTouchStart}
    ontouchend={handleTouchEnd}
    role="dialog"
    aria-modal="true"
    aria-label="Image lightbox"
  >
    <!-- Top Bar -->
    <div class="shrink-0 flex items-center justify-between p-4 bg-gradient-to-b from-black/60 to-transparent z-10">
      <span class="text-white text-sm">
        {currentIndex + 1} / {gallery.length}
      </span>
      <div class="flex items-center gap-2">
        <button
          type="button"
          class="p-2 rounded-full hover:bg-white/10 transition-colors"
          onclick={() => showInfo = !showInfo}
          aria-label="Toggle info"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
        <button
          type="button"
          class="p-2 rounded-full hover:bg-white/10 transition-colors"
          onclick={closeLightbox}
          aria-label="Close lightbox"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Image Container -->
    <div class="flex-1 relative flex items-center justify-center overflow-hidden">
      <!-- Loading Spinner -->
      {#if loading}
        <div class="absolute inset-0 flex items-center justify-center z-10">
          <div class="w-10 h-10 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
        </div>
      {/if}

      <!-- Navigation Buttons (Desktop) -->
      <button
        type="button"
        class="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 hover:bg-black/60 transition-colors hidden sm:flex"
        onclick={() => navigate(-1)}
        aria-label="Previous image"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        type="button"
        class="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 hover:bg-black/60 transition-colors hidden sm:flex"
        onclick={() => navigate(1)}
        aria-label="Next image"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <!-- Image -->
      <img
        src={currentImage.src}
        alt={currentImage.title}
        class="max-w-full max-h-full object-contain transition-opacity duration-200"
        class:opacity-0={loading}
        onload={handleImageLoad}
      />
    </div>

    <!-- Bottom Bar with Info and Dots -->
    <div class="shrink-0 bg-gradient-to-t from-black/60 to-transparent z-10">
      <!-- Info Panel -->
      {#if showInfo}
        <div class="px-4 py-3 border-b border-white/10">
          <h3 class="text-white font-medium">{currentImage.title}</h3>
          <p class="text-white/60 text-sm">{currentImage.description}</p>
        </div>
      {/if}

      <!-- Dots Navigation -->
      <div class="flex items-center justify-center gap-2 py-4">
        {#each gallery as _, index}
          <button
            type="button"
            class="w-2 h-2 rounded-full transition-all
              {index === currentIndex ? 'bg-white w-4' : 'bg-white/40 hover:bg-white/60'}"
            onclick={() => goTo(index)}
            aria-label="Go to image {index + 1}"
          ></button>
        {/each}
      </div>
    </div>
  </div>
{/if}
