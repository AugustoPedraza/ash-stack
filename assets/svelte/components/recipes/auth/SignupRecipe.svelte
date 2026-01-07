<script>
  /**
   * Signup Recipe
   * Full-screen registration form with password strength, terms checkbox,
   * field validations, loading states, and error handling.
   *
   * Uses: Button, Input, FormField
   */
  import { mockSubmit } from '../../../lib/mock/mockApi.js';
  import { Button, Input, FormField } from '../../ui';

  // Form state
  let name = $state('');
  let email = $state('');
  let password = $state('');
  let acceptTerms = $state(false);
  let loading = $state(false);
  let error = $state(null);
  let fieldErrors = $state({});
  let success = $state(false);

  // Touched state
  let touched = $state({ name: false, email: false, password: false, terms: false });

  // Validation
  const nameValid = $derived(name.trim().length >= 2);
  const emailValid = $derived(email.includes('@') && email.includes('.'));
  const passwordLength = $derived(password.length >= 8);
  const passwordHasNumber = $derived(/\d/.test(password));
  const passwordHasUpper = $derived(/[A-Z]/.test(password));
  const passwordValid = $derived(passwordLength && passwordHasNumber && passwordHasUpper);
  const termsValid = $derived(acceptTerms);
  const formValid = $derived(nameValid && emailValid && passwordValid && termsValid);

  // Password strength
  const passwordStrength = $derived.by(() => {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/\d/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;
    return score;
  });

  const strengthLabel = $derived(
    passwordStrength <= 1 ? 'Weak' :
    passwordStrength <= 3 ? 'Medium' :
    'Strong'
  );

  const strengthColor = $derived(
    passwordStrength <= 1 ? 'bg-error' :
    passwordStrength <= 3 ? 'bg-warning' :
    'bg-success'
  );

  async function handleSubmit() {
    touched = { name: true, email: true, password: true, terms: true };

    if (!formValid) {
      fieldErrors = {
        ...(nameValid ? {} : { name: 'Name must be at least 2 characters' }),
        ...(emailValid ? {} : { email: 'Please enter a valid email address' }),
        ...(passwordValid ? {} : { password: 'Password does not meet requirements' }),
        ...(termsValid ? {} : { terms: 'You must accept the terms' })
      };
      return;
    }

    loading = true;
    error = null;
    fieldErrors = {};

    const result = await mockSubmit(
      () => ({ user: { id: '1', email, name }, token: 'mock-jwt-token' }),
      {
        validationErrors: email === 'taken@example.com'
          ? { email: 'This email is already registered' }
          : {}
      }
    );

    loading = false;

    if (result.error) {
      if (result.error.code === 'VALIDATION_ERROR' && result.error.details) {
        fieldErrors = result.error.details;
      } else {
        error = result.error.message;
      }
      return;
    }

    success = true;
  }

  function resetDemo() {
    success = false;
    name = '';
    email = '';
    password = '';
    acceptTerms = false;
    touched = { name: false, email: false, password: false, terms: false };
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
      <h1 class="text-xl font-semibold text-text mb-2">Account Created!</h1>
      <p class="text-text-secondary mb-8">Welcome aboard, {name}!</p>
      <Button variant="ghost" onclick={resetDemo}>
        Reset Demo
      </Button>
    </div>
  {:else}
    <!-- Signup Form -->
    <div class="max-w-sm mx-auto pt-6">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-xl font-semibold text-text mb-2">Create Account</h1>
        <p class="text-text-muted">Join us today. It only takes a minute.</p>
      </div>

      <!-- Form -->
      <form class="flex flex-col gap-5" onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        <!-- Global Error -->
        {#if error}
          <div class="flex items-center gap-3 p-3 bg-error-soft border border-error/30 rounded-lg text-error text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
        {/if}

        <!-- Name Field -->
        <FormField
          label="Full Name"
          error={touched.name ? (fieldErrors.name || (!nameValid ? 'Name must be at least 2 characters' : '')) : ''}
          id="name"
        >
          <Input
            id="name"
            type="text"
            bind:value={name}
            onblur={() => touched.name = true}
            placeholder="John Doe"
            autocomplete="name"
            disabled={loading}
            invalid={touched.name && !nameValid}
          />
        </FormField>

        <!-- Email Field -->
        <FormField
          label="Email"
          error={touched.email ? (fieldErrors.email || (!emailValid ? 'Please enter a valid email address' : '')) : ''}
          id="email"
        >
          <Input
            id="email"
            type="email"
            bind:value={email}
            onblur={() => touched.email = true}
            placeholder="you@example.com"
            autocomplete="email"
            disabled={loading}
            invalid={touched.email && !emailValid}
          />
        </FormField>

        <!-- Password Field -->
        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium text-text" for="password">Password</label>
          <Input
            id="password"
            type="password"
            bind:value={password}
            onblur={() => touched.password = true}
            placeholder="Create a password"
            autocomplete="new-password"
            disabled={loading}
            invalid={touched.password && !passwordValid}
          />

          <!-- Password Strength Indicator -->
          {#if password.length > 0}
            <div class="flex items-center gap-2 mt-1">
              <div class="flex-1 h-1.5 bg-base-200 rounded-full overflow-hidden">
                <div
                  class="h-full transition-all duration-300 {strengthColor}"
                  style="width: {(passwordStrength / 5) * 100}%"
                ></div>
              </div>
              <span class="text-xs text-text-muted">{strengthLabel}</span>
            </div>

            <!-- Password Requirements -->
            <ul class="text-xs space-y-1 mt-2">
              <li class="flex items-center gap-2 {passwordLength ? 'text-success' : 'text-text-disabled'}">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                  {#if passwordLength}
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  {:else}
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clip-rule="evenodd" />
                  {/if}
                </svg>
                At least 8 characters
              </li>
              <li class="flex items-center gap-2 {passwordHasUpper ? 'text-success' : 'text-text-disabled'}">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                  {#if passwordHasUpper}
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  {:else}
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clip-rule="evenodd" />
                  {/if}
                </svg>
                One uppercase letter
              </li>
              <li class="flex items-center gap-2 {passwordHasNumber ? 'text-success' : 'text-text-disabled'}">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                  {#if passwordHasNumber}
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  {:else}
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clip-rule="evenodd" />
                  {/if}
                </svg>
                One number
              </li>
            </ul>
          {/if}
          {#if touched.password && (fieldErrors.password || !passwordValid)}
            <span class="text-xs text-error">{fieldErrors.password || 'Password does not meet requirements'}</span>
          {/if}
        </div>

        <!-- Terms Checkbox -->
        <div class="flex items-start gap-3">
          <button
            type="button"
            role="checkbox"
            aria-checked={acceptTerms}
            class="w-5 h-5 mt-0.5 shrink-0 rounded border-2 flex items-center justify-center transition-colors
              {acceptTerms
                ? 'bg-primary border-primary'
                : 'bg-surface border-border-strong hover:border-primary'}
              {touched.terms && !termsValid ? 'border-error' : ''}
              {loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}"
            onclick={() => !loading && (acceptTerms = !acceptTerms)}
            disabled={loading}
          >
            {#if acceptTerms}
              <svg class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            {/if}
          </button>
          <span
            class="text-sm text-text leading-relaxed cursor-pointer select-none"
            onclick={() => !loading && (acceptTerms = !acceptTerms)}
            role="none"
          >
            I agree to the <button
              type="button"
              class="text-primary hover:underline font-medium"
              onclick={(e) => { e.stopPropagation(); alert('Show Terms'); }}
            >Terms of Service</button> and <button
              type="button"
              class="text-primary hover:underline font-medium"
              onclick={(e) => { e.stopPropagation(); alert('Show Privacy'); }}
            >Privacy Policy</button>
          </span>
        </div>
        {#if touched.terms && !termsValid}
          <span class="text-xs text-error -mt-3">You must accept the terms to continue</span>
        {/if}

        <!-- Submit Button -->
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          {loading}
          disabled={loading}
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </Button>
      </form>

      <!-- Sign In Link -->
      <p class="text-center text-sm text-text-muted mt-6">
        Already have an account?
        <Button variant="ghost" size="sm" onclick={() => alert('Navigate to Sign In')}>
          Sign in
        </Button>
      </p>

      <!-- Demo Hint -->
      <p class="text-center text-xs text-text-disabled mt-8">
        Try <strong>taken@example.com</strong> to see duplicate email error
      </p>
    </div>
  {/if}
</div>
