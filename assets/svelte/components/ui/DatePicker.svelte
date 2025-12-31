<!--
  DatePicker Component
  Calendar-based date picker with range selection support.
-->
<script>
  import { createEventDispatcher, tick } from 'svelte';
  import { fade, fly } from 'svelte/transition';

  const dispatch = createEventDispatcher();

  /**
   * Selected date (or start date for range)
   * @type {Date | null}
   */
  export let value = null;

  /**
   * End date (for range mode)
   * @type {Date | null}
   */
  export let endValue = null;

  /**
   * Enable range selection
   * @type {boolean}
   */
  export let range = false;

  /**
   * Placeholder text
   * @type {string}
   */
  export let placeholder = 'Select date';

  /**
   * Date format for display
   * @type {string}
   */
  export let format = 'MMM d, yyyy';

  /**
   * Minimum selectable date
   * @type {Date | null}
   */
  export let min = null;

  /**
   * Maximum selectable date
   * @type {Date | null}
   */
  export let max = null;

  /**
   * Disabled dates
   * @type {Array<Date> | ((date: Date) => boolean)}
   */
  export let disabled = [];

  /**
   * Size variant
   * @type {'sm' | 'md' | 'lg'}
   */
  export let size = 'md';

  /**
   * Invalid state
   * @type {boolean}
   */
  export let invalid = false;

  /**
   * First day of week (0 = Sunday, 1 = Monday)
   * @type {number}
   */
  export let firstDayOfWeek = 0;

  /**
   * Show week numbers
   * @type {boolean}
   */
  export let showWeekNumbers = false;

  let open = false;
  let inputEl;
  let viewDate = value || new Date();
  let selecting = 'start'; // 'start' or 'end' for range mode
  let hoverDate = null;

  const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  // Rotate days based on firstDayOfWeek
  $: weekDays = [...DAYS.slice(firstDayOfWeek), ...DAYS.slice(0, firstDayOfWeek)];

  // Calendar grid for current view
  $: calendarDays = generateCalendar(viewDate, firstDayOfWeek);

  function generateCalendar(date, startDay) {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstOfMonth = new Date(year, month, 1);
    const lastOfMonth = new Date(year, month + 1, 0);

    const startOffset = (firstOfMonth.getDay() - startDay + 7) % 7;
    const days = [];

    // Previous month days
    const prevMonth = new Date(year, month, 0);
    for (let i = startOffset - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonth.getDate() - i),
        isCurrentMonth: false
      });
    }

    // Current month days
    for (let i = 1; i <= lastOfMonth.getDate(); i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true
      });
    }

    // Next month days
    const remaining = 42 - days.length; // 6 rows * 7 days
    for (let i = 1; i <= remaining; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false
      });
    }

    // Split into weeks
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    return weeks;
  }

  function getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  }

  function formatDate(date, fmt) {
    if (!date) return '';

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const fullMonths = MONTHS;

    return fmt
      .replace('yyyy', date.getFullYear())
      .replace('MMMM', fullMonths[date.getMonth()])
      .replace('MMM', months[date.getMonth()])
      .replace('MM', String(date.getMonth() + 1).padStart(2, '0'))
      .replace('dd', String(date.getDate()).padStart(2, '0'))
      .replace('d', date.getDate());
  }

  $: displayValue = range
    ? (value && endValue ? `${formatDate(value, format)} - ${formatDate(endValue, format)}` : (value ? formatDate(value, format) : ''))
    : formatDate(value, format);

  function isDateDisabled(date) {
    if (min && date < min) return true;
    if (max && date > max) return true;

    if (typeof disabled === 'function') {
      return disabled(date);
    }

    return disabled.some(d => isSameDay(d, date));
  }

  function isSameDay(a, b) {
    if (!a || !b) return false;
    return a.getDate() === b.getDate() &&
           a.getMonth() === b.getMonth() &&
           a.getFullYear() === b.getFullYear();
  }

  function isInRange(date) {
    if (!range || !value) return false;

    const end = endValue || hoverDate;
    if (!end) return false;

    const start = value < end ? value : end;
    const finish = value < end ? end : value;

    return date > start && date < finish;
  }

  function isRangeStart(date) {
    if (!range || !value) return false;
    return isSameDay(date, value);
  }

  function isRangeEnd(date) {
    if (!range) return false;
    const end = endValue || hoverDate;
    return end && isSameDay(date, end);
  }

  function selectDate(date) {
    if (isDateDisabled(date)) return;

    if (range) {
      if (selecting === 'start' || !value) {
        value = date;
        endValue = null;
        selecting = 'end';
      } else {
        if (date < value) {
          endValue = value;
          value = date;
        } else {
          endValue = date;
        }
        selecting = 'start';
        open = false;
        dispatch('change', { start: value, end: endValue });
      }
    } else {
      value = date;
      open = false;
      dispatch('change', { value });
    }
  }

  function previousMonth() {
    viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
  }

  function nextMonth() {
    viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
  }

  function goToToday() {
    viewDate = new Date();
    if (!range) {
      selectDate(viewDate);
    }
  }

  function clear() {
    value = null;
    endValue = null;
    selecting = 'start';
    dispatch('clear');
  }

  function toggle() {
    open = !open;
    if (open && value) {
      viewDate = new Date(value);
    }
  }

  function handleKeydown(e) {
    if (e.key === 'Escape') {
      open = false;
    }
  }

  function handleClickOutside(e) {
    if (!e.target.closest('.date-picker')) {
      open = false;
    }
  }
