<script>
  /**
   * Avatar Component
   * User representation using design tokens.
   *
   * @prop {string} [src] - Image URL
   * @prop {string} [alt=''] - Alt text for image
   * @prop {string} [initials] - Fallback initials (e.g., "JD")
   * @prop {'xs' | 'sm' | 'md' | 'lg' | 'xl'} [size='md']
   * @prop {'circle' | 'square'} [shape='circle']
   * @prop {'online' | 'offline' | 'busy' | 'away' | null} [status=null]
   */

  let {
    src = '',
    alt = '',
    initials = '',
    size = 'md',
    shape = 'circle',
    status = null
  } = $props();

  // Sizes using 8px grid: xs=24, sm=32, md=40, lg=48, xl=64
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg'
  };

  const shapes = {
    circle: 'rounded-full',
    square: 'rounded-md'
  };

  const statusColors = {
    online: 'bg-success',
    offline: 'bg-muted-foreground',
    busy: 'bg-destructive',
    away: 'bg-warning'
  };

  const statusSizes = {
    xs: 'w-1.5 h-1.5 border',
    sm: 'w-2 h-2 border',
    md: 'w-2.5 h-2.5 border-2',
    lg: 'w-3 h-3 border-2',
    xl: 'w-3.5 h-3.5 border-2'
  };

  // Use $derived to fix state_referenced_locally warning
  const displayInitials = $derived(initials || alt.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase());
</script>

<div class="relative inline-flex">
  {#if src}
    <img
      {src}
      {alt}
      class="
        {sizes[size]} {shapes[shape]}
        object-cover
        bg-muted
      "
    />
  {:else}
    <div
      class="
        {sizes[size]} {shapes[shape]}
        bg-muted text-muted-foreground
        flex items-center justify-center
        font-medium
      "
      aria-label={alt}
    >
      {displayInitials || '?'}
    </div>
  {/if}

  {#if status}
    <span
      class="
        absolute bottom-0 right-0
        {statusSizes[size]} {statusColors[status]}
        rounded-full border-background
      "
      aria-label="{status}"
    ></span>
  {/if}
</div>
