<!--
  ConnectionStatus Component
  Shows LiveView connection state with reconnection UI.
  Useful for real-time apps where connection awareness matters.
-->
<script>
  import { onMount, onDestroy } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { getLiveSocket } from '../../lib/liveview.js';
  import { connectionState, updateConnectionState } from '../../lib/debug.js';

  /**
   * Position of the indicator
   * @type {'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'inline'}
   */
  export let position = 'bottom-right';

  /**
   * Show indicator only when disconnected
   * @type {boolean}
   */
  export let showOnlyWhenDisconnected = true;

  /**
   * Auto-hide connected indicator after ms (0 = never)
   * @type {number}
   */
  export let autoHideDelay = 3000;

  /**
   * Show reconnect button
   * @type {boolean}
   */
  export let showReconnectButton = true;

  /**
   * Custom messages
   * @type {{ connecting?: string, connected?: string, disconnected?: string, error?: string }}
   */
  export let messages = {};

  const defaultMessages = {
    connecting: 'Connecting...',
    connected: 'Connected',
    disconnected: 'Connection lost',
    error: 'Connection error'
  };

  $: mergedMessages = { ...defaultMessages, ...messages };

  let status = 'connected';
  let visible = !showOnlyWhenDisconnected;
  let hideTimeout = null;
  let socket = null;

  onMount(() => {
    socket = getLiveSocket();
    if (!socket) {
      console.warn('[ConnectionStatus] LiveSocket not available');
      return;
    }

    // Monitor socket state
    const checkConnection = () => {
      if (socket.isConnected()) {
        handleConnected();
      } else {
        handleDisconnected();
      }
    };

    // Initial check
    checkConnection();

    // Listen for Phoenix LiveView events
    window.addEventListener('phx:page-loading-start', handleConnecting);
    window.addEventListener('phx:page-loading-stop', handleConnected);
    window.addEventListener('phx:disconnect', handleDisconnected);
    window.addEventListener('phx:error', handleError);

    // Polling fallback for connection state
    const interval = setInterval(checkConnection, 5000);

    return () => {
      window.removeEventListener('phx:page-loading-start', handleConnecting);
      window.removeEventListener('phx:page-loading-stop', handleConnected);
      window.removeEventListener('phx:disconnect', handleDisconnected);
      window.removeEventListener('phx:error', handleError);
      clearInterval(interval);
      if (hideTimeout) clearTimeout(hideTimeout);
    };
  });

  function handleConnecting() {
    status = 'connecting';
    visible = true;
    clearHideTimeout();
    updateConnectionState({ connected: false });
  }

  function handleConnected() {
    status = 'connected';
    updateConnectionState({ connected: true, reconnectAttempts: 0 });

    if (showOnlyWhenDisconnected) {
      visible = true;
      scheduleHide();
    }
  }

  function handleDisconnected() {
    status = 'disconnected';
    visible = true;
    clearHideTimeout();
    updateConnectionState({ connected: false });
  }

  function handleError() {
    status = 'error';
    visible = true;
    clearHideTimeout();
    updateConnectionState({ connected: false });
  }

  function scheduleHide() {
    if (autoHideDelay > 0) {
      clearHideTimeout();
      hideTimeout = setTimeout(() => {
        if (status === 'connected' && showOnlyWhenDisconnected) {
          visible = false;
        }
      }, autoHideDelay);
    }
  }

  function clearHideTimeout() {
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      hideTimeout = null;
    }
  }

  function reconnect() {
    if (socket) {
      status = 'connecting';
      updateConnectionState({
        reconnectAttempts: $connectionState.reconnectAttempts + 1
      });

      // Trigger LiveView reconnection
      socket.disconnect(() => {
        socket.connect();
      });
    }
  }

  $: statusConfig = {
    connecting: {
      icon: 'spinner',
      color: 'warning',
      pulse: true
    },
    connected: {
      icon: 'check',
      color: 'success',
      pulse: false
    },
    disconnected: {
      icon: 'offline',
      color: 'error',
      pulse: false
    },
    error: {
      icon: 'error',
      color: 'error',
      pulse: false
    }
  }[status];

  $: positionClasses = {
    'top-right': 'fixed top-4 right-4',
    'top-left': 'fixed top-4 left-4',
    'bottom-right': 'fixed bottom-4 right-4',
    'bottom-left': 'fixed bottom-4 left-4',
    inline: ''
  }[position];
</script>

{#if visible}
  <div
    class="connection-status {positionClasses}"
    class:inline={position === 'inline'}
    role="status"
    aria-live="polite"
    in:fly={{ y: position.startsWith('top') ? -20 : 20, duration: 200 }}
    out:fade={{ duration: 150 }}
  >
    <div class="status-content" class:error={status === 'error' || status === 'disconnected'}>
      <span class="status-icon" class:pulse={statusConfig.pulse}>
        {#if statusConfig.icon === 'spinner'}
          <svg class="icon spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
          </svg>
        {:else if statusConfig.icon === 'check'}
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        {:else if statusConfig.icon === 'offline'}
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 3l18 18" />
          </svg>
        {:else}
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        {/if}
      </span>

      <span class="status-text">{mergedMessages[status]}</span>

      {#if (status === 'disconnected' || status === 'error') && showReconnectButton}
        <button class="reconnect-button" on:click={reconnect}>
          Reconnect
        </button>
      {/if}
    </div>
  </div>
{/if}

<style>
  .connection-status {
    z-index: var(--z-toast);
  }

  .connection-status.inline {
    position: relative;
  }

  .status-content {
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
    padding: var(--spacing-2) var(--spacing-3);
    background-color: var(--color-surface-raised);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    font-size: 0.875rem;
    color: var(--color-text);
  }

  .status-content.error {
    border-color: var(--color-error);
    background-color: var(--color-error-soft);
  }

  .status-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.25rem;
    height: 1.25rem;
  }

  .status-icon.pulse {
    animation: pulse 2s infinite;
  }

  .icon {
    width: 100%;
    height: 100%;
  }

  .icon.spin {
    animation: spin 1s linear infinite;
  }

  .status-text {
    white-space: nowrap;
  }

  .reconnect-button {
    margin-left: var(--spacing-2);
    padding: var(--spacing-1) var(--spacing-2);
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--color-on-primary);
    background-color: var(--color-primary);
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: background-color 150ms ease;
  }

  .reconnect-button:hover {
    background-color: var(--color-primary-hover);
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .icon.spin {
      animation: none;
    }

    .status-icon.pulse {
      animation: none;
    }
  }
</style>
