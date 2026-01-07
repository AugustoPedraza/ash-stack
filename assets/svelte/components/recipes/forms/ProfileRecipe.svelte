<script>
  /**
   * Profile Recipe
   * Profile editing with avatar upload, field validation, and save states.
   * Uses AppHeader with dynamic Save CTA.
   *
   * Uses: AppHeader, Button, Input, FormField
   */
  import { mockSubmit } from '../../../lib/mock/mockApi.js';
  import { AppHeader, Button, Input, FormField } from '../../ui';

  // Profile data
  let avatar = $state(null);
  let avatarPreview = $state('https://api.dicebear.com/7.x/avataaars/svg?seed=John');
  let firstName = $state('John');
  let lastName = $state('Doe');
  let bio = $state('Software developer passionate about building great products.');
  let website = $state('https://johndoe.dev');
  let location = $state('San Francisco, CA');

  let loading = $state(false);
  let saved = $state(false);
  let uploadingAvatar = $state(false);

  // Track original values for dirty detection
  const original = {
    firstName: 'John',
    lastName: 'Doe',
    bio: 'Software developer passionate about building great products.',
    website: 'https://johndoe.dev',
    location: 'San Francisco, CA'
  };

  const isDirty = $derived(
    firstName !== original.firstName ||
    lastName !== original.lastName ||
    bio !== original.bio ||
    website !== original.website ||
    location !== original.location ||
    avatar !== null
  );

  function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onload = (e) => {
      avatarPreview = e.target.result;
    };
    reader.readAsDataURL(file);
    avatar = file;

    // Simulate upload
    uploadingAvatar = true;
    setTimeout(() => {
      uploadingAvatar = false;
    }, 1500);
  }

  async function handleSave() {
    loading = true;
    saved = false;

    await mockSubmit(() => ({ success: true }));

    // Update original values
    Object.assign(original, { firstName, lastName, bio, website, location });
    avatar = null;

    loading = false;
    saved = true;
    setTimeout(() => { saved = false; }, 3000);
  }
</script>

<div class="h-full bg-base-100 flex flex-col overflow-hidden">
  <!-- Header with Save CTA -->
  <AppHeader title="Edit Profile" showBack={true} backLabel="" onBack={() => {}}>
    {#snippet actions()}
      {#if saved}
        <span class="text-sm text-success flex items-center gap-1 mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </span>
      {/if}
      <Button
        variant={isDirty ? 'ghost' : 'ghost'}
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
      <!-- Avatar Section -->
      <div class="flex flex-col items-center mb-8">
        <div class="relative">
          <div class="w-24 h-24 rounded-full overflow-hidden bg-muted ring-4 ring-background">
            {#if uploadingAvatar}
              <div class="w-full h-full flex items-center justify-center bg-muted">
                <span class="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></span>
              </div>
            {:else}
              <img src={avatarPreview} alt="Profile" class="w-full h-full object-cover" />
            {/if}
          </div>
          <label class="absolute bottom-0 right-0 w-8 h-8 bg-primary text-on-primary rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-primary-hover transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <input
              type="file"
              accept="image/*"
              class="hidden"
              onchange={handleAvatarChange}
            />
          </label>
        </div>
        <p class="text-xs text-text-disabled mt-3">JPG, PNG or GIF. Max 5MB.</p>
      </div>

      <!-- Form -->
      <form class="space-y-5" onsubmit={(e) => { e.preventDefault(); handleSave(); }}>
        <!-- Name Fields - Side by Side on larger screens -->
        <div class="grid grid-cols-2 gap-4">
          <FormField label="First Name" id="firstName">
            <Input
              id="firstName"
              type="text"
              bind:value={firstName}
            />
          </FormField>
          <FormField label="Last Name" id="lastName">
            <Input
              id="lastName"
              type="text"
              bind:value={lastName}
            />
          </FormField>
        </div>

        <!-- Bio -->
        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium text-foreground" for="bio">Bio</label>
          <textarea
            id="bio"
            class="w-full px-4 py-3 min-h-24 bg-background text-foreground border border-border rounded-md
              transition-colors duration-150
              placeholder:text-muted-foreground
              focus:outline-none focus:ring-ring focus:ring-1 focus:ring-ring"
            bind:value={bio}
            placeholder="Tell us about yourself..."
            maxlength="160"
          ></textarea>
          <span class="text-xs text-text-disabled text-right">{bio.length}/160</span>
        </div>

        <!-- Website -->
        <FormField label="Website" id="website">
          <Input
            id="website"
            type="url"
            bind:value={website}
            placeholder="https://yourwebsite.com"
          />
        </FormField>

        <!-- Location -->
        <FormField label="Location" id="location">
          <Input
            id="location"
            type="text"
            bind:value={location}
            placeholder="City, Country"
          />
        </FormField>
      </form>
    </div>
  </div>
</div>
