<!--
  AnimatedList Component
  List with FLIP animations for add/remove/reorder.
  Items animate smoothly when the list changes.
-->
<script>
  import { flip } from 'svelte/animate';
  import { fade, fly, scale } from 'svelte/transition';
  import { quintOut, backOut } from 'svelte/easing';

  /**
   * List items (must have unique 'id' property)
   * @type {Array<{ id: string | number, [key: string]: any }>}
   */
  export let items = [];

  /**
   * Key function to identify items (default uses 'id')
   * @type {(item: any) => string | number}
   */
  export let key = (item) => item.id;

  /**
   * Animation preset
   * @type {'fade' | 'slide' | 'scale' | 'fly'}
   */
  export let animation = 'slide';

  /**
   * Animation duration in ms
   * @type {number}
   */
  export let duration = 300;

  /**
   * FLIP animation duration in ms
   * @type {number}
   */
  export let flipDuration = 300;

  /**
   * Direction for slide/fly animations
   * @type {'up' | 'down' | 'left' | 'right'}
   */
  export let direction = 'up';

  /**
   * Stagger delay between items (ms)
   * @type {number}
   */
  export let stagger = 0;

  // Direction offsets for fly animation
  const directionOffsets = {
    up: { x: 0, y: 20 },
    down: { x: 0, y: -20 },
    left: { x: 20, y: 0 },
    right: { x: -20, y: 0 }
  };
</script>

<!-- Using separate each blocks for each animation type to satisfy animate directive requirements -->
{#if animation === 'fade'}
  <div class="animated-list">
    {#each items as item, index (key(item))}
      {@const delay = stagger * index}
      <div
        animate:flip={{ duration: flipDuration, easing: quintOut }}
        in:fade={{ duration, delay }}
        out:fade={{ duration: duration * 0.5 }}
        class="animated-list-item"
      >
        <slot {item} {index} />
      </div>
    {/each}
  </div>
{:else if animation === 'scale'}
  <div class="animated-list">
    {#each items as item, index (key(item))}
      {@const delay = stagger * index}
      <div
        animate:flip={{ duration: flipDuration, easing: quintOut }}
        in:scale={{ duration, delay, easing: backOut, start: 0.9 }}
        out:scale={{ duration: duration * 0.5, start: 0.9 }}
        class="animated-list-item"
      >
        <slot {item} {index} />
      </div>
    {/each}
  </div>
{:else if animation === 'fly'}
  <div class="animated-list">
    {#each items as item, index (key(item))}
      {@const delay = stagger * index}
      <div
        animate:flip={{ duration: flipDuration, easing: quintOut }}
        in:fly={{ duration, delay, ...directionOffsets[direction], easing: quintOut }}
        out:fade={{ duration: duration * 0.5 }}
        class="animated-list-item"
      >
        <slot {item} {index} />
      </div>
    {/each}
  </div>
{:else}
  <!-- slide (default) -->
  <div class="animated-list">
    {#each items as item, index (key(item))}
      {@const delay = stagger * index}
      <div
        animate:flip={{ duration: flipDuration, easing: quintOut }}
        in:fly={{ duration, delay, y: direction === 'up' ? 10 : direction === 'down' ? -10 : 0, x: direction === 'left' ? 10 : direction === 'right' ? -10 : 0, easing: quintOut }}
        out:fade={{ duration: duration * 0.5 }}
        class="animated-list-item"
      >
        <slot {item} {index} />
      </div>
    {/each}
  </div>
{/if}

{#if items.length === 0}
  <div in:fade={{ duration: 200, delay: 100 }}>
    <slot name="empty">
      <!-- Default empty state -->
    </slot>
  </div>
{/if}

<style>
  .animated-list {
    display: contents;
  }

  .animated-list-item {
    /* Ensure items can animate properly */
    will-change: transform, opacity;
  }
</style>
