<!--
  Meter Component
  Circular or semi-circular gauge for displaying bounded values.
-->
<script>
  /**
   * Current value
   * @type {number}
   */
  export let value = 0;

  /**
   * Minimum value
   * @type {number}
   */
  export let min = 0;

  /**
   * Maximum value
   * @type {number}
   */
  export let max = 100;

  /**
   * Display type
   * @type {'circle' | 'semicircle' | 'linear'}
   */
  export let type = 'circle';

  /**
   * Size in pixels
   * @type {number}
   */
  export let size = 120;

  /**
   * Stroke width
   * @type {number}
   */
  export let strokeWidth = 10;

  /**
   * Color variant or 'auto' for threshold-based
   * @type {'primary' | 'success' | 'warning' | 'error' | 'info' | 'auto'}
   */
  export let variant = 'primary';

  /**
   * Thresholds for auto color (percentages)
   * @type {{ warning: number, error: number }}
   */
  export let thresholds = { warning: 70, error: 90 };

  /**
   * Show value label
   * @type {boolean}
   */
  export let showValue = true;

  /**
   * Show min/max labels
   * @type {boolean}
   */
  export let showLabels = false;

  /**
   * Custom value format
   * @type {(value: number) => string}
   */
  export let formatValue = (v) => Math.round(v).toString();

  /**
   * Unit label
   * @type {string}
   */
  export let unit = '';

  /**
   * Label text
   * @type {string}
   */
  export let label = '';

  /**
   * Animate on mount
   * @type {boolean}
   */
  export let animated = true;

  /**
   * Gradient fill
   * @type {boolean}
   */
  export let gradient = false;

  // Calculate percentage
  $: percentage = max > min ? ((value - min) / (max - min)) * 100 : 0;
  $: clampedPercentage = Math.min(100, Math.max(0, percentage));

  // Determine color based on variant or thresholds
  $: activeVariant = variant === 'auto'
    ? (percentage >= thresholds.error ? 'error' : percentage >= thresholds.warning ? 'warning' : 'success')
    : variant;

  // Circle calculations
  $: radius = (size - strokeWidth) / 2;
  $: circumference = 2 * Math.PI * radius;
  $: dashOffset = type === 'semicircle'
    ? circumference * (1 - clampedPercentage / 100 / 2)
    : circumference * (1 - clampedPercentage / 100);

  // Viewbox
  $: viewBoxSize = size;
  $: center = size / 2;

  // For semicircle
  $: semicircleRotation = type === 'semicircle' ? 180 : 0;
</script>

<div
  class="meter type-{type}"
  class:animated
  style="--size: {size}px; --stroke-width: {strokeWidth}px;"
  role="meter"
  aria-valuenow={value}
  aria-valuemin={min}
  aria-valuemax={max}
  aria-label={label || `${percentage.toFixed(0)}%`}
