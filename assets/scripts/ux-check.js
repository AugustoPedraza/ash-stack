#!/usr/bin/env node

/**
 * UX Quality Checker
 *
 * Scans Svelte components for common UX issues that linting can't catch.
 * Run: node scripts/ux-check.js [component.svelte]
 *
 * Checks for:
 * - Missing loading/error/empty states
 * - Icon buttons without aria-label
 * - Delete buttons without confirmation patterns
 * - Missing keyboard handlers
 * - Color-only status indicators
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SVELTE_DIR = path.join(__dirname, '../svelte');

// Colors for terminal output
const colors = {
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  dim: '\x1b[2m'
};

// UX Check Rules
const rules = [
  {
    id: 'loading-state',
    name: 'Missing Loading State',
    severity: 'warning',
    description: 'Components with data fetching should handle loading state',
    check: (content, filename) => {
      // Skip if it's a UI component (not a feature component)
      if (filename.includes('/ui/')) return null;

      const hasAsyncData = /await|fetch|pushEvent|\.then\(/.test(content);
      const hasLoadingHandling = /loading|isLoading|\{#if.*load|\{#await/.test(content);
      const hasSkeleton = /Skeleton/.test(content);

      if (hasAsyncData && !hasLoadingHandling && !hasSkeleton) {
        return 'Component appears to fetch data but has no loading state. Consider using Skeleton or {#await}.';
      }
      return null;
    }
  },
  {
    id: 'empty-state',
    name: 'Missing Empty State',
    severity: 'warning',
    description: 'Lists should handle empty state',
    check: (content) => {
      const hasEachLoop = /\{#each\s+(\w+)/.test(content);
      const hasEmptyCheck = /\.length\s*===?\s*0|EmptyState|:else\}[\s\S]*?No\s|empty/.test(content);

      if (hasEachLoop && !hasEmptyCheck) {
        return 'Component has {#each} loop but no empty state handling. Consider adding {:else} or checking .length.';
      }
      return null;
    }
  },
  {
    id: 'error-state',
    name: 'Missing Error State',
    severity: 'warning',
    description: 'Async operations should handle errors',
    check: (content, filename) => {
      if (filename.includes('/ui/')) return null;

      const hasAsyncData = /await|fetch|pushEventAsync/.test(content);
      const hasTryCatch = /try\s*\{|\.catch\(|:catch\}/.test(content);
      const hasErrorState = /error|Error|failed|Failed/.test(content);

      if (hasAsyncData && !hasTryCatch && !hasErrorState) {
        return 'Component has async operations but no visible error handling.';
      }
      return null;
    }
  },
  {
    id: 'icon-button-label',
    name: 'Icon Button Missing Label',
    severity: 'error',
    description: 'Icon-only buttons need aria-label for screen readers',
    check: (content) => {
      // Look for buttons with only Icon inside
      const iconButtonPattern = /<Button[^>]*>[\s\n]*<(?:Icon|svg|Lucide)[^>]*\/>[\s\n]*<\/Button>/g;
      const matches = content.match(iconButtonPattern) || [];

      const issues = matches.filter(match => !match.includes('aria-label'));

      if (issues.length > 0) {
        return `Found ${issues.length} icon-only button(s) without aria-label. Add aria-label="Description" to each.`;
      }
      return null;
    }
  },
  {
    id: 'delete-confirmation',
    name: 'Delete Without Confirmation',
    severity: 'error',
    description: 'Destructive actions should require confirmation',
    check: (content) => {
      // Check for delete/remove handlers that don't reference a modal
      const hasDeleteAction = /on:click=\{[^}]*(?:delete|remove|destroy)/i.test(content);
      const hasConfirmation = /Modal|confirm|Confirm|showDelete|openDelete/i.test(content);

      if (hasDeleteAction && !hasConfirmation) {
        return 'Delete/remove action found without apparent confirmation. Use a Modal for destructive actions.';
      }
      return null;
    }
  },
  {
    id: 'keyboard-handler',
    name: 'Click Without Keyboard',
    severity: 'warning',
    description: 'Interactive divs/spans need keyboard handlers',
    check: (content) => {
      // Look for on:click on div/span without on:keydown
      const clickOnDivPattern = /<(?:div|span)[^>]*on:click[^>]*>/g;
      const matches = content.match(clickOnDivPattern) || [];

      const issues = matches.filter(match =>
        !match.includes('on:keydown') &&
        !match.includes('on:keypress') &&
        !match.includes('on:keyup') &&
        !match.includes('role="button"')
      );

      if (issues.length > 0) {
        return `Found ${issues.length} clickable div/span without keyboard handler. Add on:keydown or use <button> instead.`;
      }
      return null;
    }
  },
  {
    id: 'color-only-status',
    name: 'Color-Only Status',
    severity: 'warning',
    description: 'Status indicators should not rely on color alone',
    check: (content) => {
      // Check for status patterns using only color classes
      const colorOnlyStatus = /class="[^"]*(?:text-success|text-error|text-warning|bg-success|bg-error|bg-warning)[^"]*"[^>]*>(?:<\/|{[^}]+})/;

      if (colorOnlyStatus.test(content)) {
        return 'Possible color-only status indicator. Add an icon or text label alongside color.';
      }
      return null;
    }
  },
  {
    id: 'button-order',
    name: 'Button Order',
    severity: 'info',
    description: 'Primary button should be on the right',
    check: (content) => {
      // Check for primary before secondary in same container
      const buttonGroup = /<(?:div|footer)[^>]*>[\s\S]*?<Button[^>]*variant="primary"[\s\S]*?<Button[^>]*variant="secondary"/;

      if (buttonGroup.test(content)) {
        return 'Primary button appears before secondary. Convention: secondary on left, primary on right.';
      }
      return null;
    }
  },
  {
    id: 'touch-target',
    name: 'Small Touch Target',
    severity: 'warning',
    description: 'Interactive elements should be at least 44x44px',
    check: (content) => {
      // Check for size="xs" on buttons (likely too small for touch)
      const smallButtons = /Button[^>]*size="xs"/g;
      const matches = content.match(smallButtons) || [];

      if (matches.length > 0) {
        return `Found ${matches.length} extra-small button(s). Ensure touch targets are at least 44x44px on mobile.`;
      }
      return null;
    }
  },
  {
    id: 'form-labels',
    name: 'Input Without Label',
    severity: 'error',
    description: 'Form inputs need associated labels',
    check: (content) => {
      // Check for Input/Select/Textarea not wrapped in FormField
      const inputPattern = /<(?:Input|Select|Textarea)[^>]*\/>/g;
      const formFieldPattern = /<FormField[\s\S]*?<\/FormField>/g;

      const allInputs = content.match(inputPattern) || [];
      const formFieldContent = (content.match(formFieldPattern) || []).join('');
      const inputsInFormField = formFieldContent.match(inputPattern) || [];

      const orphanInputs = allInputs.length - inputsInFormField.length;

      if (orphanInputs > 0) {
        return `Found ${orphanInputs} input(s) not wrapped in FormField. Inputs need labels for accessibility.`;
      }
      return null;
    }
  }
];

// Check a single file
function checkFile(filepath) {
  const content = fs.readFileSync(filepath, 'utf-8');
  const filename = path.relative(SVELTE_DIR, filepath);
  const issues = [];

  for (const rule of rules) {
    const result = rule.check(content, filename);
    if (result) {
      issues.push({
        rule: rule.id,
        name: rule.name,
        severity: rule.severity,
        message: result
      });
    }
  }

  return { filename, issues };
}

// Get all Svelte files
function getSvelteFiles(dir) {
  const files = [];

  function scan(directory) {
    const entries = fs.readdirSync(directory, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        scan(fullPath);
      } else if (entry.name.endsWith('.svelte')) {
        files.push(fullPath);
      }
    }
  }

  scan(dir);
  return files;
}

// Format output
function formatResults(results) {
  let errorCount = 0;
  let warningCount = 0;
  let infoCount = 0;

  console.log('\n' + colors.cyan + '📋 UX Quality Check' + colors.reset + '\n');

  for (const { filename, issues } of results) {
    if (issues.length === 0) continue;

    console.log(colors.dim + '─'.repeat(60) + colors.reset);
    console.log(colors.cyan + filename + colors.reset);

    for (const issue of issues) {
      let icon, color;

      switch (issue.severity) {
        case 'error':
          icon = '✖';
          color = colors.red;
          errorCount++;
          break;
        case 'warning':
          icon = '⚠';
          color = colors.yellow;
          warningCount++;
          break;
        default:
          icon = 'ℹ';
          color = colors.dim;
          infoCount++;
      }

      console.log(`  ${color}${icon} ${issue.name}${colors.reset}`);
      console.log(`    ${colors.dim}${issue.message}${colors.reset}`);
    }
  }

  console.log('\n' + colors.dim + '─'.repeat(60) + colors.reset);

  if (errorCount === 0 && warningCount === 0) {
    console.log(colors.green + '✓ No UX issues found!' + colors.reset);
  } else {
    console.log(
      `${colors.red}${errorCount} error(s)${colors.reset}, ` +
      `${colors.yellow}${warningCount} warning(s)${colors.reset}, ` +
      `${colors.dim}${infoCount} info${colors.reset}`
    );
  }

  console.log('');

  return errorCount > 0 ? 1 : 0;
}

// Main
function main() {
  const args = process.argv.slice(2);

  let files;
  if (args.length > 0) {
    // Check specific files
    files = args.map(f => path.resolve(f));
  } else {
    // Check all Svelte files
    files = getSvelteFiles(SVELTE_DIR);
  }

  const results = files.map(checkFile);
  const exitCode = formatResults(results);

  process.exit(exitCode);
}

main();
