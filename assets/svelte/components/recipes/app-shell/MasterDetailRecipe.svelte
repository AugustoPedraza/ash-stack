<script>
  /**
   * Master/Detail Recipe
   * Demonstrates list-to-detail push navigation.
   */
  import { AppHeader, BottomSheet, SheetMenu, IconButton } from '../../ui/index.js';
  import { generateContacts } from '../../../lib/mock/mockData.js';

  const contacts = generateContacts(10);

  let selectedContact = $state(null);
  let view = $state('list');
  let sheetOpen = $state(false);

  function selectContact(contact) {
    selectedContact = contact;
    view = 'detail';
  }

  function goBack() {
    view = 'list';
    selectedContact = null;
  }

  function handleContextAction(itemId) {
    sheetOpen = false;
    alert(`${itemId}: ${selectedContact?.name}`);
  }

  const menuItems = [
    { id: 'edit', label: 'Edit Contact', icon: editIcon },
    { id: 'share', label: 'Share Contact', icon: shareIcon },
    { separator: true },
    { id: 'delete', label: 'Delete Contact', icon: deleteIcon, destructive: true }
  ];
</script>

{#snippet editIcon()}
  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
{/snippet}

{#snippet shareIcon()}
  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
  </svg>
{/snippet}

{#snippet deleteIcon()}
  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
{/snippet}

{#snippet searchIcon()}
  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
{/snippet}

{#snippet moreIcon()}
  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <circle cx="12" cy="5" r="1.5" fill="currentColor" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    <circle cx="12" cy="19" r="1.5" fill="currentColor" />
  </svg>
{/snippet}

<!-- Full-screen demo -->
<div class="demo-container">
  <!-- List View -->
  <div
    class="demo-view"
    class:slide-out-left={view === 'detail'}
  >
    <AppHeader title="Contacts">
      {#snippet actions()}
        <IconButton label="Search">
          {@render searchIcon()}
        </IconButton>
      {/snippet}
    </AppHeader>

    <div class="demo-scroll">
      {#each contacts as contact}
        <button
          class="contact-row"
          onclick={() => selectContact(contact)}
        >
          <div class="avatar">
            <div class="avatar-img">
              <img src={contact.avatar} alt={contact.name} />
            </div>
          </div>
          <div class="contact-info">
            <div class="contact-name">{contact.name}</div>
            <div class="contact-company">{contact.company}</div>
          </div>
          <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      {/each}
    </div>
  </div>

  <!-- Detail View -->
  <div
    class="demo-view detail-view"
    class:slide-in-right={view === 'detail'}
  >
    {#if selectedContact}
      <AppHeader
        title={selectedContact.name}
        showBack={true}
        onBack={goBack}
      >
        {#snippet actions()}
          <IconButton label="More options" onclick={() => sheetOpen = true}>
            {@render moreIcon()}
          </IconButton>
        {/snippet}
      </AppHeader>

      <div class="demo-scroll detail-content">
        <div class="detail-hero">
          <div class="detail-avatar">
            <img src={selectedContact.avatar} alt={selectedContact.name} />
          </div>
          <h2 class="detail-name">{selectedContact.name}</h2>
          <p class="detail-role">{selectedContact.title} at {selectedContact.company}</p>
        </div>

        <div class="detail-fields">
          <div class="detail-field">
            <div class="field-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div class="field-content">
              <span class="field-label">Email</span>
              <span class="field-value">{selectedContact.email}</span>
            </div>
          </div>

          <div class="detail-field">
            <div class="field-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div class="field-content">
              <span class="field-label">Phone</span>
              <span class="field-value">{selectedContact.phone}</span>
            </div>
          </div>
        </div>

        <div class="detail-actions">
          <button class="btn-primary">Message</button>
          <button class="btn-secondary">Call</button>
        </div>
      </div>
    {/if}
  </div>
</div>

<BottomSheet bind:open={sheetOpen} snapPoints={[0.35]} onClose={() => sheetOpen = false}>
  <SheetMenu
    items={menuItems}
    onSelect={handleContextAction}
    onCancel={() => sheetOpen = false}
  />
</BottomSheet>

<style>
  .demo-container {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: var(--color-surface, #fff);
  }

  .demo-view {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    background: var(--color-surface, #fff);
    transition: transform 0.35s cubic-bezier(0.32, 0.72, 0, 1),
                opacity 0.35s cubic-bezier(0.32, 0.72, 0, 1);
  }

  .demo-view.slide-out-left {
    transform: translateX(-30%);
    opacity: 0.5;
  }

  .detail-view {
    transform: translateX(100%);
    box-shadow: -4px 0 24px rgba(0,0,0,0.1);
  }

  .detail-view.slide-in-right {
    transform: translateX(0);
    opacity: 1;
  }

  .demo-scroll {
    flex: 1;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }

  /* Contact List */
  .contact-row {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    padding: 12px 16px;
    border: none;
    background: transparent;
    cursor: pointer;
    text-align: left;
    border-bottom: 1px solid var(--color-border, #e5e7eb);
    transition: background 0.1s;
  }

  .contact-row:hover {
    background: var(--color-surface-sunken, #f3f4f6);
  }

  .contact-row:active {
    background: var(--color-border-strong, #e5e7eb);
  }

  .avatar-img {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    overflow: hidden;
  }

  .avatar-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .contact-info {
    flex: 1;
    min-width: 0;
  }

  .contact-name {
    font-size: 16px;
    font-weight: 500;
    color: var(--color-text, #1f2937);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .contact-company {
    font-size: 14px;
    color: var(--color-text-muted, #6b7280);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .chevron {
    width: 20px;
    height: 20px;
    color: var(--color-text-disabled, #9ca3af);
  }

  /* Detail View */
  .detail-content {
    padding: 24px 16px;
  }

  .detail-hero {
    text-align: center;
    margin-bottom: 24px;
  }

  .detail-avatar {
    width: 88px;
    height: 88px;
    border-radius: 50%;
    overflow: hidden;
    margin: 0 auto 12px;
    box-shadow: 0 0 0 3px var(--color-primary, #3b82f6),
                0 0 0 6px oklch(from var(--color-primary, #3b82f6) l c h / 0.15);
  }

  .detail-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .detail-name {
    font-size: 22px;
    font-weight: 600;
    color: var(--color-text, #1f2937);
    margin: 0 0 4px;
  }

  .detail-role {
    font-size: 14px;
    color: var(--color-text-secondary, #6b7280);
    margin: 0;
  }

  /* Fields */
  .detail-fields {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 24px;
  }

  .detail-field {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 16px;
    background: var(--color-surface-sunken, #f3f4f6);
    border-radius: 12px;
  }

  .field-icon {
    width: 20px;
    height: 20px;
    color: var(--color-primary, #3b82f6);
  }

  .field-icon svg {
    width: 100%;
    height: 100%;
  }

  .field-content {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .field-label {
    font-size: 11px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    color: var(--color-text-muted, #9ca3af);
  }

  .field-value {
    font-size: 15px;
    color: var(--color-text, #374151);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Action buttons */
  .detail-actions {
    display: flex;
    gap: 12px;
  }

  .btn-primary,
  .btn-secondary {
    flex: 1;
    padding: 14px 20px;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
  }

  .btn-primary {
    background: var(--color-primary, #3b82f6);
    color: #fff;
    border: none;
  }

  .btn-primary:hover {
    filter: brightness(1.05);
  }

  .btn-secondary {
    background: transparent;
    color: var(--color-primary, #3b82f6);
    border: 1.5px solid var(--color-primary, #3b82f6);
  }

  .btn-secondary:hover {
    background: oklch(from var(--color-primary, #3b82f6) l c h / 0.08);
  }
</style>
