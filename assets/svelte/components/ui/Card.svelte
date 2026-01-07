<script>
  /**
   * Card Component
   * Container with variants using design tokens.
   *
   * @prop {'elevated' | 'outlined' | 'flat'} [variant='outlined']
   * @prop {'sm' | 'md' | 'lg' | 'none'} [padding='md']
   * @prop {string} [title] - Optional card title
   * @prop {string} [description] - Optional description below title
   * @prop {Snippet} [header] - Custom header slot
   * @prop {Snippet} [footer] - Footer slot
   * @prop {Snippet} [actions] - Actions slot (typically buttons)
   * @prop {Snippet} [children] - Main content
   */

  let {
    variant = 'outlined',
    padding = 'md',
    title = '',
    description = '',
    header = undefined,
    footer = undefined,
    actions = undefined,
    children
  } = $props();

  const variants = {
    elevated: 'bg-surface shadow-md border-0',
    outlined: 'bg-surface border border-border',
    flat: 'bg-surface-sunken border-0'
  };

  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };

  const baseClasses = 'rounded-[var(--radius-lg)] overflow-hidden';
</script>

<div class="{baseClasses} {variants[variant]}">
  {#if header}
    <div class="border-b border-border {paddings[padding]}">
      {@render header()}
    </div>
  {:else if title || description}
    <div class="border-b border-border {paddings[padding]}">
      {#if title}
        <h3 class="text-base font-semibold text-text">{title}</h3>
      {/if}
      {#if description}
        <p class="text-sm text-text-muted mt-1">{description}</p>
      {/if}
    </div>
  {/if}

  <div class={paddings[padding]}>
    {@render children?.()}
  </div>

  {#if actions}
    <div class="border-t border-border {paddings[padding]} flex items-center justify-end gap-2">
      {@render actions()}
    </div>
  {/if}

  {#if footer}
    <div class="border-t border-border {paddings[padding]}">
      {@render footer()}
    </div>
  {/if}
</div>
