<!--
  Page Component
  Consistent page wrapper with max-width and padding.
  Enforces layout rhythm across all pages.
-->
<script>
  /** @type {'sm' | 'md' | 'lg' | 'xl' | 'full'} - Max width of content */
  export let size = 'lg';

  /** @type {boolean} - Add vertical padding */
  export let padded = true;

  /** @type {boolean} - Center content horizontally */
  export let centered = true;

  // Size variants - mapped to Tailwind max-width
  const sizes = {
    sm: 'max-w-screen-sm',    // 640px
    md: 'max-w-screen-md',    // 768px
    lg: 'max-w-screen-lg',    // 1024px
    xl: 'max-w-screen-xl',    // 1280px
    full: 'max-w-full'
  };
</script>

<div
  class="min-h-screen bg-background"
  class:py-8={padded}
>
  <div
    class="{sizes[size]} px-4"
    class:mx-auto={centered}
  >
    <slot />
  </div>
</div>
