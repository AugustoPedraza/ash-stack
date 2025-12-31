<!--
  ProgressBar Component
  Visual progress indicator with multiple variants and states.
-->
<script>
  /**
   * Progress value (0-100)
   * @type {number}
   */
  export let value = 0;

  /**
   * Maximum value
   * @type {number}
   */
  export let max = 100;

  /**
   * Show percentage label
   * @type {boolean}
   */
  export let showLabel = false;

  /**
   * Label position
   * @type {'inside' | 'outside' | 'top'}
   */
  export let labelPosition = 'outside';

  /**
   * Custom label (overrides percentage)
   * @type {string}
   */
  export let label = '';

  /**
   * Color variant
   * @type {'primary' | 'success' | 'warning' | 'error' | 'info'}
   */
  export let variant = 'primary';

  /**
   * Size variant
   * @type {'xs' | 'sm' | 'md' | 'lg'}
   */
  export let size = 'md';

  /**
   * Animated transition
   * @type {boolean}
   */
  export let animated = true;

  /**
   * Indeterminate loading state
   * @type {boolean}
   */
  export let indeterminate = false;

  /**
   * Striped pattern
   * @type {boolean}
   */
  export let striped = false;

  /**
   * Animate stripes
   * @type {boolean}
   */
  export let stripedAnimated = false;

  /**
   * Show segments (multi-step progress)
   * @type {number}
   */
  export let segments = 0;

  /**
   * Rounded corners
   * @type {boolean}
   */
  export let rounded = true;

  /**
   * Additional description below
   * @type {string}
   */
  export let description = '';

  $: percentage = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  $: displayLabel = label || `${Math.round(percentage)}%`;
  $: completedSegments = segments > 0 ? Math.ceil((value / max) * segments) : 0;
</script>

<div
  class="progress-wrapper"
  role="progressbar"
  aria-valuenow={indeterminate ? undefined : value}
  aria-valuemin={0}
  aria-valuemax={max}
  aria-label={displayLabel}
>
  {#if showLabel && labelPosition === 'top'}
    <div class="progress-header">
      <span class="progress-label">{displayLabel}</span>
      {#if description}
        <span class="progress-description">{description}</span>
      {/if}
    </div>
  {/if}

  <div
    class="progress-track size-{size}"
    class:rounded
  >
    {#if segments > 0}
      <!-- Segmented progress -->
      <div class="progress-segments">
        {#each Array(segments) as _, i}
          <div
            class="progress-segment variant-{variant}"
            class:completed={i < completedSegments}
            class:animated
          />
        {/each}
      </div>
    {:else if indeterminate}
      <!-- Indeterminate -->
      <div
        class="progress-bar indeterminate variant-{variant}"
        class:striped
        class:striped-animated={stripedAnimated}
      />
    {:else}
      <!-- Standard progress -->
      <div
        class="progress-bar variant-{variant}"
        class:animated
        class:striped
        class:striped-animated={stripedAnimated}
        style="width: {percentage}%"
      >
        {#if showLabel && labelPosition === 'inside' && size !== 'xs' && size !== 'sm'}
          <span class="progress-label-inside">{displayLabel}</span>
        {/if}
      </div>
    {/if}
  </div>

  {#if showLabel && labelPosition === 'outside'}
    <div class="progress-footer">
      <span class="progress-label">{displayLabel}</span>
      {#if description}
        <span class="progress-description">{description}</span>
      {/if}
    </div>
  {:else if description && labelPosition !== 'top'}
    <span class="progress-description-standalone">{description}</span>
  {/if}
</div>

<style>
  .progress-wrapper {
    width: 100%;
  }

  .progress-header,
  .progress-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-2);
  }

  .progress-header {
    margin-bottom: var(--spacing-2);
  }

  .progress-footer {
    margin-top: var(--spacing-2);
  }

  .progress-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text);
  }

  .progress-description,
  .progress-description-standalone {
    font-size: 0.8125rem;
    color: var(--color-text-muted);
  }

  .progress-description-standalone {
    display: block;
    margin-top: var(--spacing-1);
  }

  /* Track */
  .progress-track {
    position: relative;
    width: 100%;
    background-color: var(--color-surface-raised);
    overflow: hidden;
  }

  .progress-track.rounded {
    border-radius: var(--radius-full);
  }

  .size-xs {
    height: 0.25rem;
  }

  .size-sm {
    height: 0.5rem;
  }

  .size-md {
    height: 0.75rem;
  }

  .size-lg {
    height: 1rem;
  }

  /* Bar */
  .progress-bar {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: var(--spacing-2);
    border-radius: inherit;
  }

  .progress-bar.animated {
    transition: width 300ms ease-out;
  }

  .progress-bar.variant-primary {
    background-color: var(--color-primary);
  }

  .progress-bar.variant-success {
    background-color: var(--color-success);
  }

  .progress-bar.variant-warning {
    background-color: var(--color-warning);
  }

  .progress-bar.variant-error {
    background-color: var(--color-error);
  }

  .progress-bar.variant-info {
    background-color: var(--color-info);
  }

  /* Inside label */
  .progress-label-inside {
    font-size: 0.625rem;
    font-weight: 600;
    color: var(--color-on-primary);
    white-space: nowrap;
  }

  /* Striped */
  .progress-bar.striped {
    background-image: linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.15) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.15) 50%,
      rgba(255, 255, 255, 0.15) 75%,
      transparent 75%,
      transparent
    );
    background-size: 1rem 1rem;
  }

  .progress-bar.striped-animated {
    animation: stripe-animation 1s linear infinite;
  }

  @keyframes stripe-animation {
    0% { background-position: 1rem 0; }
    100% { background-position: 0 0; }
  }

  /* Indeterminate */
  .progress-bar.indeterminate {
    width: 30%;
    animation: indeterminate 1.5s ease-in-out infinite;
  }

  @keyframes indeterminate {
    0% {
      transform: translateX(-100%);
    }
    50% {
      transform: translateX(200%);
    }
    100% {
      transform: translateX(-100%);
    }
  }

  /* Segments */
  .progress-segments {
    display: flex;
    gap: 2px;
    height: 100%;
  }

  .progress-segment {
    flex: 1;
    height: 100%;
    background-color: var(--color-surface-sunken);
    border-radius: 1px;
  }

  .progress-segment:first-child {
    border-top-left-radius: inherit;
    border-bottom-left-radius: inherit;
  }

  .progress-segment:last-child {
    border-top-right-radius: inherit;
    border-bottom-right-radius: inherit;
  }

  .progress-segment.completed.variant-primary {
    background-color: var(--color-primary);
  }

  .progress-segment.completed.variant-success {
    background-color: var(--color-success);
  }

  .progress-segment.completed.variant-warning {
    background-color: var(--color-warning);
  }

  .progress-segment.completed.variant-error {
    background-color: var(--color-error);
  }

  .progress-segment.completed.variant-info {
    background-color: var(--color-info);
  }

  .progress-segment.completed.animated {
    transition: background-color 200ms ease;
  }
</style>
