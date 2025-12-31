<!--
  Toggle/Switch Component
  iOS-style toggle with spring animation and haptic feedback.
-->
<script>
  import { createEventDispatcher } from 'svelte';
  import { spring } from 'svelte/motion';
  import { haptic, HapticType } from '../../lib/mobile.js';

  const dispatch = createEventDispatcher();

  /** @type {boolean} */
  export let checked = false;

  /** @type {boolean} */
  export let disabled = false;

  /** @type {'sm' | 'md' | 'lg'} */
  export let size = 'md';

  /** @type {string} */
  export let label = '';

  /** @type {string} */
  export let description = '';

  /** @type {string | undefined} */
  export let id = undefined;

  /** @type {string | undefined} */
  export let name = undefined;

  // Spring animation for the toggle thumb
  const thumbPosition = spring(0, {
    stiffness: 0.3,
    damping: 0.8
  });

  // Update spring when checked changes
  $: thumbPosition.set(checked ? 1 : 0);

  // Size configurations
  const sizes = {
    sm: {
      track: 'w-8 h-4',
      thumb: 'w-3 h-3',
      translate: 16
    },
    md: {
      track: 'w-12 h-6',
      thumb: 'w-4 h-4',
      translate: 24
    },
    lg: {
      track: 'w-16 h-8',
      thumb: 'w-6 h-6',
      translate: 32
    }
  };

  $: sizeConfig = sizes[size];

  function toggle() {
    if (disabled) return;

    checked = !checked;
    haptic(checked ? HapticType.SUCCESS : HapticType.LIGHT);
    dispatch('change', { checked });
  }

  function handleKeydown(e) {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      toggle();
    }
  }
</script>

<div class="toggle-wrapper" class:disabled>
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label || undefined}
    {id}
    {disabled}
    class="toggle-track {sizeConfig.track}"
    class:checked
    on:click={toggle}
    on:keydown={handleKeydown}
  >
    <span
      class="toggle-thumb {sizeConfig.thumb}"
      style="transform: translateX({$thumbPosition * sizeConfig.translate}px)"
    />
  </button>

  {#if label || description}
    <div class="toggle-content">
      {#if label}
        <label for={id} class="toggle-label" on:click={toggle}>
          {label}
        </label>
      {/if}
      {#if description}
        <p class="toggle-description">{description}</p>
      {/if}
    </div>
  {/if}

  <!-- Hidden input for form submission -->
  {#if name}
    <input type="hidden" {name} value={checked ? 'true' : 'false'} />
  {/if}
</div>

<style>
  .toggle-wrapper {
    display: flex;
    align-items: flex-start;
    gap: var(--spacing-3);
  }

  .toggle-wrapper.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .toggle-track {
    position: relative;
    flex-shrink: 0;
    padding: 2px;
    border: none;
    border-radius: var(--radius-full);
    background-color: var(--color-border);
    cursor: pointer;
    transition: background-color 200ms ease;
  }

  .toggle-track:focus-visible {
    outline: 2px solid var(--color-border-focus);
    outline-offset: 2px;
  }

  .toggle-track.checked {
    background-color: var(--color-primary);
  }

  .toggle-track:disabled {
    cursor: not-allowed;
  }

  .toggle-track:not(:disabled):hover {
    background-color: var(--color-border-strong);
  }

  .toggle-track.checked:not(:disabled):hover {
    background-color: var(--color-primary-hover);
  }

  .toggle-track:not(:disabled):active {
    transform: scale(0.98);
  }

  .toggle-thumb {
    display: block;
    background-color: white;
    border-radius: var(--radius-full);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
    transition: box-shadow 200ms ease;
    will-change: transform;
  }

  .toggle-track:active .toggle-thumb {
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  }

  .toggle-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-0-5);
    min-width: 0;
  }

  .toggle-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text);
    cursor: pointer;
    user-select: none;
  }

  .toggle-wrapper.disabled .toggle-label {
    cursor: not-allowed;
  }

  .toggle-description {
    margin: 0;
    font-size: 0.75rem;
    color: var(--color-text-muted);
    line-height: 1.4;
  }

  /* Width classes */
  :global(.w-8) { width: 2rem; }
  :global(.w-12) { width: 3rem; }
  :global(.w-16) { width: 4rem; }

  /* Height classes */
  :global(.h-4) { height: 1rem; }
  :global(.h-6) { height: 1.5rem; }
  :global(.h-8) { height: 2rem; }

  /* Thumb sizes */
  :global(.w-3) { width: 0.75rem; }
  :global(.h-3) { height: 0.75rem; }
  :global(.w-4) { width: 1rem; }
  :global(.h-4) { height: 1rem; }
  :global(.w-6) { width: 1.5rem; }
  :global(.h-6) { height: 1.5rem; }
</style>
