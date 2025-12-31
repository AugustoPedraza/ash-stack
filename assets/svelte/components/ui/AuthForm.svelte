<!--
  AuthForm Component
  Flexible authentication form supporting login, register, and forgot password modes.
  Integrates with Phoenix LiveView and Ash authentication.
-->
<script>
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';
  import { pushEvent } from '../../lib/liveview.js';
  import Button from './Button.svelte';
  import Input from './Input.svelte';
  import Checkbox from './Checkbox.svelte';
  import FormField from './FormField.svelte';

  const dispatch = createEventDispatcher();

  /**
   * Form mode
   * @type {'login' | 'register' | 'forgot' | 'reset'}
   */
  export let mode = 'login';

  /**
   * Form errors from server
   * @type {{ [field: string]: string }}
   */
  export let errors = {};

  /**
   * Whether form is submitting
   * @type {boolean}
   */
  export let loading = false;

  /**
   * Show "Remember me" checkbox (login only)
   * @type {boolean}
   */
  export let showRemember = true;

  /**
   * Show OAuth providers
   * @type {boolean}
   */
  export let showOAuth = true;

  /**
   * Available OAuth providers
   * @type {Array<{ id: string, name: string, icon?: string }>}
   */
  export let oauthProviders = [];

  /**
   * Show password strength indicator (register only)
   * @type {boolean}
   */
  export let showPasswordStrength = true;

  /**
   * Minimum password length
   * @type {number}
   */
  export let minPasswordLength = 8;

  /**
   * Custom submit event name
   * @type {string}
   */
  export let submitEvent = '';

  /**
   * Links configuration
   * @type {{ login?: string, register?: string, forgot?: string }}
   */
  export let links = {};

  // Form data
  let email = '';
  let password = '';
  let passwordConfirm = '';
  let name = '';
  let rememberMe = false;

  // Password visibility
  let showPassword = false;
  let showPasswordConfirm = false;

  // Derived
  $: formTitle = {
    login: 'Sign in to your account',
    register: 'Create your account',
    forgot: 'Reset your password',
    reset: 'Set new password'
  }[mode];

  $: submitLabel = {
    login: 'Sign in',
    register: 'Create account',
    forgot: 'Send reset link',
    reset: 'Reset password'
  }[mode];

  $: eventName = submitEvent || {
    login: 'login',
    register: 'register',
    forgot: 'forgot_password',
    reset: 'reset_password'
  }[mode];

  // Password strength calculation
  $: passwordStrength = calculatePasswordStrength(password);

  function calculatePasswordStrength(pwd) {
    if (!pwd) return { score: 0, label: '', color: '' };

    let score = 0;
    if (pwd.length >= minPasswordLength) score++;
    if (pwd.length >= 12) score++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[^a-zA-Z0-9]/.test(pwd)) score++;

    const levels = [
      { label: 'Weak', color: 'error' },
      { label: 'Fair', color: 'warning' },
      { label: 'Good', color: 'info' },
      { label: 'Strong', color: 'success' },
      { label: 'Very strong', color: 'success' }
    ];

    return { score, ...levels[Math.min(score, 4)] };
  }

  function handleSubmit() {
    const data = { email };

    if (mode === 'login') {
      data.password = password;
      data.remember_me = rememberMe;
    } else if (mode === 'register') {
      data.name = name;
      data.password = password;
      data.password_confirmation = passwordConfirm;
    } else if (mode === 'reset') {
      data.password = password;
      data.password_confirmation = passwordConfirm;
    }

    dispatch('submit', data);
    pushEvent(eventName, data);
  }

  function handleOAuth(provider) {
    dispatch('oauth', { provider });
    pushEvent('oauth', { provider: provider.id });
  }

  function switchMode(newMode) {
    dispatch('modeChange', { mode: newMode });
  }
</script>

