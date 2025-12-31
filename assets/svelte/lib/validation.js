/**
 * Validation Rules System
 *
 * Usage:
 * import { required, email, minLength, createValidator } from '$lib/validation';
 *
 * const validate = createValidator({
 *   email: [required('Email is required'), email()],
 *   password: [required(), minLength(8, 'Password must be 8+ characters')]
 * });
 *
 * const errors = validate({ email: '', password: '123' });
 * // { email: 'Email is required', password: 'Password must be 8+ characters' }
 */

// ============================================
// Built-in Validation Rules
// ============================================

/**
 * Field is required
 * @param {string} message - Custom error message
 * @returns {function} Validation rule
 */
export function required(message = 'This field is required') {
  return (value) => {
    if (value === null || value === undefined || value === '') {
      return message;
    }
    if (Array.isArray(value) && value.length === 0) {
      return message;
    }
    return null;
  };
}

/**
 * Valid email format
 * @param {string} message - Custom error message
 * @returns {function} Validation rule
 */
export function email(message = 'Please enter a valid email') {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return (value) => {
    if (!value) return null; // Let required handle empty
    return emailRegex.test(value) ? null : message;
  };
}

/**
 * Minimum length
 * @param {number} min - Minimum length
 * @param {string} message - Custom error message
 * @returns {function} Validation rule
 */
export function minLength(min, message) {
  return (value) => {
    if (!value) return null;
    const msg = message || `Must be at least ${min} characters`;
    return value.length >= min ? null : msg;
  };
}

/**
 * Maximum length
 * @param {number} max - Maximum length
 * @param {string} message - Custom error message
 * @returns {function} Validation rule
 */
export function maxLength(max, message) {
  return (value) => {
    if (!value) return null;
    const msg = message || `Must be no more than ${max} characters`;
    return value.length <= max ? null : msg;
  };
}

/**
 * Matches regex pattern
 * @param {RegExp} pattern - Pattern to match
 * @param {string} message - Error message
 * @returns {function} Validation rule
 */
export function pattern(regex, message = 'Invalid format') {
  return (value) => {
    if (!value) return null;
    return regex.test(value) ? null : message;
  };
}

/**
 * Minimum number value
 * @param {number} min - Minimum value
 * @param {string} message - Custom error message
 * @returns {function} Validation rule
 */
export function min(minValue, message) {
  return (value) => {
    if (value === null || value === undefined || value === '') return null;
    const num = Number(value);
    const msg = message || `Must be at least ${minValue}`;
    return num >= minValue ? null : msg;
  };
}

/**
 * Maximum number value
 * @param {number} max - Maximum value
 * @param {string} message - Custom error message
 * @returns {function} Validation rule
 */
export function max(maxValue, message) {
  return (value) => {
    if (value === null || value === undefined || value === '') return null;
    const num = Number(value);
    const msg = message || `Must be no more than ${maxValue}`;
    return num <= maxValue ? null : msg;
  };
}

/**
 * Matches another field value
 * @param {string} fieldName - Field to match
 * @param {string} message - Error message
 * @returns {function} Validation rule (receives full form data as second arg)
 */
export function matches(fieldName, message) {
  return (value, allValues) => {
    if (!value) return null;
    const msg = message || `Must match ${fieldName}`;
    return value === allValues[fieldName] ? null : msg;
  };
}

/**
 * URL format
 * @param {string} message - Custom error message
 * @returns {function} Validation rule
 */
export function url(message = 'Please enter a valid URL') {
  return (value) => {
    if (!value) return null;
    try {
      new URL(value);
      return null;
    } catch {
      return message;
    }
  };
}

/**
 * Phone number (basic validation)
 * @param {string} message - Custom error message
 * @returns {function} Validation rule
 */
export function phone(message = 'Please enter a valid phone number') {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return (value) => {
    if (!value) return null;
    const digits = value.replace(/\D/g, '');
    if (digits.length < 10 || !phoneRegex.test(value)) {
      return message;
    }
    return null;
  };
}

// ============================================
// Validator Factory
// ============================================

