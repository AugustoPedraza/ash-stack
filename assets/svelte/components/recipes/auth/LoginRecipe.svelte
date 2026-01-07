<script>
  /**
   * Login Recipe
   * Full-screen login form with email/password, remember me, validation,
   * loading states, and error handling.
   *
   * Uses: Button, Input, FormField, Badge
   */
  import { mockSubmit } from '../../../lib/mock/mockApi.js';
  import { Button, Input, FormField, Badge } from '../../ui';

  // Form state
  let email = $state('');
  let password = $state('');
  let rememberMe = $state(false);
  let loading = $state(false);
  let error = $state(null);
  let fieldErrors = $state({});
  let success = $state(false);

  // Validation
  const emailValid = $derived(email.includes('@') && email.includes('.'));
  const passwordValid = $derived(password.length >= 6);
  const formValid = $derived(emailValid && passwordValid);

  // Touched state for showing errors after blur
  let touched = $state({ email: false, password: false });

  async function handleSubmit() {
    touched = { email: true, password: true };

    if (!formValid) {
      fieldErrors = {
        ...(emailValid ? {} : { email: 'Please enter a valid email address' }),
        ...(passwordValid ? {} : { password: 'Password must be at least 6 characters' })
      };
      return;
    }

    loading = true;
    error = null;
    fieldErrors = {};

    const result = await mockSubmit(
      () => ({ user: { id: '1', email, name: 'Demo User' }, token: 'mock-jwt-token' }),
      {
        validationErrors: email === 'wrong@example.com'
          ? { password: 'Invalid email or password' }
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
    email = '';
    password = '';
    touched = { email: false, password: false };
  }
</script>

<!-- Full-screen login -->
<div class="h-full bg-background overflow-y-auto px-5 py-6">
  {#if success}
    <!-- Success State -->
    <div class="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <div class="w-20 h-20 rounded-full bg-success-soft text-success flex items-center justify-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 class="text-xl font-semibold text-foreground mb-2">Welcome Back!</h1>
      <p class="text-muted-foreground mb-8">You've successfully signed in.</p>
      <Button variant="ghost" onclick={resetDemo}>
        Sign Out (Reset Demo)
      </Button>
    </div>
  {:else}
    <!-- Login Form -->
    <div class="max-w-sm mx-auto pt-10">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-xl font-semibold text-foreground mb-2">Sign In</h1>
        <p class="text-muted-foreground">Welcome back! Please sign in to continue.</p>
      </div>

      <!-- Form -->
      <form class="flex flex-col gap-5" onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        <!-- Global Error -->
        {#if error}
          <div class="flex items-center gap-3 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
        {/if}

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
          <div class="flex justify-between items-center">
            <label class="text-sm font-medium text-foreground" for="password">Password</label>
            <Button variant="ghost" size="sm" onclick={() => alert('Navigate to Forgot Password')}>
              Forgot password?
            </Button>
          </div>
          <Input
            id="password"
            type="password"
            bind:value={password}
            onblur={() => touched.password = true}
            placeholder="Enter your password"
            autocomplete="current-password"
            disabled={loading}
            invalid={touched.password && !passwordValid}
          />
          {#if touched.password && (fieldErrors.password || !passwordValid)}
            <span class="text-xs text-destructive">{fieldErrors.password || 'Password must be at least 6 characters'}</span>
          {/if}
        </div>

        <!-- Remember Me -->
        <label class="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            class="h-4 w-4 rounded border border-input bg-background accent-primary
              focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
              disabled:cursor-not-allowed disabled:opacity-50"
            bind:checked={rememberMe}
            disabled={loading}
          />
          <span class="text-sm text-foreground">Remember me</span>
        </label>

        <!-- Submit Button -->
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          {loading}
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      <!-- Sign Up Link -->
      <p class="text-center text-sm text-muted-foreground mt-6">
        Don't have an account?
        <Button variant="ghost" size="sm" onclick={() => alert('Navigate to Sign Up')}>
          Sign up
        </Button>
      </p>

      <!-- Demo Hint -->
      <p class="text-center text-xs text-text-disabled mt-8">
        Try <strong>wrong@example.com</strong> to see error handling
      </p>
    </div>
  {/if}
</div>
