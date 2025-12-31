<!--
  DataTable Component
  Responsive data table with sorting, selection, and mobile card view.
-->
<script>
  import { createEventDispatcher } from 'svelte';
  import { flip } from 'svelte/animate';
  import { fade } from 'svelte/transition';
  import Checkbox from './Checkbox.svelte';
  import Skeleton from './Skeleton.svelte';
  import { haptic, HapticType } from '../../lib/mobile.js';

  const dispatch = createEventDispatcher();

  /**
   * Column definitions
   * @type {Array<{
   *   key: string,
   *   label: string,
   *   sortable?: boolean,
   *   width?: string,
   *   align?: 'left' | 'center' | 'right',
   *   hidden?: boolean,
   *   primary?: boolean
   * }>}
   */
  export let columns = [];

  /**
   * Data rows (must have unique 'id' property)
   * @type {Array<{ id: string | number, [key: string]: any }>}
   */
  export let data = [];

  /** @type {boolean} - Enable row selection */
  export let selectable = false;

  /** @type {Array<string | number>} - Selected row ids */
  export let selected = [];

  /** @type {string | null} - Current sort column */
  export let sortBy = null;

  /** @type {'asc' | 'desc'} - Sort direction */
  export let sortDirection = 'asc';

  /** @type {boolean} - Loading state */
  export let loading = false;

  /** @type {number} - Number of skeleton rows when loading */
  export let skeletonRows = 5;

  /** @type {boolean} - Striped rows */
  export let striped = false;

  /** @type {boolean} - Hoverable rows */
  export let hoverable = true;

  /** @type {boolean} - Use card layout on mobile */
  export let mobileCards = true;

  // Derived state
  $: allSelected = data.length > 0 && selected.length === data.length;
  $: someSelected = selected.length > 0 && selected.length < data.length;
  $: visibleColumns = columns.filter(col => !col.hidden);
  $: primaryColumn = columns.find(col => col.primary) || columns[0];

  function toggleSort(column) {
    if (!column.sortable) return;

    haptic(HapticType.LIGHT);

    if (sortBy === column.key) {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      sortBy = column.key;
      sortDirection = 'asc';
    }

    dispatch('sort', { column: sortBy, direction: sortDirection });
  }

  function toggleSelectAll() {
    haptic(HapticType.SELECTION);

    if (allSelected) {
      selected = [];
    } else {
      selected = data.map(row => row.id);
    }

    dispatch('selectionChange', { selected });
  }

  function toggleSelectRow(rowId) {
    haptic(HapticType.SELECTION);

    if (selected.includes(rowId)) {
      selected = selected.filter(id => id !== rowId);
    } else {
      selected = [...selected, rowId];
    }

    dispatch('selectionChange', { selected });
  }

  function handleRowClick(row) {
    dispatch('rowClick', { row });
  }

  function getCellValue(row, key) {
    return key.split('.').reduce((obj, k) => obj?.[k], row);
  }
</script>

