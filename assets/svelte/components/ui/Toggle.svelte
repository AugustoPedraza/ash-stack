<script>
  /**
   * Toggle Component
   * Switch control using design tokens.
   *
   * @prop {boolean} [checked=false] - Toggle state
   * @prop {string} [label] - Label text
   * @prop {string} [description] - Description below label
   * @prop {'sm' | 'md' | 'lg'} [size='md']
   * @prop {boolean} [disabled=false]
   * @prop {(checked: boolean) => void} [onchange]
   */

  let {
    checked = $bindable(false),
    label = '',
    description = '',
    size = 'md',
    disabled = false,
    onchange = undefined
  } = $props();

  // Toggle track sizes (ensure touch target minimum)
  const trackSizes = {
    sm: 'w-9 h-5',
    md: 'w-11 h-6',
    lg: 'w-14 h-7'
  };

  // Toggle thumb sizes
  const thumbSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  // Thumb translation when checked
  const thumbTranslate = {
    sm: 'translate-x-4',
    md: 'translate-x-5',
    lg: 'translate-x-7'
  };

  function handleToggle() {
    if (disabled) return;
    checked = !checked;
    onchange?.(checked);
  }

  function handleKeydown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    }
  }
</script>

<label
  class="
    inline-flex items-start gap-3
    {disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
  "
>
  <!-- Toggle Track -->
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    {disabled}
    class="
      relative shrink-0 {trackSizes[size]}
      rounded-full
      transition-colors duration-[var(--duration-fast)]
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2
      {checked ? 'bg-primary' : 'bg-border-strong'}
    "
    onclick={handleToggle}
    onkeydown={handleKeydown}
  >
    <!-- Thumb -->
    <span
      class="
        absolute top-1 left-1
        {thumbSizes[size]}
        bg-white rounded-full shadow-sm
        transition-transform duration-[var(--duration-fast)]
        {checked ? thumbTranslate[size] : ''}
      "
      aria-hidden="true"
    ></span>
  </button>

  <!-- Label & Description -->
  {#if label || description}
    <div class="pt-0.5">
      {#if label}
        <span class="text-sm font-medium text-text">{label}</span>
      {/if}
      {#if description}
        <p class="text-xs text-text-muted mt-0.5">{description}</p>
      {/if}
    </div>
  {/if}
</label>
