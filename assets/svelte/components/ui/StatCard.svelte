<!--
  StatCard Component
  Display key metrics/KPIs with optional trend indicator and sparkline.
-->
<script>
  /**
   * Stat label/title
   * @type {string}
   */
  export let label = '';

  /**
   * Main value to display
   * @type {string | number}
   */
  export let value = '';

  /**
   * Previous value for comparison
   * @type {string | number | null}
   */
  export let previousValue = null;

  /**
   * Format for display (currency, percent, number)
   * @type {'number' | 'currency' | 'percent' | 'custom'}
   */
  export let format = 'number';

  /**
   * Currency code for currency format
   * @type {string}
   */
  export let currency = 'USD';

  /**
   * Decimal places
   * @type {number}
   */
  export let decimals = 0;

  /**
   * Prefix for value (e.g., "$")
   * @type {string}
   */
  export let prefix = '';

  /**
   * Suffix for value (e.g., "users")
   * @type {string}
   */
  export let suffix = '';

  /**
   * Description or helper text
   * @type {string}
   */
  export let description = '';

  /**
   * Icon (SVG string)
   * @type {string}
   */
  export let icon = '';

  /**
   * Icon background color
   * @type {'primary' | 'success' | 'warning' | 'error' | 'info'}
   */
  export let iconColor = 'primary';

  /**
   * Sparkline data points
   * @type {number[]}
   */
  export let sparkline = [];

  /**
   * Loading state
   * @type {boolean}
   */
  export let loading = false;

  /**
   * Size variant
   * @type {'sm' | 'md' | 'lg'}
   */
  export let size = 'md';

  /**
   * Inverse trend (decrease is good)
   * @type {boolean}
   */
  export let inverseTrend = false;

  $: formattedValue = formatValue(value, format, currency, decimals, prefix, suffix);
  $: trend = previousValue !== null ? calculateTrend(value, previousValue) : null;
  $: trendDirection = trend !== null ? (trend > 0 ? 'up' : trend < 0 ? 'down' : 'neutral') : null;
  $: trendIsPositive = inverseTrend
    ? trendDirection === 'down'
    : trendDirection === 'up';

  function formatValue(val, fmt, curr, dec, pre, suf) {
    if (val === null || val === undefined || val === '') return '—';

    let num = typeof val === 'string' ? parseFloat(val) : val;
    if (isNaN(num)) return val;

    let formatted;
    switch (fmt) {
      case 'currency':
        formatted = new Intl.NumberFormat(undefined, {
          style: 'currency',
          currency: curr,
          minimumFractionDigits: dec,
          maximumFractionDigits: dec
        }).format(num);
        break;
      case 'percent':
        formatted = new Intl.NumberFormat(undefined, {
          style: 'percent',
          minimumFractionDigits: dec,
          maximumFractionDigits: dec
        }).format(num / 100);
        break;
      case 'number':
        formatted = new Intl.NumberFormat(undefined, {
          minimumFractionDigits: dec,
          maximumFractionDigits: dec
        }).format(num);
        formatted = `${pre}${formatted}${suf ? ' ' + suf : ''}`;
        break;
      default:
        formatted = `${pre}${num}${suf ? ' ' + suf : ''}`;
    }
    return formatted;
  }

  function calculateTrend(current, previous) {
    const curr = typeof current === 'string' ? parseFloat(current) : current;
    const prev = typeof previous === 'string' ? parseFloat(previous) : previous;

    if (isNaN(curr) || isNaN(prev) || prev === 0) return null;
    return ((curr - prev) / Math.abs(prev)) * 100;
  }

  // Generate sparkline SVG path
  $: sparklinePath = generateSparklinePath(sparkline);

  function generateSparklinePath(data) {
    if (!data || data.length < 2) return '';

    const width = 80;
    const height = 24;
    const padding = 2;

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const points = data.map((val, i) => {
      const x = padding + (i / (data.length - 1)) * (width - padding * 2);
      const y = padding + (1 - (val - min) / range) * (height - padding * 2);
      return `${x},${y}`;
    });

    return `M ${points.join(' L ')}`;
  }
</script>

