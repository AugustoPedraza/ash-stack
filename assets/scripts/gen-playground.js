#!/usr/bin/env node
/**
 * Playground Generator
 *
 * Generates a Svelte component that displays all UI components
 * with their variants for visual testing.
 *
 * Usage: node scripts/gen-playground.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MANIFEST_FILE = path.join(__dirname, '../../components.json');
const OUTPUT_FILE = path.join(__dirname, '../svelte/components/dev/ComponentPlayground.svelte');

/**
 * Generate prop controls for a component
 */
function generatePropControls(component) {
  return component.props.map(prop => {
    const { name, type, default: defaultVal } = prop;

    // Skip complex types
    if (type.includes('Array') || type.includes('Function') || type.includes('=>')) {
      return null;
    }

    if (type.includes('boolean')) {
      return { name, control: 'toggle', default: defaultVal === 'true' };
    }

    if (type.includes("'") && type.includes('|')) {
      // Enum type like 'sm' | 'md' | 'lg'
      const options = type.match(/'([^']+)'/g)?.map(s => s.replace(/'/g, '')) || [];
      return { name, control: 'select', options, default: defaultVal?.replace(/['"]/g, '') || options[0] };
    }

    if (type.includes('string')) {
      return { name, control: 'text', default: defaultVal?.replace(/['"]/g, '') || '' };
    }

    if (type.includes('number')) {
      return { name, control: 'number', default: parseInt(defaultVal) || 0 };
    }

    return null;
  }).filter(Boolean);
}

/**
 * Generate playground component
 */
function generatePlayground(manifest) {
  const { categories, components } = manifest;

  // Build imports
  const imports = components.map(c => c.name).join(',\n  ');

  // Build component sections
  const sections = Object.entries(categories).map(([category, componentNames]) => {
    const categoryComponents = components.filter(c => componentNames.includes(c.name));

    const componentBlocks = categoryComponents.map(comp => {
      const controls = generatePropControls(comp);
      const hasControls = controls.length > 0;

      return `
    <!-- ${comp.name} -->
    <div class="component-block">
      <div class="component-header">
        <h3>${comp.name}</h3>
        <p class="component-desc">${comp.description.substring(0, 100)}${comp.description.length > 100 ? '...' : ''}</p>
      </div>
      <div class="component-preview">
        ${generatePreview(comp)}
      </div>
      <details class="component-props">
        <summary>Props (${comp.props.length})</summary>
        <ul>
          ${comp.props.map(p => `<li><code>${p.name}</code>: ${p.type}${p.default ? ` = ${p.default}` : ' (required)'}</li>`).join('\n          ')}
        </ul>
      </details>
    </div>`;
    }).join('\n');

    return `
  <!-- ${category.toUpperCase()} -->
  <section class="category-section">
    <h2>${category.charAt(0).toUpperCase() + category.slice(1)} Components</h2>
    ${componentBlocks}
  </section>`;
  }).join('\n');

  return `<!--
  Component Playground
  Auto-generated - DO NOT EDIT MANUALLY
  Run: npm run gen:playground
-->
<script>
  import {
  ${imports}
  } from '../ui';

  // Demo state
  let toggleChecked = false;
  let inputValue = '';
  let selectValue = '';
  let modalOpen = false;
  let sheetOpen = false;
  let dropdownOpen = false;

  const demoItems = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' }
  ];

  const demoTabs = [
    { id: 'tab1', label: 'First' },
    { id: 'tab2', label: 'Second' },
    { id: 'tab3', label: 'Third' }
  ];

  const demoColumns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'name', label: 'Name', sortable: true, primary: true }
  ];

  const dropdownItems = [
    { id: 'edit', label: 'Edit' },
    { id: 'delete', label: 'Delete', danger: true }
  ];
</script>

<div class="playground">
  <header class="playground-header">
    <h1>Component Playground</h1>
    <p>Auto-generated from component JSDoc. Last updated: ${new Date().toLocaleDateString()}</p>
  </header>

  <nav class="playground-nav">
    ${Object.keys(categories).map(cat => `<a href="#${cat}">${cat}</a>`).join('\n    ')}
  </nav>

  <main class="playground-content">
${sections}
  </main>
</div>

<style>
  .playground {
    max-width: 1200px;
    margin: 0 auto;
    padding: var(--spacing-6);
    font-family: system-ui, sans-serif;
  }

  .playground-header {
    margin-bottom: var(--spacing-8);
    padding-bottom: var(--spacing-4);
    border-bottom: 1px solid var(--color-border);
  }

  .playground-header h1 {
    margin: 0 0 var(--spacing-2);
    font-size: 2rem;
  }

  .playground-header p {
    margin: 0;
    color: var(--color-text-muted);
  }

  .playground-nav {
    position: sticky;
    top: 0;
    z-index: 10;
    display: flex;
    gap: var(--spacing-4);
    padding: var(--spacing-3) 0;
    margin-bottom: var(--spacing-6);
    background: var(--color-background);
    border-bottom: 1px solid var(--color-border);
  }

  .playground-nav a {
    padding: var(--spacing-2) var(--spacing-3);
    color: var(--color-text-muted);
    text-decoration: none;
    border-radius: var(--radius-md);
    text-transform: capitalize;
  }

  .playground-nav a:hover {
    color: var(--color-text);
    background: var(--color-surface-sunken);
  }

  .category-section {
    margin-bottom: var(--spacing-12);
  }

  .category-section h2 {
    margin: 0 0 var(--spacing-6);
    padding-bottom: var(--spacing-2);
    font-size: 1.5rem;
    border-bottom: 2px solid var(--color-primary);
  }

  .component-block {
    margin-bottom: var(--spacing-8);
    padding: var(--spacing-4);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
  }

  .component-header {
    margin-bottom: var(--spacing-4);
  }

  .component-header h3 {
    margin: 0 0 var(--spacing-1);
    font-size: 1.125rem;
  }

  .component-desc {
    margin: 0;
    font-size: 0.875rem;
    color: var(--color-text-muted);
  }

  .component-preview {
    padding: var(--spacing-6);
    background: var(--color-background);
    border: 1px dashed var(--color-border);
    border-radius: var(--radius-md);
    margin-bottom: var(--spacing-4);
  }

  .component-props {
    font-size: 0.875rem;
  }

  .component-props summary {
    cursor: pointer;
    padding: var(--spacing-2);
    color: var(--color-text-muted);
  }

  .component-props ul {
    margin: var(--spacing-2) 0 0;
    padding-left: var(--spacing-6);
  }

  .component-props li {
    margin-bottom: var(--spacing-1);
  }

  .component-props code {
    padding: 0.125rem 0.25rem;
    background: var(--color-surface-sunken);
    border-radius: var(--radius-sm);
    font-size: 0.8125rem;
  }

  .preview-row {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-3);
    align-items: center;
  }

  .preview-stack {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-3);
  }
</style>
`;
}

/**
 * Generate preview for a component
 */
function generatePreview(comp) {
  const { name } = comp;

  // Custom previews for complex components
  const previews = {
    Button: `<div class="preview-row">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button loading>Loading</Button>
        </div>`,
    Input: `<div class="preview-stack" style="max-width: 300px">
          <Input placeholder="Default input" bind:value={inputValue} />
          <Input size="sm" placeholder="Small" />
          <Input invalid placeholder="Invalid" />
        </div>`,
    Toggle: `<div class="preview-stack">
          <Toggle bind:checked={toggleChecked} label="Enable notifications" />
          <Toggle size="sm" label="Small toggle" />
          <Toggle size="lg" label="Large toggle" />
        </div>`,
    Badge: `<div class="preview-row">
          <Badge>Default</Badge>
          <Badge variant="primary">Primary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="error">Error</Badge>
        </div>`,
    Avatar: `<div class="preview-row">
          <Avatar size="xs" />
          <Avatar size="sm" />
          <Avatar size="md" />
          <Avatar size="lg" />
          <Avatar size="xl" />
        </div>`,
    Skeleton: `<div class="preview-stack" style="max-width: 300px">
          <Skeleton variant="text" lines={3} />
          <div class="preview-row">
            <Skeleton variant="avatar" />
            <Skeleton variant="button" />
          </div>
        </div>`,
    Card: `<Card title="Card Title" description="Card description text">
          <p>Card content goes here</p>
        </Card>`,
    Modal: `<div>
          <Button on:click={() => modalOpen = true}>Open Modal</Button>
          <Modal bind:open={modalOpen} title="Modal Title">
            <p>Modal content</p>
          </Modal>
        </div>`,
    Sheet: `<div>
          <Button on:click={() => sheetOpen = true}>Open Sheet</Button>
          <Sheet bind:open={sheetOpen} title="Sheet Title">
            <p>Sheet content with gesture dismiss</p>
          </Sheet>
        </div>`,
    Tabs: `<Tabs tabs={demoTabs} value="tab1" />`,
    Dropdown: `<Dropdown items={dropdownItems} bind:open={dropdownOpen} title="Actions">
          <Button slot="trigger" variant="secondary">Open Menu</Button>
        </Dropdown>`,
    AnimatedList: `<AnimatedList items={demoItems} animation="slide" let:item>
          <div style="padding: 8px; background: var(--color-surface-sunken); border-radius: 4px;">
            {item.name}
          </div>
        </AnimatedList>`,
    DataTable: `<DataTable columns={demoColumns} data={demoItems} />`,
    Pagination: `<Pagination page={1} totalPages={10} totalItems={100} />`,
    EmptyState: `<EmptyState preset="search" title="No results" size="sm" compact />`,
    Toast: `<Button on:click={() => toast.success('Success!')}>Show Toast</Button>`,
    ToastContainer: `<p style="color: var(--color-text-muted)">Add &lt;ToastContainer /&gt; to app root</p>`,
    InfiniteScroll: `<p style="color: var(--color-text-muted)">Wrap content for infinite loading</p>`,
  };

  return previews[name] || `<${name} />`;
}

/**
 * Main function
 */
function main() {
  console.log('🎨 Generating component playground...\n');

  // Check manifest exists
  if (!fs.existsSync(MANIFEST_FILE)) {
    console.error('❌ components.json not found. Run npm run gen:components first.');
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(MANIFEST_FILE, 'utf-8'));
  console.log(`Found ${manifest.components.length} components in manifest\n`);

  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Generate playground
  const playground = generatePlayground(manifest);
  fs.writeFileSync(OUTPUT_FILE, playground);

  console.log(`✅ Generated ${OUTPUT_FILE}`);
}

main();
