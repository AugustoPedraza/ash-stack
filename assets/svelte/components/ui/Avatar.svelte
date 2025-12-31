<!--
  Avatar Component
  User representation with image, initials, and optional status.
  NO class prop or restProps - use size/shape props only.
-->
<script>
  /**
   * Size of the avatar
   * @type {'xs' | 'sm' | 'md' | 'lg' | 'xl'}
   */
  export let size = 'md';

  /**
   * Image URL
   * @type {string | null}
   */
  export let src = null;

  /**
   * Alt text (also used for generating initials)
   * @type {string}
   */
  export let alt = '';

  /**
   * Explicit initials (overrides auto-generation from alt)
   * @type {string | null}
   */
  export let fallback = null;

  /**
   * Shape of the avatar
   * @type {'circle' | 'rounded'}
   */
  export let shape = 'circle';

  /**
   * Status indicator
   * @type {'online' | 'offline' | 'away' | 'busy' | null}
   */
  export let status = null;

  // Generate initials from alt text
  $: initials = fallback || alt
    .split(' ')
    .map(word => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  // Size classes - using only valid spacing values
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
  };

  // Status indicator colors
  const statusColors = {
    online: 'bg-success',
    offline: 'bg-text-muted',
    away: 'bg-warning',
    busy: 'bg-error',
  };

  // Status indicator sizes - using only valid sizes (w-2, w-3, w-4)
  const statusSizes = {
    xs: 'w-2 h-2',
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
  };

  // Track image load error
  let imageError = false;

  function handleImageError() {
    imageError = true;
  }
</script>

<div class="relative inline-flex">
  <div
    class="
      {sizes[size]}
      {shape === 'circle' ? 'rounded-full' : 'rounded-lg'}
      overflow-hidden
      bg-surface-sunken
      flex items-center justify-center
      font-medium text-text-muted
      ring-2 ring-surface
    "
  >
    {#if src && !imageError}
      <img
        {src}
        {alt}
        class="w-full h-full object-cover"
        on:error={handleImageError}
      />
    {:else}
      <span>{initials}</span>
    {/if}
  </div>

  {#if status}
    <span
      class="
        absolute bottom-0 right-0
        {statusSizes[size]}
        rounded-full
        {statusColors[status]}
        ring-2 ring-surface
      "
      aria-label={status}
    />
  {/if}
</div>
