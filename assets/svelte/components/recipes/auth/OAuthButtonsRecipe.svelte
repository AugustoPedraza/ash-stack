<script>
  /**
   * OAuth Buttons Recipe
   * Social login buttons for all major providers with loading states.
   *
   * Uses: Button
   */
  import { Button } from '../../ui';

  let loadingProvider = $state(null);
  let error = $state(null);
  let success = $state(null);

  // Modern minimal styling - consistent neutral appearance
  const providers = [
    { id: 'google', name: 'Google' },
    { id: 'apple', name: 'Apple' },
    { id: 'github', name: 'GitHub' },
    { id: 'microsoft', name: 'Microsoft' },
    { id: 'facebook', name: 'Facebook' },
    { id: 'twitter', name: 'X' },
  ];

  async function handleOAuth(providerId) {
    if (loadingProvider) return;

    loadingProvider = providerId;
    error = null;

    // Simulate OAuth redirect delay
    await new Promise(r => setTimeout(r, 1500));

    // Simulate random failure for demo
    if (Math.random() < 0.2) {
      loadingProvider = null;
      error = `Failed to connect with ${providers.find(p => p.id === providerId)?.name}. Please try again.`;
      return;
    }

    loadingProvider = null;
    success = providerId;
  }

  function resetDemo() {
    success = null;
    error = null;
    loadingProvider = null;
  }
</script>

{#snippet providerIcon(id)}
  {#if id === 'google'}
    <svg class="w-5 h-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  {:else if id === 'apple'}
    <svg class="w-5 h-5 text-text" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
    </svg>
  {:else if id === 'github'}
    <svg class="w-5 h-5 text-text" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  {:else if id === 'microsoft'}
    <svg class="w-5 h-5" viewBox="0 0 24 24">
      <path fill="#F25022" d="M1 1h10v10H1z"/>
      <path fill="#00A4EF" d="M1 13h10v10H1z"/>
      <path fill="#7FBA00" d="M13 1h10v10H13z"/>
      <path fill="#FFB900" d="M13 13h10v10H13z"/>
    </svg>
  {:else if id === 'facebook'}
    <svg class="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  {:else if id === 'twitter'}
    <svg class="w-5 h-5 text-text" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  {/if}
{/snippet}

<div class="h-full bg-base-100 overflow-y-auto px-5 py-6">
  {#if success}
    <!-- Success State -->
    <div class="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <div class="w-20 h-20 rounded-full bg-success-soft text-success flex items-center justify-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 class="text-xl font-semibold text-text mb-2">Connected!</h1>
      <p class="text-text-secondary mb-8">
        Successfully signed in with {providers.find(p => p.id === success)?.name}.
      </p>
      <Button variant="ghost" onclick={resetDemo}>
        Reset Demo
      </Button>
    </div>
  {:else}
    <!-- OAuth Buttons -->
    <div class="max-w-sm mx-auto pt-10">
      <div class="text-center mb-8">
        <h1 class="text-xl font-semibold text-text mb-2">Continue with</h1>
        <p class="text-text-muted">Choose your preferred sign-in method.</p>
      </div>

      {#if error}
        <div class="flex items-center gap-3 p-3 bg-error-soft border border-error/30 rounded-lg text-error text-sm mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{error}</span>
        </div>
      {/if}

      <div class="flex flex-col gap-2">
        {#each providers as provider}
          <Button
            variant="secondary"
            size="lg"
            fullWidth
            disabled={loadingProvider !== null}
            onclick={() => handleOAuth(provider.id)}
          >
            {#snippet children()}
              <span class="flex items-center justify-center gap-3">
                {#if loadingProvider === provider.id}
                  <span class="w-5 h-5 border-2 border-text/30 border-t-text rounded-full animate-spin"></span>
                {:else}
                  <span class="w-5 h-5 flex items-center justify-center">
                    {@render providerIcon(provider.id)}
                  </span>
                {/if}
                <span>Continue with {provider.name}</span>
              </span>
            {/snippet}
          </Button>
        {/each}
      </div>

      <div class="flex items-center gap-4 my-8">
        <div class="flex-1 h-px bg-border"></div>
        <span class="text-text-disabled text-sm">or</span>
        <div class="flex-1 h-px bg-border"></div>
      </div>

      <Button
        variant="secondary"
        size="lg"
        fullWidth
        onclick={() => alert('Navigate to email login')}
      >
        Continue with email
      </Button>

      <p class="text-center text-xs text-text-disabled mt-8">
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  {/if}
</div>
