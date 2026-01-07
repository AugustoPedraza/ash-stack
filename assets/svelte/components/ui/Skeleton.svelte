<script>
  /**
   * Skeleton Component
   * Loading placeholders using design tokens.
   *
   * @prop {'text' | 'circle' | 'rect' | 'card' | 'avatar' | 'button'} [variant='text']
   * @prop {'sm' | 'md' | 'lg'} [size='md']
   * @prop {boolean} [animate=true] - Pulse animation
   * @prop {number} [lines=1] - For text variant, number of lines
   * @prop {string} [width] - Custom width (e.g., '200px', '50%')
   * @prop {string} [height] - Custom height
   */

  let {
    variant = 'text',
    size = 'md',
    animate = true,
    lines = 1,
    width = '',
    height = ''
  } = $props();

  const baseClasses = `bg-base-200 ${animate ? 'animate-pulse' : ''}`;

  // Text skeleton heights
  const textHeights = {
    sm: 'h-3',
    md: 'h-4',
    lg: 'h-5'
  };

  // Avatar sizes
  const avatarSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  // Button sizes
  const buttonSizes = {
    sm: 'h-8 w-20',
    md: 'h-10 w-24',
    lg: 'h-12 w-32'
  };

  // Card sizes
  const cardSizes = {
    sm: 'h-24',
    md: 'h-32',
    lg: 'h-48'
  };
</script>

{#if variant === 'text'}
  <div class="space-y-2" style:width={width || undefined}>
    {#each Array(lines) as _, i}
      <div
        class="
          {baseClasses} {textHeights[size]}
          rounded-[var(--radius-sm)]
          {i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'}
        "
        style:height={height || undefined}
      ></div>
    {/each}
  </div>

{:else if variant === 'circle'}
  <div
    class="{baseClasses} {avatarSizes[size]} rounded-full"
    style:width={width || undefined}
    style:height={height || width || undefined}
  ></div>

{:else if variant === 'avatar'}
  <div class="flex items-center gap-3">
    <div class="{baseClasses} {avatarSizes[size]} rounded-full"></div>
    <div class="space-y-2 flex-1">
      <div class="{baseClasses} h-4 rounded w-32"></div>
      <div class="{baseClasses} h-3 rounded w-24"></div>
    </div>
  </div>

{:else if variant === 'button'}
  <div
    class="{baseClasses} {buttonSizes[size]} rounded-[var(--radius-md)]"
    style:width={width || undefined}
    style:height={height || undefined}
  ></div>

{:else if variant === 'card'}
  <div
    class="{baseClasses} {cardSizes[size]} rounded-[var(--radius-lg)] w-full"
    style:width={width || undefined}
    style:height={height || undefined}
  ></div>

{:else if variant === 'rect'}
  <div
    class="{baseClasses} rounded-[var(--radius-md)]"
    style:width={width || '100%'}
    style:height={height || '100px'}
  ></div>
{/if}
