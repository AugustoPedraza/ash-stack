<!--
  Section Component
  Consistent vertical rhythm for page sections.
  Enforces spacing between major page areas.
-->
<script>
  /** @type {string | null} - Section title */
  export let title = null;

  /** @type {string | null} - Section description */
  export let description = null;

  /** @type {'sm' | 'md' | 'lg'} - Vertical spacing */
  export let spacing = 'md';

  // Spacing variants
  const spacings = {
    sm: 'py-4',
    md: 'py-8',
    lg: 'py-12'
  };

  // Gap between header and content
  const gaps = {
    sm: 'gap-3',
    md: 'gap-6',
    lg: 'gap-8'
  };
</script>

<section class="{spacings[spacing]}">
  <div class="flex flex-col {gaps[spacing]}">
    {#if title || description || $$slots.header}
      <header class="flex items-start justify-between gap-4">
        <div>
          {#if $$slots.header}
            <slot name="header" />
          {:else}
            {#if title}
              <h2 class="text-xl font-semibold text-text">{title}</h2>
            {/if}
            {#if description}
              <p class="mt-1 text-text-muted">{description}</p>
            {/if}
          {/if}
        </div>
        {#if $$slots.actions}
          <div class="flex items-center gap-2">
            <slot name="actions" />
          </div>
        {/if}
      </header>
    {/if}

    <div>
      <slot />
    </div>
  </div>
</section>
