<script>
  /**
   * Multi-Step Wizard Recipe
   * Step indicator, navigation, validation per step, and summary.
   *
   * Uses: Button, Input, FormField, Toggle
   */
  import { mockSubmit } from '../../../lib/mock/mockApi.js';
  import { Button, Input, FormField, Toggle } from '../../ui';

  const steps = [
    { id: 1, label: 'Account' },
    { id: 2, label: 'Profile' },
    { id: 3, label: 'Preferences' },
    { id: 4, label: 'Review' }
  ];

  let currentStep = $state(1);

  // Derived for mobile-friendly progress display
  const progress = $derived((currentStep / steps.length) * 100);
  const currentLabel = $derived(steps[currentStep - 1]?.label || '');
  let loading = $state(false);
  let completed = $state(false);

  // Step 1: Account
  let email = $state('');
  let password = $state('');
  let touched1 = $state({ email: false, password: false });

  // Step 2: Profile
  let fullName = $state('');
  let phone = $state('');
  let touched2 = $state({ fullName: false, phone: false });

  // Step 3: Preferences
  let plan = $state('free');
  let notifications = $state(true);

  // Validation
  const step1Valid = $derived(
    email.includes('@') && email.includes('.') &&
    password.length >= 8
  );
  const step2Valid = $derived(
    fullName.trim().length >= 2 &&
    phone.replace(/\D/g, '').length >= 10
  );
  const step3Valid = $derived(true); // Always valid

  function nextStep() {
    if (currentStep === 1) {
      touched1 = { email: true, password: true };
      if (!step1Valid) return;
    }
    if (currentStep === 2) {
      touched2 = { fullName: true, phone: true };
      if (!step2Valid) return;
    }
    if (currentStep < 4) {
      currentStep++;
    }
  }

  function prevStep() {
    if (currentStep > 1) {
      currentStep--;
    }
  }

  async function handleSubmit() {
    loading = true;
    await mockSubmit(() => ({ success: true }));
    loading = false;
    completed = true;
  }

  function resetWizard() {
    currentStep = 1;
    completed = false;
    email = '';
    password = '';
    fullName = '';
    phone = '';
    plan = 'free';
    notifications = true;
    touched1 = { email: false, password: false };
    touched2 = { fullName: false, phone: false };
  }
</script>

