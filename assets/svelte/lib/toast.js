/**
 * Toast Store
 *
 * Programmatic toast notifications.
 *
 * Usage:
 * import { toast } from '$lib/toast';
 *
 * toast.success('Changes saved!');
 * toast.error('Something went wrong');
 * toast.info('New message received');
 * toast.warning('Session expires soon');
 *
 * // Custom options
 * toast.success('Saved!', { duration: 3000 });
 *
 * // In your layout, add <ToastContainer />
 */

import { writable } from 'svelte/store';

// Toast store
function createToastStore() {
  const { subscribe, update } = writable([]);

  let idCounter = 0;

  function addToast(message, options = {}) {
    const id = ++idCounter;

    const toast = {
      id,
      message,
      variant: options.variant || 'info',
      duration: options.duration ?? 4000,
      dismissible: options.dismissible ?? true,
      action: options.action || null, // { label: 'Undo', onClick: () => {} }
    };

    update((toasts) => [...toasts, toast]);

    // Auto-dismiss
    if (toast.duration > 0) {
      setTimeout(() => {
        dismiss(id);
      }, toast.duration);
    }

    return id;
  }

  function dismiss(id) {
    update((toasts) => toasts.filter((t) => t.id !== id));
  }

  function clear() {
    update(() => []);
  }

  return {
    subscribe,
    dismiss,
    clear,

    // Convenience methods
    success(message, options = {}) {
      return addToast(message, { ...options, variant: 'success' });
    },

    error(message, options = {}) {
      return addToast(message, { ...options, variant: 'error', duration: options.duration ?? 6000 });
    },

    warning(message, options = {}) {
      return addToast(message, { ...options, variant: 'warning' });
    },

    info(message, options = {}) {
      return addToast(message, { ...options, variant: 'info' });
    },

    // Generic add
    add: addToast,

    // Promise helper - shows loading, then success/error
    async promise(promise, messages) {
      const id = addToast(messages.loading || 'Loading...', {
        variant: 'info',
        duration: 0, // Don't auto-dismiss
        dismissible: false
      });

      try {
        const result = await promise;
        dismiss(id);
        if (messages.success) {
          addToast(
            typeof messages.success === 'function'
              ? messages.success(result)
              : messages.success,
            { variant: 'success' }
          );
        }
        return result;
      } catch (error) {
        dismiss(id);
        addToast(
          typeof messages.error === 'function'
            ? messages.error(error)
            : messages.error || 'Something went wrong',
          { variant: 'error' }
        );
        throw error;
      }
    }
  };
}

export const toast = createToastStore();
