<script>
  /**
   * Edit Contact Recipe (In-App)
   * In-app form with Save CTA in header - user has already committed to editing.
   * Use for: Edit profile, Edit contact, Edit settings, any logged-in editing.
   * Contrast with ContactFormPublicRecipe which has CTA at bottom.
   *
   * Uses: AppHeader, Button, Input, FormField
   */
  import { mockSubmit } from '../../../lib/mock/mockApi.js';
  import { AppHeader, Button, Input, FormField } from '../../ui';

  // Simulated existing contact data
  const original = {
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+1 (555) 123-4567',
    company: 'Acme Corp',
    notes: 'Met at the conference in March. Interested in partnership.'
  };

  let name = $state(original.name);
  let email = $state(original.email);
  let phone = $state(original.phone);
  let company = $state(original.company);
  let notes = $state(original.notes);

  let loading = $state(false);
  let saved = $state(false);

  const isDirty = $derived(
    name !== original.name ||
    email !== original.email ||
    phone !== original.phone ||
    company !== original.company ||
    notes !== original.notes
  );

  async function handleSave() {
    loading = true;
    saved = false;

    await mockSubmit(() => ({ success: true }));

    // Update original values
    Object.assign(original, { name, email, phone, company, notes });

    loading = false;
    saved = true;
    setTimeout(() => { saved = false; }, 3000);
  }

  function handleBack() {
    // In real app, would navigate back or show unsaved changes warning
    if (isDirty) {
      // Could show confirmation dialog
    }
  }
</script>

<div class="h-full bg-base-100 flex flex-col overflow-hidden">
  <!-- Header with Save CTA - In-App Pattern -->
  <AppHeader title="Edit Contact" showBack={true} backLabel="" onBack={handleBack}>
    {#snippet actions()}
      {#if saved}
        <span class="text-sm text-success flex items-center gap-1 mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </span>
      {/if}
      <Button
        variant="ghost"
        size="sm"
        onclick={handleSave}
        disabled={!isDirty || loading}
        {loading}
      >
        Save
      </Button>
    {/snippet}
  </AppHeader>

  <div class="flex-1 overflow-y-auto px-5 py-6">
    <div class="max-w-md mx-auto">
      <!-- Form - No submit button at bottom, Save is in header -->
      <form class="space-y-5" onsubmit={(e) => { e.preventDefault(); handleSave(); }}>
        <FormField label="Name" id="name">
          <Input
            id="name"
            type="text"
            bind:value={name}
          />
        </FormField>

        <FormField label="Email" id="email">
          <Input
            id="email"
            type="email"
            bind:value={email}
          />
        </FormField>

        <FormField label="Phone" id="phone">
          <Input
            id="phone"
            type="tel"
            bind:value={phone}
          />
        </FormField>

        <FormField label="Company" id="company">
          <Input
            id="company"
            type="text"
            bind:value={company}
          />
        </FormField>

        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium text-text" for="notes">Notes</label>
          <textarea
            id="notes"
            class="w-full px-4 py-3 min-h-24 bg-surface text-text border border-border rounded-[var(--radius-md)]
              transition-colors duration-[var(--duration-fast)]
              placeholder:text-text-muted
              focus:outline-none focus:border-border-focus focus:ring-1 focus:ring-border-focus"
            bind:value={notes}
          ></textarea>
        </div>
      </form>

      <!-- Danger Zone - Common pattern for edit screens -->
      <div class="mt-10 pt-6 border-t border-border">
        <h3 class="text-sm font-medium text-error mb-3">Danger Zone</h3>
        <Button variant="danger" size="sm">
          Delete Contact
        </Button>
      </div>
    </div>
  </div>
</div>
