<script>
  import PlaygroundShell from './playground/PlaygroundShell.svelte';
  import { categories } from './playground/recipeRegistry.js';

  // Import implemented recipes - App Shell
  import BottomTabBarRecipe from './recipes/app-shell/BottomTabBarRecipe.svelte';
  import MasterDetailRecipe from './recipes/app-shell/MasterDetailRecipe.svelte';
  import ScreenHeaderRecipe from './recipes/app-shell/ScreenHeaderRecipe.svelte';

  // Import implemented recipes - Auth
  import LoginRecipe from './recipes/auth/LoginRecipe.svelte';
  import SignupRecipe from './recipes/auth/SignupRecipe.svelte';
  import ForgotPasswordRecipe from './recipes/auth/ForgotPasswordRecipe.svelte';
  import OtpVerificationRecipe from './recipes/auth/OtpVerificationRecipe.svelte';
  import MagicLinkRecipe from './recipes/auth/MagicLinkRecipe.svelte';
  import EmailVerificationRecipe from './recipes/auth/EmailVerificationRecipe.svelte';
  import OAuthButtonsRecipe from './recipes/auth/OAuthButtonsRecipe.svelte';

  // Import implemented recipes - Forms
  import ContactFormRecipe from './recipes/forms/ContactFormRecipe.svelte';
  import ContactFormPublicRecipe from './recipes/forms/ContactFormPublicRecipe.svelte';
  import EditContactRecipe from './recipes/forms/EditContactRecipe.svelte';
  import SettingsRecipe from './recipes/forms/SettingsRecipe.svelte';
  import ProfileRecipe from './recipes/forms/ProfileRecipe.svelte';
  import MultiStepWizardRecipe from './recipes/forms/MultiStepWizardRecipe.svelte';
  import PasswordChangeRecipe from './recipes/forms/PasswordChangeRecipe.svelte';
  import AccountDeletionRecipe from './recipes/forms/AccountDeletionRecipe.svelte';

  // Import implemented recipes - Data Lists
  import TransactionsRecipe from './recipes/data-lists/TransactionsRecipe.svelte';
  import InfiniteScrollRecipe from './recipes/data-lists/InfiniteScrollRecipe.svelte';
  import FilterSortRecipe from './recipes/data-lists/FilterSortRecipe.svelte';
  import BulkActionsRecipe from './recipes/data-lists/BulkActionsRecipe.svelte';

  // Import implemented recipes - Inputs
  import DatePickerRecipe from './recipes/inputs/DatePickerRecipe.svelte';
  import TimePickerRecipe from './recipes/inputs/TimePickerRecipe.svelte';
  import MultiSelectRecipe from './recipes/inputs/MultiSelectRecipe.svelte';
  import RichTextRecipe from './recipes/inputs/RichTextRecipe.svelte';
  import AddressAutocompleteRecipe from './recipes/inputs/AddressAutocompleteRecipe.svelte';

  // Import implemented recipes - Navigation
  import BreadcrumbsRecipe from './recipes/navigation/BreadcrumbsRecipe.svelte';
  import TabsRecipe from './recipes/navigation/TabsRecipe.svelte';
  import StepperRecipe from './recipes/navigation/StepperRecipe.svelte';
  import PaginationRecipe from './recipes/navigation/PaginationRecipe.svelte';

  // Import implemented recipes - Dashboard
  import StatsCardsRecipe from './recipes/dashboard/StatsCardsRecipe.svelte';
  import ActivityFeedRecipe from './recipes/dashboard/ActivityFeedRecipe.svelte';
  import QuickActionsRecipe from './recipes/dashboard/QuickActionsRecipe.svelte';
  import ChartsRecipe from './recipes/dashboard/ChartsRecipe.svelte';

  // Import implemented recipes - Real-time
  import ChatRecipe from './recipes/realtime/ChatRecipe.svelte';
  import TypingIndicatorsRecipe from './recipes/realtime/TypingIndicatorsRecipe.svelte';
  import PresenceRecipe from './recipes/realtime/PresenceRecipe.svelte';
  import MessageThreadsRecipe from './recipes/realtime/MessageThreadsRecipe.svelte';

  // Import implemented recipes - Notifications
  import BadgeCountersRecipe from './recipes/notifications/BadgeCountersRecipe.svelte';
  import NotificationCenterRecipe from './recipes/notifications/NotificationCenterRecipe.svelte';
  import ReadUnreadRecipe from './recipes/notifications/ReadUnreadRecipe.svelte';

  // Import implemented recipes - Media
  import FileUploadRecipe from './recipes/media/FileUploadRecipe.svelte';
  import ImagePreviewRecipe from './recipes/media/ImagePreviewRecipe.svelte';
  import LightboxRecipe from './recipes/media/LightboxRecipe.svelte';
  import VideoPlayerRecipe from './recipes/media/VideoPlayerRecipe.svelte';

  // Import implemented recipes - Search
  import CommandPaletteRecipe from './recipes/search/CommandPaletteRecipe.svelte';
  import SearchableSelectRecipe from './recipes/search/SearchableSelectRecipe.svelte';

  // Import implemented recipes - Modals
  import ConfirmationsRecipe from './recipes/modals/ConfirmationsRecipe.svelte';
  import DetailViewRecipe from './recipes/modals/DetailViewRecipe.svelte';
  import MobileSheetsRecipe from './recipes/modals/MobileSheetsRecipe.svelte';
  import TabsInModalRecipe from './recipes/modals/TabsInModalRecipe.svelte';

  // Import implemented recipes - Permissions
  import RoleGateRecipe from './recipes/permissions/RoleGateRecipe.svelte';
  import FeatureFlagRecipe from './recipes/permissions/FeatureFlagRecipe.svelte';

  // Recipe component map
  const recipeComponents = {
    'app-shell': {
      'bottom-tab-bar': BottomTabBarRecipe,
      'master-detail': MasterDetailRecipe,
      'screen-header': ScreenHeaderRecipe
    },
    'auth': {
      'login': LoginRecipe,
      'signup': SignupRecipe,
      'forgot-password': ForgotPasswordRecipe,
      'otp-verification': OtpVerificationRecipe,
      'magic-link': MagicLinkRecipe,
      'email-verification': EmailVerificationRecipe,
      'oauth-buttons': OAuthButtonsRecipe
    },
    'forms': {
      'contact-form': ContactFormRecipe,
      'contact-form-public': ContactFormPublicRecipe,
      'edit-contact': EditContactRecipe,
      'settings': SettingsRecipe,
      'profile': ProfileRecipe,
      'multi-step-wizard': MultiStepWizardRecipe,
      'password-change': PasswordChangeRecipe,
      'account-deletion': AccountDeletionRecipe
    },
    'data-lists': {
      'transactions': TransactionsRecipe,
      'infinite-scroll': InfiniteScrollRecipe,
      'filter-sort': FilterSortRecipe,
      'bulk-actions': BulkActionsRecipe
    },
    'inputs': {
      'date-picker': DatePickerRecipe,
      'time-picker': TimePickerRecipe,
      'multi-select': MultiSelectRecipe,
      'rich-text': RichTextRecipe,
      'address-autocomplete': AddressAutocompleteRecipe
    },
    'navigation': {
      'breadcrumbs': BreadcrumbsRecipe,
      'tabs': TabsRecipe,
      'stepper': StepperRecipe,
      'pagination': PaginationRecipe
    },
    'dashboard': {
      'stats-cards': StatsCardsRecipe,
      'activity-feed': ActivityFeedRecipe,
      'quick-actions': QuickActionsRecipe,
      'charts': ChartsRecipe
    },
    'realtime': {
      'chat': ChatRecipe,
      'typing-indicators': TypingIndicatorsRecipe,
      'presence': PresenceRecipe,
      'message-threads': MessageThreadsRecipe
    },
    'notifications': {
      'badge-counters': BadgeCountersRecipe,
      'notification-center': NotificationCenterRecipe,
      'read-unread': ReadUnreadRecipe
    },
    'media': {
      'file-upload': FileUploadRecipe,
      'image-preview': ImagePreviewRecipe,
      'lightbox': LightboxRecipe,
      'video-player': VideoPlayerRecipe
    },
    'search': {
      'command-palette': CommandPaletteRecipe,
      'searchable-select': SearchableSelectRecipe
    },
    'modals': {
      'confirmations': ConfirmationsRecipe,
      'detail-view': DetailViewRecipe,
      'mobile-sheets': MobileSheetsRecipe,
      'tabs-in-modal': TabsInModalRecipe
    },
    'permissions': {
      'role-gate': RoleGateRecipe,
      'feature-flag': FeatureFlagRecipe
    }
  };

  let activeCategory = $state(null);
  let activeRecipe = $state(null);

  // Get the active recipe component
  const ActiveRecipeComponent = $derived(
    activeCategory && activeRecipe
      ? recipeComponents[activeCategory]?.[activeRecipe]
      : null
  );

  // Theme handling
  let darkMode = $state(false);

  function toggleTheme() {
    darkMode = !darkMode;
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }

  // Keyboard shortcut for theme toggle
  function handleKeydown(e) {
    if (e.key === 'd' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      toggleTheme();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<PlaygroundShell
  {categories}
  bind:activeCategory
  bind:activeRecipe
>
  <!-- Recipe content rendered based on active recipe -->
  {#if ActiveRecipeComponent}
    <ActiveRecipeComponent />
  {:else if activeCategory && activeRecipe}
    <div class="text-center py-12">
      <div class="text-6xl mb-4">🚧</div>
      <h3 class="text-xl font-semibold text-foreground mb-2">
        Recipe Coming Soon
      </h3>
      <p class="text-muted-foreground mb-4">
        This recipe is planned but not yet implemented.
      </p>
      <p class="text-sm text-muted-foreground">
        Active: {activeCategory} / {activeRecipe}
      </p>
    </div>
  {/if}
</PlaygroundShell>

<!-- Theme toggle floating button -->
<button
  class="fixed bottom-4 right-4 btn btn-circle btn-primary shadow-lg z-50"
  onclick={toggleTheme}
  aria-label="Toggle theme"
  title="Toggle theme (Cmd+D)"
>
  {#if darkMode}
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  {:else}
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  {/if}
</button>
