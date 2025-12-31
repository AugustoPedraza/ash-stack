<!--
  Form Component
  Form wrapper with validation, loading state, and context for child components.
  Auto-disables submit until valid, manages submission state.
-->
<script context="module">
  import { writable, derived } from 'svelte/store';

  // Context key for form state
  export const FORM_CONTEXT = {};
</script>

<script>
  import { setContext, createEventDispatcher } from 'svelte';
  import { validateField } from '../../lib/validation.js';

  const dispatch = createEventDispatcher();

  /** @type {boolean} - Bound: form is currently valid */
  export let valid = false;

  /** @type {boolean} - Bound: form is currently submitting */
  export let submitting = false;

  /** @type {boolean} - Disable submit button when invalid */
  export let disableWhenInvalid = true;

  /** @type {boolean} - Show success state briefly after submit */
  export let showSuccess = true;

  /** @type {number} - Success state duration in ms */
  export let successDuration = 1500;

  // Internal state
  const fields = writable({});  // { fieldId: { value, rules, error, touched } }
  const isSubmitting = writable(false);
  const submitSuccess = writable(false);
  const submitError = writable(null);

  // Derive form validity from all fields
  const isValid = derived(fields, ($fields) => {
    const fieldList = Object.values($fields);
    if (fieldList.length === 0) return true;
    return fieldList.every((f) => !f.error);
  });

  // Derive all errors
  const errors = derived(fields, ($fields) => {
    const result = {};
    for (const [id, field] of Object.entries($fields)) {
      if (field.error && field.touched) {
        result[id] = field.error;
      }
    }
    return result;
  });

  // Sync bound props
  $: valid = $isValid;
  $: submitting = $isSubmitting;

  // Register a field with the form
  function registerField(id, rules = []) {
    fields.update((f) => ({
      ...f,
      [id]: { value: '', rules, error: null, touched: false }
    }));

    return {
      // Update field value and validate
      setValue(value) {
        fields.update((f) => {
          const field = f[id];
          if (!field) return f;

          const error = validateField(value, field.rules);
          return {
            ...f,
            [id]: { ...field, value, error }
          };
        });
      },

      // Mark field as touched (show errors)
      touch() {
        fields.update((f) => {
          const field = f[id];
          if (!field) return f;

          const error = validateField(field.value, field.rules);
          return {
            ...f,
            [id]: { ...field, touched: true, error }
          };
        });
      },

      // Update rules dynamically
      setRules(newRules) {
        fields.update((f) => {
          const field = f[id];
          if (!field) return f;

          const error = validateField(field.value, newRules);
          return {
            ...f,
            [id]: { ...field, rules: newRules, error }
          };
        });
      },

      // Unregister on destroy
      unregister() {
        fields.update((f) => {
          const { [id]: _, ...rest } = f;
          return rest;
        });
      }
    };
  }

  // Touch all fields
  function touchAll() {
    fields.update((f) => {
      const updated = {};
      for (const [id, field] of Object.entries(f)) {
        const error = validateField(field.value, field.rules);
        updated[id] = { ...field, touched: true, error };
      }
      return updated;
    });
  }

  // Reset form state
  function reset() {
    fields.update((f) => {
      const updated = {};
      for (const [id, field] of Object.entries(f)) {
        updated[id] = { ...field, value: '', touched: false, error: null };
      }
      return updated;
    });
    submitSuccess.set(false);
    submitError.set(null);
  }

  // Handle form submission
  async function handleSubmit(event) {
    event.preventDefault();

    // Touch all fields to show validation errors
    touchAll();

    // Check validity
    if (!$isValid) {
      dispatch('invalid', { errors: $errors });
      return;
    }

    // Start submitting
    isSubmitting.set(true);
    submitSuccess.set(false);
    submitError.set(null);

    try {
      // Gather form data
      const formData = {};
      for (const [id, field] of Object.entries($fields)) {
        formData[id] = field.value;
      }

      // Dispatch submit event and wait for handler
      dispatch('submit', {
        data: formData,
        done: (success = true, error = null) => {
          isSubmitting.set(false);

          if (success && showSuccess) {
            submitSuccess.set(true);
            setTimeout(() => submitSuccess.set(false), successDuration);
          }

          if (!success) {
            submitError.set(error);
          }
        }
      });
    } catch (error) {
      isSubmitting.set(false);
      submitError.set(error);
      dispatch('error', { error });
    }
  }

  // Provide context to children
  setContext(FORM_CONTEXT, {
    registerField,
    isSubmitting,
    isValid,
    submitSuccess,
    submitError,
    disableWhenInvalid: () => disableWhenInvalid
  });
</script>

<form
  on:submit={handleSubmit}
  on:reset={() => reset()}
  class="flex flex-col gap-4"
  novalidate
>
  <slot
    {valid}
    {submitting}
    success={$submitSuccess}
    error={$submitError}
    {reset}
  />
</form>
