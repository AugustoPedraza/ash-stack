<script>
  /**
   * Date Picker Recipe
   * Single date, date range, min/max constraints, disabled dates.
   *
   * Uses: Button
   */
  import { Button } from '../../ui';

  // State for different picker modes
  let singleDate = $state(null);
  let rangeStart = $state(null);
  let rangeEnd = $state(null);
  let showSinglePicker = $state(false);
  let showRangePicker = $state(false);
  let pickerMonth = $state(new Date().getMonth());
  let pickerYear = $state(new Date().getFullYear());
  let selectingEnd = $state(false);

  // Temp selection (before confirming with Done)
  let tempSingleDate = $state(null);
  let tempRangeStart = $state(null);
  let tempRangeEnd = $state(null);

  // Min/max constraints (past 1 year to future 1 year)
  const today = new Date();
  const minDate = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
  const maxDate = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());

  // Disabled dates (weekends for demo)
  function isWeekend(date) {
    const day = date.getDay();
    return day === 0 || day === 6;
  }

  function isDisabled(date) {
    return isWeekend(date) || isOutOfBounds(date);
  }

  function isInRange(date) {
    if (!tempRangeStart || !tempRangeEnd) return false;
    return date >= tempRangeStart && date <= tempRangeEnd;
  }

  function isRangeStart(date) {
    if (!tempRangeStart) return false;
    return isSameDay(date, tempRangeStart);
  }

  function isRangeEnd(date) {
    if (!tempRangeEnd) return false;
    return isSameDay(date, tempRangeEnd);
  }

  function isSameDay(a, b) {
    if (!a || !b) return false;
    return a.getFullYear() === b.getFullYear() &&
           a.getMonth() === b.getMonth() &&
           a.getDate() === b.getDate();
  }

  function isToday(date) {
    return isSameDay(date, today);
  }

  function isSelected(date) {
    return isSameDay(date, tempSingleDate);
  }

  function isOutOfBounds(date) {
    return date < minDate || date > maxDate;
  }

  // Calendar generation
  const calendarDays = $derived.by(() => {
    const firstDay = new Date(pickerYear, pickerMonth, 1);
    const lastDay = new Date(pickerYear, pickerMonth + 1, 0);
    const startOffset = firstDay.getDay();
    const days = [];

    // Previous month filler days
    for (let i = startOffset - 1; i >= 0; i--) {
      const d = new Date(pickerYear, pickerMonth, -i);
      days.push({ date: d, isCurrentMonth: false });
    }

    // Current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const d = new Date(pickerYear, pickerMonth, i);
      days.push({ date: d, isCurrentMonth: true });
    }

    // Next month filler days (to complete 6 rows)
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(pickerYear, pickerMonth + 1, i);
      days.push({ date: d, isCurrentMonth: false });
    }

    return days;
  });

  const monthName = $derived(
    new Date(pickerYear, pickerMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  );

  function prevMonth() {
    if (pickerMonth === 0) {
      pickerMonth = 11;
      pickerYear--;
    } else {
      pickerMonth--;
    }
  }

  function nextMonth() {
    if (pickerMonth === 11) {
      pickerMonth = 0;
      pickerYear++;
    } else {
      pickerMonth++;
    }
  }

  function selectSingleDate(date) {
    if (isDisabled(date)) return;
    tempSingleDate = date;
  }

  function selectRangeDate(date) {
    if (isDisabled(date)) return;

    if (!selectingEnd) {
      tempRangeStart = date;
      tempRangeEnd = null;
      selectingEnd = true;
    } else {
      if (date < tempRangeStart) {
        tempRangeEnd = tempRangeStart;
        tempRangeStart = date;
      } else {
        tempRangeEnd = date;
      }
      selectingEnd = false;
    }
  }

  function formatDate(date) {
    if (!date) return '';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function openSinglePicker() {
    if (singleDate) {
      pickerMonth = singleDate.getMonth();
      pickerYear = singleDate.getFullYear();
      tempSingleDate = singleDate;
    } else {
      pickerMonth = today.getMonth();
      pickerYear = today.getFullYear();
      tempSingleDate = null;
    }
    showSinglePicker = true;
  }

  function openRangePicker() {
    if (rangeStart) {
      pickerMonth = rangeStart.getMonth();
      pickerYear = rangeStart.getFullYear();
      tempRangeStart = rangeStart;
      tempRangeEnd = rangeEnd;
    } else {
      pickerMonth = today.getMonth();
      pickerYear = today.getFullYear();
      tempRangeStart = null;
      tempRangeEnd = null;
    }
    selectingEnd = false;
    showRangePicker = true;
  }

  function confirmSingleDate() {
    singleDate = tempSingleDate;
    showSinglePicker = false;
  }

  function confirmRangeDate() {
    rangeStart = tempRangeStart;
    rangeEnd = tempRangeEnd;
    showRangePicker = false;
    selectingEnd = false;
  }

  function cancelSinglePicker() {
    tempSingleDate = null;
    showSinglePicker = false;
  }

  function cancelRangePicker() {
    tempRangeStart = null;
    tempRangeEnd = null;
    selectingEnd = false;
    showRangePicker = false;
  }

  function clearSingle() {
    singleDate = null;
  }

  function clearTempSingle() {
    tempSingleDate = null;
  }

  function clearRange() {
    rangeStart = null;
    rangeEnd = null;
  }

  function clearTempRange() {
    tempRangeStart = null;
    tempRangeEnd = null;
    selectingEnd = false;
  }

  function selectToday() {
    if (!isDisabled(today)) {
      tempSingleDate = today;
    }
  }
</script>

<div class="h-full bg-surface overflow-y-auto px-5 py-6">
  <div class="max-w-md mx-auto">
    <div class="mb-8">
      <h1 class="text-xl font-semibold text-text mb-2">Date Picker</h1>
      <p class="text-text-muted text-sm">Single date and date range selection with constraints.</p>
    </div>

    <div class="flex flex-col gap-6">
      <!-- Single Date Picker -->
      <div class="flex flex-col gap-1.5">
        <span class="text-sm font-medium text-text">Select Date</span>
        <div class="relative">
          <button
            type="button"
            class="w-full flex items-center justify-between px-3 py-2.5 border border-border-strong rounded-lg bg-surface text-left hover:border-primary transition-colors"
            onclick={openSinglePicker}
          >
            <span class="{singleDate ? 'text-text' : 'text-text-muted'}">
              {singleDate ? formatDate(singleDate) : 'Choose a date'}
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
          {#if singleDate}
            <button
              type="button"
              class="absolute right-10 top-1/2 -translate-y-1/2 p-1 hover:bg-surface-sunken rounded"
              onclick={clearSingle}
              aria-label="Clear date"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          {/if}
        </div>
        <p class="text-xs text-text-muted">Weekends are unavailable in this demo.</p>
      </div>

      <!-- Date Range Picker -->
      <div class="flex flex-col gap-1.5">
        <span class="text-sm font-medium text-text">Select Date Range</span>
        <button
          type="button"
          class="w-full flex items-center justify-between px-3 py-2.5 border border-border-strong rounded-lg bg-surface text-left hover:border-primary transition-colors"
          onclick={openRangePicker}
        >
          <span class="{rangeStart ? 'text-text' : 'text-text-muted'}">
            {#if rangeStart && rangeEnd}
              {formatDate(rangeStart)} - {formatDate(rangeEnd)}
            {:else if rangeStart}
              {formatDate(rangeStart)} - Select end date
            {:else}
              Choose start and end dates
            {/if}
          </span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
        {#if rangeStart}
          <button
            type="button"
            class="text-xs text-text-muted hover:text-text self-start"
            onclick={clearRange}
          >
            Clear selection
          </button>
        {/if}
      </div>

      <!-- Selected Values Display -->
      {#if singleDate || (rangeStart && rangeEnd)}
        <div class="p-4 bg-surface-sunken rounded-lg">
          <h3 class="text-sm font-medium text-text mb-2">Selected Values</h3>
          {#if singleDate}
            <p class="text-sm text-text-secondary">
              <span class="font-medium">Single:</span> {singleDate.toISOString().split('T')[0]}
            </p>
          {/if}
          {#if rangeStart && rangeEnd}
            <p class="text-sm text-text-secondary">
              <span class="font-medium">Range:</span> {rangeStart.toISOString().split('T')[0]} to {rangeEnd.toISOString().split('T')[0]}
            </p>
          {/if}
        </div>
      {/if}
    </div>
  </div>
</div>

<!-- Single Date Picker Modal -->
{#if showSinglePicker}
  <div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
    <button
      class="absolute inset-0 bg-black/50"
      onclick={cancelSinglePicker}
      aria-label="Close"
    ></button>
    <div class="relative bg-surface rounded-t-2xl sm:rounded-xl shadow-xl w-full max-w-sm p-5">
      <!-- Calendar Header -->
      <div class="flex items-center justify-between mb-4">
        <button
          type="button"
          class="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-sunken transition-colors"
          onclick={prevMonth}
          aria-label="Previous month"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span class="font-semibold text-text">{monthName}</span>
        <button
          type="button"
          class="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-sunken transition-colors"
          onclick={nextMonth}
          aria-label="Next month"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <!-- Weekday Headers -->
      <div class="grid grid-cols-7 mb-1">
        {#each ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as day, i}
          <div class="text-center text-xs font-medium py-2 {i === 0 || i === 6 ? 'text-text-disabled' : 'text-text-muted'}">{day}</div>
        {/each}
      </div>

      <!-- Calendar Grid -->
      <div class="grid grid-cols-7">
        {#each calendarDays as { date, isCurrentMonth }}
          {@const weekend = isWeekend(date)}
          {@const outOfBounds = isOutOfBounds(date)}
          {@const disabled = weekend || outOfBounds}
          {@const selected = isSelected(date)}
          {@const todayDate = isToday(date)}
          <div class="flex items-center justify-center p-1">
            <button
              type="button"
              class="w-8 h-8 flex items-center justify-center text-sm rounded-full transition-colors
                {!isCurrentMonth ? 'text-text-disabled' : ''}
                {isCurrentMonth && weekend && !outOfBounds ? 'text-text-disabled' : ''}
                {outOfBounds ? 'text-text-disabled' : ''}
                {isCurrentMonth && !disabled && !selected ? 'text-text hover:bg-surface-sunken' : ''}
                {selected ? 'bg-primary text-white' : ''}
                {todayDate && !selected ? 'font-medium text-primary ring-1 ring-primary' : ''}"
              onclick={() => selectSingleDate(date)}
              disabled={disabled}
            >
              {date.getDate()}
            </button>
          </div>
        {/each}
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between mt-5 pt-4 border-t border-border">
        <div class="flex items-center gap-4">
          <button
            type="button"
            class="text-sm text-text-muted hover:text-text transition-colors"
            onclick={selectToday}
          >
            Today
          </button>
          {#if tempSingleDate}
            <button
              type="button"
              class="text-sm text-text-muted hover:text-text transition-colors"
              onclick={clearTempSingle}
            >
              Clear
            </button>
          {/if}
        </div>
        <div class="flex items-center gap-2">
          <Button variant="ghost" size="sm" onclick={cancelSinglePicker}>
            Cancel
          </Button>
          <Button variant="ghost" size="sm" onclick={confirmSingleDate}>
            Done
          </Button>
        </div>
      </div>
    </div>
  </div>
{/if}

<!-- Range Picker Modal -->
{#if showRangePicker}
  <div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
    <button
      class="absolute inset-0 bg-black/50"
      onclick={cancelRangePicker}
      aria-label="Close"
    ></button>
    <div class="relative bg-surface rounded-t-2xl sm:rounded-xl shadow-xl w-full max-w-sm p-5">
      <!-- Header with instructions -->
      <div class="mb-4 text-center">
        <span class="text-sm text-text-secondary">
          {#if !tempRangeStart}
            Select start date
          {:else if !tempRangeEnd}
            Select end date
          {:else}
            {formatDate(tempRangeStart)} - {formatDate(tempRangeEnd)}
          {/if}
        </span>
      </div>

      <!-- Calendar Header -->
      <div class="flex items-center justify-between mb-4">
        <button
          type="button"
          class="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-sunken transition-colors"
          onclick={prevMonth}
          aria-label="Previous month"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span class="font-semibold text-text">{monthName}</span>
        <button
          type="button"
          class="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-sunken transition-colors"
          onclick={nextMonth}
          aria-label="Next month"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <!-- Weekday Headers -->
      <div class="grid grid-cols-7 mb-1">
        {#each ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as day, i}
          <div class="text-center text-xs font-medium py-2 {i === 0 || i === 6 ? 'text-text-disabled' : 'text-text-muted'}">{day}</div>
        {/each}
      </div>

      <!-- Calendar Grid -->
      <div class="grid grid-cols-7">
        {#each calendarDays as { date, isCurrentMonth }}
          {@const weekend = isWeekend(date)}
          {@const outOfBounds = isOutOfBounds(date)}
          {@const disabled = weekend || outOfBounds}
          {@const inRange = isInRange(date)}
          {@const start = isRangeStart(date)}
          {@const end = isRangeEnd(date)}
          {@const todayDate = isToday(date)}
          <div class="flex items-center justify-center p-0.5 {inRange && !start && !end ? 'bg-primary/10' : ''} {start ? 'bg-gradient-to-r from-transparent to-primary/10 rounded-l-full' : ''} {end ? 'bg-gradient-to-l from-transparent to-primary/10 rounded-r-full' : ''}">
            <button
              type="button"
              class="w-8 h-8 flex items-center justify-center text-sm rounded-full transition-colors
                {!isCurrentMonth ? 'text-text-disabled' : ''}
                {isCurrentMonth && weekend && !outOfBounds ? 'text-text-disabled' : ''}
                {outOfBounds ? 'text-text-disabled' : ''}
                {isCurrentMonth && !disabled && !start && !end ? 'text-text hover:bg-surface-sunken' : ''}
                {start || end ? 'bg-primary text-white' : ''}
                {todayDate && !start && !end ? 'font-medium text-primary ring-1 ring-primary' : ''}"
              onclick={() => selectRangeDate(date)}
              disabled={disabled}
            >
              {date.getDate()}
            </button>
          </div>
        {/each}
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between mt-5 pt-4 border-t border-border">
        <div>
          {#if tempRangeStart}
            <button
              type="button"
              class="text-sm text-text-muted hover:text-text transition-colors"
              onclick={clearTempRange}
            >
              Clear
            </button>
          {/if}
        </div>
        <div class="flex items-center gap-2">
          <Button variant="ghost" size="sm" onclick={cancelRangePicker}>
            Cancel
          </Button>
          <Button variant="ghost" size="sm" onclick={confirmRangeDate} disabled={!tempRangeStart || !tempRangeEnd}>
            Done
          </Button>
        </div>
      </div>
    </div>
  </div>
{/if}
