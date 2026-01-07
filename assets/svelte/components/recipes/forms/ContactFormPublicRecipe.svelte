<script>
  /**
   * Contact Form (Public) Recipe
   * Public-facing form with CTA at bottom - user flows top-to-bottom.
   * Use for: Contact us, Support requests, Lead capture, Auth forms.
   *
   * Uses: Button, Input, FormField
   */
  import { mockSubmit } from '../../../lib/mock/mockApi.js';
  import { Button, Input, FormField } from '../../ui';

  let name = $state('');
  let email = $state('');
  let message = $state('');
  let loading = $state(false);
  let success = $state(false);
  let error = $state(null);
  let touched = $state({ name: false, email: false, message: false });

  const nameValid = $derived(name.trim().length >= 2);
  const emailValid = $derived(email.includes('@') && email.includes('.'));
  const messageValid = $derived(message.trim().length >= 10);
  const formValid = $derived(nameValid && emailValid && messageValid);

  async function handleSubmit() {
    touched = { name: true, email: true, message: true };
    if (!formValid) return;

    loading = true;
    error = null;

    const result = await mockSubmit(() => ({ success: true }));

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
    message = '';
    success = false;
    error = null;
    touched = { name: false, email: false, message: false };
  }
</script>

<div class="h-full bg-background overflow-y-auto px-5 py-8">
  {#if success}
    <!-- Success State -->
    <div class="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div class="w-16 h-16 rounded-full bg-success-soft text-success flex items-center justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 class="text-xl font-semibold text-foreground mb-2">Message Sent!</h1>
      <p class="text-muted-foreground mb-6">We'll get back to you within 24 hours.</p>
      <Button variant="ghost" onclick={resetForm}>
        Send Another
      </Button>
    </div>
  {:else}
    <div class="max-w-sm mx-auto">
      <!-- Header - Simple, no navigation -->
      <div class="text-center mb-8">
        <h1 class="text-xl font-semibold text-foreground mb-2">Contact Us</h1>
        <p class="text-sm text-muted-foreground">Have a question? We'd love to hear from you.</p>
      </div>

      <!-- Form -->
      <form class="space-y-5" onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        {#if error}
          <div class="p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
            {error}
          </div>
        {/if}

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
            disabled={loading}
            invalid={touched.name && !nameValid}
          />
        </FormField>

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
            disabled={loading}
            invalid={touched.email && !emailValid}
          />
        </FormField>

        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium text-foreground" for="message">Message</label>
          <textarea
            id="message"
            class="w-full px-4 py-3 min-h-28 bg-background text-foreground border rounded-md
              transition-colors duration-150
              placeholder:text-muted-foreground
              focus:outline-none focus:ring-ring focus:ring-1 focus:ring-ring
              {touched.message && !messageValid ? 'border-destructive' : 'border-border'}"
            bind:value={message}
            onblur={() => touched.message = true}
            placeholder="How can we help?"
            disabled={loading}
          ></textarea>
          {#if touched.message && !messageValid}
            <span class="text-xs text-destructive">Please enter at least 10 characters</span>
          {/if}
        </div>

        <!-- CTA at Bottom - Public Form Pattern -->
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