<div class="h-full bg-background overflow-y-auto px-5 py-6">
  {#if completed}
    <!-- Success State -->
    <div class="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <div class="w-20 h-20 rounded-full bg-success-soft text-success flex items-center justify-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 class="text-xl font-semibold text-foreground mb-2">Setup Complete!</h1>
      <p class="text-muted-foreground mb-8">Your account has been created successfully.</p>
      <Button variant="ghost" onclick={resetWizard}>
        Start Over
      </Button>
    </div>
  {:else}
    <div class="max-w-md mx-auto">
      <!-- Mobile-First Progress Indicator -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-foreground">{currentLabel}</span>
          <span class="text-xs text-text-disabled">Step {currentStep} of {steps.length}</span>
        </div>
        <div class="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            class="h-full bg-primary rounded-full transition-all duration-300"
            style="width: {progress}%"
          ></div>
        </div>
        <!-- Dots indicator -->
        <div class="flex items-center justify-center gap-2 mt-3">
          {#each steps as step}
            <div
              class="w-2 h-2 rounded-full transition-all duration-300
                {step.id === currentStep ? 'bg-primary w-6' : ''}
                {step.id < currentStep ? 'bg-primary' : ''}
                {step.id > currentStep ? 'bg-muted' : ''}"
            ></div>
          {/each}
        </div>
      </div>

      <!-- Step Content -->
      <div class="min-h-[300px]">
        {#if currentStep === 1}
          <!-- Step 1: Account -->
          <div>
            <h2 class="text-lg font-semibold text-foreground mb-1">Create Account</h2>
            <p class="text-sm text-muted-foreground mb-6">Enter your email and create a password</p>

            <div class="space-y-4">
              <FormField
                label="Email"
                error={touched1.email && !email.includes('@') ? 'Please enter a valid email' : ''}
                id="email"
              >
                <Input
                  id="email"
                  type="email"
                  bind:value={email}
                  onblur={() => touched1.email = true}
                  placeholder="you@example.com"
                  invalid={touched1.email && !email.includes('@')}
                />
              </FormField>

              <FormField
                label="Password"
                error={touched1.password && password.length < 8 ? 'Password must be at least 8 characters' : ''}
                id="password"
              >
                <Input
                  id="password"
                  type="password"
                  bind:value={password}
                  onblur={() => touched1.password = true}
                  placeholder="At least 8 characters"
                  invalid={touched1.password && password.length < 8}
                />
              </FormField>
            </div>
          </div>
        {:else if currentStep === 2}
          <!-- Step 2: Profile -->
          <div>
            <h2 class="text-lg font-semibold text-foreground mb-1">Your Profile</h2>
            <p class="text-sm text-muted-foreground mb-6">Tell us a bit about yourself</p>

            <div class="space-y-4">
              <FormField
                label="Full Name"
                error={touched2.fullName && fullName.trim().length < 2 ? 'Please enter your name' : ''}
                id="fullName"
              >
                <Input
                  id="fullName"
                  type="text"
                  bind:value={fullName}
                  onblur={() => touched2.fullName = true}
                  placeholder="John Doe"
                  invalid={touched2.fullName && fullName.trim().length < 2}
                />
              </FormField>

              <FormField
                label="Phone Number"
                error={touched2.phone && phone.replace(/\D/g, '').length < 10 ? 'Please enter a valid phone number' : ''}
                id="phone"
              >
                <Input
                  id="phone"
                  type="tel"
                  bind:value={phone}
                  onblur={() => touched2.phone = true}
                  placeholder="(555) 123-4567"
                  invalid={touched2.phone && phone.replace(/\D/g, '').length < 10}
                />
              </FormField>
            </div>
          </div>
        {:else if currentStep === 3}
          <!-- Step 3: Preferences -->
          <div>
            <h2 class="text-lg font-semibold text-foreground mb-1">Preferences</h2>
            <p class="text-sm text-muted-foreground mb-6">Choose your plan and settings</p>

            <div class="space-y-4">
              <div class="flex flex-col gap-2">
                <span class="text-sm font-medium text-foreground">Plan</span>
                <div class="grid grid-cols-3 gap-2">
                  {#each ['free', 'pro', 'team'] as p}
                    <Button
                      variant={plan === p ? 'primary' : 'secondary'}
                      size="sm"
                      onclick={() => plan = p}
                    >
                      <span class="capitalize">{p}</span>
                    </Button>
                  {/each}
                </div>
              </div>

              <Toggle
                bind:checked={notifications}
                label="Email Notifications"
                description="Receive updates and tips"
              />
            </div>
          </div>
        {:else if currentStep === 4}
          <!-- Step 4: Review -->
          <div>
            <h2 class="text-lg font-semibold text-foreground mb-1">Review</h2>
            <p class="text-sm text-muted-foreground mb-6">Confirm your information</p>

            <div class="space-y-4">
              <div class="p-4 bg-muted/50 rounded-lg space-y-3">
                <div class="flex justify-between">
                  <span class="text-sm text-muted-foreground">Email</span>
                  <span class="text-sm font-medium text-foreground">{email}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-muted-foreground">Name</span>
                  <span class="text-sm font-medium text-foreground">{fullName}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-muted-foreground">Phone</span>
                  <span class="text-sm font-medium text-foreground">{phone}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-muted-foreground">Plan</span>
                  <span class="text-sm font-medium text-foreground capitalize">{plan}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-muted-foreground">Notifications</span>
                  <span class="text-sm font-medium text-foreground">{notifications ? 'Enabled' : 'Disabled'}</span>
                </div>
              </div>
            </div>
          </div>
        {/if}
      </div>

      <!-- Navigation -->
      <div class="flex items-center justify-between mt-8">
        <Button
          variant="ghost"
          onclick={prevStep}
          disabled={currentStep === 1}
        >
          Back
        </Button>

        {#if currentStep < 4}
          <Button
            variant="ghost"
            onclick={nextStep}
          >
            Continue
          </Button>
        {:else}
          <Button
            variant="primary"
            {loading}
            onclick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Account'}
          </Button>
        {/if}
      </div>
    </div>
  {/if}
</div>
