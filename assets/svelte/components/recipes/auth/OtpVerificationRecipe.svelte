<script>
  /**
   * OTP Verification Recipe
   * 6-digit code input with auto-advance, resend functionality,
   * expiration timer, and auto-submit.
   *
   * Uses: Button, Input
   */
  import { mockSubmit } from '../../../lib/mock/mockApi.js';
  import { Button, Input } from '../../ui';

  let code = $state(['', '', '', '', '', '']);
  let loading = $state(false);
  let error = $state(null);
  let success = $state(false);
  let resendCooldown = $state(0);
  let expiresIn = $state(300); // 5 minutes

  const codeComplete = $derived(code.every(d => d !== ''));
  const codeString = $derived(code.join(''));
  const formattedTime = $derived(
    `${Math.floor(expiresIn / 60)}:${(expiresIn % 60).toString().padStart(2, '0')}`
  );

  // Start expiration timer
  $effect(() => {
    if (success || expiresIn <= 0) return;
    const timer = setInterval(() => {
      expiresIn--;
      if (expiresIn <= 0) clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  });

  // Resend cooldown timer
  $effect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      resendCooldown--;
      if (resendCooldown <= 0) clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  });

  // Auto-submit when code is complete
  $effect(() => {
    if (codeComplete && !loading && !success) {
      handleSubmit();
    }
  });

  function handleInput(index, event) {
    const value = event.target.value.replace(/\D/g, '');
    if (value.length > 1) {
      // Pasted code - distribute digits
      const digits = value.slice(0, 6).split('');
      code = code.map((_, i) => digits[i] || '');
      // Focus last filled input
      const lastIndex = Math.min(digits.length - 1, 5);
      document.getElementById(`otp-${lastIndex}`)?.focus();
    } else {
      code[index] = value;
      code = [...code];
      // Auto-advance to next input
      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
    }
  }

  function handleKeydown(index, event) {
    if (event.key === 'Backspace' && !code[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  }

  async function handleSubmit() {
    if (!codeComplete) return;

    loading = true;
    error = null;

    const result = await mockSubmit(
      () => ({ verified: true }),
      {
        validationErrors: codeString === '000000'
          ? { code: 'Invalid verification code' }
          : {}
      }
    );

    loading = false;

    if (result.error) {
      error = result.error.details?.code || result.error.message;
      code = ['', '', '', '', '', ''];
      document.getElementById('otp-0')?.focus();
      return;
    }

    success = true;
  }

  async function handleResend() {
    if (resendCooldown > 0) return;

    resendCooldown = 60;
    expiresIn = 300;
    code = ['', '', '', '', '', ''];
    error = null;
    document.getElementById('otp-0')?.focus();
  }

  function resetDemo() {
    success = false;
    code = ['', '', '', '', '', ''];
    error = null;
    expiresIn = 300;
    resendCooldown = 0;
  }
</script>

<div class="h-full bg-base-100 overflow-y-auto px-5 py-6">
  {#if success}
    <div class="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <div class="w-20 h-20 rounded-full bg-success-soft text-success flex items-center justify-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 class="text-xl font-semibold text-text mb-2">Verified!</h1>
      <p class="text-text-secondary mb-8">Your phone number has been verified.</p>
      <Button variant="ghost" onclick={resetDemo}>
        Reset Demo
      </Button>
    </div>
  {:else}
    <div class="max-w-sm mx-auto pt-10">
      <div class="text-center mb-8">
        <h1 class="text-xl font-semibold text-text mb-2">Enter Code</h1>
        <p class="text-text-muted">We sent a 6-digit code to your phone.</p>
        {#if expiresIn > 0}
          <p class="text-sm text-text-disabled mt-2">Expires in {formattedTime}</p>
        {:else}
          <p class="text-sm text-error mt-2">Code expired</p>
        {/if}
      </div>

      {#if error}
        <div class="flex items-center justify-center gap-2 p-3 bg-error-soft border border-error/30 rounded-lg text-error text-sm mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{error}</span>
        </div>
      {/if}

      <!-- OTP Input -->
      <div class="flex justify-center gap-3 mb-8">
        {#each code as digit, i}
          <div class="w-12">
            <Input
              id="otp-{i}"
              type="text"
              inputmode="numeric"
              maxlength={6}
              textCenter
              size="lg"
              value={digit}
              invalid={!!error}
              disabled={loading || expiresIn <= 0}
              oninput={(e) => handleInput(i, e)}
              onkeydown={(e) => handleKeydown(i, e)}
            />
          </div>
        {/each}
      </div>

      {#if loading}
        <div class="flex justify-center mb-6">
          <span class="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></span>
        </div>
      {/if}

      <p class="text-center text-sm text-text-muted">
        Didn't receive the code?
        {#if resendCooldown > 0}
          <span class="text-text-disabled">Resend in {resendCooldown}s</span>
        {:else}
          <Button variant="ghost" size="sm" onclick={handleResend}>Resend</Button>
        {/if}
      </p>

      <p class="text-center text-xs text-text-disabled mt-8">
        Enter <strong>000000</strong> to see error handling
      </p>
    </div>
  {/if}
</div>