<div class="auth-form">
  <div class="auth-header">
    <h1 class="auth-title">{formTitle}</h1>

    {#if mode === 'login' && links.register}
      <p class="auth-subtitle">
        Don't have an account?
        <a href={links.register} class="auth-link" on:click|preventDefault={() => switchMode('register')}>
          Sign up
        </a>
      </p>
    {:else if mode === 'register' && links.login}
      <p class="auth-subtitle">
        Already have an account?
        <a href={links.login} class="auth-link" on:click|preventDefault={() => switchMode('login')}>
          Sign in
        </a>
      </p>
    {:else if mode === 'forgot' && links.login}
      <p class="auth-subtitle">
        Remember your password?
        <a href={links.login} class="auth-link" on:click|preventDefault={() => switchMode('login')}>
          Sign in
        </a>
      </p>
    {/if}
  </div>

  {#if showOAuth && oauthProviders.length > 0 && (mode === 'login' || mode === 'register')}
    <div class="oauth-section" transition:fade={{ duration: 150 }}>
      <div class="oauth-buttons">
        {#each oauthProviders as provider}
          <Button
            variant="secondary"
            size="md"
            on:click={() => handleOAuth(provider)}
            disabled={loading}
          >
            {#if provider.icon}
              <span class="oauth-icon">{@html provider.icon}</span>
            {/if}
            Continue with {provider.name}
          </Button>
        {/each}
      </div>

      <div class="divider">
        <span class="divider-text">or continue with email</span>
      </div>
    </div>
  {/if}

  <form on:submit|preventDefault={handleSubmit} class="auth-fields">
    {#if mode === 'register'}
      <FormField label="Full name" error={errors.name} required>
        <Input
          bind:value={name}
          type="text"
          placeholder="John Doe"
          autocomplete="name"
          invalid={!!errors.name}
          disabled={loading}
        />
      </FormField>
    {/if}

    <FormField label="Email address" error={errors.email} required>
      <Input
        bind:value={email}
        type="email"
        placeholder="you@example.com"
        autocomplete="email"
        invalid={!!errors.email}
        disabled={loading}
      />
    </FormField>

    {#if mode !== 'forgot'}
      <FormField label="Password" error={errors.password} required>
        <div class="password-input">
          <Input
            bind:value={password}
            type={showPassword ? 'text' : 'password'}
            placeholder={mode === 'reset' ? 'New password' : 'Enter your password'}
            autocomplete={mode === 'login' ? 'current-password' : 'new-password'}
            invalid={!!errors.password}
            disabled={loading}
          />
          <button
            type="button"
            class="password-toggle"
            on:click={() => showPassword = !showPassword}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {#if showPassword}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="toggle-icon">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            {:else}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="toggle-icon">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            {/if}
          </button>
        </div>

        {#if showPasswordStrength && (mode === 'register' || mode === 'reset') && password}
          <div class="password-strength" transition:fade={{ duration: 100 }}>
            <div class="strength-bar">
              <div
                class="strength-fill strength-{passwordStrength.color}"
                style="width: {(passwordStrength.score / 5) * 100}%"
              />
            </div>
            <span class="strength-label">{passwordStrength.label}</span>
          </div>
        {/if}
      </FormField>
    {/if}

    {#if mode === 'register' || mode === 'reset'}
      <FormField label="Confirm password" error={errors.password_confirmation} required>
        <div class="password-input">
          <Input
            bind:value={passwordConfirm}
            type={showPasswordConfirm ? 'text' : 'password'}
            placeholder="Confirm your password"
            autocomplete="new-password"
            invalid={!!errors.password_confirmation}
            disabled={loading}
          />
          <button
            type="button"
            class="password-toggle"
            on:click={() => showPasswordConfirm = !showPasswordConfirm}
            aria-label={showPasswordConfirm ? 'Hide password' : 'Show password'}
          >
            {#if showPasswordConfirm}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="toggle-icon">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            {:else}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="toggle-icon">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            {/if}
          </button>
        </div>
      </FormField>
    {/if}

    {#if mode === 'login'}
      <div class="login-options">
        {#if showRemember}
          <Checkbox bind:checked={rememberMe} label="Remember me" size="sm" />
        {/if}

        {#if links.forgot}
          <a href={links.forgot} class="forgot-link" on:click|preventDefault={() => switchMode('forgot')}>
            Forgot password?
          </a>
        {/if}
      </div>
    {/if}

    <Button
      type="submit"
      variant="primary"
      size="lg"
      fullWidth
      {loading}
      disabled={loading}
    >
      {loading ? 'Please wait...' : submitLabel}
    </Button>

    {#if errors._form}
      <p class="form-error" role="alert" transition:fade={{ duration: 150 }}>
        {errors._form}
      </p>
    {/if}
  </form>

  {#if mode === 'forgot'}
    <p class="forgot-info">
      Enter your email address and we'll send you a link to reset your password.
    </p>
  {/if}
</div>

<style>
  .auth-form {
    width: 100%;
    max-width: 24rem;
    margin: 0 auto;
  }

  .auth-header {
    text-align: center;
    margin-bottom: var(--spacing-6);
  }

  .auth-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--color-text);
    margin: 0 0 var(--spacing-2);
  }

  .auth-subtitle {
    font-size: 0.875rem;
    color: var(--color-text-muted);
    margin: 0;
  }

  .auth-link {
    color: var(--color-primary);
    text-decoration: none;
    font-weight: 500;
  }

  .auth-link:hover {
    text-decoration: underline;
  }

  .oauth-section {
    margin-bottom: var(--spacing-6);
  }

  .oauth-buttons {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-3);
  }

  .oauth-icon {
    width: 1.25rem;
    height: 1.25rem;
    margin-right: var(--spacing-2);
  }

  .divider {
    display: flex;
    align-items: center;
    margin-top: var(--spacing-6);
  }

  .divider::before,
  .divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background-color: var(--color-border);
  }

  .divider-text {
    padding: 0 var(--spacing-3);
    font-size: 0.75rem;
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .auth-fields {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-4);
  }

  .password-input {
    position: relative;
  }

  .password-toggle {
    position: absolute;
    right: var(--spacing-3);
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    padding: var(--spacing-1);
    cursor: pointer;
    color: var(--color-text-muted);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .password-toggle:hover {
    color: var(--color-text);
  }

  .toggle-icon {
    width: 1.25rem;
    height: 1.25rem;
  }

  .password-strength {
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
    margin-top: var(--spacing-2);
  }

  .strength-bar {
    flex: 1;
    height: 4px;
    background-color: var(--color-surface-sunken);
    border-radius: var(--radius-full);
    overflow: hidden;
  }

  .strength-fill {
    height: 100%;
    transition: width 200ms ease, background-color 200ms ease;
  }

  .strength-error {
    background-color: var(--color-error);
  }

  .strength-warning {
    background-color: var(--color-warning);
  }

  .strength-info {
    background-color: var(--color-info);
  }

  .strength-success {
    background-color: var(--color-success);
  }

  .strength-label {
    font-size: 0.75rem;
    color: var(--color-text-muted);
    white-space: nowrap;
  }

  .login-options {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .forgot-link {
    font-size: 0.875rem;
    color: var(--color-primary);
    text-decoration: none;
  }

  .forgot-link:hover {
    text-decoration: underline;
  }

  .form-error {
    text-align: center;
    font-size: 0.875rem;
    color: var(--color-error);
    margin: 0;
    padding: var(--spacing-3);
    background-color: var(--color-error-soft);
    border-radius: var(--radius-md);
  }

  .forgot-info {
    margin-top: var(--spacing-4);
    font-size: 0.875rem;
    color: var(--color-text-muted);
    text-align: center;
  }
</style>
