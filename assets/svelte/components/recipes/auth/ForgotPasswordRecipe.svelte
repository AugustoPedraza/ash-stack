<script>
  /**
   * Forgot Password Recipe
   * Email submission flow with success state and rate limiting demo.
   *
   * Uses: Button, Input, FormField
   */
  import { mockSubmit } from '../../../lib/mock/mockApi.js';
  import { Button, Input, FormField } from '../../ui';

  let email = $state('');
  let loading = $state(false);
  let error = $state(null);
  let success = $state(false);
  let touched = $state(false);
  let rateLimited = $state(false);
  let cooldownSeconds = $state(0);

  const emailValid = $derived(email.includes('@') && email.includes('.'));

  async function handleSubmit() {
    touched = true;
    if (!emailValid) return;

    if (rateLimited) {
      error = `Please wait ${cooldownSeconds} seconds before trying again`;
      return;
    }

    loading = true;
    error = null;

    const result = await mockSubmit(
      () => ({ message: 'Reset email sent' }),
      {
        validationErrors: email === 'notfound@example.com'
          ? { email: 'No account found with this email' }
          : {}
      }
    );

    loading = false;

    if (result.error) {
      if (result.error.details?.email) {
        error = result.error.details.email;
      } else {
        error = result.error.message;
      }
      return;
    }

    success = true;

    // Simulate rate limiting for demo
    rateLimited = true;
    cooldownSeconds = 60;
    const interval = setInterval(() => {
      cooldownSeconds--;
      if (cooldownSeconds <= 0) {
        rateLimited = false;
        clearInterval(interval);
      }
    }, 1000);
  }

  function resetDemo() {
    success = false;
    email = '';
    touched = false;
    error = null;
  }
</script>

<div class="h-full bg-base-100 overflow-y-auto px-5 py-6">
  {#if success}
    <!-- Success State -->
    <div class="flex flex-col items-center justify-center min-h-[80vh] text-center max-w-sm mx-auto">
      <div class="w-20 h-20 rounded-full bg-primary-soft text-primary flex items-center justify-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
      <h1 class="text-xl font-semibold text-text mb-2">Check Your Email</h1>
      <p class="text-text-secondary mb-2">We sent a password reset link to:</p>
      <p class="font-medium text-text mb-6">{email}</p>
      <p class="text-sm text-text-muted mb-8">
        Didn't receive the email? Check your spam folder or
        {#if rateLimited}
          <span class="text-text-disabled">resend in {cooldownSeconds}s</span>
        {:else}
          <Button variant="ghost" size="sm" onclick={handleSubmit}>resend</Button>
        {/if}
      </p>
      <Button variant="ghost" onclick={resetDemo}>
        Back to Reset
      </Button>
    </div>
  {:else}
    <!-- Forgot Password Form -->
    <div class="max-w-sm mx-auto pt-10">
      <div class="text-center mb-8">
        <h1 class="text-xl font-semibold text-text mb-2">Forgot Password?</h1>
        <p class="text-text-muted">Enter your email and we'll send you a reset link.</p>
      </div>

      <form class="flex flex-col gap-5" onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        {#if error}
          <div class="flex items-center gap-3 p-3 bg-error-soft border border-error/30 rounded-lg text-error text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
        {/if}

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
          {loading ? 'Sending...' : 'Send Reset Link'}
        </Button>
      </form>

      <p class="text-center text-sm text-text-muted mt-6">
        Remember your password?
        <Button variant="ghost" size="sm" onclick={() => alert('Navigate to Sign In')}>
          Sign in
        </Button>
      </p>

      <p class="text-center text-xs text-text-disabled mt-8">
        Try <strong>notfound@example.com</strong> to see error handling
      </p>
    </div>
  {/if}
</div>
