<!--
  ParticipantRow Component
  Horizontal list of participant avatars with status indicators.
  Shows stacked avatars with overflow count.
-->
<script>
  import { createEventDispatcher } from 'svelte';
  import Avatar from './Avatar.svelte';

  const dispatch = createEventDispatcher();

  /** @type {Array<{ id: string, name: string, avatar?: string, status?: 'online' | 'away' | 'busy' | 'offline', role?: string }>} */
  export let participants = [];

  /** @type {number} - Maximum visible avatars before showing count */
  export let maxVisible = 5;

  /** @type {'xs' | 'sm' | 'md'} - Avatar size */
  export let size = 'sm';

  /** @type {boolean} - Stack avatars with overlap */
  export let stacked = true;

  /** @type {boolean} - Show online status indicators */
  export let showStatus = false;

  /** @type {boolean} - Show participant names on hover */
  export let showNames = false;

  /** @type {string | null} - Label text (e.g., "3 participants") */
  export let label = null;

  /** @type {'left' | 'right'} - Label position */
  export let labelPosition = 'right';

  // Calculate visible and overflow
  $: visibleParticipants = participants.slice(0, maxVisible);
  $: overflowCount = Math.max(0, participants.length - maxVisible);
  $: overflowParticipants = participants.slice(maxVisible);

  // Size mappings
  const sizeMap = {
    xs: { avatar: 'xs', overlap: -6, counter: 20 },
    sm: { avatar: 'sm', overlap: -8, counter: 28 },
    md: { avatar: 'md', overlap: -10, counter: 36 }
  };

  function handleParticipantClick(participant) {
    dispatch('participantclick', { participant });
  }

  function handleOverflowClick() {
    dispatch('overflowclick', { participants: overflowParticipants });
  }

  function handleRowClick() {
    dispatch('click', { participants });
  }

  $: sizeConfig = sizeMap[size];
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
  class="participant-row"
  class:with-label={label}
  on:click={handleRowClick}
  on:keydown={(e) => e.key === 'Enter' && handleRowClick()}
  role="group"
  tabindex="0"
>
  {#if label && labelPosition === 'left'}
    <span class="participant-label">{label}</span>
  {/if}

  <div
    class="avatars-container"
    class:stacked
    style={stacked ? `--overlap: ${sizeConfig.overlap}px` : undefined}
  >
    {#each visibleParticipants as participant, i (participant.id)}
      <button
        class="participant-avatar"
        class:stacked
        style={stacked ? `z-index: ${visibleParticipants.length - i}` : undefined}
        on:click|stopPropagation={() => handleParticipantClick(participant)}
        aria-label={participant.name}
        title={showNames ? participant.name : undefined}
      >
        <Avatar
          src={participant.avatar}
          alt={participant.name}
          size={sizeConfig.avatar}
          status={showStatus ? participant.status : undefined}
        />
      </button>
    {/each}

    {#if overflowCount > 0}
      <button
        class="overflow-counter"
        class:stacked
        style="width: {sizeConfig.counter}px; height: {sizeConfig.counter}px"
        on:click|stopPropagation={handleOverflowClick}
        aria-label="{overflowCount} more participants"
        title={overflowParticipants.map(p => p.name).join(', ')}
      >
        +{overflowCount}
      </button>
    {/if}
  </div>

  {#if label && labelPosition === 'right'}
    <span class="participant-label">{label}</span>
  {/if}
</div>

<style>
  .participant-row {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    cursor: pointer;
  }

  .avatars-container {
    display: flex;
    align-items: center;
  }

  .avatars-container:not(.stacked) {
    gap: var(--space-1);
  }

  .avatars-container.stacked .participant-avatar,
  .avatars-container.stacked .overflow-counter {
    margin-left: var(--overlap);
  }

  .avatars-container.stacked .participant-avatar:first-child {
    margin-left: 0;
  }

  .participant-avatar {
    position: relative;
    padding: 0;
    background: none;
    border: 2px solid var(--color-surface);
    border-radius: var(--radius-full);
    cursor: pointer;
    transition: transform var(--duration-fast) var(--ease-primary);
  }

  .participant-avatar:hover {
    transform: scale(1.1);
    z-index: 100 !important;
  }

  .participant-avatar:focus-visible {
    outline: 2px solid var(--color-border-focus);
    outline-offset: 2px;
  }

  .overflow-counter {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--color-surface-sunken);
    border: 2px solid var(--color-surface);
    border-radius: var(--radius-full);
    font-size: var(--text-xs);
    font-weight: var(--font-semibold);
    color: var(--color-text-muted);
    cursor: pointer;
    transition: all var(--duration-fast) var(--ease-primary);
  }

  .overflow-counter:hover {
    background-color: var(--color-surface-raised);
    color: var(--color-text);
    transform: scale(1.1);
  }

  .overflow-counter:focus-visible {
    outline: 2px solid var(--color-border-focus);
    outline-offset: 2px;
  }

  .participant-label {
    font-size: var(--text-sm);
    color: var(--color-text-muted);
    white-space: nowrap;
  }

  .with-label .participant-label {
    margin: 0;
  }
</style>
