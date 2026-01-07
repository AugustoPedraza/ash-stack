<script>
  /**
   * Email Verification Recipe
   * Verification pending state with resend and success confirmation.
   *
   * Uses: Button, Card
   */
  import { mockSubmit } from '../../../lib/mock/mockApi.js';
  import { Button, Card } from '../../ui';

  let email = $state('user@example.com'); // Simulated logged-in user
  let verified = $state(false);
  let resending = $state(false);
  let resendCooldown = $state(0);
  let justResent = $state(false);

  // Cooldown timer
  $effect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      resendCooldown--;
      if (resendCooldown <= 0) clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  });

  async function handleResend() {
    if (resendCooldown > 0) return;

    resending = true;
    justResent = false;

    await mockSubmit(() => ({ sent: true }));

    resending = false;
    justResent = true;
    resendCooldown = 60;

    setTimeout(() => { justResent = false; }, 3000);
  }

  function simulateVerify() {
    verified = true;
  }

  function resetDemo() {
    verified = false;
    resendCooldown = 0;
    justResent = false;
  }
</script>

<div class="h-full bg-base-100 overflow-y-auto px-5 py-6">
  {#if verified}
    <!-- Verified State -->
    <div class="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <div class="w-20 h-20 rounded-full bg-success-soft text-success flex items-center justify-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      </div>
      <h1 class="text-xl font-semibold text-foreground mb-2">Email Verified!</h1>
      <p class="text-muted-foreground mb-8">Your email address has been confirmed.</p>
      <Button variant="ghost" onclick={resetDemo}>
        Reset Demo
      </Button>
    </div>
  {:else}
    <!-- Pending Verification State -->
    <div class="flex flex-col items-center justify-center min-h-[80vh] text-center max-w-sm mx-auto">
      <div class="w-20 h-20 rounded-full bg-warning-soft text-warning flex items-center justify-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>

      <h1 class="text-xl font-semibold text-foreground mb-2">Verify Your Email</h1>
      <p class="text-muted-foreground mb-2">We sent a verification link to:</p>
      <p class="font-medium text-foreground mb-6">{email}</p>

      <p class="text-sm text-muted-foreground mb-8">
        Please check your inbox and click the verification link to activate your account.
      </p>

      <!-- Status Messages -->
      {#if justResent}
        <div class="flex items-center gap-2 p-3 bg-success-soft border border-success/30 rounded-lg text-success text-sm mb-6 w-full">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span>Verification email sent!</span>
        </div>
      {/if}

      <!-- Actions -->
      <div class="flex flex-col gap-3 w-full">
        <Button
          variant="secondary"
          size="lg"
          fullWidth
          loading={resending}
          disabled={resending || resendCooldown > 0}
          onclick={handleResend}
        >
          {#if resending}
            Sending...
          {:else if resendCooldown > 0}
            Resend in {resendCooldown}s
          {:else}
            Resend Verification Email
          {/if}
        </Button>

        <Button
          variant="primary"
          size="lg"
          fullWidth
          onclick={simulateVerify}
        >
          Simulate: Verify Email
        </Button>

        <Button variant="ghost" onclick={() => alert('Open email change modal')}>
          Wrong email? Change it
        </Button>
      </div>

      <!-- Help Text -->
      <Card variant="flat" class="mt-8 w-full">
        <p class="text-sm font-medium text-foreground mb-2">Didn't receive the email?</p>
        <ul class="text-sm text-muted-foreground space-y-1 text-left">
          <li>Check your spam or junk folder</li>
          <li>Make sure {email} is correct</li>
          <li>Wait a few minutes and try resending</li>
        </ul>
      </Card>
    </div>
  {/if}
</div>
