<script>
  /**
   * Stepper Recipe (Mobile-First)
   * Simple progress indicators for multi-step flows.
   *
   * Uses: Button
   */
  import { Button } from '../../ui';

  const steps = [
    { id: 1, label: 'Account' },
    { id: 2, label: 'Profile' },
    { id: 3, label: 'Preferences' },
    { id: 4, label: 'Confirm' }
  ];

  let currentStep = $state(2);

  function nextStep() {
    if (currentStep < steps.length) {
      currentStep++;
    }
  }

  function prevStep() {
    if (currentStep > 1) {
      currentStep--;
    }
  }

  const progress = $derived((currentStep / steps.length) * 100);
  const currentLabel = $derived(steps[currentStep - 1]?.label || '');
</script>

<div class="h-full bg-surface overflow-y-auto px-5 py-6">
  <div class="max-w-md mx-auto">
    <div class="mb-8">
      <h1 class="text-xl font-semibold text-text mb-2">Progress</h1>
      <p class="text-text-muted text-sm">Mobile-friendly progress indicators for multi-step flows.</p>
    </div>

    <div class="flex flex-col gap-6">
      <!-- Progress Bar with Label -->
      <div class="flex flex-col gap-1.5">
        <span class="text-sm font-medium text-text">Progress Bar</span>
        <p class="text-xs text-text-muted mb-2">Most common mobile pattern. Simple and clear.</p>

        <div class="p-4 border border-border-strong rounded-lg bg-surface">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-text">{currentLabel}</span>
            <span class="text-xs text-text-muted">Step {currentStep} of {steps.length}</span>
          </div>
          <div class="h-1.5 bg-surface-sunken rounded-full overflow-hidden">
            <div
              class="h-full bg-primary rounded-full transition-all duration-300"
              style="width: {progress}%"
            ></div>
          </div>
        </div>
      </div>

      <!-- Dots Indicator -->
      <div class="flex flex-col gap-1.5">
        <span class="text-sm font-medium text-text">Dots Indicator</span>
        <p class="text-xs text-text-muted mb-2">Good for onboarding flows (2-5 steps).</p>

        <div class="p-4 border border-border-strong rounded-lg bg-surface">
          <div class="flex items-center justify-center gap-2">
            {#each steps as step}
              <div
                class="w-2 h-2 rounded-full transition-all duration-300
                  {step.id === currentStep ? 'bg-primary w-6' : ''}
                  {step.id < currentStep ? 'bg-primary' : ''}
                  {step.id > currentStep ? 'bg-border' : ''}"
              ></div>
            {/each}
          </div>
          <p class="mt-3 text-sm text-text-muted text-center">{currentLabel}</p>
        </div>
      </div>

      <!-- Fraction Display -->
      <div class="flex flex-col gap-1.5">
        <span class="text-sm font-medium text-text">Fraction Display</span>
        <p class="text-xs text-text-muted mb-2">Minimal, shows exact position.</p>

        <div class="p-4 border border-border-strong rounded-lg bg-surface">
          <div class="flex items-center justify-center gap-1">
            <span class="text-2xl font-semibold text-primary">{currentStep}</span>
            <span class="text-lg text-text-disabled">/</span>
            <span class="text-lg text-text-muted">{steps.length}</span>
          </div>
          <p class="mt-2 text-sm text-text-muted text-center">{currentLabel}</p>
        </div>
      </div>

      <!-- Combined Header Pattern -->
      <div class="flex flex-col gap-1.5">
        <span class="text-sm font-medium text-text">In Screen Header</span>
        <p class="text-xs text-text-muted mb-2">Progress integrated with navigation.</p>

        <div class="border border-border-strong rounded-lg bg-surface overflow-hidden">
          <!-- Header with progress -->
          <div class="px-4 py-3 border-b border-border">
            <div class="flex items-center justify-between mb-2">
              <button
                type="button"
                class="text-sm text-text-muted hover:text-text transition-colors disabled:opacity-30"
                onclick={prevStep}
                disabled={currentStep === 1}
              >
                ← Back
              </button>
              <span class="text-sm font-medium text-text">{currentLabel}</span>
              <span class="text-xs text-text-muted w-12 text-right">
                {currentStep}/{steps.length}
              </span>
            </div>
            <div class="h-1 bg-surface-sunken rounded-full overflow-hidden">
              <div
                class="h-full bg-primary rounded-full transition-all duration-300"
                style="width: {progress}%"
              ></div>
            </div>
          </div>

          <!-- Content -->
          <div class="p-4">
            <p class="text-sm text-text-muted">Step content goes here...</p>
          </div>

          <!-- Footer -->
          <div class="px-4 py-3 border-t border-border">
            <Button
              variant="primary"
              fullWidth
              onclick={nextStep}
              disabled={currentStep === steps.length}
            >
              {currentStep === steps.length ? 'Complete' : 'Continue'}
            </Button>
          </div>
        </div>
      </div>

      <!-- Navigation Controls -->
      <div class="flex items-center justify-between">
        <button
          type="button"
          class="text-sm text-text-muted hover:text-text transition-colors disabled:opacity-30"
          onclick={prevStep}
          disabled={currentStep === 1}
        >
          ← Previous
        </button>
        <button
          type="button"
          class="text-sm font-medium text-primary hover:text-primary/80 transition-colors disabled:opacity-30"
          onclick={nextStep}
          disabled={currentStep === steps.length}
        >
          Next →
        </button>
      </div>

      <!-- Current State -->
      <div class="p-4 bg-surface-sunken rounded-lg">
        <h3 class="text-sm font-medium text-text mb-2">State</h3>
        <pre class="text-xs text-text-secondary">{JSON.stringify({
          currentStep,
          progress: Math.round(progress) + '%',
          label: currentLabel
        }, null, 2)}</pre>
      </div>

      <!-- Mobile UX Note -->
      <div class="p-4 bg-primary/5 border border-primary/20 rounded-lg">
        <h3 class="text-sm font-medium text-primary mb-2">Mobile UX Patterns</h3>
        <ul class="text-xs text-text-secondary space-y-1">
          <li>• Progress bar: clearest for longer flows</li>
          <li>• Dots: best for 2-5 step onboarding</li>
          <li>• Numbered steps take too much space</li>
          <li>• Always show current step label</li>
        </ul>
      </div>
    </div>
  </div>
</div>
