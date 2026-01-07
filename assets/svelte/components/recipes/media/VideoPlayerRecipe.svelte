<script>
  /**
   * Video Player Recipe
   * Custom controls with progress, fullscreen, and mobile optimizations.
   */

  let videoElement = $state(null);
  let isPlaying = $state(false);
  let currentTime = $state(0);
  let duration = $state(0);
  let volume = $state(1);
  let isMuted = $state(false);
  let isFullscreen = $state(false);
  let showControls = $state(true);
  let buffered = $state(0);
  let controlsTimeout = $state(null);

  // Sample video (using a public video)
  const videoSrc = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
  const posterSrc = 'https://picsum.photos/800/450?random=20';

  function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  function togglePlay() {
    if (!videoElement) return;
    if (isPlaying) {
      videoElement.pause();
    } else {
      videoElement.play();
    }
  }

  function handleTimeUpdate() {
    if (!videoElement) return;
    currentTime = videoElement.currentTime;
    if (videoElement.buffered.length > 0) {
      buffered = videoElement.buffered.end(videoElement.buffered.length - 1);
    }
  }

  function handleLoadedMetadata() {
    if (!videoElement) return;
    duration = videoElement.duration;
  }

  function handleSeek(e) {
    if (!videoElement) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    videoElement.currentTime = pos * duration;
  }

  function toggleMute() {
    if (!videoElement) return;
    isMuted = !isMuted;
    videoElement.muted = isMuted;
  }

  function handleVolumeChange(e) {
    if (!videoElement) return;
    volume = parseFloat(e.target.value);
    videoElement.volume = volume;
    isMuted = volume === 0;
  }

  function toggleFullscreen() {
    const container = document.querySelector('.video-container');
    if (!container) return;

    if (!isFullscreen) {
      if (container.requestFullscreen) container.requestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  }

  function handleFullscreenChange() {
    isFullscreen = !!document.fullscreenElement;
  }

  function handleMouseMove() {
    showControls = true;
    if (controlsTimeout) clearTimeout(controlsTimeout);
    if (isPlaying) {
      controlsTimeout = setTimeout(() => {
        showControls = false;
      }, 3000);
    }
  }

  function skip(seconds) {
    if (!videoElement) return;
    videoElement.currentTime = Math.max(0, Math.min(duration, currentTime + seconds));
  }

  $effect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      if (controlsTimeout) clearTimeout(controlsTimeout);
    };
  });
</script>

<div class="h-full bg-background overflow-y-auto px-5 py-6">
  <div class="max-w-md mx-auto">
    <div class="mb-8">
      <h1 class="text-xl font-semibold text-foreground mb-2">Video Player</h1>
      <p class="text-muted-foreground text-sm">Custom controls with progress and fullscreen.</p>
    </div>

    <!-- Video Player -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="video-container relative rounded-xl overflow-hidden bg-black mb-8 group"
      onmousemove={handleMouseMove}
      onmouseleave={() => isPlaying && (showControls = false)}
    >
      <!-- Video Element -->
      <video
        bind:this={videoElement}
        src={videoSrc}
        poster={posterSrc}
        class="w-full aspect-video"
        ontimeupdate={handleTimeUpdate}
        onloadedmetadata={handleLoadedMetadata}
        onplay={() => isPlaying = true}
        onpause={() => isPlaying = false}
        onended={() => isPlaying = false}
        onclick={togglePlay}
        playsinline
      >
        <track kind="captions" />
      </video>

      <!-- Play/Pause Overlay -->
      {#if !isPlaying}
        <button
          type="button"
          class="absolute inset-0 flex items-center justify-center bg-black/30"
          onclick={togglePlay}
          aria-label="Play video"
        >
          <div class="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </button>
      {/if}

      <!-- Controls Overlay -->
      <div
        class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-200
          {showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}"
      >
        <!-- Progress Bar -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <div
          class="h-1 bg-white/30 rounded-full mb-3 cursor-pointer relative"
          onclick={handleSeek}
          role="slider"
          tabindex="0"
          aria-label="Video progress"
          aria-valuemin="0"
          aria-valuemax={duration}
          aria-valuenow={currentTime}
        >
          <!-- Buffered -->
          <div
            class="absolute h-full bg-white/30 rounded-full"
            style="width: {(buffered / duration) * 100}%"
          ></div>
          <!-- Progress -->
          <div
            class="absolute h-full bg-white rounded-full"
            style="width: {(currentTime / duration) * 100}%"
          ></div>
          <!-- Thumb -->
          <div
            class="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow"
            style="left: {(currentTime / duration) * 100}%"
          ></div>
        </div>

        <!-- Controls Row -->
        <div class="flex items-center gap-3">
          <!-- Play/Pause -->
          <button
            type="button"
            class="p-1 rounded hover:bg-white/10 transition-colors"
            onclick={togglePlay}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {#if isPlaying}
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            {:else}
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            {/if}
          </button>

          <!-- Skip Buttons -->
          <button
            type="button"
            class="p-1 rounded hover:bg-white/10 transition-colors"
            onclick={() => skip(-10)}
            aria-label="Rewind 10 seconds"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
            </svg>
          </button>

          <button
            type="button"
            class="p-1 rounded hover:bg-white/10 transition-colors"
            onclick={() => skip(10)}
            aria-label="Forward 10 seconds"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
            </svg>
          </button>

          <!-- Time -->
          <span class="text-xs text-white/80 tabular-nums">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          <div class="flex-1"></div>

          <!-- Volume -->
          <div class="hidden sm:flex items-center gap-1">
            <button
              type="button"
              class="p-1 rounded hover:bg-white/10 transition-colors"
              onclick={toggleMute}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {#if isMuted || volume === 0}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              {:else}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              {/if}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={isMuted ? 0 : volume}
              onchange={handleVolumeChange}
              class="w-16 h-1 bg-white/30 rounded-full appearance-none cursor-pointer"
              aria-label="Volume"
            />
          </div>

          <!-- Fullscreen -->
          <button
            type="button"
            class="p-1 rounded hover:bg-white/10 transition-colors"
            onclick={toggleFullscreen}
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {#if isFullscreen}
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            {:else}
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            {/if}
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile UX Note -->
    <div class="p-4 bg-primary/5 border border-primary/20 rounded-lg">
      <h3 class="text-sm font-medium text-primary mb-2">Mobile UX Patterns</h3>
      <ul class="text-xs text-muted-foreground space-y-1">
        <li>• Auto-hide controls during playback</li>
        <li>• Double-tap sides to skip 10s</li>
        <li>• Use playsinline for iOS</li>
        <li>• Show buffering indicator</li>
      </ul>
    </div>
  </div>
</div>

<style>
  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 12px;
    height: 12px;
    background: white;
    border-radius: 50%;
    cursor: pointer;
  }
</style>
