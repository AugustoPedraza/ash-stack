<script>
  /**
   * Settings Recipe
   * Multi-section settings with save/discard detection and unsaved changes warning.
   * Uses AppHeader with dynamic Save CTA.
   *
   * Uses: AppHeader, Button, Input, FormField, Toggle, Dropdown
   */
  import { mockSubmit } from '../../../lib/mock/mockApi.js';
  import { AppHeader, Button, Input, FormField, Toggle, Dropdown } from '../../ui';

  // Initial values (simulating loaded from server)
  const initialValues = {
    displayName: 'John Doe',
    email: 'john@example.com',
    timezone: 'America/New_York',
    language: 'en',
    emailNotifications: true,
    pushNotifications: false,
    weeklyDigest: true,
    marketingEmails: false
  };

  // Current form values
  let displayName = $state(initialValues.displayName);
  let email = $state(initialValues.email);
  let timezone = $state(initialValues.timezone);
  let language = $state(initialValues.language);
  let emailNotifications = $state(initialValues.emailNotifications);
  let pushNotifications = $state(initialValues.pushNotifications);
  let weeklyDigest = $state(initialValues.weeklyDigest);
  let marketingEmails = $state(initialValues.marketingEmails);

  let loading = $state(false);
  let saved = $state(false);

  // Dropdown states
  let showTimezoneDropdown = $state(false);
  let showLanguageDropdown = $state(false);

  // Track if form has unsaved changes
  const isDirty = $derived(
    displayName !== initialValues.displayName ||
    email !== initialValues.email ||
    timezone !== initialValues.timezone ||
    language !== initialValues.language ||
    emailNotifications !== initialValues.emailNotifications ||
    pushNotifications !== initialValues.pushNotifications ||
    weeklyDigest !== initialValues.weeklyDigest ||
    marketingEmails !== initialValues.marketingEmails
  );

  async function handleSave() {
    loading = true;
    saved = false;

    await mockSubmit(() => ({ success: true }));

    // Update initial values to current (simulating server save)
    Object.assign(initialValues, {
      displayName, email, timezone, language,
      emailNotifications, pushNotifications, weeklyDigest, marketingEmails
    });

    loading = false;
    saved = true;

    // Hide saved message after 3 seconds
    setTimeout(() => { saved = false; }, 3000);
  }

  function handleDiscard() {
    displayName = initialValues.displayName;
    email = initialValues.email;
    timezone = initialValues.timezone;
    language = initialValues.language;
    emailNotifications = initialValues.emailNotifications;
    pushNotifications = initialValues.pushNotifications;
    weeklyDigest = initialValues.weeklyDigest;
    marketingEmails = initialValues.marketingEmails;
  }

  const timezones = [
    { id: 'America/New_York', label: 'Eastern Time (ET)' },
    { id: 'America/Chicago', label: 'Central Time (CT)' },
    { id: 'America/Denver', label: 'Mountain Time (MT)' },
    { id: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { id: 'Europe/London', label: 'London (GMT)' },
    { id: 'Europe/Paris', label: 'Paris (CET)' },
  ];

  const languages = [
    { id: 'en', label: 'English' },
    { id: 'es', label: 'Spanish' },
    { id: 'fr', label: 'French' },
    { id: 'de', label: 'German' },
  ];

  // Derived labels for dropdowns
  const timezoneLabel = $derived(timezones.find(t => t.id === timezone)?.label || 'Select timezone');
  const languageLabel = $derived(languages.find(l => l.id === language)?.label || 'Select language');
</script>

<div class="h-full bg-background flex flex-col overflow-hidden">
  <!-- Header with save CTA -->
  <AppHeader title="Settings">
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
    <div class="max-w-lg mx-auto space-y-8">
      <!-- Account Section -->
      <section>
        <h2 class="text-lg font-semibold text-foreground mb-1">Account</h2>
        <p class="text-sm text-muted-foreground mb-4">Manage your account information</p>

        <div class="space-y-4">
          <FormField label="Display Name" id="displayName">
            <Input
              id="displayName"
              type="text"
              bind:value={displayName}
            />
          </FormField>

          <FormField label="Email" id="email" helper="Used for login and notifications">
            <Input
              id="email"
              type="email"
              bind:value={email}
            />
          </FormField>
        </div>
      </section>

      <div class="border-t border-border"></div>

      <!-- Preferences Section -->
      <section>
        <h2 class="text-lg font-semibold text-foreground mb-1">Preferences</h2>
        <p class="text-sm text-muted-foreground mb-4">Customize your experience</p>

        <div class="space-y-4">
          <!-- Timezone Dropdown -->
          <div class="flex flex-col gap-1.5">
            <span class="text-sm font-medium text-foreground">Timezone</span>
            <Dropdown
              bind:open={showTimezoneDropdown}
              items={timezones}
              align="left"
              onselect={(item) => timezone = item.id}
            >
              {#snippet trigger()}
                <button
                  type="button"
                  class="w-full flex items-center justify-between px-4 py-2.5 text-sm border border-border rounded-md bg-background text-left hover:ring-ring transition-colors"
                >
                  <span class="text-foreground">{timezoneLabel}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-muted-foreground transition-transform {showTimezoneDropdown ? 'rotate-180' : ''}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              {/snippet}
            </Dropdown>
          </div>

          <!-- Language Dropdown -->
          <div class="flex flex-col gap-1.5">
            <span class="text-sm font-medium text-foreground">Language</span>
            <Dropdown
              bind:open={showLanguageDropdown}
              items={languages}
              align="left"
              onselect={(item) => language = item.id}
            >
              {#snippet trigger()}
                <button
                  type="button"
                  class="w-full flex items-center justify-between px-4 py-2.5 text-sm border border-border rounded-md bg-background text-left hover:ring-ring transition-colors"
                >
                  <span class="text-foreground">{languageLabel}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-muted-foreground transition-transform {showLanguageDropdown ? 'rotate-180' : ''}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              {/snippet}
            </Dropdown>
          </div>
        </div>
      </section>

      <div class="border-t border-border"></div>

      <!-- Notifications Section -->
      <section>
        <h2 class="text-lg font-semibold text-foreground mb-1">Notifications</h2>
        <p class="text-sm text-muted-foreground mb-4">Choose what updates you receive</p>

        <div class="space-y-3">
          <Toggle
            bind:checked={emailNotifications}
            label="Email Notifications"
            description="Receive updates via email"
          />

          <Toggle
            bind:checked={pushNotifications}
            label="Push Notifications"
            description="Receive push notifications on your device"
          />

          <Toggle
            bind:checked={weeklyDigest}
            label="Weekly Digest"
            description="Summary of activity every week"
          />

          <Toggle
            bind:checked={marketingEmails}
            label="Marketing Emails"
            description="Receive product updates and offers"
          />
        </div>
      </section>
    </div>
  </div>

  <!-- Unsaved changes warning banner -->
  {#if isDirty}
    <div class="bg-warning-soft border-t border-warning/30 px-5 py-3 lg:hidden">
      <div class="flex items-center justify-between max-w-lg mx-auto">
        <span class="text-sm text-warning">Unsaved changes</span>
        <div class="flex items-center gap-4">
          <Button variant="ghost" size="sm" onclick={handleDiscard}>
            Discard
          </Button>
          <Button variant="primary" size="sm" {loading} onclick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  {/if}
</div>
