<!--
  RealtimeList Component
  List that auto-syncs with server broadcasts.
  Supports optimistic updates with reconciliation.
-->
<script>
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';
  import { flip } from 'svelte/animate';
  import { fade, fly } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import { createRealtimeStore } from '../../lib/realtime.js';
  import { pushEvent } from '../../lib/liveview.js';

  const dispatch = createEventDispatcher();

  /**
   * Store name - must match server-side broadcasts
   * @type {string}
   */
  export let store;

  /**
   * Initial items
   * @type {Array<{ id: string | number, [key: string]: any }>}
   */
  export let items = [];

  /**
   * Key function to identify items
   * @type {(item: any) => string | number}
   */
  export let getId = (item) => item.id;

  /**
   * Sort function
   * @type {((a: any, b: any) => number) | null}
   */
  export let sort = null;

  /**
   * Animation duration
   * @type {number}
   */
  export let duration = 300;

  /**
   * Show optimistic items differently
   * @type {boolean}
   */
  export let showOptimistic = true;

  /**
   * Enable optimistic add
   * @type {boolean}
   */
  export let optimisticAdd = true;

  /**
   * Event to send for adding items
   * @type {string}
   */
  export let addEvent = 'add';

  /**
   * Event to send for removing items
   * @type {string}
   */
  export let removeEvent = 'remove';

  // Create realtime store
  const realtimeStore = createRealtimeStore(store, items, {
    getId,
    sort
  });

  // Reactive store value
  $: storeItems = $realtimeStore;

  // Update store when items prop changes
  $: if (items && items.length > 0 && storeItems.length === 0) {
    realtimeStore.set(items);
  }

  /**
   * Add an item with optimistic update
   */
  export function add(item) {
    const tempId = `temp_${Date.now()}_${Math.random().toString(36).slice(2)}`;

    if (optimisticAdd) {
      realtimeStore.addOptimistic(tempId, item);
    }

    pushEvent(addEvent, { ...item, temp_id: tempId });
    dispatch('add', { item, tempId });
  }

  /**
   * Remove an item with optimistic update
   */
  export function remove(id) {
    // Optimistically remove
    realtimeStore.remove(id);

    pushEvent(removeEvent, { id });
    dispatch('remove', { id });
  }

  /**
   * Update an item
   */
  export function update(id, changes) {
    realtimeStore.updateItem(id, changes);
    dispatch('update', { id, changes });
  }

  onDestroy(() => {
    realtimeStore.destroy();
  });
</script>

<div class="realtime-list">
  {#each storeItems as item (getId(item))}
    <div
      class="realtime-list-item"
      class:optimistic={showOptimistic && item._optimistic}
      animate:flip={{ duration, easing: quintOut }}
      in:fly={{ y: -20, duration, easing: quintOut }}
      out:fade={{ duration: duration / 2 }}
    >
      <slot {item} {remove} {update} optimistic={item._optimistic || false} />
    </div>
  {/each}

  {#if storeItems.length === 0}
    <div in:fade={{ duration: 150, delay: 100 }}>
      <slot name="empty">
        <!-- Default empty state -->
      </slot>
    </div>
  {/if}
</div>

<style>
  .realtime-list {
    display: contents;
  }

  .realtime-list-item {
    will-change: transform, opacity;
  }

  .realtime-list-item.optimistic {
    opacity: 0.7;
  }
</style>
