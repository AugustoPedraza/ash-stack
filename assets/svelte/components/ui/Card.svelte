<!--
  Card Component
  Consistent card container with optional header and footer.
  NO class prop - use variant/padding props.
-->
<script>
  /** @type {'default' | 'raised' | 'outline' | 'ghost'} */
  export let variant = 'default';

  /** @type {'sm' | 'md' | 'lg' | 'none'} */
  export let padding = 'md';

  /** @type {string | null} - Optional card title */
  export let title = null;

  /** @type {string | null} - Optional card description */
  export let description = null;

  // Variant styles
  const variants = {
    default: 'bg-surface border border-border shadow-sm',
    raised: 'bg-surface-raised border border-border shadow-md',
    outline: 'bg-transparent border border-border',
    ghost: 'bg-transparent'
  };

  // Padding sizes
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };
</script>

<div class="rounded-lg {variants[variant]}">
  {#if title || description || $$slots.header}
    <div
      class="border-b border-border"
      class:p-4={padding === 'sm'}
      class:p-6={padding === 'md' || padding === 'none'}
      class:p-8={padding === 'lg'}
    >
      {#if $$slots.header}
        <slot name="header" />
      {:else}
        <div class="flex items-start justify-between gap-4">
          <div>
            {#if title}
              <h3 class="text-lg font-semibold text-text">{title}</h3>
            {/if}
            {#if description}
              <p class="mt-1 text-sm text-text-muted">{description}</p>
            {/if}
          </div>
          {#if $$slots.actions}
            <div class="flex items-center gap-2">
              <slot name="actions" />
            </div>
          {/if}
        </div>
      {/if}
    </div>
  {/if}

  <div class={paddings[padding]}>
    <slot />
  </div>

  {#if $$slots.footer}
    <div
      class="border-t border-border"
      class:p-4={padding === 'sm'}
      class:p-6={padding === 'md' || padding === 'none'}
      class:p-8={padding === 'lg'}
    >
      <slot name="footer" />
    </div>
  {/if}
</div>
