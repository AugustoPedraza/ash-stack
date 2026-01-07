<script>
  /**
   * Contact Form Recipe
   * Basic form with validation, submit loading, and success feedback.
   *
   * Uses: Button, Input, FormField
   */
  import { mockSubmit } from '../../../lib/mock/mockApi.js';
  import { Button, Input, FormField } from '../../ui';

  let name = $state('');
  let email = $state('');
  let subject = $state('');
  let message = $state('');
  let loading = $state(false);
  let error = $state(null);
  let success = $state(false);
  let touched = $state({ name: false, email: false, subject: false, message: false });

  // Validation
  const nameValid = $derived(name.trim().length >= 2);
  const emailValid = $derived(email.includes('@') && email.includes('.'));
  const subjectValid = $derived(subject.trim().length >= 3);
  const messageValid = $derived(message.trim().length >= 10);
  const formValid = $derived(nameValid && emailValid && subjectValid && messageValid);

  async function handleSubmit() {
    touched = { name: true, email: true, subject: true, message: true };

    if (!formValid) return;

    loading = true;
    error = null;

    const result = await mockSubmit(() => ({ sent: true }));

    loading = false;

    if (result.error) {
      error = result.error.message;
      return;
    }

    success = true;
  }

  function resetForm() {
    name = '';
    email = '';
    subject = '';
    message = '';
    touched = { name: false, email: false, subject: false, message: false };
    success = false;
    error = null;
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
      <h1 class="text-xl font-semibold text-text mb-2">Message Sent!</h1>
      <p class="text-text-secondary mb-8">We'll get back to you within 24 hours.</p>
      <Button variant="ghost" onclick={resetForm}>
        Send Another Message
      </Button>
    </div>
  {:else}
    <!-- Contact Form -->
    <div class="max-w-md mx-auto pt-6">
      <div class="mb-8">
        <h1 class="text-xl font-semibold text-text mb-2">Contact Us</h1>
        <p class="text-text-muted text-sm">Have a question? We'd love to hear from you.</p>
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

        <!-- Name Field -->
        <FormField
          label="Name"
          error={touched.name && !nameValid ? 'Please enter your name' : ''}
          id="name"
        >
          <Input
            id="name"
            type="text"
            bind:value={name}
            onblur={() => touched.name = true}
            placeholder="Your name"
            autocomplete="name"
            disabled={loading}
            invalid={touched.name && !nameValid}
          />
        </FormField>

        <!-- Email Field -->
        <FormField
          label="Email"
          error={touched.email && !emailValid ? 'Please enter a valid email' : ''}
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

        <!-- Subject Field -->
        <FormField
          label="Subject"
          error={touched.subject && !subjectValid ? 'Please enter a subject' : ''}
          id="subject"
        >
          <Input
            id="subject"
            type="text"
            bind:value={subject}
            onblur={() => touched.subject = true}
            placeholder="How can we help?"
            disabled={loading}
            invalid={touched.subject && !subjectValid}
          />
        </FormField>

        <!-- Message Field (textarea - keeping raw for now) -->
        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium text-text" for="message">Message</label>
          <textarea
            id="message"
            class="w-full px-4 py-3 min-h-32 bg-surface text-text border rounded-[var(--radius-md)]
              transition-colors duration-[var(--duration-fast)]
              placeholder:text-text-muted
              focus:outline-none focus:border-border-focus focus:ring-1 focus:ring-border-focus
              {touched.message && !messageValid ? 'border-error' : 'border-border'}"
            bind:value={message}
            onblur={() => touched.message = true}
            placeholder="Tell us more about your inquiry..."
            disabled={loading}
          ></textarea>
          {#if touched.message && !messageValid}
            <span class="text-xs text-error">Message must be at least 10 characters</span>
          {:else}
            <span class="text-xs text-text-disabled">{message.length}/500</span>
          {/if}
        </div>

        <!-- Submit Button -->
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          {loading}
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send Message'}
        </Button>
      </form>
    </div>
  {/if}
</div>
