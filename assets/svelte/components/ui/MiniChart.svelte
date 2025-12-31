<!--
  MiniChart Component
  Lightweight inline charts (sparkline, bar, dot) without external dependencies.
-->
<script>
  /**
   * Data points
   * @type {Array<number | { value: number, label?: string }>}
   */
  export let data = [];

  /**
   * Chart type
   * @type {'line' | 'bar' | 'dot' | 'area'}
   */
  export let type = 'line';

  /**
   * Width in pixels or 'auto'
   * @type {number | 'auto'}
   */
  export let width = 'auto';

  /**
   * Height in pixels
   * @type {number}
   */
  export let height = 40;

  /**
   * Show tooltip on hover
   * @type {boolean}
   */
  export let showTooltip = true;

  /**
   * Color variant
   * @type {'primary' | 'success' | 'warning' | 'error' | 'info'}
   */
  export let variant = 'primary';

  /**
   * Fill area under line
   * @type {boolean}
   */
  export let fill = false;

  /**
   * Animate on mount
   * @type {boolean}
   */
  export let animated = true;

  /**
   * Show data points on line/area
   * @type {boolean}
   */
  export let showPoints = false;

  /**
   * Curve type for line/area
   * @type {'linear' | 'smooth'}
   */
  export let curve = 'smooth';

  /**
   * Format value for tooltip
   * @type {(value: number) => string}
   */
  export let formatValue = (v) => v.toLocaleString();

  let hoveredIndex = null;
  let chartEl;

  // Normalize data to array of numbers
  $: values = data.map(d => typeof d === 'number' ? d : d.value);
  $: labels = data.map((d, i) => typeof d === 'number' ? `Point ${i + 1}` : (d.label || `Point ${i + 1}`));

  // Calculate bounds
  $: minValue = Math.min(...values);
  $: maxValue = Math.max(...values);
  $: range = maxValue - minValue || 1;

  // Dimensions
  $: padding = { top: 4, right: 4, bottom: 4, left: 4 };
  $: chartWidth = typeof width === 'number' ? width : 120;
  $: chartHeight = height;
  $: innerWidth = chartWidth - padding.left - padding.right;
  $: innerHeight = chartHeight - padding.top - padding.bottom;

  // Generate path for line/area charts
  $: linePath = generateLinePath(values, innerWidth, innerHeight, curve);
  $: areaPath = generateAreaPath(values, innerWidth, innerHeight, curve);

  function generateLinePath(vals, w, h, curveType) {
    if (vals.length < 2) return '';

    const points = vals.map((val, i) => ({
      x: padding.left + (i / (vals.length - 1)) * w,
      y: padding.top + (1 - (val - minValue) / range) * h
    }));

    if (curveType === 'smooth') {
      return generateSmoothPath(points);
    }

    return `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;
  }

  function generateAreaPath(vals, w, h, curveType) {
    if (vals.length < 2) return '';

    const points = vals.map((val, i) => ({
      x: padding.left + (i / (vals.length - 1)) * w,
      y: padding.top + (1 - (val - minValue) / range) * h
    }));

    const baseline = padding.top + h;
    const startX = points[0].x;
    const endX = points[points.length - 1].x;

    let pathD;
    if (curveType === 'smooth') {
      pathD = generateSmoothPath(points);
    } else {
      pathD = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;
    }

    return `${pathD} L ${endX},${baseline} L ${startX},${baseline} Z`;
  }

  function generateSmoothPath(points) {
    if (points.length < 2) return '';

    let path = `M ${points[0].x},${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i];
      const next = points[i + 1];
      const midX = (curr.x + next.x) / 2;

      path += ` C ${midX},${curr.y} ${midX},${next.y} ${next.x},${next.y}`;
    }

    return path;
  }

  // Calculate bar dimensions
  $: barWidth = innerWidth / values.length - 2;

  // Get point positions for dots/hover
  $: pointPositions = values.map((val, i) => ({
    x: padding.left + (values.length > 1 ? (i / (values.length - 1)) * innerWidth : innerWidth / 2),
    y: padding.top + (1 - (val - minValue) / range) * innerHeight,
    value: val,
    label: labels[i]
  }));

  function handleMouseMove(e) {
    if (!showTooltip || !chartEl) return;

    const rect = chartEl.getBoundingClientRect();
    const x = e.clientX - rect.left;

    // Find closest point
    let closestIdx = 0;
    let closestDist = Infinity;

    pointPositions.forEach((point, i) => {
      const dist = Math.abs(point.x - x);
      if (dist < closestDist) {
        closestDist = dist;
        closestIdx = i;
      }
    });

    hoveredIndex = closestDist < 20 ? closestIdx : null;
  }

  function handleMouseLeave() {
    hoveredIndex = null;
  }

  $: colorVar = `var(--color-${variant})`;
  $: colorSoftVar = `var(--color-${variant}-soft)`;
