<script>
  /**
   * Stats Cards Recipe
   * Mobile-first metric cards with sparklines, trends, and loading states.
   *
   * Uses: Card, Skeleton, Button, Badge
   */
  import { Card, Skeleton, Button, Badge } from '../../ui';

  let loading = $state(true);

  // Simulated stats data
  const stats = [
    {
      id: 'revenue',
      label: 'Revenue',
      value: 12847.50,
      previousValue: 11234.00,
      format: 'currency',
      sparkline: [40, 55, 45, 65, 50, 80, 75, 90, 85, 95]
    },
    {
      id: 'users',
      label: 'Active Users',
      value: 2847,
      previousValue: 2650,
      format: 'number',
      sparkline: [20, 25, 22, 30, 28, 35, 40, 38, 45, 48]
    },
    {
      id: 'orders',
      label: 'Orders',
      value: 384,
      previousValue: 412,
      format: 'number',
      sparkline: [50, 45, 55, 40, 48, 42, 38, 35, 40, 38]
    },
    {
      id: 'conversion',
      label: 'Conversion',
      value: 3.24,
      previousValue: 2.98,
      format: 'percent',
      sparkline: [2.1, 2.4, 2.2, 2.8, 2.6, 3.0, 2.9, 3.1, 3.0, 3.2]
    }
  ];

  // Simulate loading
  $effect(() => {
    const timer = setTimeout(() => {
      loading = false;
    }, 1000);
    return () => clearTimeout(timer);
  });

  function formatValue(value, format) {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
      case 'percent':
        return `${value.toFixed(2)}%`;
      default:
        return new Intl.NumberFormat('en-US').format(value);
    }
  }

  function getChange(current, previous) {
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(change).toFixed(1),
      positive: change >= 0
    };
  }

  function getSparklinePath(data, width = 80, height = 24) {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const stepX = width / (data.length - 1);

    const points = data.map((value, i) => {
      const x = i * stepX;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    });

    return `M${points.join(' L')}`;
  }
</script>

<div class="h-full bg-base-100 overflow-y-auto">
  <div class="max-w-lg mx-auto px-5 py-6">
    <div class="mb-6">
      <h1 class="text-xl font-semibold text-foreground mb-2">Stats Cards</h1>
      <p class="text-sm text-muted-foreground">Mobile-first metric cards with trends and sparklines.</p>
    </div>

    <!-- Stats Grid - 2 columns on mobile -->
    <div class="grid grid-cols-2 gap-3 mb-8">
      {#each stats as stat}
        <Card variant="outlined" padding="md">
          {#if loading}
            <!-- Skeleton -->
            <div class="space-y-2">
              <Skeleton variant="text" class="w-16" />
              <Skeleton variant="text" class="w-20 h-6" />
              <Skeleton variant="text" class="w-12" />
            </div>
          {:else}
            <!-- Label -->
            <p class="text-xs text-muted-foreground mb-1">{stat.label}</p>

            <!-- Value -->
            <p class="text-lg font-semibold text-foreground mb-1">
              {formatValue(stat.value, stat.format)}
            </p>

            <!-- Change indicator -->
            {@const change = getChange(stat.value, stat.previousValue)}
            <div class="flex items-center gap-1">
              <span class="flex items-center text-xs {change.positive ? 'text-success' : 'text-destructive'}">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 {change.positive ? '' : 'rotate-180'}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                {change.value}%
              </span>
              <span class="text-xs text-text-disabled">vs last period</span>
            </div>

            <!-- Mini sparkline -->
            <div class="mt-2">
              <svg class="w-full h-6" viewBox="0 0 80 24" preserveAspectRatio="none">
                <path
                  d={getSparklinePath(stat.sparkline)}
                  fill="none"
                  stroke={change.positive ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)'}
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          {/if}
        </Card>
      {/each}
    </div>

    <!-- Alternative: Full-width card style -->
    <div class="mb-6">
      <h2 class="text-sm font-medium text-foreground mb-3">Full-Width Style</h2>
    </div>

    <div class="space-y-3 mb-8">
      {#each stats.slice(0, 2) as stat}
        <Card variant="outlined" padding="md">
          {#if loading}
            <div class="flex items-center justify-between">
              <div class="flex-1 space-y-2">
                <Skeleton variant="text" class="w-20" />
                <Skeleton variant="text" class="w-24 h-5" />
              </div>
              <Skeleton variant="rect" class="w-20 h-8" />
            </div>
          {:else}
            {@const change = getChange(stat.value, stat.previousValue)}
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-muted-foreground">{stat.label}</p>
                <p class="text-xl font-semibold text-foreground">
                  {formatValue(stat.value, stat.format)}
                </p>
              </div>

              <div class="flex items-center gap-3">
                <!-- Sparkline -->
                <svg class="w-20 h-8" viewBox="0 0 80 24" preserveAspectRatio="none">
                  <path
                    d={getSparklinePath(stat.sparkline)}
                    fill="none"
                    stroke="currentColor"
                    class="text-primary"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>

                <!-- Change badge -->
                <Badge variant={change.positive ? 'success' : 'error'} size="sm">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-0.5 {change.positive ? '' : 'rotate-180'}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  {change.value}%
                </Badge>
              </div>
            </div>
          {/if}
        </Card>
      {/each}
    </div>

    <!-- Compact list style -->
    <div class="mb-6">
      <h2 class="text-sm font-medium text-foreground mb-3">Compact List Style</h2>
    </div>

    <Card variant="outlined" padding="none" class="divide-y divide-border mb-8">
      {#each stats as stat}
        <div class="flex items-center justify-between px-4 py-3">
          {#if loading}
            <Skeleton variant="text" class="w-24" />
            <Skeleton variant="text" class="w-16" />
          {:else}
            {@const change = getChange(stat.value, stat.previousValue)}
            <span class="text-sm text-muted-foreground">{stat.label}</span>
            <div class="flex items-center gap-2">
              <span class="text-sm font-medium text-foreground">
                {formatValue(stat.value, stat.format)}
              </span>
              <span class="text-xs {change.positive ? 'text-success' : 'text-destructive'}">
                {change.positive ? '+' : '-'}{change.value}%
              </span>
            </div>
          {/if}
        </div>
      {/each}
    </Card>

    <!-- State toggle for demo -->
    <div class="flex justify-center">
      <Button
        variant="ghost"
        size="sm"
        onclick={() => loading = !loading}
      >
        Toggle Loading State
      </Button>
    </div>

    <!-- Mobile UX Note -->
    <div class="mt-8 p-4 bg-primary/5 border border-primary/20 rounded-lg">
      <h3 class="text-sm font-medium text-primary mb-2">Mobile UX Patterns</h3>
      <ul class="text-xs text-muted-foreground space-y-1">
        <li>• 2-column grid maximizes mobile screen</li>
        <li>• Sparklines show trend at a glance</li>
        <li>• Color-coded change indicators</li>
        <li>• Skeleton loading prevents layout shift</li>
      </ul>
    </div>
  </div>
</div>
