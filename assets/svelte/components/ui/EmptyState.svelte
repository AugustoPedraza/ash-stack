<!--
  EmptyState Component
  Displays a placeholder when content is empty or unavailable.
  Supports various presets and custom content.
-->
<script>
  import { fade } from 'svelte/transition';

  /** @type {'default' | 'search' | 'error' | 'success' | 'offline' | 'custom'} */
  export let preset = 'default';

  /** @type {string} - Title text */
  export let title = '';

  /** @type {string} - Description text */
  export let description = '';

  /** @type {'sm' | 'md' | 'lg'} */
  export let size = 'md';

  /** @type {boolean} - Compact layout */
  export let compact = false;

  // Preset configurations
  const presets = {
    default: {
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>`,
      defaultTitle: 'No items yet',
      defaultDescription: 'Get started by creating your first item.'
    },
    search: {
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>`,
      defaultTitle: 'No results found',
      defaultDescription: 'Try adjusting your search or filter to find what you\'re looking for.'
    },
    error: {
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>`,
      defaultTitle: 'Something went wrong',
      defaultDescription: 'We couldn\'t load the content. Please try again.'
    },
    success: {
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>`,
      defaultTitle: 'All done!',
      defaultDescription: 'You\'ve completed all your tasks.'
    },
    offline: {
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z" />
      </svg>`,
      defaultTitle: 'You\'re offline',
      defaultDescription: 'Check your internet connection and try again.'
    },
    custom: {
      icon: '',
      defaultTitle: '',
      defaultDescription: ''
    }
  };

  $: config = presets[preset];
  $: displayTitle = title || config.defaultTitle;
  $: displayDescription = description || config.defaultDescription;

  // Size classes
  const sizeClasses = {
    sm: { icon: 'w-10 h-10', title: 'text-base', desc: 'text-sm' },
    md: { icon: 'w-12 h-12', title: 'text-lg', desc: 'text-sm' },
    lg: { icon: 'w-16 h-16', title: 'text-xl', desc: 'text-base' }
  };

  $: sizeConfig = sizeClasses[size];
</script>

<div
  class="empty-state"
  class:compact
  class:size-sm={size === 'sm'}
  class:size-lg={size === 'lg'}
  in:fade={{ duration: 150 }}
  role="status"
>
  <!-- Icon -->
  <div class="empty-icon {sizeConfig.icon}">
    <slot name="icon">
      {#if preset !== 'custom'}
        {@html config.icon}
      {/if}
    </slot>
  </div>

  <!-- Content -->
  <div class="empty-content">
    {#if displayTitle}
      <h3 class="empty-title {sizeConfig.title}">{displayTitle}</h3>
    {/if}

    {#if displayDescription}
      <p class="empty-description {sizeConfig.desc}">{displayDescription}</p>
    {/if}

    <slot name="description" />
  </div>

  <!-- Actions -->
  {#if $$slots.actions}
    <div class="empty-actions">
      <slot name="actions" />
    </div>
  {/if}

  <!-- Extra content -->
  <slot />
</div>

<style>
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-12) var(--spacing-4);
    text-align: center;
  }

  .empty-state.compact {
    padding: var(--spacing-6) var(--spacing-4);
  }

  .empty-state.size-sm {
    padding: var(--spacing-6) var(--spacing-3);
  }

  .empty-state.size-lg {
    padding: var(--spacing-16) var(--spacing-6);
  }

  .empty-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: var(--spacing-4);
    color: var(--color-text-muted);
  }

  .empty-icon :global(svg) {
    width: 100%;
    height: 100%;
  }

  .empty-content {
    max-width: 24rem;
  }

  .empty-title {
    margin: 0 0 var(--spacing-2);
    font-weight: 600;
    color: var(--color-text);
  }

  .empty-description {
    margin: 0;
    color: var(--color-text-muted);
    line-height: 1.5;
  }

  .empty-actions {
    display: flex;
    gap: var(--spacing-3);
    margin-top: var(--spacing-6);
  }

  /* Width/height utility classes */
  :global(.w-10) { width: 2.5rem; }
  :global(.h-10) { height: 2.5rem; }
  :global(.w-12) { width: 3rem; }
  :global(.h-12) { height: 3rem; }
  :global(.w-16) { width: 4rem; }
  :global(.h-16) { height: 4rem; }

  /* Text size utility classes */
  :global(.text-sm) { font-size: 0.875rem; }
  :global(.text-base) { font-size: 1rem; }
  :global(.text-lg) { font-size: 1.125rem; }
  :global(.text-xl) { font-size: 1.25rem; }
</style>