</script>

<div
  class="mini-chart"
  class:animated
  style="width: {typeof width === 'number' ? `${width}px` : '100%'}; height: {height}px;"
  bind:this={chartEl}
  on:mousemove={handleMouseMove}
  on:mouseleave={handleMouseLeave}
  role="img"
  aria-label="Chart"
>
  <svg
    viewBox="0 0 {chartWidth} {chartHeight}"
    preserveAspectRatio="none"
    class="chart-svg"
  >
    {#if type === 'line' || type === 'area'}
      <!-- Area fill -->
      {#if fill || type === 'area'}
        <path
          d={areaPath}
          fill={colorVar}
          fill-opacity="0.15"
          class="area-fill"
        />
      {/if}

      <!-- Line -->
      <path
        d={linePath}
        fill="none"
        stroke={colorVar}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="chart-line"
      />

      <!-- Points -->
      {#if showPoints || hoveredIndex !== null}
        {#each pointPositions as point, i}
          {#if showPoints || i === hoveredIndex}
            <circle
              cx={point.x}
              cy={point.y}
              r={i === hoveredIndex ? 5 : 3}
              fill={colorVar}
              class="chart-point"
              class:hovered={i === hoveredIndex}
            />
          {/if}
        {/each}
      {/if}

    {:else if type === 'bar'}
      {#each values as value, i}
        {@const barHeight = ((value - minValue) / range) * innerHeight}
        {@const x = padding.left + i * (innerWidth / values.length) + 1}
        {@const y = padding.top + innerHeight - barHeight}

        <rect
          {x}
          {y}
          width={barWidth}
          height={barHeight}
          rx="2"
          fill={i === hoveredIndex ? colorVar : colorVar}
          fill-opacity={i === hoveredIndex ? 1 : 0.7}
          class="chart-bar"
        />
      {/each}

    {:else if type === 'dot'}
      {#each pointPositions as point, i}
        <circle
          cx={point.x}
          cy={chartHeight / 2}
          r={((point.value - minValue) / range) * 6 + 3}
          fill={colorVar}
          fill-opacity={i === hoveredIndex ? 1 : 0.6}
          class="chart-dot"
        />
      {/each}
    {/if}
  </svg>

  <!-- Tooltip -->
  {#if showTooltip && hoveredIndex !== null}
    {@const point = pointPositions[hoveredIndex]}
    <div
      class="chart-tooltip"
      style="left: {point.x}px; top: {type === 'dot' ? chartHeight / 2 : point.y}px;"
    >
      <span class="tooltip-value">{formatValue(point.value)}</span>
      <span class="tooltip-label">{point.label}</span>
    </div>
  {/if}
</div>

<style>
  .mini-chart {
    position: relative;
    display: inline-block;
  }

  .chart-svg {
    display: block;
    width: 100%;
    height: 100%;
  }

  /* Line animation */
  .animated .chart-line {
    stroke-dasharray: 1000;
    stroke-dashoffset: 1000;
    animation: draw-line 1s ease forwards;
  }

  @keyframes draw-line {
    to {
      stroke-dashoffset: 0;
    }
  }

  /* Area animation */
  .animated .area-fill {
    opacity: 0;
    animation: fade-in 0.5s ease 0.5s forwards;
  }

  @keyframes fade-in {
    to {
      opacity: 1;
    }
  }

  /* Point */
  .chart-point {
    transition: r 150ms ease;
  }

  .chart-point.hovered {
    filter: drop-shadow(0 0 4px currentColor);
  }

  /* Bar animation */
  .animated .chart-bar {
    transform-origin: bottom;
    animation: grow-bar 0.5s ease forwards;
  }

  @keyframes grow-bar {
    from {
      transform: scaleY(0);
    }
    to {
      transform: scaleY(1);
    }
  }

  /* Dot animation */
  .animated .chart-dot {
    animation: pop-in 0.3s ease forwards;
    animation-delay: calc(var(--index, 0) * 50ms);
  }

  @keyframes pop-in {
    from {
      transform: scale(0);
    }
    to {
      transform: scale(1);
    }
  }

  /* Tooltip */
  .chart-tooltip {
    position: absolute;
    transform: translate(-50%, -100%);
    margin-top: -8px;
    padding: var(--spacing-1) var(--spacing-2);
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    box-shadow: var(--shadow-md);
    pointer-events: none;
    z-index: var(--z-tooltip);
    white-space: nowrap;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
  }

  .tooltip-value {
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--color-text);
  }

  .tooltip-label {
    font-size: 0.6875rem;
    color: var(--color-text-muted);
  }
</style>
