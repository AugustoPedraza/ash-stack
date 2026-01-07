<script>
  /**
   * Confirmations Recipe
   * Delete and discard confirmation dialogs with proper styling.
   *
   * Uses: Button, Input, Modal, Card
   */
  import { Button, Input, Modal, Card } from '../../ui';

  let showDeleteModal = $state(false);
  let showDiscardModal = $state(false);
  let showLogoutModal = $state(false);
  let deleteConfirmText = $state('');
  let isDeleting = $state(false);

  // Demo item to delete
  const itemToDelete = { name: 'Project Alpha', type: 'project' };

  function handleDelete() {
    isDeleting = true;
    setTimeout(() => {
      isDeleting = false;
      showDeleteModal = false;
      deleteConfirmText = '';
      // Show success toast in real app
    }, 1500);
  }

  function handleDiscard() {
    showDiscardModal = false;
    // Navigate away in real app
  }

  function handleLogout() {
    showLogoutModal = false;
    // Logout in real app
  }

  const canDelete = $derived(
    deleteConfirmText.toLowerCase() === itemToDelete.name.toLowerCase()
  );
</script>

<div class="h-full bg-background overflow-y-auto px-5 py-6">
  <div class="max-w-md mx-auto">
    <div class="mb-8">
      <h1 class="text-xl font-semibold text-foreground mb-2">Confirmations</h1>
      <p class="text-muted-foreground text-sm">Various confirmation dialog patterns.</p>
    </div>

    <!-- Trigger Buttons -->
    <div class="space-y-4 mb-8">
      <Button
        variant="danger"
        fullWidth
        onclick={() => showDeleteModal = true}
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        Delete with text confirmation
      </Button>

      <Button
        variant="secondary"
        fullWidth
        onclick={() => showDiscardModal = true}
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        Discard unsaved changes
      </Button>

      <Button
        variant="secondary"
        fullWidth
        onclick={() => showLogoutModal = true}
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Simple confirmation (logout)
      </Button>
    </div>

    <!-- Pattern Examples -->
    <Card variant="flat" padding="md" class="mb-8">
      <h3 class="text-sm font-medium text-foreground mb-3">Confirmation Patterns</h3>
      <ul class="text-xs text-muted-foreground space-y-2">
        <li class="flex items-start gap-2">
          <span class="text-error font-bold">Destructive</span>
          <span>— Requires text input to confirm (e.g., "DELETE")</span>
        </li>
        <li class="flex items-start gap-2">
          <span class="text-warning font-bold">Warning</span>
          <span>— Simple Yes/No with clear consequence</span>
        </li>
        <li class="flex items-start gap-2">
          <span class="text-foreground font-bold">Informational</span>
          <span>— Confirm action with explanation</span>
        </li>
      </ul>
    </Card>

    <!-- Mobile UX Note -->
    <div class="p-4 bg-primary/5 border border-primary/20 rounded-lg">
      <h3 class="text-sm font-medium text-primary mb-2">Mobile UX Patterns</h3>
      <ul class="text-xs text-muted-foreground space-y-1">
        <li>• Use bottom sheets on mobile</li>
        <li>• Destructive button always on right</li>
        <li>• Clear consequence in message</li>
        <li>• Require text input for irreversible actions</li>
      </ul>
    </div>
  </div>
</div>

<!-- Delete Confirmation Modal -->
<Modal bind:open={showDeleteModal} title="Delete {itemToDelete.name}?" size="sm">
  {#snippet header()}
    <div class="w-12 h-12 mx-auto mb-4 rounded-full bg-error-soft flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </div>
  {/snippet}

  <p class="text-sm text-muted-foreground text-center mb-4">
    This action cannot be undone. All data associated with this {itemToDelete.type} will be permanently removed.
  </p>

  <!-- Text Confirmation -->
  <div class="mb-4">
    <label for="delete-confirm" class="block text-sm font-medium text-foreground mb-2">
      Type <span class="font-mono text-error">"{itemToDelete.name}"</span> to confirm
    </label>
    <Input
      id="delete-confirm"
      type="text"
      bind:value={deleteConfirmText}
      placeholder={itemToDelete.name}
    />
  </div>

  {#snippet footer()}
    <div class="flex gap-3 w-full">
      <Button
        variant="secondary"
        fullWidth
        onclick={() => { showDeleteModal = false; deleteConfirmText = ''; }}
      >
        Cancel
      </Button>
      <Button
        variant="danger"
        fullWidth
        onclick={handleDelete}
        disabled={!canDelete || isDeleting}
        loading={isDeleting}
      >
        Delete
      </Button>
    </div>
  {/snippet}
</Modal>

<!-- Discard Changes Modal -->
<Modal bind:open={showDiscardModal} title="Discard unsaved changes?" size="sm">
  {#snippet header()}
    <div class="w-12 h-12 mx-auto mb-4 rounded-full bg-warning-soft flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    </div>
  {/snippet}

  <p class="text-sm text-muted-foreground text-center mb-6">
    You have unsaved changes. If you leave now, your changes will be lost.
  </p>

  {#snippet footer()}
    <div class="flex gap-3 w-full">
      <Button variant="secondary" fullWidth onclick={() => showDiscardModal = false}>
        Keep Editing
      </Button>
      <Button variant="primary" fullWidth onclick={handleDiscard}>
        Discard
      </Button>
    </div>
  {/snippet}
</Modal>

<!-- Logout Confirmation Modal -->
<Modal bind:open={showLogoutModal} title="Log out?" size="sm">
  <p class="text-sm text-muted-foreground text-center mb-6">
    Are you sure you want to log out of your account?
  </p>

  {#snippet footer()}
    <div class="flex gap-3 w-full">
      <Button variant="secondary" fullWidth onclick={() => showLogoutModal = false}>
        Cancel
      </Button>
      <Button variant="primary" fullWidth onclick={handleLogout}>
        Log Out
      </Button>
    </div>
  {/snippet}
</Modal>