<div class="stat-card size-{size}" class:loading>
  {#if loading}
    <div class="skeleton-icon" />
    <div class="skeleton-content">
      <div class="skeleton-label" />
      <div class="skeleton-value" />
    </div>
  {:else}
    {#if icon}
      <div class="stat-icon color-{iconColor}">
        {@html icon}
      </div>
    {/if}

    <div class="stat-content">
      <span class="stat-label">{label}</span>

      <div class="stat-value-row">
        <span class="stat-value">{formattedValue}</span>

        {#if trend !== null}
          <span
            class="stat-trend"
            class:positive={trendIsPositive}
            class:negative={!trendIsPositive && trendDirection !== 'neutral'}
          >
            {#if trendDirection === 'up'}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                <polyline points="17 6 23 6 23 12"/>
              </svg>
            {:else if trendDirection === 'down'}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/>
                <polyline points="17 18 23 18 23 12"/>
              </svg>
            {:else}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            {/if}
            <span>{Math.abs(trend).toFixed(1)}%</span>
          </span>
        {/if}
      </div>

      {#if description}
        <span class="stat-description">{description}</span>
      {/if}
    </div>

    {#if sparkline.length > 1}
      <div class="stat-sparkline">
        <svg viewBox="0 0 80 24" preserveAspectRatio="none">
          <path
            d={sparklinePath}
            fill="none"
            stroke={trendIsPositive ? 'var(--color-success)' : 'var(--color-error)'}
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    {/if}
  {/if}
</div>

<style>
  .stat-card {
    display: flex;
    align-items: flex-start;
    gap: var(--spacing-4);
    padding: var(--spacing-4);
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
  }

  .stat-card.loading {
    animation: pulse 1.5s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }

  /* Sizes */
  .size-sm {
    padding: var(--spacing-3);
  }

  .size-sm .stat-value {
    font-size: 1.25rem;
  }

  .size-lg {
    padding: var(--spacing-6);
  }

  .size-lg .stat-value {
    font-size: 2.5rem;
  }

  /* Icon */
  .stat-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3rem;
    height: 3rem;
    flex-shrink: 0;
    border-radius: var(--radius-md);
  }

  .stat-icon :global(svg) {
    width: 1.5rem;
    height: 1.5rem;
  }

  .stat-icon.color-primary {
    background-color: color-mix(in srgb, var(--color-primary) 15%, transparent);
    color: var(--color-primary);
  }

  .stat-icon.color-success {
    background-color: var(--color-success-soft);
    color: var(--color-success);
  }

  .stat-icon.color-warning {
    background-color: var(--color-warning-soft);
    color: var(--color-warning);
  }

  .stat-icon.color-error {
    background-color: var(--color-error-soft);
    color: var(--color-error);
  }

  .stat-icon.color-info {
    background-color: var(--color-info-soft);
    color: var(--color-info);
  }

  /* Content */
  .stat-content {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-1);
  }

  .stat-label {
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--color-text-muted);
  }

  .stat-value-row {
    display: flex;
    align-items: baseline;
    gap: var(--spacing-2);
    flex-wrap: wrap;
  }

  .stat-value {
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--color-text);
    line-height: 1.2;
  }

  .stat-trend {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-1);
    padding: var(--spacing-1) var(--spacing-2);
    font-size: 0.75rem;
    font-weight: 600;
    border-radius: var(--radius-full);
    background-color: var(--color-surface-raised);
    color: var(--color-text-muted);
  }

  .stat-trend svg {
    width: 0.875rem;
    height: 0.875rem;
  }

  .stat-trend.positive {
    background-color: var(--color-success-soft);
    color: var(--color-success);
  }

  .stat-trend.negative {
    background-color: var(--color-error-soft);
    color: var(--color-error);
  }

  .stat-description {
    font-size: 0.75rem;
    color: var(--color-text-muted);
  }

  /* Sparkline */
  .stat-sparkline {
    width: 5rem;
    height: 1.5rem;
    flex-shrink: 0;
    align-self: center;
  }

  .stat-sparkline svg {
    width: 100%;
    height: 100%;
  }

  /* Skeleton */
  .skeleton-icon {
    width: 3rem;
    height: 3rem;
    background-color: var(--color-surface-raised);
    border-radius: var(--radius-md);
  }

  .skeleton-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-2);
  }

  .skeleton-label {
    width: 40%;
    height: 0.75rem;
    background-color: var(--color-surface-raised);
    border-radius: var(--radius-sm);
  }

  .skeleton-value {
    width: 60%;
    height: 1.5rem;
    background-color: var(--color-surface-raised);
    border-radius: var(--radius-sm);
  }
</style>