</script>

<svelte:window on:click={handleClickOutside} />

<div class="date-picker size-{size}" class:open class:invalid on:keydown={handleKeydown}>
  <button
    type="button"
    class="date-input"
    bind:this={inputEl}
    on:click={toggle}
    aria-haspopup="dialog"
    aria-expanded={open}
  >
    <svg class="calendar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>

    <span class="date-value" class:placeholder={!displayValue}>
      {displayValue || placeholder}
    </span>

    {#if value}
      <button
        type="button"
        class="clear-button"
        on:click|stopPropagation={clear}
        aria-label="Clear date"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
    {/if}
  </button>

  {#if open}
    <div
      class="calendar-popup"
      role="dialog"
      aria-modal="true"
      aria-label="Choose date"
      transition:fly={{ y: -10, duration: 150 }}
    >
      <div class="calendar-header">
        <button type="button" class="nav-button" on:click={previousMonth} aria-label="Previous month">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>

        <span class="month-year">
          {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
        </span>

        <button type="button" class="nav-button" on:click={nextMonth} aria-label="Next month">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>

      <div class="calendar-grid" role="grid">
        <div class="weekdays" role="row">
          {#if showWeekNumbers}
            <span class="weekday week-number-header">#</span>
          {/if}
          {#each weekDays as day}
            <span class="weekday" role="columnheader">{day}</span>
          {/each}
        </div>

        {#each calendarDays as week, weekIndex}
          <div class="week" role="row">
            {#if showWeekNumbers}
              <span class="week-number">{getWeekNumber(week[0].date)}</span>
            {/if}
            {#each week as { date, isCurrentMonth }}
              {@const isDisabled = isDateDisabled(date)}
              {@const isSelected = isSameDay(date, value) || isSameDay(date, endValue)}
              {@const isToday = isSameDay(date, new Date())}
              {@const inRange = isInRange(date)}
              {@const rangeStart = isRangeStart(date)}
              {@const rangeEnd = isRangeEnd(date)}

              <button
                type="button"
                class="day"
                class:other-month={!isCurrentMonth}
                class:today={isToday}
                class:selected={isSelected}
                class:disabled={isDisabled}
                class:in-range={inRange}
                class:range-start={rangeStart}
                class:range-end={rangeEnd}
                disabled={isDisabled}
                on:click={() => selectDate(date)}
                on:mouseenter={() => range && (hoverDate = date)}
                on:mouseleave={() => range && (hoverDate = null)}
                role="gridcell"
                aria-selected={isSelected}
                aria-disabled={isDisabled}
              >
                {date.getDate()}
              </button>
            {/each}
          </div>
        {/each}
      </div>

      <div class="calendar-footer">
        <button type="button" class="today-button" on:click={goToToday}>
          Today
        </button>
      </div>
    </div>
  {/if}
</div>

<style>
  .date-picker {
    position: relative;
    width: 100%;
  }

  .date-input {
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
    width: 100%;
    padding: 0 var(--spacing-3);
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    cursor: pointer;
    text-align: left;
    font-family: inherit;
    transition: border-color 150ms ease, box-shadow 150ms ease;
  }

  .date-input:hover {
    border-color: var(--color-border-strong);
  }

  .date-picker.open .date-input,
  .date-input:focus {
    outline: none;
    border-color: var(--color-border-focus);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 20%, transparent);
  }

  .date-picker.invalid .date-input {
    border-color: var(--color-error);
  }

  /* Sizes */
  .size-sm .date-input { height: 2rem; font-size: 0.875rem; }
  .size-md .date-input { height: 2.5rem; font-size: 0.9375rem; }
  .size-lg .date-input { height: 3rem; font-size: 1rem; }

  .calendar-icon {
    width: 1.25rem;
    height: 1.25rem;
    color: var(--color-text-muted);
    flex-shrink: 0;
  }

  .date-value {
    flex: 1;
    color: var(--color-text);
  }

  .date-value.placeholder {
    color: var(--color-text-muted);
  }

  .clear-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;
    padding: 0;
    background: none;
    border: none;
    border-radius: var(--radius-sm);
    color: var(--color-text-muted);
    cursor: pointer;
  }

  .clear-button:hover {
    color: var(--color-text);
    background-color: var(--color-surface-raised);
  }

  .clear-button svg {
    width: 1rem;
    height: 1rem;
  }

  /* Calendar popup */
  .calendar-popup {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: var(--z-dropdown);
    margin-top: var(--spacing-1);
    padding: var(--spacing-3);
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
  }

  .calendar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--spacing-3);
  }

  .nav-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    padding: 0;
    background: none;
    border: none;
    border-radius: var(--radius-md);
    color: var(--color-text-muted);
    cursor: pointer;
    transition: color 150ms ease, background-color 150ms ease;
  }

  .nav-button:hover {
    color: var(--color-text);
    background-color: var(--color-surface-raised);
  }

  .nav-button svg {
    width: 1.25rem;
    height: 1.25rem;
  }

  .month-year {
    font-weight: 600;
    color: var(--color-text);
  }

  .calendar-grid {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-1);
  }

  .weekdays,
  .week {
    display: flex;
    gap: var(--spacing-1);
  }

  .weekday {
    width: 2.5rem;
    text-align: center;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--color-text-muted);
    text-transform: uppercase;
  }

  .week-number-header,
  .week-number {
    width: 2rem;
    font-size: 0.75rem;
    color: var(--color-text-disabled);
    text-align: center;
  }

  .day {
    width: 2.5rem;
    height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
    border: none;
    border-radius: var(--radius-md);
    background: none;
    color: var(--color-text);
    cursor: pointer;
    transition: background-color 100ms ease;
  }

  .day:hover:not(.disabled) {
    background-color: var(--color-surface-raised);
  }

  .day.other-month {
    color: var(--color-text-disabled);
  }

  .day.today {
    font-weight: 600;
    color: var(--color-primary);
  }

  .day.selected {
    background-color: var(--color-primary);
    color: var(--color-on-primary);
  }

  .day.disabled {
    color: var(--color-text-disabled);
    cursor: not-allowed;
  }

  .day.in-range {
    background-color: color-mix(in srgb, var(--color-primary) 15%, transparent);
    border-radius: 0;
  }

  .day.range-start {
    border-radius: var(--radius-md) 0 0 var(--radius-md);
  }

  .day.range-end {
    border-radius: 0 var(--radius-md) var(--radius-md) 0;
  }

  .day.range-start.range-end {
    border-radius: var(--radius-md);
  }

  .calendar-footer {
    display: flex;
    justify-content: center;
    margin-top: var(--spacing-3);
    padding-top: var(--spacing-3);
    border-top: 1px solid var(--color-border);
  }

  .today-button {
    padding: var(--spacing-1) var(--spacing-3);
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-primary);
    background: none;
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: background-color 150ms ease;
  }

  .today-button:hover {
    background-color: var(--color-surface-raised);
  }
</style>
