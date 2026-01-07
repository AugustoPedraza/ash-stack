<script>
  /**
   * Time Picker Recipe
   * Simple time slot list dropdown (Google Calendar / Calendly style).
   *
   * Uses: Button
   */
  import { Button } from '../../ui';

  // Time state
  let selectedTime = $state('09:00');
  let showTimePicker = $state(false);

  // Duration state
  let selectedDuration = $state(60);
  let showDurationPicker = $state(false);

  // Timezone
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Generate time slots (30-minute intervals)
  const timeSlots = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      const hour24 = h.toString().padStart(2, '0');
      const minute = m.toString().padStart(2, '0');
      const value = `${hour24}:${minute}`;

      const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
      const period = h < 12 ? 'AM' : 'PM';
      const label = `${hour12}:${minute} ${period}`;

      timeSlots.push({ value, label });
    }
  }

  // Duration options
  const durationOptions = [
    { value: 15, label: '15 minutes' },
    { value: 30, label: '30 minutes' },
    { value: 45, label: '45 minutes' },
    { value: 60, label: '1 hour' },
    { value: 90, label: '1.5 hours' },
    { value: 120, label: '2 hours' },
    { value: 180, label: '3 hours' },
    { value: 240, label: '4 hours' }
  ];

  // Format selected time for display
  const formattedTime = $derived(() => {
    const slot = timeSlots.find(s => s.value === selectedTime);
    return slot ? slot.label : selectedTime;
  });

  // Format duration for display
  const formattedDuration = $derived(() => {
    const opt = durationOptions.find(d => d.value === selectedDuration);
    return opt ? opt.label : `${selectedDuration} minutes`;
  });

  // Calculate end time
  const endTime = $derived(() => {
    const [h, m] = selectedTime.split(':').map(Number);
    const totalMinutes = h * 60 + m + selectedDuration;
    const endH = Math.floor(totalMinutes / 60) % 24;
    const endM = totalMinutes % 60;
    const hour12 = endH === 0 ? 12 : endH > 12 ? endH - 12 : endH;
    const period = endH < 12 ? 'AM' : 'PM';
    return `${hour12}:${endM.toString().padStart(2, '0')} ${period}`;
  });

  function selectTime(value) {
    selectedTime = value;
    showTimePicker = false;
  }

  function selectDuration(value) {
    selectedDuration = value;
    showDurationPicker = false;
  }

  function closeTimePicker() {
    showTimePicker = false;
  }

  function closeDurationPicker() {
    showDurationPicker = false;
  }
</script>

<div class="h-full bg-background overflow-y-auto px-5 py-6">
  <div class="max-w-md mx-auto">
    <div class="mb-8">
      <h1 class="text-xl font-semibold text-foreground mb-2">Time Picker</h1>
      <p class="text-muted-foreground text-sm">Select time from a simple list dropdown.</p>
    </div>

    <div class="flex flex-col gap-6">
      <!-- Time Picker -->
      <div class="flex flex-col gap-1.5">
        <span class="text-sm font-medium text-foreground">Start Time</span>
        <div class="relative">
          <button
            type="button"
            class="w-full flex items-center justify-between px-3 py-2.5 border border-border-strong rounded-lg bg-background text-left hover:border-primary transition-colors"
            onclick={() => showTimePicker = true}
          >
            <span class="text-foreground">{formattedTime()}</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>

          <!-- Time Dropdown -->
          {#if showTimePicker}
            <div class="absolute top-full left-0 right-0 mt-1 bg-background border border-border-strong rounded-lg shadow-lg z-20 overflow-hidden">
              <div class="max-h-64 overflow-y-auto">
                {#each timeSlots as slot}
                  <button
                    type="button"
                    class="w-full px-4 py-2.5 text-left text-sm transition-colors
                      {selectedTime === slot.value ? 'bg-primary/10 text-primary font-medium' : 'text-foreground hover:bg-surface-sunken'}"
                    onclick={() => selectTime(slot.value)}
                  >
                    {slot.label}
                  </button>
                {/each}
              </div>
            </div>
          {/if}
        </div>
        <p class="text-xs text-muted-foreground">{userTimezone}</p>
      </div>

      <!-- Duration Picker -->
      <div class="flex flex-col gap-1.5">
        <span class="text-sm font-medium text-foreground">Duration</span>
        <div class="relative">
          <button
            type="button"
            class="w-full flex items-center justify-between px-3 py-2.5 border border-border-strong rounded-lg bg-background text-left hover:border-primary transition-colors"
            onclick={() => showDurationPicker = true}
          >
            <span class="text-foreground">{formattedDuration()}</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-muted-foreground transition-transform {showDurationPicker ? 'rotate-180' : ''}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- Duration Dropdown -->
          {#if showDurationPicker}
            <div class="absolute top-full left-0 right-0 mt-1 bg-background border border-border-strong rounded-lg shadow-lg z-20 overflow-hidden">
              <div class="max-h-64 overflow-y-auto">
                {#each durationOptions as option}
                  <button
                    type="button"
                    class="w-full px-4 py-2.5 text-left text-sm transition-colors
                      {selectedDuration === option.value ? 'bg-primary/10 text-primary font-medium' : 'text-foreground hover:bg-surface-sunken'}"
                    onclick={() => selectDuration(option.value)}
                  >
                    {option.label}
                  </button>
                {/each}
              </div>
            </div>
          {/if}
        </div>
      </div>

      <!-- Quick Duration Presets -->
      <div class="flex flex-col gap-1.5">
        <span class="text-sm font-medium text-foreground">Quick Select</span>
        <div class="flex flex-wrap gap-2">
          {#each [15, 30, 60, 90, 120] as mins}
            {@const label = mins < 60 ? `${mins}m` : mins === 60 ? '1h' : `${mins/60}h`}
            <button
              type="button"
              class="px-3 py-1.5 text-sm rounded-lg border transition-colors
                {selectedDuration === mins
                  ? 'bg-primary text-white border-primary'
                  : 'border-border-strong text-foreground hover:border-primary bg-background'}"
              onclick={() => selectedDuration = mins}
            >
              {label}
            </button>
          {/each}
        </div>
      </div>

      <!-- Summary -->
      <div class="p-4 bg-surface-sunken rounded-lg">
        <h3 class="text-sm font-medium text-foreground mb-3">Summary</h3>
        <div class="flex flex-col gap-2 text-sm">
          <div class="flex justify-between">
            <span class="text-muted-foreground">Start</span>
            <span class="text-foreground font-medium">{formattedTime()}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-muted-foreground">Duration</span>
            <span class="text-foreground font-medium">{formattedDuration()}</span>
          </div>
          <div class="flex justify-between pt-2 border-t border-border">
            <span class="text-muted-foreground">End</span>
            <span class="text-foreground font-medium">{endTime()}</span>
          </div>
        </div>
      </div>

      <!-- Form Values -->
      <div class="p-4 bg-surface-sunken rounded-lg">
        <h3 class="text-sm font-medium text-foreground mb-2">Form Values</h3>
        <pre class="text-xs text-muted-foreground">{JSON.stringify({ time: selectedTime, duration: selectedDuration }, null, 2)}</pre>
      </div>
    </div>
  </div>
</div>

<!-- Click outside handlers -->
{#if showTimePicker}
  <button
    class="fixed inset-0 z-10"
    onclick={closeTimePicker}
    aria-label="Close"
  ></button>
{/if}

{#if showDurationPicker}
  <button
    class="fixed inset-0 z-10"
    onclick={closeDurationPicker}
    aria-label="Close"
  ></button>
{/if}
