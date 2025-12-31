<!--
  PageHeader Component
  Consistent page header with title, description, and action slot.
  Enforces header rhythm across all pages.
-->
<script>
  /** @type {string} - Page title (required) */
  export let title;

  /** @type {string | null} - Optional description */
  export let description = null;

  /** @type {boolean} - Show border below header */
  export let bordered = false;
</script>

<header
  class="mb-8"
  class:pb-6={bordered}
  class:border-b={bordered}
  class:border-border={bordered}
>
  <div class="flex items-start justify-between gap-4">
    <div class="flex-1 min-w-0">
      <h1 class="text-2xl font-semibold text-text truncate">
        {title}
      </h1>
      {#if description}
        <p class="mt-2 text-text-muted">
          {description}
        </p>
      {/if}
    </div>

    <!-- Action buttons slot -->
    {#if $$slots.actions}
      <div class="flex items-center gap-3 flex-shrink-0">
        <slot name="actions" />
      </div>
    {/if}
  </div>

  <!-- Optional tabs/filters slot -->
  {#if $$slots.tabs}
    <div class="mt-6">
      <slot name="tabs" />
    </div>
  {/if}
</header>
