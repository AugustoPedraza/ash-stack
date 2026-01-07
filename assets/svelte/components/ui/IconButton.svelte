<script>
  /**
   * IconButton Component
   * Ghost-style icon button for header actions, context menus, etc.
   *
   * @prop {string} [label] - Aria label (required for accessibility)
   * @prop {string} [variant='ghost'] - 'ghost' | 'primary'
   * @prop {() => void} [onclick] - Click handler
   * @prop {Snippet} [children] - Icon content (SVG)
   */

  let {
    label = '',
    variant = 'ghost',
    onclick = () => {},
    children
  } = $props();

  const variants = {
    ghost: 'p-2 rounded-lg text-foreground/70 hover:bg-muted active:bg-accent',
    primary: 'btn btn-primary btn-sm font-medium'
  };
</script>

<button
  class="{variants[variant]} transition-colors"
  onclick={onclick}
  aria-label={label}
>
  {@render children?.()}
</button>
