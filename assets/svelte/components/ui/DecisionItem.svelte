<!--
  DecisionItem Component
  Displays a decision requiring approval with status, voters, and actions.
  Used in collaboration/meeting contexts.
-->
<script>
  import { createEventDispatcher } from 'svelte';
  import Avatar from './Avatar.svelte';

  const dispatch = createEventDispatcher();

  /** @type {string} - Decision title/question */
  export let title;

  /** @type {string} - Optional description */
  export let description = '';

  /** @type {'pending' | 'approved' | 'rejected' | 'expired'} */
  export let status = 'pending';

  /** @type {Array<{ id: string, name: string, avatar?: string, vote?: 'approve' | 'reject' | null }>} */
  export let voters = [];

  /** @type {Date | string | null} - Deadline for the decision */
  export let deadline = null;

  /** @type {boolean} - Whether current user can vote */
  export let canVote = true;

  /** @type {'approve' | 'reject' | null} - Current user's vote */
  export let currentVote = null;

  /** @type {boolean} - Compact display mode */
  export let compact = false;

  // Count votes
  $: approvedCount = voters.filter(v => v.vote === 'approve').length;
  $: rejectedCount = voters.filter(v => v.vote === 'reject').length;
  $: pendingCount = voters.filter(v => v.vote === null || v.vote === undefined).length;
  $: totalVoters = voters.length;
  $: progressPercent = totalVoters > 0 ? ((approvedCount + rejectedCount) / totalVoters) * 100 : 0;

  // Format deadline
  function formatDeadline(date) {
    if (!date) return null;
    const d = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diff = d.getTime() - now.getTime();

    if (diff < 0) return 'Expired';
    if (diff < 60 * 60 * 1000) {
      const mins = Math.floor(diff / (60 * 1000));
      return `${mins}m left`;
    }
    if (diff < 24 * 60 * 60 * 1000) {
      const hours = Math.floor(diff / (60 * 60 * 1000));
      return `${hours}h left`;
    }
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    return `${days}d left`;
  }

  function handleApprove() {
    if (!canVote || status !== 'pending') return;
    dispatch('vote', { vote: 'approve' });
  }

  function handleReject() {
    if (!canVote || status !== 'pending') return;
    dispatch('vote', { vote: 'reject' });
  }

  function handleClick() {
    dispatch('click');
  }

  $: formattedDeadline = formatDeadline(deadline);
  $: statusColors = {
    pending: 'warning',
    approved: 'success',
    rejected: 'error',
    expired: 'error'
  };
  $: statusLabels = {
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    expired: 'Expired'
  };
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
  class="decision-item"
  class:compact
  class:pending={status === 'pending'}
  class:approved={status === 'approved'}
  class:rejected={status === 'rejected'}
  class:expired={status === 'expired'}
  on:click={handleClick}
  on:keydown={(e) => e.key === 'Enter' && handleClick()}
  role="article"
  tabindex="0"
