/**
 * ESLint Configuration for Svelte + TypeScript + Accessibility
 *
 * Enforces:
 * - TypeScript best practices
 * - Svelte best practices
 * - Accessibility (a11y) rules
 *
 * Run: npm run lint
 * Fix: npm run lint:fix
 */

import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import svelteParser from 'svelte-eslint-parser';
import tsParser from '@typescript-eslint/parser';

export default [
  // Base JS config
  js.configs.recommended,

  // TypeScript configs
  ...tseslint.configs.recommended,

  // Svelte plugin configs (includes a11y rules)
  ...svelte.configs['flat/recommended'],
  ...svelte.configs['flat/prettier'],

  // Global settings
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  // TypeScript files
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
  },

  // Svelte files
  {
    files: ['**/*.svelte'],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: tsParser,
      },
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
      // TYPESCRIPT IN SVELTE
      // =================================================================

      // Allow unused vars starting with _
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_|^\\$\\$',
        },
      ],
      'no-unused-vars': 'off',

      // Console is OK in dev
      'no-console': 'off',
    },
  },

  // JavaScript files (for gradual migration)
  {
    files: ['**/*.js'],
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-unused-vars': 'off',
    },
  },

  // Ignore patterns
  {
    ignores: ['node_modules/', 'dist/', '../priv/static/', 'vendor/', '*.min.js'],
  },
];
