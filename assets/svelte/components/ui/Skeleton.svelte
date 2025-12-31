<!--
  Skeleton Component
  Animated loading placeholder with shimmer effect.
  Supports various shapes and sizes for content loading states.
-->
<script>
  /** @type {'text' | 'circle' | 'rect' | 'card' | 'avatar' | 'button'} */
  export let variant = 'text';

  /** @type {string} - Custom width (CSS value) */
  export let width = '';

  /** @type {string} - Custom height (CSS value) */
  export let height = '';

  /** @type {number} - Number of lines for text variant */
  export let lines = 1;

  /** @type {'xs' | 'sm' | 'md' | 'lg' | 'xl'} - Size for avatar variant */
  export let size = 'md';

  /** @type {boolean} - Enable shimmer animation */
  export let animate = true;

  /** @type {boolean} - Rounded corners */
  export let rounded = true;

  // Avatar sizes
  const avatarSizes = {
    xs: '24px',
    sm: '32px',
    md: '40px',
    lg: '48px',
    xl: '64px'
  };

  // Variant configurations
  function getStyles() {
    switch (variant) {
      case 'circle':
      case 'avatar':
        const avatarSize = avatarSizes[size] || '40px';
        return {
          width: width || avatarSize,
          height: height || avatarSize,
          borderRadius: '50%'
        };
      case 'button':
        return {
          width: width || '80px',
          height: height || '36px',
          borderRadius: rounded ? 'var(--radius-md)' : '0'
        };
      case 'card':
        return {
          width: width || '100%',
          height: height || '120px',
          borderRadius: rounded ? 'var(--radius-lg)' : '0'
        };
      case 'rect':
        return {
          width: width || '100%',
          height: height || '100px',
          borderRadius: rounded ? 'var(--radius-md)' : '0'
        };
      case 'text':
      default:
        return {
          width: width || '100%',
          height: height || '1em',
          borderRadius: rounded ? 'var(--radius-sm)' : '0'
        };
    }
  }

  $: styles = getStyles();
</script>

{#if variant === 'text' && lines > 1}
  <div class="skeleton-lines">
    {#each Array(lines) as _, i}
      <div
        class="skeleton"
        class:animate
        style="
          width: {i === lines - 1 ? '70%' : styles.width};
          height: {styles.height};
          border-radius: {styles.borderRadius};
        "
        role="presentation"
        aria-hidden="true"
      />
    {/each}
  </div>
{:else}
  <div
    class="skeleton"
    class:animate
    style="
      width: {styles.width};
      height: {styles.height};
      border-radius: {styles.borderRadius};
    "
    role="presentation"
    aria-hidden="true"
  >
    <slot />
  </div>
{/if}

<style>
  .skeleton {
    position: relative;
    overflow: hidden;
    background-color: var(--color-surface-sunken);
    display: inline-block;
  }

  .skeleton.animate::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    animation: shimmer 1.5s infinite;
  }

  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }

  /* Respect reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .skeleton.animate::after {
      animation: none;
      opacity: 0;
    }
  }

  .skeleton-lines {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-2);
  }
</style>