>
  <div class="decision-header">
    <div class="decision-icon">
      {#if status === 'approved'}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      {:else if status === 'rejected'}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      {:else}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      {/if}
    </div>

    <div class="decision-content">
      <h4 class="decision-title">{title}</h4>
      {#if description && !compact}
        <p class="decision-description">{description}</p>
      {/if}
    </div>

    <div class="decision-meta">
      <span class="status-badge {statusColors[status]}">{statusLabels[status]}</span>
      {#if formattedDeadline && status === 'pending'}
        <span class="deadline">{formattedDeadline}</span>
      {/if}
    </div>
  </div>

  {#if !compact}
    <!-- Progress bar -->
    <div class="decision-progress">
      <div class="progress-bar">
        <div class="progress-approved" style="width: {(approvedCount / totalVoters) * 100}%"></div>
        <div class="progress-rejected" style="width: {(rejectedCount / totalVoters) * 100}%"></div>
      </div>
      <div class="progress-labels">
        <span class="approve-count">{approvedCount} approved</span>
        <span class="pending-count">{pendingCount} pending</span>
        <span class="reject-count">{rejectedCount} rejected</span>
      </div>
    </div>

    <!-- Voters -->
    {#if voters.length > 0}
      <div class="decision-voters">
        <div class="voters-list">
          {#each voters.slice(0, 5) as voter}
            <div class="voter" class:voted={voter.vote !== null}>
              <Avatar
                src={voter.avatar}
                alt={voter.name}
                size="xs"
              />
              {#if voter.vote === 'approve'}
                <span class="vote-indicator approve">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                    <polyline points="20 6 9 17 4 12" stroke="currentColor" stroke-width="3" fill="none" />
                  </svg>
                </span>
              {:else if voter.vote === 'reject'}
                <span class="vote-indicator reject">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                    <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="3" />
                    <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="3" />
                  </svg>
                </span>
              {/if}
            </div>
          {/each}
          {#if voters.length > 5}
            <span class="voters-more">+{voters.length - 5}</span>
          {/if}
        </div>
      </div>
    {/if}

    <!-- Actions -->
    {#if canVote && status === 'pending'}
      <div class="decision-actions">
        <button
          class="vote-btn reject"
          class:active={currentVote === 'reject'}
          on:click|stopPropagation={handleReject}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
          <span>Reject</span>
        </button>
        <button
          class="vote-btn approve"
          class:active={currentVote === 'approve'}
          on:click|stopPropagation={handleApprove}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>Approve</span>
        </button>
      </div>
    {/if}
  {/if}
</div>

<style>
  .decision-item {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    padding: var(--space-4);
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    cursor: pointer;
    transition: all var(--duration-fast) var(--ease-primary);
  }

  .decision-item:hover {
    border-color: var(--color-border-strong);
  }

  .decision-item.compact {
    padding: var(--space-3);
    gap: 0;
  }

  .decision-item.pending {
    border-left: 3px solid var(--color-warning);
  }

  .decision-item.approved {
    border-left: 3px solid var(--color-success);
  }

  .decision-item.rejected,
  .decision-item.expired {
    border-left: 3px solid var(--color-error);
  }

  /* Header */
  .decision-header {
    display: flex;
    align-items: flex-start;
    gap: var(--space-3);
  }

  .decision-icon {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: var(--radius-full);
    background-color: var(--color-surface-sunken);
  }

  .pending .decision-icon {
    color: var(--color-warning);
  }

  .approved .decision-icon {
    color: var(--color-success);
  }

  .rejected .decision-icon,
  .expired .decision-icon {
    color: var(--color-error);
  }

  .decision-content {
    flex: 1;
    min-width: 0;
  }

  .decision-title {
    margin: 0;
    font-size: var(--text-sm);
    font-weight: var(--font-semibold);
    color: var(--color-text);
    line-height: var(--leading-snug);
  }

  .decision-description {
    margin: var(--space-1) 0 0;
    font-size: var(--text-sm);
    color: var(--color-text-muted);
    line-height: var(--leading-relaxed);
  }

  .decision-meta {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: var(--space-1);
    flex-shrink: 0;
  }

  .status-badge {
    font-size: var(--text-xs);
    font-weight: var(--font-medium);
    padding: var(--space-0-5) var(--space-2);
    border-radius: var(--radius-full);
  }

  .status-badge.warning {
    background-color: var(--color-warning-soft);
    color: var(--color-warning);
  }

  .status-badge.success {
    background-color: var(--color-success-soft);
    color: var(--color-success);
  }

  .status-badge.error {
    background-color: var(--color-error-soft);
    color: var(--color-error);
  }

  .deadline {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
  }

  /* Progress */
  .decision-progress {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .progress-bar {
    display: flex;
    height: 4px;
    background-color: var(--color-surface-sunken);
    border-radius: var(--radius-full);
    overflow: hidden;
  }

  .progress-approved {
    background-color: var(--color-success);
    transition: width var(--duration-normal) var(--ease-primary);
  }

  .progress-rejected {
    background-color: var(--color-error);
    transition: width var(--duration-normal) var(--ease-primary);
  }

  .progress-labels {
    display: flex;
    justify-content: space-between;
    font-size: var(--text-xs);
  }

  .approve-count {
    color: var(--color-success);
  }

  .pending-count {
    color: var(--color-text-muted);
  }

  .reject-count {
    color: var(--color-error);
  }

  /* Voters */
  .decision-voters {
    display: flex;
    align-items: center;
  }

  .voters-list {
    display: flex;
    align-items: center;
  }

  .voter {
    position: relative;
    margin-left: -8px;
  }

  .voter:first-child {
    margin-left: 0;
  }

  .vote-indicator {
    position: absolute;
    bottom: -2px;
    right: -2px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 14px;
    height: 14px;
    border-radius: var(--radius-full);
    border: 2px solid var(--color-surface);
  }

  .vote-indicator.approve {
    background-color: var(--color-success);
    color: white;
  }

  .vote-indicator.reject {
    background-color: var(--color-error);
    color: white;
  }

  .voters-more {
    margin-left: var(--space-2);
    font-size: var(--text-xs);
    color: var(--color-text-muted);
  }

  /* Actions */
  .decision-actions {
    display: flex;
    gap: var(--space-2);
    padding-top: var(--space-2);
    border-top: 1px solid var(--color-border);
  }

  .vote-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-3);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: none;
    font-size: var(--text-sm);
    font-weight: var(--font-medium);
    cursor: pointer;
    transition: all var(--duration-fast) var(--ease-primary);
  }

  .vote-btn.reject {
    color: var(--color-text-muted);
  }

  .vote-btn.reject:hover,
  .vote-btn.reject.active {
    background-color: var(--color-error-soft);
    border-color: var(--color-error);
    color: var(--color-error);
  }

  .vote-btn.approve {
    color: var(--color-text-muted);
  }

  .vote-btn.approve:hover,
  .vote-btn.approve.active {
    background-color: var(--color-success-soft);
    border-color: var(--color-success);
    color: var(--color-success);
  }
</style>
