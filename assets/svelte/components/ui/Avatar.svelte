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

  const sizes = {
    xs: 'w-[var(--avatar-xs)] h-[var(--avatar-xs)] text-xs',
    sm: 'w-[var(--avatar-sm)] h-[var(--avatar-sm)] text-xs',
    md: 'w-[var(--avatar-md)] h-[var(--avatar-md)] text-sm',
    lg: 'w-[var(--avatar-lg)] h-[var(--avatar-lg)] text-base',
    xl: 'w-[var(--avatar-xl)] h-[var(--avatar-xl)] text-lg'
  };

  const shapes = {
    circle: 'rounded-full',
    square: 'rounded-[var(--radius-md)]'
  };

  const statusColors = {
    online: 'bg-success',
    offline: 'bg-text-muted',
    busy: 'bg-error',
    away: 'bg-warning'
  };

  const statusSizes = {
    xs: 'w-1.5 h-1.5 border',
    sm: 'w-2 h-2 border',
    md: 'w-2.5 h-2.5 border-2',
    lg: 'w-3 h-3 border-2',
    xl: 'w-3.5 h-3.5 border-2'
  };

  // Compute initials from alt if not provided
  const displayInitials = initials || alt.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
</script>

<div class="relative inline-flex">
  {#if src}
    <img
      {src}
      {alt}
      class="
        {sizes[size]} {shapes[shape]}
        object-cover
        bg-base-200
      "
    />
  {:else}
    <div
      class="
        {sizes[size]} {shapes[shape]}
        bg-base-200 text-text-secondary
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
        rounded-full border-surface
      "
      aria-label="{status}"
    ></span>
  {/if}
</div>
