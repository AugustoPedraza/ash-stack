<script>
  /**
   * Magic Link Recipe
   * Passwordless email link flow with checking status and expiration handling.
   *
   * Uses: Button, Input, FormField
   */
  import { mockSubmit } from '../../../lib/mock/mockApi.js';
  import { Button, Input, FormField } from '../../ui';

  let email = $state('');
  let loading = $state(false);
  let error = $state(null);
  let linkSent = $state(false);
  let checkingLink = $state(false);
  let success = $state(false);
  let touched = $state(false);

  const emailValid = $derived(email.includes('@') && email.includes('.'));

  async function handleSubmit() {
    touched = true;
    if (!emailValid) return;

    loading = true;
    error = null;

    const result = await mockSubmit(() => ({ sent: true }));

    loading = false;

    if (result.error) {
      error = result.error.message;
      return;
    }

    linkSent = true;
  }

  async function simulateClickLink() {
    checkingLink = true;

    // Simulate checking the magic link
    await new Promise(r => setTimeout(r, 1500));

    checkingLink = false;
    success = true;
  }

  function simulateExpiredLink() {
    linkSent = false;
    error = 'This link has expired. Please request a new one.';
  }

  function resetDemo() {
    email = '';
    linkSent = false;
    checkingLink = false;
    success = false;
    error = null;
    touched = false;
  }
</script>

<div class="h-full bg-base-100 overflow-y-auto px-5 py-6">
  {#if success}
    <!-- Success State -->
    <div class="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <div class="w-20 h-20 rounded-full bg-success-soft text-success flex items-center justify-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 class="text-xl font-semibold text-text mb-2">You're In!</h1>
      <p class="text-text-secondary mb-8">Successfully signed in via magic link.</p>
      <Button variant="ghost" onclick={resetDemo}>
        Reset Demo
      </Button>
    </div>
  {:else if checkingLink}
    <!-- Checking Link State -->
    <div class="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <span class="w-10 h-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin mb-6"></span>
      <h1 class="text-xl font-bold text-text mb-2">Verifying Link...</h1>
      <p class="text-text-muted">Please wait while we sign you in.</p>
    </div>
  {:else if linkSent}
    <!-- Link Sent State -->
    <div class="flex flex-col items-center justify-center min-h-[80vh] text-center max-w-sm mx-auto">
      <div class="w-20 h-20 rounded-full bg-primary-soft text-primary flex items-center justify-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
      <h1 class="text-xl font-semibold text-text mb-2">Check Your Email</h1>
      <p class="text-text-secondary mb-2">We sent a magic link to:</p>
      <p class="font-medium text-text mb-6">{email}</p>
      <p class="text-sm text-text-muted mb-8">
        Click the link in the email to sign in. The link expires in 15 minutes.
      </p>

      <!-- Demo Actions -->
      <div class="flex flex-col gap-3 w-full">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onclick={simulateClickLink}
        >
          Simulate: Click Magic Link
        </Button>
        <Button
          variant="danger"
          size="lg"
          fullWidth
          onclick={simulateExpiredLink}
        >
          Simulate: Expired Link
        </Button>
        <Button variant="ghost" onclick={resetDemo}>
          Use different email
        </Button>
      </div>
    </div>
  {:else}
    <!-- Email Input Form -->
    <div class="max-w-sm mx-auto pt-10">
      <div class="text-center mb-8">
        <h1 class="text-xl font-semibold text-text mb-2">Sign In with Email</h1>
        <p class="text-text-muted">We'll send you a magic link to sign in instantly.</p>
      </div>

      {#if error}
        <div class="flex items-center gap-3 p-3 bg-error-soft border border-error/30 rounded-lg text-error text-sm mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{error}</span>
        </div>
      {/if}

      <form class="flex flex-col gap-5" onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        <FormField
          label="Email"
          error={touched && !emailValid ? 'Please enter a valid email address' : ''}
          id="email"
        >
          <Input
            id="email"
            type="email"
            bind:value={email}
            onblur={() => touched = true}
            placeholder="you@example.com"
            autocomplete="email"
            disabled={loading}
            invalid={touched && !emailValid}
          />
        </FormField>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          {loading}
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send Magic Link'}
        </Button>
      </form>

      <div class="flex items-center gap-4 my-8">
        <div class="flex-1 h-px bg-border"></div>
        <span class="text-text-disabled text-sm">or</span>
        <div class="flex-1 h-px bg-border"></div>
      </div>

      <Button
        variant="secondary"
        size="lg"
        fullWidth
        onclick={() => alert('Navigate to password login')}
      >
        Sign in with password
      </Button>
    </div>
  {/if}
</div>