<!-- Desktop table view -->
<div class="table-container" class:mobile-cards={mobileCards}>
  <table class="data-table" class:striped class:hoverable>
    <thead>
      <tr>
        {#if selectable}
          <th class="select-cell">
            <Checkbox
              checked={allSelected}
              indeterminate={someSelected}
              on:change={toggleSelectAll}
              aria-label="Select all rows"
            />
          </th>
        {/if}

        {#each visibleColumns as column (column.key)}
          <th
            class:sortable={column.sortable}
            class:sorted={sortBy === column.key}
            style={column.width ? `width: ${column.width}` : ''}
            on:click={() => toggleSort(column)}
            on:keydown={(e) => e.key === 'Enter' && toggleSort(column)}
            role={column.sortable ? 'button' : undefined}
            tabindex={column.sortable ? 0 : undefined}
          >
            <div class="th-content" class:align-center={column.align === 'center'} class:align-right={column.align === 'right'}>
              <span>{column.label}</span>
              {#if column.sortable}
                <span class="sort-icon" class:active={sortBy === column.key}>
                  {#if sortBy === column.key}
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      {#if sortDirection === 'asc'}
                        <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
                      {:else}
                        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                      {/if}
                    </svg>
                  {:else}
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  {/if}
                </span>
              {/if}
            </div>
          </th>
        {/each}
      </tr>
    </thead>

    <tbody>
      {#if loading}
        {#each Array(skeletonRows) as _, i}
          <tr>
            {#if selectable}
              <td class="select-cell">
                <Skeleton variant="rect" width="18px" height="18px" />
              </td>
            {/if}
            {#each visibleColumns as column}
              <td>
                <Skeleton variant="text" width={column.width || '80%'} />
              </td>
            {/each}
          </tr>
        {/each}
      {:else}
        {#each data as row (row.id)}
          <tr
            class:selected={selected.includes(row.id)}
            on:click={() => handleRowClick(row)}
            on:keydown={(e) => e.key === 'Enter' && handleRowClick(row)}
            tabindex="0"
            animate:flip={{ duration: 200 }}
          >
            {#if selectable}
              <td class="select-cell" on:click|stopPropagation>
                <Checkbox
                  checked={selected.includes(row.id)}
                  on:change={() => toggleSelectRow(row.id)}
                  aria-label={`Select row ${row.id}`}
                />
              </td>
            {/if}

            {#each visibleColumns as column}
              <td
                class:align-center={column.align === 'center'}
                class:align-right={column.align === 'right'}
                data-label={column.label}
              >
                <slot name="cell" {row} {column} value={getCellValue(row, column.key)}>
                  {getCellValue(row, column.key) ?? '—'}
                </slot>
              </td>
            {/each}
          </tr>
        {/each}
      {/if}
    </tbody>
  </table>

  <!-- Mobile card view -->
  {#if mobileCards}
    <div class="mobile-cards-container">
      {#if loading}
        {#each Array(skeletonRows) as _, i}
          <div class="mobile-card">
            <Skeleton variant="card" height="80px" />
          </div>
        {/each}
      {:else}
        {#each data as row (row.id)}
          <div
            class="mobile-card"
            class:selected={selected.includes(row.id)}
            on:click={() => handleRowClick(row)}
            on:keydown={(e) => e.key === 'Enter' && handleRowClick(row)}
            tabindex="0"
            animate:flip={{ duration: 200 }}
          >
            <div class="mobile-card-header">
              {#if selectable}
                <div on:click|stopPropagation>
                  <Checkbox
                    checked={selected.includes(row.id)}
                    on:change={() => toggleSelectRow(row.id)}
                  />
                </div>
              {/if}
              <div class="mobile-card-primary">
                <slot name="cell" {row} column={primaryColumn} value={getCellValue(row, primaryColumn.key)}>
                  {getCellValue(row, primaryColumn.key) ?? '—'}
                </slot>
              </div>
            </div>

            <div class="mobile-card-fields">
              {#each visibleColumns.filter(c => c !== primaryColumn) as column}
                <div class="mobile-card-field">
                  <span class="mobile-card-label">{column.label}</span>
                  <span class="mobile-card-value">
                    <slot name="cell" {row} {column} value={getCellValue(row, column.key)}>
                      {getCellValue(row, column.key) ?? '—'}
                    </slot>
                  </span>
                </div>
              {/each}
            </div>
          </div>
        {/each}
      {/if}
    </div>
  {/if}
</div>

<!-- Empty state -->
{#if !loading && data.length === 0}
  <div class="empty-state" in:fade={{ duration: 150 }}>
    <slot name="empty">
      <p>No data available</p>
    </slot>
  </div>
{/if}

<style>
  .table-container {
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .data-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.875rem;
  }

  thead {
    background-color: var(--color-surface-sunken);
    border-bottom: 1px solid var(--color-border);
  }

  th {
    padding: var(--spacing-3) var(--spacing-4);
    font-weight: 600;
    color: var(--color-text-secondary);
    text-align: left;
    white-space: nowrap;
    user-select: none;
  }

  th.sortable {
    cursor: pointer;
  }

  th.sortable:hover {
    color: var(--color-text);
  }

  th.sorted {
    color: var(--color-primary);
  }

  .th-content {
    display: flex;
    align-items: center;
    gap: var(--spacing-1);
  }

  .th-content.align-center {
    justify-content: center;
  }

  .th-content.align-right {
    justify-content: flex-end;
  }

  .sort-icon {
    width: 1rem;
    height: 1rem;
    opacity: 0.3;
    transition: opacity 150ms ease;
  }

  .sort-icon.active {
    opacity: 1;
  }

  .sort-icon svg {
    width: 100%;
    height: 100%;
  }

  tbody tr {
    border-bottom: 1px solid var(--color-border);
    transition: background-color 100ms ease;
  }

  .data-table.striped tbody tr:nth-child(even) {
    background-color: var(--color-surface-sunken);
  }

  .data-table.hoverable tbody tr:hover {
    background-color: var(--color-surface-raised);
  }

  tbody tr.selected {
    background-color: var(--color-primary-soft, rgba(var(--color-primary-rgb), 0.1));
  }

  tbody tr:focus-visible {
    outline: 2px solid var(--color-border-focus);
    outline-offset: -2px;
  }

  td {
    padding: var(--spacing-3) var(--spacing-4);
    color: var(--color-text);
    vertical-align: middle;
  }

  td.align-center {
    text-align: center;
  }

  td.align-right {
    text-align: right;
  }

  .select-cell {
    width: 48px;
    padding-right: 0;
  }

  .empty-state {
    padding: var(--spacing-12) var(--spacing-4);
    text-align: center;
    color: var(--color-text-muted);
  }

  /* Mobile cards (hidden by default on desktop) */
  .mobile-cards-container {
    display: none;
  }

  /* Mobile responsive */
  @media (max-width: 768px) {
    .table-container.mobile-cards .data-table {
      display: none;
    }

    .table-container.mobile-cards .mobile-cards-container {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-3);
    }

    .mobile-card {
      padding: var(--spacing-4);
      background-color: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      cursor: pointer;
      transition: background-color 100ms ease, border-color 100ms ease;
    }

    .mobile-card:active {
      background-color: var(--color-surface-sunken);
    }

    .mobile-card.selected {
      border-color: var(--color-primary);
      background-color: var(--color-primary-soft, rgba(var(--color-primary-rgb), 0.05));
    }

    .mobile-card-header {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
      margin-bottom: var(--spacing-3);
    }

    .mobile-card-primary {
      flex: 1;
      font-weight: 600;
      color: var(--color-text);
    }

    .mobile-card-fields {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--spacing-2) var(--spacing-4);
    }

    .mobile-card-field {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-0-5);
    }

    .mobile-card-label {
      font-size: 0.75rem;
      color: var(--color-text-muted);
    }

    .mobile-card-value {
      font-size: 0.875rem;
      color: var(--color-text);
    }
  }
</style>