/**
 * Create a validator function from a rules schema
 * @param {Object} schema - { fieldName: [rule1, rule2, ...] }
 * @returns {function} Validator function
 *
 * @example
 * const validate = createValidator({
 *   email: [required(), email()],
 *   password: [required(), minLength(8)]
 * });
 *
 * const errors = validate(formData);
 * const isValid = Object.keys(errors).length === 0;
 */
export function createValidator(schema) {
  return (values) => {
    const errors = {};

    for (const [field, rules] of Object.entries(schema)) {
      const value = values[field];

      for (const rule of rules) {
        const error = rule(value, values);
        if (error) {
          errors[field] = error;
          break; // Stop at first error for this field
        }
      }
    }

    return errors;
  };
}

/**
 * Validate a single field
 * @param {any} value - Field value
 * @param {Array} rules - Array of validation rules
 * @param {Object} allValues - All form values (for cross-field validation)
 * @returns {string|null} Error message or null
 */
export function validateField(value, rules, allValues = {}) {
  for (const rule of rules) {
    const error = rule(value, allValues);
    if (error) return error;
  }
  return null;
}

// ============================================
// Svelte Store Integration
// ============================================

import { writable, derived } from 'svelte/store';

/**
 * Create a form store with validation
 * @param {Object} initialValues - Initial form values
 * @param {Object} schema - Validation schema
 * @returns {Object} Form store with values, errors, isValid, etc.
 *
 * @example
 * const form = createFormStore(
 *   { email: '', password: '' },
 *   { email: [required(), email()], password: [required(), minLength(8)] }
 * );
 *
 * // In component:
 * <input bind:value={$form.values.email} on:blur={() => form.touch('email')} />
 * {#if $form.errors.email}<span>{$form.errors.email}</span>{/if}
 * <button disabled={!$form.isValid || $form.isSubmitting}>Submit</button>
 */
export function createFormStore(initialValues, schema = {}) {
  const values = writable({ ...initialValues });
  const touched = writable({});
  const isSubmitting = writable(false);
  const submitCount = writable(0);

  const validate = createValidator(schema);

  // Derive errors from values
  const errors = derived(values, ($values) => validate($values));

  // Derive validity
  const isValid = derived(errors, ($errors) => Object.keys($errors).length === 0);

  // Derive touched errors (only show errors for touched fields)
  const touchedErrors = derived(
    [errors, touched],
    ([$errors, $touched]) => {
      const result = {};
      for (const [field, error] of Object.entries($errors)) {
        if ($touched[field]) {
          result[field] = error;
        }
      }
      return result;
    }
  );

  return {
    values,
    errors,
    touchedErrors,
    touched,
    isValid,
    isSubmitting,
    submitCount,

    // Touch a field (show its errors)
    touch(field) {
      touched.update((t) => ({ ...t, [field]: true }));
    },

    // Touch all fields
    touchAll() {
      values.subscribe((v) => {
        const allTouched = {};
        for (const key of Object.keys(v)) {
          allTouched[key] = true;
        }
        touched.set(allTouched);
      })();
    },

    // Set a field value
    setValue(field, value) {
      values.update((v) => ({ ...v, [field]: value }));
    },

    // Set multiple values
    setValues(newValues) {
      values.update((v) => ({ ...v, ...newValues }));
    },

    // Reset form to initial state
    reset() {
      values.set({ ...initialValues });
      touched.set({});
      isSubmitting.set(false);
    },

    // Handle form submission
    async handleSubmit(onSubmit) {
      // Touch all fields to show all errors
      let currentValues;
      values.subscribe((v) => { currentValues = v; })();

      const allTouched = {};
      for (const key of Object.keys(currentValues)) {
        allTouched[key] = true;
      }
      touched.set(allTouched);

      // Check validity
      const currentErrors = validate(currentValues);
      if (Object.keys(currentErrors).length > 0) {
        return { success: false, errors: currentErrors };
      }

      // Submit
      isSubmitting.set(true);
      submitCount.update((c) => c + 1);

      try {
        const result = await onSubmit(currentValues);
        return { success: true, result };
      } catch (error) {
        return { success: false, error };
      } finally {
        isSubmitting.set(false);
      }
    }
  };
}
