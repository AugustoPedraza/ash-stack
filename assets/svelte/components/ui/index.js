/**
 * UI Components Index
 * Export all base UI components for easy importing.
 *
 * DESIGN SYSTEM ENFORCEMENT:
 * - All components use only design tokens (no raw Tailwind colors)
 * - No `class` prop escape hatches - use variant/size props
 * - Consistent spacing, radii, and shadows
 *
 * Usage:
 * import { Button, Input, Card, Form, toast } from '$lib/components/ui';
 */

// Form Components
export { default as Button } from './Button.svelte';
export { default as Input } from './Input.svelte';
export { default as Select } from './Select.svelte';
export { default as Textarea } from './Textarea.svelte';
export { default as Checkbox } from './Checkbox.svelte';
export { default as FormField } from './FormField.svelte';
export { default as Form } from './Form.svelte';
export { default as SubmitButton } from './SubmitButton.svelte';

// Layout Components
export { default as Page } from './Page.svelte';
export { default as PageHeader } from './PageHeader.svelte';
export { default as Card } from './Card.svelte';
export { default as Section } from './Section.svelte';

// Display Components
export { default as Avatar } from './Avatar.svelte';
export { default as Badge } from './Badge.svelte';
export { default as Skeleton } from './Skeleton.svelte';

// Feedback Components
export { default as Toast } from './Toast.svelte';
export { default as ToastContainer } from './ToastContainer.svelte';

// Interactive Components
export { default as Modal } from './Modal.svelte';
export { default as Tabs } from './Tabs.svelte';
export { default as Toggle } from './Toggle.svelte';
export { default as Dropdown } from './Dropdown.svelte';

// Animation Components
export { default as AnimatedList } from './AnimatedList.svelte';

// Data Components
export { default as DataTable } from './DataTable.svelte';
export { default as InfiniteScroll } from './InfiniteScroll.svelte';
export { default as Pagination } from './Pagination.svelte';
export { default as EmptyState } from './EmptyState.svelte';

// Real-time Components
export { default as RealtimeList } from './RealtimeList.svelte';
export { default as TypingIndicator } from './TypingIndicator.svelte';

// DX Components
export { default as ErrorBoundary } from './ErrorBoundary.svelte';
export { default as ConnectionStatus } from './ConnectionStatus.svelte';

// Auth Components
export { default as AuthForm } from './AuthForm.svelte';
export { default as OAuthButton } from './OAuthButton.svelte';

// Navigation Components
export { default as CommandPalette } from './CommandPalette.svelte';
export { default as Breadcrumbs } from './Breadcrumbs.svelte';
export { default as Sidebar } from './Sidebar.svelte';

// Mobile Components
export { default as Sheet } from './Sheet.svelte';

// Re-export toast store for convenience
export { toast } from '../../lib/toast.js';

// Re-export mobile utilities
export {
  haptic,
  HapticType,
  isIOS,
  isStandalone,
  platform,
  safeArea,
  keyboard,
  lockScroll,
  unlockScroll
} from '../../lib/mobile.js';

// Re-export gesture actions
export {
  swipe,
  pullToRefresh,
  longPress,
  pan,
  pinch
} from '../../lib/gestures.js';

// Re-export utility functions
export { cn } from '../../lib/utils.js';

// Re-export validation utilities
export {
  required,
  email,
  minLength,
  maxLength,
  min,
  max,
  pattern,
  matches,
  url,
  phone,
  createValidator,
  validateField,
  createFormStore
} from '../../lib/validation.js';

// Re-export optimistic update utilities
export {
  createOptimisticStore,
  createOptimisticList,
  optimistic,
  debounceOptimistic
} from '../../lib/optimistic.js';