>
  {#if type === 'linear'}
    <!-- Linear meter -->
    <div class="linear-track">
      <div
        class="linear-fill variant-{activeVariant}"
        class:gradient
        style="width: {clampedPercentage}%"
      />
    </div>
    {#if showValue || showLabels}
      <div class="linear-labels">
        {#if showLabels}
          <span class="linear-min">{min}</span>
        {/if}
        {#if showValue}
          <span class="linear-value">{formatValue(value)}{unit}</span>
        {/if}
        {#if showLabels}
          <span class="linear-max">{max}</span>
        {/if}
      </div>
    {/if}
  {:else}
    <!-- Circular/Semicircular meter -->
    <svg
      viewBox="0 0 {viewBoxSize} {type === 'semicircle' ? viewBoxSize / 2 + strokeWidth : viewBoxSize}"
      class="meter-svg"
    >
      {#if gradient}
        <defs>
          <linearGradient id="meter-gradient-{activeVariant}" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="var(--color-{activeVariant})" stop-opacity="0.5" />
            <stop offset="100%" stop-color="var(--color-{activeVariant})" />
          </linearGradient>
        </defs>
      {/if}

      <!-- Background track -->
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="var(--color-surface-raised)"
        stroke-width={strokeWidth}
        stroke-linecap="round"
        transform={type === 'semicircle' ? `rotate(${semicircleRotation} ${center} ${center})` : ''}
        stroke-dasharray={type === 'semicircle' ? `${circumference / 2} ${circumference}` : circumference}
      />

      <!-- Value arc -->
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke={gradient ? `url(#meter-gradient-${activeVariant})` : `var(--color-${activeVariant})`}
        stroke-width={strokeWidth}
        stroke-linecap="round"
        stroke-dasharray={type === 'semicircle' ? `${circumference / 2} ${circumference}` : circumference}
        stroke-dashoffset={dashOffset}
        transform={type === 'semicircle'
          ? `rotate(${semicircleRotation} ${center} ${center})`
          : `rotate(-90 ${center} ${center})`}
        class="meter-value-arc"
      />
    </svg>

    <!-- Center content -->
    <div
      class="meter-content"
      style={type === 'semicircle' ? `bottom: ${strokeWidth}px;` : ''}
    >
      {#if showValue}
        <span class="meter-value variant-{activeVariant}">
          {formatValue(value)}
        </span>
        {#if unit}
          <span class="meter-unit">{unit}</span>
        {/if}
      {/if}
      {#if label}
        <span class="meter-label">{label}</span>
      {/if}
    </div>

    <!-- Min/Max labels for semicircle -->
    {#if showLabels && type === 'semicircle'}
      <div class="semicircle-labels">
        <span class="label-min">{min}</span>
        <span class="label-max">{max}</span>
      </div>
    {/if}
  {/if}
</div>

<style>
  .meter {
    position: relative;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
  }

  .meter.type-circle,
  .meter.type-semicircle {
    width: var(--size);
  }

  .meter.type-semicircle {
    height: calc(var(--size) / 2 + var(--stroke-width));
  }

  .meter.type-linear {
    width: 100%;
  }

  /* SVG */
  .meter-svg {
    width: 100%;
    height: auto;
  }

  .meter-value-arc {
    transition: stroke-dashoffset 0.5s ease;
  }

  .animated .meter-value-arc {
    animation: meter-fill 1s ease forwards;
  }

  @keyframes meter-fill {
    from {
      stroke-dashoffset: var(--circumference, 500);
    }
  }

  /* Center content */
  .meter-content {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .type-circle .meter-content {
    inset: 0;
  }

  .type-semicircle .meter-content {
    left: 0;
    right: 0;
    bottom: 0;
  }

  .meter-value {
    font-size: calc(var(--size) / 5);
    font-weight: 700;
    line-height: 1;
  }

  .meter-value.variant-primary { color: var(--color-primary); }
  .meter-value.variant-success { color: var(--color-success); }
  .meter-value.variant-warning { color: var(--color-warning); }
  .meter-value.variant-error { color: var(--color-error); }
  .meter-value.variant-info { color: var(--color-info); }

  .meter-unit {
    font-size: calc(var(--size) / 10);
    color: var(--color-text-muted);
    margin-top: 2px;
  }

  .meter-label {
    font-size: calc(var(--size) / 12);
    color: var(--color-text-muted);
    margin-top: var(--spacing-1);
  }

  /* Semicircle labels */
  .semicircle-labels {
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 0 var(--spacing-2);
    font-size: 0.75rem;
    color: var(--color-text-muted);
  }

  /* Linear type */
  .linear-track {
    width: 100%;
    height: 0.5rem;
    background-color: var(--color-surface-raised);
    border-radius: var(--radius-full);
    overflow: hidden;
  }

  .linear-fill {
    height: 100%;
    border-radius: var(--radius-full);
    transition: width 0.5s ease;
  }

  .linear-fill.variant-primary { background-color: var(--color-primary); }
  .linear-fill.variant-success { background-color: var(--color-success); }
  .linear-fill.variant-warning { background-color: var(--color-warning); }
  .linear-fill.variant-error { background-color: var(--color-error); }
  .linear-fill.variant-info { background-color: var(--color-info); }

  .linear-fill.gradient {
    background: linear-gradient(90deg,
      color-mix(in srgb, currentColor 50%, transparent),
      currentColor
    );
  }

  .linear-labels {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-top: var(--spacing-1);
    font-size: 0.75rem;
  }

  .linear-min,
  .linear-max {
    color: var(--color-text-muted);
  }

  .linear-value {
    font-weight: 600;
    color: var(--color-text);
  }
</style>
