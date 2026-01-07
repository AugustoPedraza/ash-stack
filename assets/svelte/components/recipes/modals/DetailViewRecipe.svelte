<script>
  /**
   * Detail View Modal Recipe
   * Full modal with data display and footer actions.
   *
   * Uses: Button, Modal, Badge, Avatar, Card
   */
  import { Button, Modal, Badge, Avatar, Card } from '../../ui';

  let showModal = $state(false);
  let isEditing = $state(false);

  // Sample data
  const contact = {
    id: 1,
    name: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    phone: '+1 (555) 123-4567',
    company: 'Acme Corporation',
    role: 'Product Designer',
    avatar: 'https://i.pravatar.cc/80?img=1',
    status: 'active',
    tags: ['Design', 'Leadership', 'Remote'],
    notes: 'Key stakeholder for the redesign project. Prefers async communication.',
    createdAt: new Date(Date.now() - 86400000 * 30),
    lastContact: new Date(Date.now() - 86400000 * 2)
  };

  function formatDate(date) {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function handleEdit() {
    isEditing = true;
    // In real app, switch to edit mode
  }

  function handleDelete() {
    // Show confirmation modal
    showModal = false;
  }

  function handleSave() {
    isEditing = false;
    // Save changes
  }
</script>

<div class="h-full bg-base-100 overflow-y-auto px-5 py-6">
  <div class="max-w-md mx-auto">
    <div class="mb-8">
      <h1 class="text-xl font-semibold text-text mb-2">Detail View Modal</h1>
      <p class="text-text-muted text-sm">Full modal with data and footer actions.</p>
    </div>

    <!-- Trigger -->
    <Button
      variant="secondary"
      fullWidth
      onclick={() => showModal = true}
    >
      <Avatar src={contact.avatar} alt={contact.name} size="sm" />
      <div class="flex-1 text-left">
        <p class="text-sm font-medium text-text">{contact.name}</p>
        <p class="text-xs text-text-muted">{contact.role} at {contact.company}</p>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </Button>

    <!-- Preview Card -->
    <Card variant="flat" padding="md" class="mt-8">
      <h3 class="text-sm font-medium text-text mb-3">Modal Features</h3>
      <ul class="text-xs text-text-secondary space-y-2">
        <li class="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Scrollable content area
        </li>
        <li class="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Fixed header with close button
        </li>
        <li class="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Fixed footer with actions
        </li>
        <li class="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Responsive sizing
        </li>
      </ul>
    </Card>

    <!-- Mobile UX Note -->
    <div class="mt-8 p-4 bg-primary/5 border border-primary/20 rounded-lg">
      <h3 class="text-sm font-medium text-primary mb-2">Mobile UX Patterns</h3>
      <ul class="text-xs text-text-secondary space-y-1">
        <li>• Full-screen on mobile, centered on desktop</li>
        <li>• Sticky header/footer for long content</li>
        <li>• Swipe to close on mobile sheets</li>
        <li>• Context menu (•••) for secondary actions</li>
      </ul>
    </div>
  </div>
</div>

<!-- Detail Modal -->
<Modal bind:open={showModal} title="Contact Details" size="lg">
  <!-- Profile Header -->
  <div class="flex items-center gap-4 mb-6">
    <Avatar src={contact.avatar} alt={contact.name} size="lg" />
    <div>
      <div class="flex items-center gap-2">
        <h3 class="text-lg font-semibold text-text">{contact.name}</h3>
        <Badge variant="success" size="sm">{contact.status}</Badge>
      </div>
      <p class="text-sm text-text-secondary">{contact.role}</p>
      <p class="text-sm text-text-secondary">{contact.company}</p>
    </div>
  </div>

  <!-- Contact Info -->
  <div class="space-y-4 mb-6">
    <div>
      <span class="text-xs font-medium text-text-muted uppercase tracking-wider">Email</span>
      <p class="text-sm text-text mt-1">{contact.email}</p>
    </div>
    <div>
      <span class="text-xs font-medium text-text-muted uppercase tracking-wider">Phone</span>
      <p class="text-sm text-text mt-1">{contact.phone}</p>
    </div>
  </div>

  <!-- Tags -->
  <div class="mb-6">
    <span class="text-xs font-medium text-text-muted uppercase tracking-wider">Tags</span>
    <div class="flex flex-wrap gap-2 mt-2">
      {#each contact.tags as tag}
        <Badge variant="primary" size="sm">{tag}</Badge>
      {/each}
    </div>
  </div>

  <!-- Notes -->
  <div class="mb-6">
    <span class="text-xs font-medium text-text-muted uppercase tracking-wider">Notes</span>
    <p class="text-sm text-text-secondary mt-2 whitespace-pre-wrap">{contact.notes}</p>
  </div>

  <!-- Metadata -->
  <Card variant="flat" padding="md">
    <div class="grid grid-cols-2 gap-4">
      <div>
        <span class="text-xs font-medium text-text-muted">Created</span>
        <p class="text-sm text-text">{formatDate(contact.createdAt)}</p>
      </div>
      <div>
        <span class="text-xs font-medium text-text-muted">Last Contact</span>
        <p class="text-sm text-text">{formatDate(contact.lastContact)}</p>
      </div>
    </div>
  </Card>

  {#snippet footer()}
    <div class="flex gap-3 w-full">
      {#if isEditing}
        <Button variant="secondary" fullWidth onclick={() => isEditing = false}>
          Cancel
        </Button>
        <Button variant="primary" fullWidth onclick={handleSave}>
          Save Changes
        </Button>
      {:else}
        <Button variant="danger" fullWidth onclick={handleDelete}>
          Delete
        </Button>
        <Button variant="primary" fullWidth onclick={handleEdit}>
          Edit Contact
        </Button>
      {/if}
    </div>
  {/snippet}
</Modal>
