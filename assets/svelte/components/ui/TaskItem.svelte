<!--
  TaskItem Component
  Inline task with checkbox, title, due date, and assignee.
  Can be embedded in messages or standalone.
-->
<script>
  import { createEventDispatcher } from 'svelte';
  import Avatar from './Avatar.svelte';

  const dispatch = createEventDispatcher();

  /** @type {string} - Task title */
  export let title;

  /** @type {boolean} - Whether the task is completed */
  export let completed = false;

  /** @type {{ id: string, name: string, avatar?: string } | null} - Assigned user */
  export let assignee = null;

  /** @type {Date | string | null} - Due date */
  export let dueDate = null;

  /** @type {'low' | 'medium' | 'high' | 'urgent'} - Priority level */
  export let priority = 'medium';

  /** @type {string} - Optional description */
  export let description = '';

  /** @type {boolean} - Whether the task can be edited */
  export let editable = true;

  /** @type {boolean} - Compact display mode */
  export let compact = false;

  /** @type {Array<string>} - Tags/labels */
  export let tags = [];

  // Format due date
  function formatDueDate(date) {
    if (!date) return null;
    const d = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dueDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());

    if (dueDay.getTime() === today.getTime()) return 'Today';
    if (dueDay.getTime() === tomorrow.getTime()) return 'Tomorrow';
    if (dueDay < today) return 'Overdue';

    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }

  function isOverdue(date) {
    if (!date || completed) return false;
    const d = typeof date === 'string' ? new Date(date) : date;
    return d < new Date();
  }

  function handleToggle() {
    if (!editable) return;
    dispatch('toggle', { completed: !completed });
  }

  function handleClick() {
    dispatch('click');
  }

  function handleAssigneeClick(e) {
    e.stopPropagation();
    dispatch('assigneeclick', { assignee });
  }

  $: formattedDueDate = formatDueDate(dueDate);
  $: overdue = isOverdue(dueDate);
  $: priorityColors = {
    low: 'text-muted',
    medium: 'info',
    high: 'warning',
    urgent: 'error'
  };
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
  class="task-item"
  class:completed
  class:compact
  class:overdue
  on:click={handleClick}
  on:keydown={(e) => e.key === 'Enter' && handleClick()}
  role="article"
  tabindex="0"
>
  <button
    class="task-checkbox"
    class:checked={completed}
    on:click|stopPropagation={handleToggle}
    disabled={!editable}
    aria-label={completed ? 'Mark as incomplete' : 'Mark as complete'}
  >
    {#if completed}
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    {/if}
  </button>

  <div class="task-content">
    <div class="task-main">
      <span class="task-title" class:strikethrough={completed}>{title}</span>

      {#if !compact && description}
        <p class="task-description">{description}</p>
      {/if}

      {#if tags.length > 0 && !compact}
        <div class="task-tags">
          {#each tags as tag}
            <span class="task-tag">{tag}</span>
          {/each}
        </div>
      {/if}
    </div>

    <div class="task-meta">
      {#if priority !== 'medium' && !compact}
        <span class="priority-indicator {priorityColors[priority]}">
          {#if priority === 'urgent'}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 19h20L12 2zm0 3l7.5 13h-15L12 5z" />
              <circle cx="12" cy="16" r="1" />
              <rect x="11" y="10" width="2" height="4" />
            </svg>
          {:else if priority === 'high'}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 14l5-5 5 5H7z" />
            </svg>
          {:else if priority === 'low'}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 10l5 5 5-5H7z" />
            </svg>
          {/if}
        </span>
      {/if}

      {#if formattedDueDate}
        <span class="task-due" class:overdue>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span>{formattedDueDate}</span>
        </span>
      {/if}

      {#if assignee}
        <button class="task-assignee" on:click={handleAssigneeClick} aria-label="View assignee">
          <Avatar
            src={assignee.avatar}
            alt={assignee.name}
            size="xs"
          />
          {#if !compact}
            <span class="assignee-name">{assignee.name}</span>
          {/if}
        </button>
      {/if}
    </div>
  </div>
</div>

<style>
  .task-item {
    display: flex;
    align-items: flex-start;
    gap: var(--space-3);
    padding: var(--space-3) var(--space-4);
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    cursor: pointer;
    transition: all var(--duration-fast) var(--ease-primary);
  }

  .task-item:hover {
    border-color: var(--color-border-strong);
  }

  .task-item.compact {
    padding: var(--space-2) var(--space-3);
  }

  .task-item.completed {
    opacity: 0.7;
  }

  .task-item.overdue:not(.completed) {
    border-left: 3px solid var(--color-error);
  }

  /* Checkbox */
  .task-checkbox {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    margin-top: 2px;
    border: 2px solid var(--color-border-strong);
    border-radius: var(--radius-sm);
    background: none;
    cursor: pointer;
    transition: all var(--duration-fast) var(--ease-primary);
  }

  .task-checkbox:hover:not(:disabled) {
    border-color: var(--color-primary);
  }

  .task-checkbox:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .task-checkbox.checked {
    background-color: var(--color-primary);
    border-color: var(--color-primary);
    color: var(--color-on-primary);
  }

  /* Content */
  .task-content {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .task-main {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .task-title {
    font-size: var(--text-sm);
    font-weight: var(--font-medium);
    color: var(--color-text);
    line-height: var(--leading-snug);
  }

  .task-title.strikethrough {
    text-decoration: line-through;
    color: var(--color-text-muted);
  }

  .task-description {
    margin: 0;
    font-size: var(--text-xs);
    color: var(--color-text-muted);
    line-height: var(--leading-relaxed);
  }

  .task-tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-1);
  }

  .task-tag {
    font-size: var(--text-xs);
    padding: var(--space-0-5) var(--space-2);
    background-color: var(--color-surface-sunken);
    border-radius: var(--radius-full);
    color: var(--color-text-muted);
  }

  /* Meta */
  .task-meta {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    flex-wrap: wrap;
  }

  .priority-indicator {
    display: flex;
    align-items: center;
  }

  .priority-indicator.text-muted {
    color: var(--color-text-muted);
  }

  .priority-indicator.info {
    color: var(--color-info);
  }

  .priority-indicator.warning {
    color: var(--color-warning);
  }

  .priority-indicator.error {
    color: var(--color-error);
  }

  .task-due {
    display: flex;
    align-items: center;
    gap: var(--space-1);
    font-size: var(--text-xs);
    color: var(--color-text-muted);
  }

  .task-due.overdue {
    color: var(--color-error);
  }

  .task-assignee {
    display: flex;
    align-items: center;
    gap: var(--space-1);
    padding: 0;
    background: none;
    border: none;
    cursor: pointer;
    border-radius: var(--radius-full);
    transition: opacity var(--duration-fast) var(--ease-primary);
  }

  .task-assignee:hover {
    opacity: 0.8;
  }

  .assignee-name {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
  }

  /* Mobile */
  @media (max-width: 640px) {
    .task-meta {
      gap: var(--space-2);
    }

    .assignee-name {
      display: none;
    }
  }
</style>
