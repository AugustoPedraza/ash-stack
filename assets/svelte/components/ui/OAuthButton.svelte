<!--
  OAuthButton Component
  Pre-styled buttons for common OAuth providers.
  Includes official brand colors and icons.
-->
<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  /**
   * OAuth provider
   * @type {'google' | 'github' | 'apple' | 'microsoft' | 'facebook' | 'twitter' | 'discord' | 'slack'}
   */
  export let provider;

  /**
   * Button size
   * @type {'sm' | 'md' | 'lg'}
   */
  export let size = 'md';

  /**
   * Show provider name or icon only
   * @type {boolean}
   */
  export let iconOnly = false;

  /**
   * Custom label (overrides default)
   * @type {string | null}
   */
  export let label = null;

  /**
   * Loading state
   * @type {boolean}
   */
  export let loading = false;

  /**
   * Disabled state
   * @type {boolean}
   */
  export let disabled = false;

  /**
   * Full width button
   * @type {boolean}
   */
  export let fullWidth = false;

  // Provider configurations
  const providers = {
    google: {
      name: 'Google',
      bgColor: '#ffffff',
      textColor: '#1f1f1f',
      borderColor: '#dadce0',
      hoverBg: '#f8f9fa',
      icon: `<svg viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>`
    },
    github: {
      name: 'GitHub',
      bgColor: '#24292f',
      textColor: '#ffffff',
      borderColor: '#24292f',
      hoverBg: '#32383f',
      icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>`
    },
    apple: {
      name: 'Apple',
      bgColor: '#000000',
      textColor: '#ffffff',
      borderColor: '#000000',
      hoverBg: '#1a1a1a',
      icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>`
    },
    microsoft: {
      name: 'Microsoft',
      bgColor: '#ffffff',
      textColor: '#1f1f1f',
      borderColor: '#8c8c8c',
      hoverBg: '#f3f3f3',
      icon: `<svg viewBox="0 0 24 24" fill="none"><path fill="#f25022" d="M2 2h9.5v9.5H2z"/><path fill="#00a4ef" d="M2 12.5h9.5V22H2z"/><path fill="#7fba00" d="M12.5 2H22v9.5h-9.5z"/><path fill="#ffb900" d="M12.5 12.5H22V22h-9.5z"/></svg>`
    },
    facebook: {
      name: 'Facebook',
      bgColor: '#1877f2',
      textColor: '#ffffff',
      borderColor: '#1877f2',
      hoverBg: '#166fe5',
      icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`
    },
    twitter: {
      name: 'Twitter',
      bgColor: '#1da1f2',
      textColor: '#ffffff',
      borderColor: '#1da1f2',
      hoverBg: '#1a91da',
      icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`
    },
    discord: {
      name: 'Discord',
      bgColor: '#5865f2',
      textColor: '#ffffff',
      borderColor: '#5865f2',
      hoverBg: '#4752c4',
      icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>`
    },
    slack: {
      name: 'Slack',
      bgColor: '#4a154b',
      textColor: '#ffffff',
      borderColor: '#4a154b',
      hoverBg: '#3e1140',
      icon: `<svg viewBox="0 0 24 24" fill="none"><path d="M5.042 15.165a2.528 2.528 0 01-2.52 2.523A2.528 2.528 0 010 15.165a2.527 2.527 0 012.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 012.521-2.52 2.527 2.527 0 012.521 2.52v6.313A2.528 2.528 0 018.834 24a2.528 2.528 0 01-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 01-2.521-2.52A2.528 2.528 0 018.834 0a2.528 2.528 0 012.521 2.522v2.52H8.834zm0 1.271a2.528 2.528 0 012.521 2.521 2.528 2.528 0 01-2.521 2.521H2.522A2.528 2.528 0 010 8.834a2.528 2.528 0 012.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 012.522-2.521A2.528 2.528 0 0124 8.834a2.528 2.528 0 01-2.522 2.521h-2.522V8.834zm-1.27 0a2.528 2.528 0 01-2.523 2.521 2.527 2.527 0 01-2.52-2.521V2.522A2.527 2.527 0 0115.163 0a2.528 2.528 0 012.523 2.522v6.312zM15.163 18.956a2.528 2.528 0 012.523 2.522A2.528 2.528 0 0115.163 24a2.527 2.527 0 01-2.52-2.522v-2.522h2.52zm0-1.27a2.527 2.527 0 01-2.52-2.523 2.526 2.526 0 012.52-2.52h6.313A2.527 2.527 0 0124 15.163a2.528 2.528 0 01-2.522 2.523h-6.315z" fill="currentColor"/></svg>`
    }
  };

  $: config = providers[provider] || providers.google;
  $: displayLabel = label || `Continue with ${config.name}`;

  function handleClick() {
    if (!loading && !disabled) {
      dispatch('click', { provider });
    }
  }
</script>

<button
  type="button"
  class="oauth-button size-{size}"
  class:icon-only={iconOnly}
  class:full-width={fullWidth}
  class:loading
  style="
    --bg-color: {config.bgColor};
    --text-color: {config.textColor};
    --border-color: {config.borderColor};
    --hover-bg: {config.hoverBg};
  "
  disabled={disabled || loading}
  on:click={handleClick}
  aria-label={iconOnly ? displayLabel : undefined}
>
  {#if loading}
    <span class="spinner" />
  {:else}
    <span class="oauth-icon">
      {@html config.icon}
    </span>
  {/if}

  {#if !iconOnly}
    <span class="oauth-label">{displayLabel}</span>
  {/if}
</button>

<style>
  .oauth-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-3);
    font-family: inherit;
    font-weight: 500;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: background-color 150ms ease, box-shadow 150ms ease;
    background-color: var(--bg-color);
    color: var(--text-color);
    border: 1px solid var(--border-color);
  }

  .oauth-button:hover:not(:disabled) {
    background-color: var(--hover-bg);
  }

  .oauth-button:focus-visible {
    outline: 2px solid var(--color-border-focus);
    outline-offset: 2px;
  }

  .oauth-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* Sizes */
  .size-sm {
    height: 2.25rem;
    padding: 0 var(--spacing-3);
    font-size: 0.875rem;
  }

  .size-md {
    height: 2.75rem;
    padding: 0 var(--spacing-4);
    font-size: 0.9375rem;
  }

  .size-lg {
    height: 3rem;
    padding: 0 var(--spacing-6);
    font-size: 1rem;
  }

  /* Icon only */
  .icon-only.size-sm {
    width: 2.25rem;
    padding: 0;
  }

  .icon-only.size-md {
    width: 2.75rem;
    padding: 0;
  }

  .icon-only.size-lg {
    width: 3rem;
    padding: 0;
  }

  /* Full width */
  .full-width {
    width: 100%;
  }

  /* Icon */
  .oauth-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .size-sm .oauth-icon {
    width: 1rem;
    height: 1rem;
  }

  .size-md .oauth-icon {
    width: 1.25rem;
    height: 1.25rem;
  }

  .size-lg .oauth-icon {
    width: 1.5rem;
    height: 1.5rem;
  }

  .oauth-icon :global(svg) {
    width: 100%;
    height: 100%;
  }

  /* Label */
  .oauth-label {
    white-space: nowrap;
  }

  /* Loading spinner */
  .spinner {
    width: 1.25rem;
    height: 1.25rem;
    border: 2px solid var(--text-color);
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* Dark mode adjustments for light-bg buttons */
  @media (prefers-color-scheme: dark) {
    .oauth-button[style*="--bg-color: #ffffff"] {
      --bg-color: #ffffff;
      --hover-bg: #f0f0f0;
    }
  }
</style>
