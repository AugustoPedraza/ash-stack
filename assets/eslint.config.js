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

  // Svelte plugin configs (includes a11y rules)
  ...svelte.configs['flat/recommended'],
  ...svelte.configs['flat/prettier'],

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
      // SVELTE BEST PRACTICES
      // =================================================================

      // Avoid common mistakes
      'svelte/no-at-html-tags': 'warn',
      'svelte/no-target-blank': 'error',

      // Code style
      'svelte/html-quotes': ['error', { prefer: 'double' }],

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
