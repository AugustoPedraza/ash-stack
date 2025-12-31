/**
 * ESLint Configuration for Svelte + Accessibility
 *
 * Enforces:
 * - Svelte best practices
 * - Accessibility (a11y) rules
 * - UX pattern compliance
 *
 * Run: npm run lint
 * Fix: npm run lint:fix
 */

import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import svelteParser from 'svelte-eslint-parser';

export default [
  // Base JS config
  js.configs.recommended,

  // Svelte plugin configs
  ...svelte.configs['flat/recommended'],

  // Global settings
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    }
  },

  // Svelte files
  {
    files: ['**/*.svelte'],
    languageOptions: {
      parser: svelteParser
    },
    rules: {
      // =================================================================
      // ACCESSIBILITY RULES (Critical for UX)
      // =================================================================

      // Interactive elements must be focusable
      'svelte/a11y-no-noninteractive-tabindex': 'error',

      // Click handlers need keyboard equivalents
      'svelte/a11y-click-events-have-key-events': 'error',

      // Mouse events need keyboard equivalents
      'svelte/a11y-mouse-events-have-key-events': 'error',

      // No autofocus (disorienting for screen readers)
      'svelte/a11y-no-autofocus': 'warn',

      // Images need alt text
      'svelte/a11y-missing-attribute': 'error',

      // Interactive elements need accessible names
      'svelte/a11y-label-has-associated-control': 'error',

      // Valid ARIA attributes
      'svelte/a11y-aria-attributes': 'error',
      'svelte/a11y-incorrect-aria-attribute-type': 'error',
      'svelte/a11y-unknown-aria-attribute-type': 'error',
      'svelte/a11y-hidden': 'error',

      // Role requirements
      'svelte/a11y-role-has-required-aria-props': 'error',
      'svelte/a11y-no-redundant-roles': 'warn',

      // Media accessibility
      'svelte/a11y-media-has-caption': 'warn',

      // Structure
      'svelte/a11y-structure': 'error',

      // No distracting elements
      'svelte/a11y-distracting-elements': 'error',

      // Positive tabindex is bad for a11y
      'svelte/a11y-positive-tabindex': 'error',

      // =================================================================
      // SVELTE BEST PRACTICES
      // =================================================================

      // Prevent memory leaks
      'svelte/no-reactive-reassign': 'warn',

      // Avoid common mistakes
      'svelte/no-at-html-tags': 'warn',
      'svelte/no-target-blank': 'error',

      // Code style
      'svelte/html-quotes': ['error', { prefer: 'double' }],
      'svelte/mustache-spacing': 'error',
      'svelte/no-spaces-around-equal-signs-in-attribute': 'error',
      'svelte/spaced-html-comment': 'error',

      // =================================================================
      // GENERAL JS IN SVELTE
      // =================================================================

      // Allow unused vars starting with _
      'no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_|^\\$\\$'
      }],

      // Console is OK in dev
      'no-console': 'off'
    }
  },

  // JavaScript files
  {
    files: ['**/*.js'],
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
    }
  },

  // Ignore patterns
  {
    ignores: [
      'node_modules/',
      '../priv/static/',
      'vendor/',
      '*.min.js'
    ]
  }
];
