#!/usr/bin/env node
/**
 * Component Manifest Generator
 *
 * Scans Svelte components, extracts props/documentation from JSDoc,
 * and generates a components.json manifest for AI context.
 *
 * Usage: node scripts/gen-component-manifest.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const COMPONENTS_DIR = path.join(__dirname, '../svelte/components/ui');
const OUTPUT_FILE = path.join(__dirname, '../../components.json');

/**
 * Parse a Svelte component file and extract props/docs
 */
function parseComponent(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const name = path.basename(filePath, '.svelte');

  // Extract component description from top comment
  const descMatch = content.match(/<!--\s*([\s\S]*?)-->/);
  const description = descMatch
    ? descMatch[1].trim().split('\n').map(l => l.trim()).join(' ')
    : '';

  // Extract props with JSDoc comments
  const props = [];
  const propRegex = /\/\*\*\s*([\s\S]*?)\*\/\s*export\s+let\s+(\w+)\s*(?:=\s*([^;]+))?;/g;

  let match;
  while ((match = propRegex.exec(content)) !== null) {
    const [, jsdoc, propName, defaultValue] = match;

    // Parse JSDoc
    const typeMatch = jsdoc.match(/@type\s*\{([^}]+)\}/);
    const descLines = jsdoc
      .split('\n')
      .map(l => l.replace(/^\s*\*\s?/, '').trim())
      .filter(l => l && !l.startsWith('@'));

    props.push({
      name: propName,
      type: typeMatch ? typeMatch[1].trim() : 'any',
      default: defaultValue ? defaultValue.trim() : undefined,
      description: descLines.join(' '),
      required: !defaultValue
    });
  }

  // Extract slots
  const slots = [];
  const slotRegex = /<slot\s+name="([^"]+)"/g;
  while ((match = slotRegex.exec(content)) !== null) {
    slots.push(match[1]);
  }
  // Check for default slot
  if (content.includes('<slot') && (content.includes('<slot>') || content.includes('<slot />'))) {
    slots.unshift('default');
  }

  // Extract events
  const events = [];
  const dispatchRegex = /dispatch\(['"]([^'"]+)['"]/g;
  while ((match = dispatchRegex.exec(content)) !== null) {
    if (!events.includes(match[1])) {
      events.push(match[1]);
    }
  }

  // Detect categories based on props/patterns
  const category = detectCategory(name, content, props);

  return {
    name,
    description,
    category,
    props,
    slots,
    events,
    file: `assets/svelte/components/ui/${name}.svelte`
  };
}

/**
 * Detect component category based on patterns
 */
function detectCategory(name, content, props) {
  const lowerName = name.toLowerCase();

  if (['button', 'input', 'select', 'textarea', 'checkbox', 'toggle', 'formfield', 'form', 'submitbutton'].some(n => lowerName.includes(n))) {
    return 'form';
  }
  if (['page', 'card', 'section', 'pageheader'].some(n => lowerName.includes(n))) {
    return 'layout';
  }
  if (['avatar', 'badge', 'skeleton', 'emptystate'].some(n => lowerName.includes(n))) {
    return 'display';
  }
  if (['modal', 'tabs', 'dropdown', 'sheet'].some(n => lowerName.includes(n))) {
    return 'interactive';
  }
  if (['animatedlist'].some(n => lowerName.includes(n))) {
    return 'animation';
  }
  if (['datatable', 'infinitescroll', 'pagination'].some(n => lowerName.includes(n))) {
    return 'data';
  }
  if (['toast'].some(n => lowerName.includes(n))) {
    return 'feedback';
  }
  return 'other';
}

/**
 * Generate example usage for a component
 */
function generateExample(component) {
  const { name, props } = component;
  const requiredProps = props.filter(p => p.required);
  const optionalWithDefaults = props.filter(p => !p.required && p.default);

  let propsStr = requiredProps
    .map(p => {
      if (p.type.includes('string')) return `${p.name}="value"`;
      if (p.type.includes('boolean')) return p.name;
      if (p.type.includes('number')) return `${p.name}={0}`;
      if (p.type.includes('Array')) return `${p.name}={[]}`;
      return `${p.name}={value}`;
    })
    .join(' ');

  if (propsStr) propsStr = ' ' + propsStr;

  // Simple vs self-closing
  const hasSlots = component.slots.length > 0;
  if (hasSlots) {
    return `<${name}${propsStr}>\n  <!-- content -->\n</${name}>`;
  }
  return `<${name}${propsStr} />`;
}

/**
 * Main function
 */
function main() {
  console.log('📦 Generating component manifest...\n');

  // Find all .svelte files
  const files = fs.readdirSync(COMPONENTS_DIR)
    .filter(f => f.endsWith('.svelte'))
    .sort();

  console.log(`Found ${files.length} components\n`);

  const components = [];
  const categories = {};

  for (const file of files) {
    const filePath = path.join(COMPONENTS_DIR, file);
    try {
      const component = parseComponent(filePath);
      component.example = generateExample(component);
      components.push(component);

      // Group by category
      if (!categories[component.category]) {
        categories[component.category] = [];
      }
      categories[component.category].push(component.name);

      console.log(`  ✓ ${component.name} (${component.props.length} props, ${component.slots.length} slots)`);
    } catch (error) {
      console.error(`  ✗ ${file}: ${error.message}`);
    }
  }

  // Build manifest
  const manifest = {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    generated: new Date().toISOString(),
    version: '1.0.0',
    description: 'Auto-generated component manifest for AI context. DO NOT EDIT MANUALLY.',
    usage: "import { ComponentName } from '$lib/components/ui';",
    categories,
    components
  };

  // Write manifest
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(manifest, null, 2));
  console.log(`\n✅ Generated ${OUTPUT_FILE}`);

  // Print summary
  console.log('\n📊 Summary:');
  for (const [cat, comps] of Object.entries(categories)) {
    console.log(`  ${cat}: ${comps.join(', ')}`);
  }
}

main();
