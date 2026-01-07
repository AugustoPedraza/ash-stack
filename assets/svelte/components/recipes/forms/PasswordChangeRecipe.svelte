<script>
  /**
   * Password Change Recipe
   * Current password verification, new password with strength indicator, confirmation.
   *
   * Uses: Button, Input, FormField
   */
  import { mockSubmit } from '../../../lib/mock/mockApi.js';
  import { Button, Input, FormField } from '../../ui';

  let currentPassword = $state('');
  let newPassword = $state('');
  let confirmPassword = $state('');
  let loading = $state(false);
  let error = $state(null);
  let success = $state(false);
  let touched = $state({ current: false, new: false, confirm: false });

  // Password strength calculation
  const strength = $derived(() => {
    let score = 0;
    if (newPassword.length >= 8) score++;
    if (newPassword.length >= 12) score++;
    if (/[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword)) score++;
    if (/\d/.test(newPassword)) score++;
    if (/[^a-zA-Z0-9]/.test(newPassword)) score++;
    return score;
  });

  const strengthLabel = $derived(() => {
    const s = strength();
    if (s === 0) return { label: '', color: '' };
    if (s <= 2) return { label: 'Weak', color: 'text-error' };
    if (s <= 3) return { label: 'Medium', color: 'text-warning' };
    return { label: 'Strong', color: 'text-success' };
  });

  const strengthPercent = $derived(Math.min(100, (strength() / 5) * 100));

  // Validation
  const currentValid = $derived(currentPassword.length >= 1);
  const newValid = $derived(newPassword.length >= 8);
  const confirmValid = $derived(confirmPassword === newPassword && confirmPassword.length > 0);
  const formValid = $derived(currentValid && newValid && confirmValid);

  // Requirements checklist
  const requirements = $derived([
    { met: newPassword.length >= 8, label: 'At least 8 characters' },
    { met: /[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword), label: 'Upper and lowercase letters' },
    { met: /\d/.test(newPassword), label: 'At least one number' },
    { met: /[^a-zA-Z0-9]/.test(newPassword), label: 'At least one special character' },
  ]);

  async function handleSubmit() {
    touched = { current: true, new: true, confirm: true };

    if (!formValid) return;

    loading = true;
    error = null;

    const result = await mockSubmit(
      () => ({ success: true }),
      {
        validationErrors: currentPassword === 'wrong'
          ? { current: 'Current password is incorrect' }
          : {}
      }
    );

    loading = false;

    if (result.error) {
      if (result.error.details?.current) {
        error = result.error.details.current;
      } else {
        error = result.error.message;
      }
      return;
    }

    success = true;
  }

  function resetForm() {
    currentPassword = '';
    newPassword = '';
    confirmPassword = '';
    success = false;
    error = null;
    touched = { current: false, new: false, confirm: false };
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
      <h1 class="text-xl font-semibold text-text mb-2">Password Updated!</h1>
      <p class="text-text-secondary mb-8">Your password has been changed successfully.</p>
      <Button variant="ghost" onclick={resetForm}>
        Done
      </Button>
    </div>
  {:else}
    <div class="max-w-sm mx-auto pt-6">
      <div class="mb-8">
        <h1 class="text-xl font-semibold text-text mb-2">Change Password</h1>
        <p class="text-sm text-text-muted">Enter your current password and choose a new one.</p>
      </div>

      <form class="space-y-5" onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        {#if error}
          <div class="flex items-center gap-3 p-3 bg-error-soft border border-error/30 rounded-lg text-error text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
        {/if}

        <!-- Current Password -->
        <FormField
          label="Current Password"
          error={touched.current && !currentValid ? 'Please enter your current password' : ''}
          id="currentPassword"
        >
          <Input
            id="currentPassword"
            type="password"
            bind:value={currentPassword}
            onblur={() => touched.current = true}
            placeholder="Enter current password"
            autocomplete="current-password"
            disabled={loading}
            invalid={touched.current && !currentValid}
          />
        </FormField>

        <div class="border-t border-border my-2"></div>

        <!-- New Password -->
        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium text-text" for="newPassword">New Password</label>
          <Input
            id="newPassword"
            type="password"
            bind:value={newPassword}
            onblur={() => touched.new = true}
            placeholder="Enter new password"
            autocomplete="new-password"
            disabled={loading}
            invalid={touched.new && !newValid}
          />

          <!-- Strength Indicator -->
          {#if newPassword.length > 0}
            <div class="space-y-2 mt-1">
              <div class="flex items-center justify-between">
                <div class="flex-1 h-1.5 bg-base-200 rounded-full overflow-hidden mr-3">
                  <div
                    class="h-full transition-all duration-300 rounded-full
                      {strength() <= 2 ? 'bg-error' : strength() <= 3 ? 'bg-warning' : 'bg-success'}"
                    style="width: {strengthPercent}%"
                  ></div>
                </div>
                <span class="text-xs font-medium {strengthLabel().color}">{strengthLabel().label}</span>
              </div>

              <!-- Requirements -->
              <ul class="space-y-1">
                {#each requirements as req}
                  <li class="flex items-center gap-2 text-xs {req.met ? 'text-success' : 'text-text-disabled'}">
                    {#if req.met}
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    {:else}
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    {/if}
                    {req.label}
                  </li>
                {/each}
              </ul>
            </div>
          {/if}
        </div>

        <!-- Confirm Password -->
        <FormField
          label="Confirm New Password"
          error={touched.confirm && !confirmValid ? (confirmPassword.length === 0 ? 'Please confirm your password' : 'Passwords do not match') : ''}
          id="confirmPassword"
        >
          <Input
            id="confirmPassword"
            type="password"
            bind:value={confirmPassword}
            onblur={() => touched.confirm = true}
            placeholder="Confirm new password"
            autocomplete="new-password"
            disabled={loading}
            invalid={touched.confirm && !confirmValid}
          />
        </FormField>

        <!-- Submit -->
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          {loading}
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Password'}
        </Button>
      </form>

      <p class="text-xs text-text-disabled text-center mt-6">
        Try <strong>wrong</strong> as current password to see error handling
      </p>
    </div>
  {/if}
</div>
