<script>
  /**
   * Charts Recipe
   * Line, bar, and donut charts using simple SVG - no heavy libraries.
   *
   * Uses: Button, Card, Skeleton
   */
  import { Button, Card, Skeleton } from '../../ui';

  let loading = $state(true);
  let activeChart = $state('line');

  // Simulated data
  const lineData = [
    { month: 'Jan', value: 65 },
    { month: 'Feb', value: 78 },
    { month: 'Mar', value: 52 },
    { month: 'Apr', value: 91 },
    { month: 'May', value: 84 },
    { month: 'Jun', value: 110 },
  ];

  const barData = [
    { label: 'Mon', value: 45, color: 'rgb(var(--color-primary))' },
    { label: 'Tue', value: 72, color: 'rgb(var(--color-primary))' },
    { label: 'Wed', value: 58, color: 'rgb(var(--color-primary))' },
    { label: 'Thu', value: 89, color: 'rgb(var(--color-primary))' },
    { label: 'Fri', value: 63, color: 'rgb(var(--color-primary))' },
    { label: 'Sat', value: 34, color: 'rgb(var(--color-primary) / 0.5)' },
    { label: 'Sun', value: 28, color: 'rgb(var(--color-primary) / 0.5)' },
  ];

  const donutData = [
    { label: 'Desktop', value: 45, color: 'rgb(var(--color-primary))' },
    { label: 'Mobile', value: 35, color: 'rgb(var(--color-info))' },
    { label: 'Tablet', value: 20, color: 'rgb(var(--color-success))' },
  ];

  const chartTypes = ['line', 'bar', 'donut'];

  // Simulate loading
  $effect(() => {
    const timer = setTimeout(() => {
      loading = false;
    }, 800);
    return () => clearTimeout(timer);
  });

  // Line chart helpers
  function getLinePath(data, width = 280, height = 160, padding = 20) {
    const values = data.map(d => d.value);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min || 1;

    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const stepX = chartWidth / (data.length - 1);

    const points = data.map((d, i) => {
      const x = padding + i * stepX;
      const y = padding + chartHeight - ((d.value - min) / range) * chartHeight;
      return { x, y };
    });

    const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');

    // Area path (filled)
    const areaPath = path + ` L${points[points.length - 1].x},${height - padding} L${padding},${height - padding} Z`;

    return { linePath: path, areaPath, points };
  }

  // Bar chart helpers
  function getBarDimensions(data, width = 280, height = 160, padding = 20) {
    const max = Math.max(...data.map(d => d.value));
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const barWidth = (chartWidth / data.length) * 0.7;
    const gap = (chartWidth / data.length) * 0.3;

    return data.map((d, i) => {
      const barHeight = (d.value / max) * chartHeight;
      const x = padding + i * (barWidth + gap) + gap / 2;
      const y = padding + chartHeight - barHeight;
      return { x, y, width: barWidth, height: barHeight, ...d };
    });
  }

  // Donut chart helpers
  function getDonutSegments(data, cx = 100, cy = 100, outerRadius = 80, innerRadius = 50) {
    const total = data.reduce((sum, d) => sum + d.value, 0);
    let currentAngle = -90; // Start from top

    return data.map(d => {
      const percentage = d.value / total;
      const angle = percentage * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      currentAngle = endAngle;

      const start = polarToCartesian(cx, cy, outerRadius, startAngle);
      const end = polarToCartesian(cx, cy, outerRadius, endAngle);
      const innerStart = polarToCartesian(cx, cy, innerRadius, startAngle);
      const innerEnd = polarToCartesian(cx, cy, innerRadius, endAngle);

      const largeArc = angle > 180 ? 1 : 0;

      const path = [
        `M ${start.x} ${start.y}`,
        `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${end.x} ${end.y}`,
        `L ${innerEnd.x} ${innerEnd.y}`,
        `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
        'Z'
      ].join(' ');

      return { path, percentage, ...d };
    });
  }

  function polarToCartesian(cx, cy, radius, angle) {
    const rad = (angle * Math.PI) / 180;
    return {
      x: cx + radius * Math.cos(rad),
      y: cy + radius * Math.sin(rad)
    };
  }

  // Computed chart data
  const lineChartData = $derived(getLinePath(lineData));
  const barChartData = $derived(getBarDimensions(barData));
  const donutSegments = $derived(getDonutSegments(donutData));
</script>

<div class="h-full bg-base-100 overflow-y-auto">
  <div class="max-w-lg mx-auto px-5 py-6">
    <div class="mb-6">
      <h1 class="text-xl font-semibold text-text mb-2">Charts</h1>
      <p class="text-sm text-text-muted">Simple SVG charts - no heavy libraries.</p>
    </div>

    <!-- Chart Type Tabs -->
    <div class="flex gap-1 p-1 bg-base-200 rounded-lg mb-6">
      {#each chartTypes as type}
        <Button
          variant={activeChart === type ? 'secondary' : 'ghost'}
          size="sm"
          fullWidth
          onclick={() => activeChart = type}
        >
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </Button>
      {/each}
    </div>

    {#if loading}
      <!-- Loading Skeleton -->
      <Card variant="outlined" padding="md">
        <Skeleton variant="text" class="w-24 mb-4" />
        <Skeleton variant="rect" class="h-40" />
      </Card>
    {:else}
      <!-- Line Chart -->
      {#if activeChart === 'line'}
        <Card variant="outlined" padding="md">
          <div class="flex items-center justify-between mb-4">
            <div>
              <p class="text-sm font-medium text-text">Monthly Revenue</p>
              <p class="text-xs text-text-muted">Last 6 months</p>
            </div>
            <div class="text-right">
              <p class="text-lg font-semibold text-text">$110k</p>
              <p class="text-xs text-success">+18% vs last month</p>
            </div>
          </div>

          <svg class="w-full" viewBox="0 0 280 160" preserveAspectRatio="xMidYMid meet">
            <!-- Grid lines -->
            {#each [0, 1, 2, 3, 4] as i}
              <line
                x1="20" y1={20 + i * 30}
                x2="260" y2={20 + i * 30}
                stroke="currentColor"
                class="text-border"
                stroke-width="1"
              />
            {/each}

            <!-- Area fill -->
            <path
              d={lineChartData.areaPath}
              fill="url(#lineGradient)"
              opacity="0.3"
            />

            <!-- Line -->
            <path
              d={lineChartData.linePath}
              fill="none"
              stroke="currentColor"
              class="text-primary"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />

            <!-- Data points -->
            {#each lineChartData.points as point, i}
              <circle
                cx={point.x}
                cy={point.y}
                r="4"
                fill="currentColor"
                class="text-primary"
              />
              <text
                x={point.x}
                y="155"
                text-anchor="middle"
                class="text-[10px] fill-text-muted"
              >
                {lineData[i].month}
              </text>
            {/each}

            <!-- Gradient definition -->
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:rgb(var(--color-primary));stop-opacity:0.4" />
                <stop offset="100%" style="stop-color:rgb(var(--color-primary));stop-opacity:0" />
              </linearGradient>
            </defs>
          </svg>
        </Card>
      {/if}

      <!-- Bar Chart -->
      {#if activeChart === 'bar'}
        <Card variant="outlined" padding="md">
          <div class="flex items-center justify-between mb-4">
            <div>
              <p class="text-sm font-medium text-text">Daily Visitors</p>
              <p class="text-xs text-text-muted">This week</p>
            </div>
            <div class="text-right">
              <p class="text-lg font-semibold text-text">389</p>
              <p class="text-xs text-text-muted">avg per day</p>
            </div>
          </div>

          <svg class="w-full" viewBox="0 0 280 160" preserveAspectRatio="xMidYMid meet">
            <!-- Grid lines -->
            {#each [0, 1, 2, 3, 4] as i}
              <line
                x1="20" y1={20 + i * 30}
                x2="260" y2={20 + i * 30}
                stroke="currentColor"
                class="text-border"
                stroke-width="1"
              />
            {/each}

            <!-- Bars -->
            {#each barChartData as bar, i}
              <g>
                <rect
                  x={bar.x}
                  y={bar.y}
                  width={bar.width}
                  height={bar.height}
                  rx="4"
                  fill="currentColor"
                  class="{i < 5 ? 'text-primary' : 'text-primary/50'}"
                />
                <text
                  x={bar.x + bar.width / 2}
                  y="155"
                  text-anchor="middle"
                  class="text-[10px] fill-text-muted"
                >
                  {bar.label}
                </text>
              </g>
            {/each}
          </svg>
        </Card>
      {/if}

      <!-- Donut Chart -->
      {#if activeChart === 'donut'}
        <Card variant="outlined" padding="md">
          <div class="mb-4">
            <p class="text-sm font-medium text-text">Traffic Sources</p>
            <p class="text-xs text-text-muted">Device breakdown</p>
          </div>

          <div class="flex items-center justify-center gap-6">
            <!-- Donut -->
            <div class="relative">
              <svg class="w-40 h-40" viewBox="0 0 200 200">
                {#each donutSegments as segment, i}
                  <path
                    d={segment.path}
                    fill={segment.color}
                    class="transition-opacity hover:opacity-80"
                  />
                {/each}
              </svg>
              <!-- Center text -->
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <p class="text-2xl font-semibold text-text">100%</p>
                <p class="text-xs text-text-muted">Total</p>
              </div>
            </div>

            <!-- Legend -->
            <div class="space-y-3">
              {#each donutSegments as segment}
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 rounded-full" style="background-color: {segment.color}"></div>
                  <div>
                    <p class="text-sm text-text">{segment.label}</p>
                    <p class="text-xs text-text-muted">{Math.round(segment.percentage * 100)}%</p>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        </Card>
      {/if}
    {/if}

    <!-- Additional Chart Styles -->
    <div class="mt-8 mb-4">
      <h2 class="text-sm font-medium text-text">Mini Chart Variants</h2>
    </div>

    <div class="grid grid-cols-2 gap-3 mb-8">
      <!-- Mini Line -->
      <Card variant="outlined" padding="md">
        <p class="text-xs text-text-muted mb-1">Revenue</p>
        <div class="flex items-end justify-between">
          <p class="text-lg font-semibold text-text">$12.8k</p>
          <svg class="w-16 h-8" viewBox="0 0 80 24" preserveAspectRatio="none">
            <path
              d="M0,20 L13,15 L26,18 L40,8 L53,12 L66,4 L80,6"
              fill="none"
              stroke="currentColor"
              class="text-success"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <p class="text-xs text-success mt-1">+12.5%</p>
      </Card>

      <!-- Mini Bar -->
      <Card variant="outlined" padding="md">
        <p class="text-xs text-text-muted mb-1">Orders</p>
        <div class="flex items-end justify-between">
          <p class="text-lg font-semibold text-text">384</p>
          <svg class="w-16 h-8" viewBox="0 0 80 24" preserveAspectRatio="none">
            {#each [12, 18, 8, 20, 15, 10, 16] as h, i}
              <rect
                x={i * 11 + 2}
                y={24 - h}
                width="8"
                height={h}
                rx="2"
                fill="currentColor"
                class="text-primary/70"
              />
            {/each}
          </svg>
        </div>
        <p class="text-xs text-error mt-1">-6.8%</p>
      </Card>

      <!-- Progress Ring -->
      <Card variant="outlined" padding="md">
        <p class="text-xs text-text-muted mb-2">Goal Progress</p>
        <div class="flex items-center gap-3">
          <svg class="w-12 h-12" viewBox="0 0 48 48">
            <!-- Background ring -->
            <circle
              cx="24" cy="24" r="20"
              fill="none"
              stroke="currentColor"
              class="text-border"
              stroke-width="4"
            />
            <!-- Progress ring (75%) -->
            <circle
              cx="24" cy="24" r="20"
              fill="none"
              stroke="currentColor"
              class="text-primary"
              stroke-width="4"
              stroke-linecap="round"
              stroke-dasharray="125.6"
              stroke-dashoffset="31.4"
              transform="rotate(-90 24 24)"
            />
          </svg>
          <div>
            <p class="text-lg font-semibold text-text">75%</p>
            <p class="text-xs text-text-muted">$7.5k / $10k</p>
          </div>
        </div>
      </Card>

      <!-- Horizontal Bar -->
      <Card variant="outlined" padding="md">
        <p class="text-xs text-text-muted mb-2">Storage Used</p>
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-sm text-text">Files</span>
            <span class="text-xs text-text-muted">4.2 GB</span>
          </div>
          <div class="h-2 bg-base-200 rounded-full overflow-hidden">
            <div class="h-full bg-primary rounded-full" style="width: 65%"></div>
          </div>
          <p class="text-xs text-text-muted">65% of 6.5 GB</p>
        </div>
      </Card>
    </div>

    <!-- Mobile UX Note -->
    <div class="p-4 bg-primary/5 border border-primary/20 rounded-lg">
      <h3 class="text-sm font-medium text-primary mb-2">Mobile UX Patterns</h3>
      <ul class="text-xs text-text-secondary space-y-1">
        <li>• Pure SVG - no heavy chart libraries</li>
        <li>• Responsive with viewBox scaling</li>
        <li>• Touch-friendly tap targets</li>
        <li>• Skeleton loading prevents layout shift</li>
      </ul>
    </div>
  </div>
</div>
