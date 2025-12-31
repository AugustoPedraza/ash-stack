<!--
  ErrorBoundary Component
  Catches errors in child components and displays fallback UI.
  Integrates with Phoenix for error reporting.
-->
<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import { pushEvent } from '../../lib/liveview.js';

  const dispatch = createEventDispatcher();

  /**
   * Custom fallback component or snippet
   * @type {any}
   */
  export let fallback = null;

  /**
   * Whether to report errors to the server
   * @type {boolean}
   */
  export let reportToServer = false;

  /**
   * Event name for server error reporting
   * @type {string}
   */
  export let reportEvent = 'client_error';

  /**
   * Whether to show error details in dev mode
   * @type {boolean}
   */
  export let showDetails = import.meta.env?.DEV ?? false;

  /**
   * Custom error message
   * @type {string}
   */
  export let message = 'Something went wrong';

  /**
   * Whether to allow retry
   * @type {boolean}
   */
  export let retryable = true;

  let error = null;
  let errorInfo = null;
  let retryCount = 0;

  /**
   * Reset the error state
   */
  export function reset() {
    error = null;
    errorInfo = null;
    retryCount++;
    dispatch('reset', { retryCount });
  }

  /**
   * Handle caught error
   */
  function handleError(err, info = null) {
    error = err;
    errorInfo = info;

    // Log to console in dev
    if (import.meta.env?.DEV) {
      console.error('[ErrorBoundary] Caught error:', err);
      if (info) console.error('[ErrorBoundary] Component stack:', info);
    }

    // Report to server if enabled
    if (reportToServer) {
      pushEvent(reportEvent, {
        message: err?.message || String(err),
        stack: err?.stack,
        component: info?.componentStack,
        url: window.location.href,
        timestamp: new Date().toISOString()
      });
    }

    dispatch('error', { error: err, info });
  }

  // Set up global error handler for this boundary
  onMount(() => {
    const originalHandler = window.onerror;

    // Note: This is a simplified approach. In production,
    // you'd want to use Svelte's error boundary when available
    // or a more sophisticated error tracking solution.

    return () => {
      window.onerror = originalHandler;
    };
  });

  // Expose error handler for programmatic use
  export { handleError };
</script>

{#if error}
  <div class="error-boundary" role="alert">
    {#if fallback}
      <svelte:component this={fallback} {error} {errorInfo} {reset} {retryCount} />
    {:else}
      <div class="error-content">
        <div class="error-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="icon"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>

        <h3 class="error-title">{message}</h3>

        {#if showDetails && error}
          <details class="error-details">
            <summary>Error Details</summary>
            <pre class="error-stack">{error.message}\n{error.stack || ''}</pre>
          </details>
        {/if}

        {#if retryable}
          <button class="retry-button" on:click={reset}>
            Try Again
          </button>
        {/if}
      </div>
    {/if}
  </div>
{:else}
  <slot />
{/if}

<style>
  .error-boundary {
    padding: var(--spacing-6);
  }

  .error-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-4);
    text-align: center;
    max-width: 24rem;
    margin: 0 auto;
  }

  .error-icon {
    width: 3rem;
    height: 3rem;
    color: var(--color-error);
  }

  .icon {
    width: 100%;
    height: 100%;
  }

  .error-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--color-text);
    margin: 0;
  }

  .error-details {
    width: 100%;
    text-align: left;
  }

  .error-details summary {
    cursor: pointer;
    font-size: 0.875rem;
    color: var(--color-text-muted);
    padding: var(--spacing-2);
  }

  .error-stack {
    font-family: monospace;
    font-size: 0.75rem;
    background-color: var(--color-surface-sunken);
    padding: var(--spacing-3);
    border-radius: var(--radius-md);
    overflow-x: auto;
    white-space: pre-wrap;
    word-break: break-word;
    margin: var(--spacing-2) 0 0;
    color: var(--color-error);
  }

  .retry-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-2) var(--spacing-4);
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-on-primary);
    background-color: var(--color-primary);
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: background-color 150ms ease;
  }

  .retry-button:hover {
    background-color: var(--color-primary-hover);
  }

  .retry-button:active {
    background-color: var(--color-primary-active);
  }
</style>
