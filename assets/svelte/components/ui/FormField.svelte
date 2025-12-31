<!--
  FormField Component
  Consistent wrapper for form inputs with label, error, and helper text.
  Integrates with Form component for validation.
-->
<script>
  import { getContext, onMount, onDestroy } from 'svelte';
  import { FORM_CONTEXT } from './Form.svelte';
  import { validateField } from '../../lib/validation.js';

  /** @type {string} Label text for the field */
  export let label = '';

  /** @type {string} Unique name/ID for the field */
  export let name = `field-${Math.random().toString(36).slice(2, 9)}`;

  /** @type {string | null} Error message (external, overrides validation) */
  export let error = null;

  /** @type {string | null} Helper text below the input */
  export let helper = null;

  /** @type {boolean} Whether the field is required */
  export let required = false;

  /** @type {boolean} Whether the field is disabled */
  export let disabled = false;

  /** @type {Array} Validation rules */
  export let rules = [];

  // Get form context if inside a Form
  const formContext = getContext(FORM_CONTEXT);

  // Internal state
  let fieldValue = '';
  let validationError = null;
  let touched = false;
  let fieldRegistration = null;

  // Register with parent Form if available
  onMount(() => {
    if (formContext) {
      // Combine required with custom rules
      const allRules = required
        ? [requiredRule, ...rules]
        : rules;

      fieldRegistration = formContext.registerField(name, allRules);
    }
  });

  onDestroy(() => {
    if (fieldRegistration) {
      fieldRegistration.unregister();
    }
  });

  // Required validation rule
  function requiredRule(value) {
    if (value === null || value === undefined || value === '') {
      return 'This field is required';
    }
    return null;
  }

  // Handle value changes from child input
  function handleInput(event) {
    const value = event.detail?.value ?? event.target?.value ?? '';
    fieldValue = value;

    if (fieldRegistration) {
      fieldRegistration.setValue(value);
    } else {
      // Validate locally if not in a Form
      const allRules = required ? [requiredRule, ...rules] : rules;
      validationError = validateField(value, allRules);
    }
  }

  // Handle blur (touch field)
  function handleBlur() {
    touched = true;
    if (fieldRegistration) {
      fieldRegistration.touch();
    }
  }

  // Displayed error: external error > validation error (if touched)
  $: displayError = error || (touched ? validationError : null);
  $: hasError = !!displayError;

  // Generate ID for accessibility
  $: inputId = `input-${name}`;
  $: errorId = `${inputId}-error`;
  $: helperId = `${inputId}-helper`;
</script>

<div class="flex flex-col gap-1">
  {#if label}
    <label
      for={inputId}
      class="text-sm font-medium transition-colors"
      class:text-text={!disabled}
      class:text-text-disabled={disabled}
    >
      {label}
      {#if required}
        <span class="text-error ml-1">*</span>
      {/if}
    </label>
  {/if}

  <div class="relative">
    <!-- Pass props to slotted input -->
    <slot
      id={inputId}
      {name}
      {error}
      {disabled}
      invalid={hasError}
      describedBy={hasError ? errorId : helper ? helperId : null}
      onInput={handleInput}
      onBlur={handleBlur}
    />
  </div>

  <!-- Error message with animation -->
  {#if displayError}
    <p
      id={errorId}
      class="text-sm text-error flex items-center gap-1 animate-in"
      role="alert"
    >
      <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
      </svg>
      {displayError}
    </p>
  {:else if helper}
    <p id={helperId} class="text-sm text-text-muted">
      {helper}
    </p>
  {/if}
</div>

<style>
  .animate-in {
    animation: slideIn 0.2s ease-out;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
