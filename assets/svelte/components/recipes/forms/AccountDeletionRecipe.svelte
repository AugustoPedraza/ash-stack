<script>
  /**
   * Account Deletion Recipe
   * Danger zone styling, confirmation input, and destructive action flow.
   *
   * Uses: Button, Input, Card
   */
  import { mockSubmit } from '../../../lib/mock/mockApi.js';
  import { Button, Input, Card } from '../../ui';

  const CONFIRMATION_TEXT = 'delete my account';

  let showConfirmation = $state(false);
  let confirmInput = $state('');
  let loading = $state(false);
  let deleted = $state(false);

  const confirmationValid = $derived(confirmInput.toLowerCase() === CONFIRMATION_TEXT);

  async function handleDelete() {
    if (!confirmationValid) return;

    loading = true;
    await mockSubmit(() => ({ success: true }), { delay: 2000 });
    loading = false;
    deleted = true;
  }

  function resetDemo() {
    showConfirmation = false;
    confirmInput = '';
    deleted = false;
  }
</script>

<div class="h-full bg-base-100 overflow-y-auto px-5 py-6">
  {#if deleted}
    <!-- Deleted State -->
    <div class="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <div class="w-20 h-20 rounded-full bg-muted text-text-disabled flex items-center justify-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 class="text-xl font-semibold text-foreground mb-2">Account Deleted</h1>
      <p class="text-muted-foreground mb-8">Your account and all data have been permanently removed.</p>
      <Button variant="ghost" onclick={resetDemo}>
        Reset Demo
      </Button>
    </div>
  {:else}
    <div class="max-w-md mx-auto pt-6">
      <h1 class="text-xl font-semibold text-foreground mb-6">Account Settings</h1>

      <!-- Normal Settings Section -->
      <section class="mb-8">
        <h2 class="text-lg font-semibold text-foreground mb-4">Export Data</h2>
        <Card variant="flat">
          <p class="text-sm text-muted-foreground mb-3">
            Download a copy of all your data including profile information, preferences, and activity history.
          </p>
          <Button variant="secondary" size="sm">
            {#snippet children()}
              <span class="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export Data
              </span>
            {/snippet}
          </Button>
        </Card>
      </section>

      <!-- Danger Zone -->
      <section>
        <h2 class="text-lg font-semibold text-destructive mb-4">Danger Zone</h2>
        <div class="border border-destructive/30 rounded-lg overflow-hidden">
          <div class="p-4 bg-destructive/10">
            <h3 class="font-medium text-foreground mb-1">Delete Account</h3>
            <p class="text-sm text-muted-foreground mb-4">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>

            {#if !showConfirmation}
              <Button variant="danger" onclick={() => showConfirmation = true}>
                Delete Account
              </Button>
            {:else}
              <!-- Confirmation Form -->
              <div class="p-4 bg-background rounded-lg border border-destructive/30 mt-4">
                <div class="flex items-start gap-3 mb-4">
                  <div class="w-10 h-10 rounded-full bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-medium text-foreground">Are you absolutely sure?</h4>
                    <p class="text-sm text-muted-foreground mt-1">
                      This will permanently delete your account, including all projects, files, and settings.
                      <strong class="text-foreground">This cannot be undone.</strong>
                    </p>
                  </div>
                </div>

                <div class="space-y-4">
                  <div class="flex flex-col gap-1.5">
                    <label class="text-sm text-muted-foreground" for="confirmDelete">
                      Type <strong class="text-foreground">{CONFIRMATION_TEXT}</strong> to confirm:
                    </label>
                    <Input
                      id="confirmDelete"
                      type="text"
                      bind:value={confirmInput}
                      placeholder={CONFIRMATION_TEXT}
                      autocomplete="off"
                      disabled={loading}
                      invalid={confirmInput.length > 0 && !confirmationValid}
                    />
                  </div>

                  <div class="flex gap-3">
                    <Button
                      variant="ghost"
                      fullWidth
                      onclick={() => { showConfirmation = false; confirmInput = ''; }}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="danger"
                      fullWidth
                      {loading}
                      onclick={handleDelete}
                      disabled={!confirmationValid || loading}
                    >
                      {loading ? 'Deleting...' : 'Delete Forever'}
                    </Button>
                  </div>
                </div>
              </div>
            {/if}
          </div>
        </div>
      </section>

      <!-- Warning Note -->
      <Card variant="flat" class="mt-8">
        <div class="flex gap-3 p-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-warning shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p class="text-sm text-muted-foreground">
              <strong class="text-foreground">Before deleting:</strong> Consider exporting your data first. Once deleted, we cannot recover your account or any associated information.
            </p>
          </div>
        </div>
      </Card>
    </div>
  {/if}
</div>
