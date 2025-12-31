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
 * import { Button, Avatar, Input, Card } from '$lib/components/ui';
 */

// Form Components
export { default as Button } from './Button.svelte';
export { default as Input } from './Input.svelte';
export { default as Select } from './Select.svelte';
export { default as Textarea } from './Textarea.svelte';
export { default as Checkbox } from './Checkbox.svelte';
export { default as FormField } from './FormField.svelte';

// Layout Components
export { default as Page } from './Page.svelte';
export { default as PageHeader } from './PageHeader.svelte';
export { default as Card } from './Card.svelte';
export { default as Section } from './Section.svelte';

// Display Components
export { default as Avatar } from './Avatar.svelte';
export { default as Badge } from './Badge.svelte';

// Add new components here as they are created:
// export { default as Modal } from './Modal.svelte';
// export { default as Spinner } from './Spinner.svelte';
// export { default as Toast } from './Toast.svelte';
// export { default as Dropdown } from './Dropdown.svelte';
