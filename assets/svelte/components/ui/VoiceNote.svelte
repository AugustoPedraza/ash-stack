<!--
  VoiceNote Component
  Audio recording and playback with waveform visualization.
  PWA-optimized, works offline with recorded audio.
-->
<script>
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';

  const dispatch = createEventDispatcher();

  /** @type {'idle' | 'recording' | 'playing' | 'paused'} */
  export let state = 'idle';

  /** @type {string | null} - Audio URL for playback */
  export let src = null;

  /** @type {number} - Duration in seconds */
  export let duration = 0;

  /** @type {boolean} - Show transcription link */
  export let hasTranscription = false;

  /** @type {string} - Transcription text (if available) */
  export let transcription = '';

  /** @type {boolean} - Enable recording mode */
  export let allowRecording = false;

  /** @type {number[]} - Waveform data (0-1 values) */
  export let waveformData = [];

  // Internal state
  let audioElement;
  let mediaRecorder;
  let audioChunks = [];
  let recordingDuration = 0;
  let recordingInterval;
  let currentTime = 0;
  let isPlaying = false;
  let analyser;
  let animationFrame;
  let canvasEl;
  let audioContext;

  // Generate placeholder waveform if none provided
  $: displayWaveform = waveformData.length > 0
    ? waveformData
    : generatePlaceholderWaveform(40);

  function generatePlaceholderWaveform(bars) {
    return Array.from({ length: bars }, () => 0.2 + Math.random() * 0.6);
  }

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  // Playback controls
  function play() {
    if (!audioElement || !src) return;
    audioElement.play();
    isPlaying = true;
    state = 'playing';
    dispatch('play');
  }

  function pause() {
    if (!audioElement) return;
    audioElement.pause();
    isPlaying = false;
    state = 'paused';
    dispatch('pause');
  }

  function togglePlayback() {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }

  function handleTimeUpdate() {
    if (audioElement) {
      currentTime = audioElement.currentTime;
    }
  }

  function handleEnded() {
    isPlaying = false;
    state = 'idle';
    currentTime = 0;
    dispatch('ended');
  }

  function seekTo(e) {
    if (!audioElement || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    audioElement.currentTime = percent * duration;
  }

  // Recording controls
  async function startRecording() {
    if (!allowRecording) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Set up audio context for visualization
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 256;

      mediaRecorder = new MediaRecorder(stream);
      audioChunks = [];

      mediaRecorder.ondataavailable = (e) => {
        audioChunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);

        dispatch('recorded', {
          blob: audioBlob,
          url: audioUrl,
          duration: recordingDuration
        });

        // Clean up
        stream.getTracks().forEach(track => track.stop());
        if (audioContext) {
          audioContext.close();
        }
      };

      mediaRecorder.start();
      state = 'recording';
      recordingDuration = 0;

      recordingInterval = setInterval(() => {
        recordingDuration += 1;
      }, 1000);

      // Start visualization
      visualizeRecording();

      dispatch('recordingstart');
    } catch (err) {
      console.error('Error accessing microphone:', err);
      dispatch('error', { message: 'Could not access microphone' });
    }
  }

  function stopRecording() {
    if (mediaRecorder && state === 'recording') {
      mediaRecorder.stop();
      state = 'idle';

      if (recordingInterval) {
        clearInterval(recordingInterval);
      }
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }

      dispatch('recordingstop');
    }
  }

  function cancelRecording() {
    if (mediaRecorder && state === 'recording') {
      mediaRecorder.stop();
      audioChunks = [];
      state = 'idle';
      recordingDuration = 0;

      if (recordingInterval) {
        clearInterval(recordingInterval);
      }
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }

      dispatch('recordingcancel');
    }
  }

  function visualizeRecording() {
    if (!analyser || !canvasEl) return;

    const ctx = canvasEl.getContext('2d');
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const width = canvasEl.width;
    const height = canvasEl.height;

    function draw() {
      if (state !== 'recording') return;

      animationFrame = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = 'var(--color-surface-sunken)';
      ctx.fillRect(0, 0, width, height);

      const barWidth = (width / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * height;

        ctx.fillStyle = 'var(--color-primary)';
        ctx.fillRect(x, height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }
    }

    draw();
  }

  function showTranscription() {
    dispatch('transcription', { text: transcription });
  }

  onDestroy(() => {
    if (recordingInterval) clearInterval(recordingInterval);
    if (animationFrame) cancelAnimationFrame(animationFrame);
    if (audioContext) audioContext.close();
  });

  $: progress = duration > 0 ? (currentTime / duration) * 100 : 0;
</script>

<div class="voice-note" class:recording={state === 'recording'}>
  {#if state === 'recording'}
    <!-- Recording Mode -->
    <div class="recording-container">
      <button class="cancel-btn" on:click={cancelRecording} aria-label="Cancel recording">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div class="recording-visualizer">
        <canvas bind:this={canvasEl} width="200" height="40"></canvas>
      </div>

      <span class="recording-time">{formatTime(recordingDuration)}</span>

      <button class="stop-btn" on:click={stopRecording} aria-label="Stop recording">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <rect x="6" y="6" width="12" height="12" rx="2" />
        </svg>
      </button>
    </div>
  {:else if src}
    <!-- Playback Mode -->
    <div class="playback-container">
      <button class="play-btn" on:click={togglePlayback} aria-label={isPlaying ? 'Pause' : 'Play'}>
        {#if isPlaying}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        {:else}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        {/if}
      </button>

      <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <div
        class="waveform-container"
        on:click={seekTo}
        role="slider"
        tabindex="0"
        aria-label="Seek audio"
        aria-valuenow={currentTime}
        aria-valuemin={0}
        aria-valuemax={duration}
      >
        <div class="waveform">
          {#each displayWaveform as value, i}
            <div
              class="waveform-bar"
              class:played={i < (displayWaveform.length * progress / 100)}
              style="height: {value * 100}%"
            ></div>
          {/each}
        </div>
        <div class="progress-line" style="left: {progress}%"></div>
      </div>

      <span class="duration">{formatTime(currentTime)} / {formatTime(duration)}</span>
    </div>

    {#if hasTranscription}
      <button class="transcription-link" on:click={showTranscription}>
        Transcription available
      </button>
    {/if}

    <audio
      bind:this={audioElement}
      {src}
      on:timeupdate={handleTimeUpdate}
      on:ended={handleEnded}
      preload="metadata"
    ></audio>
  {:else if allowRecording}
    <!-- Idle Recording Mode -->
    <button class="record-btn" on:click={startRecording} aria-label="Start recording">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="6" />
      </svg>
      <span>Record voice note</span>
    </button>
  {/if}
</div>

<style>
  .voice-note {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  /* Playback Container */
  .playback-container {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-3);
    background-color: var(--color-surface-sunken);
    border-radius: var(--radius-lg);
  }

  .play-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background-color: var(--color-surface);
    border: none;
    border-radius: var(--radius-full);
    color: var(--color-text);
    cursor: pointer;
    transition: all var(--duration-fast) var(--ease-primary);
    flex-shrink: 0;
  }

  .play-btn:hover {
    background-color: var(--color-surface-raised);
    transform: scale(1.05);
  }

  .play-btn:active {
    transform: scale(0.95);
  }

  /* Waveform */
  .waveform-container {
    flex: 1;
    position: relative;
    height: 40px;
    cursor: pointer;
  }

  .waveform {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    gap: 2px;
  }

  .waveform-bar {
    flex: 1;
    background-color: var(--color-border-strong);
    border-radius: 1px;
    transition: background-color var(--duration-fast) var(--ease-primary);
    min-height: 4px;
  }

  .waveform-bar.played {
    background-color: var(--color-primary);
  }

  .progress-line {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 2px;
    background-color: var(--color-primary);
    border-radius: 1px;
    pointer-events: none;
  }

  .duration {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
    white-space: nowrap;
    min-width: 70px;
    text-align: right;
  }

  .transcription-link {
    background: none;
    border: none;
    padding: 0;
    font-size: var(--text-xs);
    color: var(--color-primary);
    cursor: pointer;
    text-decoration: underline;
    text-align: left;
  }

  .transcription-link:hover {
    color: var(--color-primary-hover);
  }

  /* Recording Container */
  .recording-container {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-3);
    background-color: var(--color-error-soft);
    border: 1px solid var(--color-error);
    border-radius: var(--radius-lg);
  }

  .cancel-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: none;
    border: none;
    border-radius: var(--radius-full);
    color: var(--color-text-muted);
    cursor: pointer;
    transition: all var(--duration-fast) var(--ease-primary);
  }

  .cancel-btn:hover {
    background-color: var(--color-surface);
    color: var(--color-text);
  }

  .recording-visualizer {
    flex: 1;
    height: 40px;
    background-color: var(--color-surface);
    border-radius: var(--radius-md);
    overflow: hidden;
  }

  .recording-visualizer canvas {
    width: 100%;
    height: 100%;
  }

  .recording-time {
    font-size: var(--text-sm);
    font-weight: var(--font-medium);
    color: var(--color-error);
    min-width: 40px;
  }

  .stop-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background-color: var(--color-error);
    border: none;
    border-radius: var(--radius-full);
    color: var(--color-on-error);
    cursor: pointer;
    transition: all var(--duration-fast) var(--ease-primary);
  }

  .stop-btn:hover {
    opacity: 0.9;
  }

  .stop-btn:active {
    transform: scale(0.95);
  }

  /* Record Button (Idle) */
  .record-btn {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-3) var(--space-4);
    background-color: var(--color-surface-sunken);
    border: 1px dashed var(--color-border);
    border-radius: var(--radius-lg);
    color: var(--color-text-muted);
    font-size: var(--text-sm);
    cursor: pointer;
    transition: all var(--duration-fast) var(--ease-primary);
  }

  .record-btn:hover {
    background-color: var(--color-surface);
    border-color: var(--color-error);
    color: var(--color-error);
  }

  .record-btn svg {
    color: var(--color-error);
  }
</style>
