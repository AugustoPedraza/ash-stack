/**
 * Recipe Registry
 * Central registry of all available recipes organized by category
 */

export const categories = [
  {
    id: 'app-shell',
    label: 'App Shell',
    description: 'Core navigation and layout patterns',
    recipes: [
      { id: 'bottom-tab-bar', name: 'Bottom Tab Bar', description: 'Main app navigation with 5 tabs', patterns: ['navigation', 'mobile-first'], components: ['TabBar', 'TabItem', 'Badge'] },
      { id: 'master-detail', name: 'Master/Detail', description: 'List to detail push navigation', patterns: ['navigation', 'master-detail'], components: ['List', 'ListItem', 'Header'] },
      { id: 'screen-header', name: 'Screen Header', description: 'Header with back button, title, CTA', patterns: ['navigation', 'header'], components: ['Header', 'Button', 'ContextMenu'] }
    ]
  },
  {
    id: 'auth',
    label: 'Auth',
    description: 'Authentication flows',
    recipes: [
      { id: 'login', name: 'Login', description: 'Email/password login with OAuth', patterns: ['form-validation', 'async-submit'], components: ['Input', 'Button', 'Checkbox'] },
      { id: 'signup', name: 'Signup', description: 'Registration with password strength', patterns: ['form-validation', 'password-strength'], components: ['Input', 'Button', 'PasswordStrength'] },
      { id: 'forgot-password', name: 'Forgot Password', description: 'Password reset email flow', patterns: ['form-validation', 'async-submit'], components: ['Input', 'Button'] },
      { id: 'otp-verification', name: 'OTP Verification', description: '6-digit code input with timer', patterns: ['otp-input', 'countdown'], components: ['OtpInput', 'Button', 'Timer'] },
      { id: 'magic-link', name: 'Magic Link', description: 'Passwordless email login', patterns: ['async-submit', 'polling'], components: ['Input', 'Button', 'Spinner'] },
      { id: 'email-verification', name: 'Email Verification', description: 'Verify email address', patterns: ['async-submit', 'resend'], components: ['Button', 'Alert'] },
      { id: 'oauth-buttons', name: 'OAuth Buttons', description: 'Social login providers', patterns: ['oauth', 'loading-states'], components: ['OAuthButton'] }
    ]
  },
  {
    id: 'forms',
    label: 'Forms',
    description: 'Form patterns and validation',
    recipes: [
      { id: 'contact-form', name: 'Contact Form', description: 'Basic form with validation', patterns: ['form-validation', 'async-submit'], components: ['Input', 'Textarea', 'Button'] },
      { id: 'contact-form-public', name: 'Contact Form (Public)', description: 'Public form with CTA at bottom', patterns: ['public-form', 'cta-bottom'], components: ['Input', 'Textarea', 'Button'] },
      { id: 'edit-contact', name: 'Edit Contact (In-App)', description: 'In-app form with header Save CTA', patterns: ['in-app-form', 'header-cta'], components: ['AppHeader', 'Input', 'Button'] },
      { id: 'settings', name: 'Settings', description: 'Save/discard with change detection', patterns: ['form-dirty', 'unsaved-warning'], components: ['Input', 'Toggle', 'Button'] },
      { id: 'profile', name: 'Profile', description: 'Avatar upload with fields', patterns: ['file-upload', 'form-validation'], components: ['Avatar', 'Input', 'FileUpload'] },
      { id: 'dynamic-cta', name: 'Dynamic CTA', description: 'Button enabled when form changes', patterns: ['form-dirty', 'realtime-validation'], components: ['Input', 'Button'] },
      { id: 'multi-step-wizard', name: 'Multi-step Wizard', description: 'Steps with validation per step', patterns: ['wizard', 'step-validation'], components: ['Stepper', 'Input', 'Button'] },
      { id: 'password-change', name: 'Password Change', description: 'Current + new password fields', patterns: ['password-strength', 'form-validation'], components: ['Input', 'PasswordStrength', 'Button'] },
      { id: 'account-deletion', name: 'Account Deletion', description: 'Dangerous action confirmation', patterns: ['confirmation-input', 'danger-zone'], components: ['Input', 'Button', 'Alert'] }
    ]
  },
  {
    id: 'data-lists',
    label: 'Data Lists',
    description: 'List and table patterns',
    recipes: [
      { id: 'transactions', name: 'Transactions', description: 'DataTable with sorting', patterns: ['data-table', 'sorting', 'selection'], components: ['DataTable', 'Badge', 'Checkbox'] },
      { id: 'infinite-scroll', name: 'Infinite Scroll', description: 'Load more on scroll', patterns: ['infinite-scroll', 'pull-to-refresh'], components: ['InfiniteScroll', 'Skeleton'] },
      { id: 'filter-sort', name: 'Filter & Sort', description: 'Combined filtering UI', patterns: ['filtering', 'sorting'], components: ['Input', 'Select', 'Badge'] },
      { id: 'bulk-actions', name: 'Bulk Actions', description: 'Select all and batch operations', patterns: ['bulk-select', 'action-bar'], components: ['Checkbox', 'ActionBar', 'Button'] }
    ]
  },
  {
    id: 'inputs',
    label: 'Inputs',
    description: 'Advanced input components',
    recipes: [
      { id: 'date-picker', name: 'Date Picker', description: 'Single and range selection', patterns: ['date-selection', 'calendar'], components: ['DatePicker', 'Input'] },
      { id: 'time-picker', name: 'Time Picker', description: 'Time and duration selection', patterns: ['time-selection'], components: ['TimePicker', 'Input'] },
      { id: 'multi-select', name: 'Multi-Select', description: 'Tags input with chips', patterns: ['multi-select', 'tags'], components: ['MultiSelect', 'Chip'] },
      { id: 'rich-text', name: 'Rich Text', description: 'Basic formatting toolbar', patterns: ['rich-text', 'mentions'], components: ['RichTextEditor'] },
      { id: 'address-autocomplete', name: 'Address Autocomplete', description: 'Search with suggestions', patterns: ['autocomplete', 'async-search'], components: ['SearchInput', 'Dropdown'] }
    ]
  },
  {
    id: 'navigation',
    label: 'Navigation',
    description: 'Mobile-first navigation patterns',
    recipes: [
      { id: 'breadcrumbs', name: 'Back Navigation', description: 'Simple back button (mobile standard)', patterns: ['back-navigation', 'mobile'], components: ['BackButton'] },
      { id: 'tabs', name: 'Tabs', description: 'Segment controls and scrollable pills', patterns: ['segment-control', 'filter-pills'], components: ['SegmentControl', 'FilterPills'] },
      { id: 'stepper', name: 'Progress', description: 'Progress bar and dots indicator', patterns: ['progress-bar', 'dots'], components: ['ProgressBar'] },
      { id: 'pagination', name: 'Load More', description: 'Load more button (no page numbers)', patterns: ['load-more', 'infinite'], components: ['LoadMore'] }
    ]
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    description: 'Dashboard components',
    recipes: [
      { id: 'stats-cards', name: 'Stats Cards', description: 'Metrics with sparklines', patterns: ['stats', 'sparkline'], components: ['StatCard', 'MiniChart'] },
      { id: 'activity-feed', name: 'Activity Feed', description: 'Grouped activity timeline', patterns: ['feed', 'timeline'], components: ['ActivityFeed', 'Avatar'] },
      { id: 'quick-actions', name: 'Quick Actions', description: 'Action card grid', patterns: ['action-grid'], components: ['Card', 'Button'] },
      { id: 'charts', name: 'Charts', description: 'Line, bar, donut charts', patterns: ['charts', 'data-viz'], components: ['MiniChart'] }
    ]
  },
  {
    id: 'realtime',
    label: 'Real-time',
    description: 'Real-time collaboration',
    recipes: [
      { id: 'chat', name: 'Chat', description: 'Message list with input', patterns: ['chat', 'realtime'], components: ['ChatMessage', 'ChatInput'] },
      { id: 'typing-indicators', name: 'Typing Indicators', description: 'Who is typing display', patterns: ['typing', 'presence'], components: ['TypingIndicator'] },
      { id: 'presence', name: 'Presence', description: 'Online user list', patterns: ['presence', 'realtime'], components: ['ParticipantRow', 'Avatar'] },
      { id: 'message-threads', name: 'Message Threads', description: 'Nested message replies', patterns: ['threads', 'nested'], components: ['MessageThread', 'ChatMessage'] }
    ]
  },
  {
    id: 'notifications',
    label: 'Notifications',
    description: 'Notification patterns',
    recipes: [
      { id: 'badge-counters', name: 'Badge Counters', description: 'Animated count badges', patterns: ['badges', 'animation'], components: ['Badge'] },
      { id: 'notification-center', name: 'Notification Center', description: 'Grouped notifications', patterns: ['notifications', 'grouping'], components: ['NotificationCenter', 'NotificationItem'] },
      { id: 'read-unread', name: 'Read/Unread', description: 'Visual read states', patterns: ['read-state', 'batch-actions'], components: ['NotificationItem', 'Button'] }
    ]
  },
  {
    id: 'media',
    label: 'Media',
    description: 'File and media handling',
    recipes: [
      { id: 'file-upload', name: 'File Upload', description: 'Drag and drop with progress', patterns: ['file-upload', 'progress'], components: ['FileUpload', 'ProgressBar'] },
      { id: 'image-preview', name: 'Image Preview', description: 'Thumbnail and full-size', patterns: ['image-preview', 'zoom'], components: ['Image', 'Modal'] },
      { id: 'lightbox', name: 'Lightbox', description: 'Gallery with navigation', patterns: ['lightbox', 'keyboard-nav'], components: ['Lightbox', 'Image'] },
      { id: 'video-player', name: 'Video Player', description: 'Controls and fullscreen', patterns: ['video', 'media-controls'], components: ['VideoPlayer'] }
    ]
  },
  {
    id: 'search',
    label: 'Search',
    description: 'Search patterns',
    recipes: [
      { id: 'command-palette', name: 'Command Palette', description: 'Cmd+K quick actions', patterns: ['command-palette', 'keyboard'], components: ['CommandPalette'] },
      { id: 'searchable-select', name: 'Searchable Select', description: 'Async search dropdown', patterns: ['search', 'async'], components: ['SearchInput', 'Dropdown'] }
    ]
  },
  {
    id: 'modals',
    label: 'Modals',
    description: 'Modal and sheet patterns',
    recipes: [
      { id: 'confirmations', name: 'Confirmations', description: 'Delete and discard dialogs', patterns: ['confirmation', 'destructive'], components: ['Modal', 'Button'] },
      { id: 'detail-view', name: 'Detail View', description: 'Full modal with data', patterns: ['detail-modal', 'footer-actions'], components: ['Modal', 'Button'] },
      { id: 'mobile-sheets', name: 'Mobile Sheets', description: 'Bottom sheet with gestures', patterns: ['sheet', 'gestures'], components: ['Sheet'] },
      { id: 'tabs-in-modal', name: 'Tabs in Modal', description: 'Tabbed modal content', patterns: ['modal-tabs'], components: ['Modal', 'Tabs'] }
    ]
  },
  {
    id: 'permissions',
    label: 'Permissions',
    description: 'Permission patterns',
    recipes: [
      { id: 'role-gate', name: 'Role Gate', description: 'Show/hide by role', patterns: ['role-based', 'upgrade-prompt'], components: ['RoleGate', 'Alert'] },
      { id: 'feature-flag', name: 'Feature Flag', description: 'Conditional features', patterns: ['feature-flag', 'coming-soon'], components: ['FeatureFlag', 'Badge'] }
    ]
  }
];

/**
 * Get a specific recipe by category and recipe ID
 */
export function getRecipe(categoryId, recipeId) {
  const category = categories.find(c => c.id === categoryId);
  if (!category) return null;
  return category.recipes.find(r => r.id === recipeId);
}

/**
 * Get all recipes as flat array
 */
export function getAllRecipes() {
  return categories.flatMap(c => c.recipes.map(r => ({ ...r, categoryId: c.id })));
}

/**
 * Get total recipe count
 */
export function getRecipeCount() {
  return categories.reduce((sum, c) => sum + c.recipes.length, 0);
}
