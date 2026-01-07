# Design System

> **Purpose**: This document defines UX patterns for consistent, accessible interfaces.
> All patterns are derived from industry best practices (Shopify Polaris, Apple HIG, Material Design, Nielsen Norman Group research).

---

## Table of Contents

1. [Foundations](#1-foundations)
2. [Components](#2-components)
3. [Patterns](#3-patterns)
4. [Blocks](#4-blocks)
5. [Pages](#5-pages)
6. [Accessibility](#6-accessibility)

---

## 1. Foundations

### 1.1 Spacing Scale

**Base unit: 4px** (industry standard)

| Token | Value | Use Case |
|-------|-------|----------|
| `space-0` | 0 | Reset |
| `space-1` | 4px | Tight gaps (icon + text) |
| `space-2` | 8px | Related elements |
| `space-3` | 12px | Form field gaps |
| `space-4` | 16px | Section padding |
| `space-6` | 24px | Card padding |
| `space-8` | 32px | Section gaps |
| `space-12` | 48px | Page sections |
| `space-16` | 64px | Major divisions |

**Spacing Rules:**
- Related elements: `space-2` (8px)
- Unrelated elements: `space-4` (16px) or more
- Form fields: `space-3` (12px) vertical gap
- Card padding: `space-4` (16px) mobile, `space-6` (24px) desktop

### 1.2 Typography Scale

**Modular scale: 1.25 ratio** (Major Third)

| Token | Size | Line Height | Use Case |
|-------|------|-------------|----------|
| `text-xs` | 12px | 1.5 | Captions, labels |
| `text-sm` | 14px | 1.5 | Secondary text, form hints |
| `text-base` | 16px | 1.5 | Body text (default) |
| `text-lg` | 18px | 1.5 | Lead paragraphs |
| `text-xl` | 20px | 1.4 | Card titles |
| `text-2xl` | 24px | 1.3 | Section headings |
| `text-3xl` | 30px | 1.2 | Page titles |
| `text-4xl` | 36px | 1.2 | Hero headings |

**Font Weights:**
- `400` (normal): Body text
- `500` (medium): Labels, navigation
- `600` (semibold): Headings, emphasis
- `700` (bold): Strong emphasis only

**Typography Rules:**
- Body text: 16px minimum (accessibility)
- Line length: 45-75 characters optimal
- Paragraph spacing: Equal to line height
- Heading hierarchy: Skip no more than one level

### 1.3 Color Usage

**Semantic Color Rules:**

| Color | Use Case | Never Use For |
|-------|----------|---------------|
| `primary` | Main actions, links, focus | Backgrounds |
| `secondary` | Secondary actions | Primary CTAs |
| `success` | Confirmations, completed | Decorative |
| `warning` | Caution, pending | Critical errors |
| `error` | Errors, destructive | Non-error states |
| `muted` | Disabled, placeholders | Active elements |

**Color Application:**
- **Text on light**: Use `text` (high contrast) or `text-secondary` (medium)
- **Text on dark**: Use `on-primary`, `on-success`, etc.
- **Backgrounds**: Layer with `background` → `surface` → `surface-raised`
- **Borders**: Use `border` default, `border-strong` for emphasis

**Contrast Requirements (WCAG 2.1):**
- Normal text: 4.5:1 minimum
- Large text (18px+): 3:1 minimum
- UI components: 3:1 minimum

### 1.4 Motion

**Duration Scale:**

| Duration | Use Case |
|----------|----------|
| 0ms | Reduced motion preference |
| 100ms | Micro-interactions (hover, focus) |
| 150ms | Button states, toggles |
| 200ms | Dropdowns, tooltips |
| 300ms | Modals, sheets, page transitions |
| 500ms | Complex animations |

**Easing:**
- **Enter**: `ease-out` (fast start, slow end)
- **Exit**: `ease-in` (slow start, fast end)
- **Movement**: `ease-in-out` (symmetric)

**Motion Rules:**
- Always respect `prefers-reduced-motion`
- Use transform/opacity only (GPU-accelerated)
- Avoid animation on first load
- Exit faster than enter (150ms vs 200ms)

---

## 2. Components

### 2.1 Button

**Variants:**

| Variant | Use Case | Visual |
|---------|----------|--------|
| `primary` | Main action per section | Solid fill, high contrast |
| `secondary` | Alternative actions | Muted fill or outline |
| `ghost` | Tertiary actions, toolbars | No fill, subtle hover |
| `destructive` | Delete, remove, cancel | Red/error color |

**Sizes:**

| Size | Height | Padding | Font | Use Case |
|------|--------|---------|------|----------|
| `sm` | 32px | 12px | 14px | Dense UIs, tables |
| `md` | 40px | 16px | 14px | Default |
| `lg` | 48px | 20px | 16px | Hero CTAs, mobile primary |

**States:**
- **Default**: Base appearance
- **Hover**: Subtle background shift
- **Active/Pressed**: Scale down slightly (0.98)
- **Focus**: Visible ring (2px, offset 2px)
- **Disabled**: 50% opacity, no pointer events
- **Loading**: Spinner replaces text, maintain width

**Button Rules:**
1. One primary button per visible area
2. Primary on right, secondary on left (Western reading)
3. Minimum touch target: 44×44px
4. Loading state: Disable interaction, show spinner
5. Icon-only buttons require `aria-label`

### 2.2 Input

**Anatomy:**
```
┌─────────────────────────────────────┐
│ Label *                             │  ← Label (above, always visible)
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ Placeholder or value            │ │  ← Input field
│ └─────────────────────────────────┘ │
│ Helper text or error message        │  ← Helper/Error (below)
└─────────────────────────────────────┘
```

**Sizes:**

| Size | Height | Use Case |
|------|--------|----------|
| `sm` | 32px | Dense forms, filters |
| `md` | 40px | Default |
| `lg` | 48px | Mobile-first, hero forms |

**States:**
- **Default**: Subtle border
- **Hover**: Border darkens slightly
- **Focus**: Primary color ring
- **Error**: Error color border + ring
- **Disabled**: Muted background, no interaction
- **Read-only**: No border, text only appearance

**Input Rules:**
1. Labels above inputs (not floating - accessibility)
2. Required fields: Asterisk after label
3. Placeholder ≠ Label (placeholders disappear)
4. Error messages below input, not in tooltip
5. Validate on blur, not on every keystroke

### 2.3 Form Field (Molecule)

The atomic form unit combining label, input, and feedback.

**Structure:**
```svelte
<FormField label="Email" required error={errors.email} hint="We'll never share your email">
  <Input type="email" bind:value={email} />
</FormField>
```

**Spacing:**
- Label to input: 4px
- Input to helper/error: 4px
- Field to next field: 12px (space-3)

### 2.4 Select

**Desktop**: Native dropdown with custom styling
**Mobile**: Native select (better UX on touch devices)

**Rules:**
1. Show placeholder: "Select an option"
2. Searchable for 7+ options
3. Multi-select: Use checkboxes in dropdown
4. Clear button for optional fields

### 2.5 Checkbox & Radio

**Checkbox**: Multiple selections allowed
**Radio**: Single selection from group

**Sizing:**
- Touch target: 44×44px minimum (including label)
- Visual checkbox: 16-20px

**Rules:**
1. Clicking label toggles input
2. Group related options with fieldset + legend
3. Limit radio groups to 5-7 options
4. Default selection for radios (no null state)

### 2.6 Switch/Toggle

For binary settings with immediate effect.

**Rules:**
1. Use for instant changes (no submit required)
2. Label describes the ON state
3. Don't use for forms requiring submission
4. Provide feedback after toggle (toast)

### 2.7 Badge

Status indicators and counts.

**Variants:**
- `default`: Neutral information
- `secondary`: Less emphasis
- `success`: Positive status
- `warning`: Attention needed
- `error`: Problem status

**Rules:**
1. Keep text short (1-2 words or number)
2. Don't use for actions (use buttons)
3. Position consistently (top-right for counts)

### 2.8 Avatar

User/entity representation.

**Sizes:**
| Size | Dimension | Use Case |
|------|-----------|----------|
| `xs` | 24px | Dense lists |
| `sm` | 32px | Comments, compact |
| `md` | 40px | Default |
| `lg` | 48px | Profile headers |
| `xl` | 64px | Profile pages |

**Rules:**
1. Always have fallback (initials or icon)
2. Include alt text for images
3. Group overlaps: Max 4 visible, "+N" for more

---

## 3. Patterns

### 3.1 Forms

#### 3.1.1 Single Column Form (Default)

**Use for**: All forms (higher completion rates proven by research)

```
┌────────────────────────────────────────────┐
│ Form Title                                 │
│ Optional description                       │
├────────────────────────────────────────────┤
│                                            │
│ Label                                      │
│ ┌────────────────────────────────────────┐ │
│ │ Input                                  │ │
│ └────────────────────────────────────────┘ │
│ Helper text                                │
│                                            │
│ Label                                      │
│ ┌────────────────────────────────────────┐ │
│ │ Input                                  │ │
│ └────────────────────────────────────────┘ │
│                                            │
│ ┌─ Section Divider (optional) ───────────┐ │
│                                            │
│ Label                                      │
│ ┌────────────────────────────────────────┐ │
│ │ Input                                  │ │
│ └────────────────────────────────────────┘ │
│                                            │
├────────────────────────────────────────────┤
│           [Cancel]  [Primary Action]       │
└────────────────────────────────────────────┘
```

**Rules:**
- Max width: 400-500px (optimal reading)
- Fields stack vertically always
- Related fields grouped with subtle divider
- Actions at bottom, primary on right

#### 3.1.2 Form Sections (Long Forms)

**Use for**: Settings, profiles, multi-step processes

```
┌────────────────────────────────────────────┐
│ Section Title                              │
│ Section description                        │
├────────────────────────────────────────────┤
│ Field                                      │
│ Field                                      │
│ Field                                      │
│                        [Section Action]    │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ Another Section                            │
├────────────────────────────────────────────┤
│ Field                                      │
│ Field                                      │
└────────────────────────────────────────────┘
```

**Rules:**
- Each section can submit independently
- Clear visual separation between sections
- Section descriptions explain purpose
- 3-5 fields per section maximum

#### 3.1.3 Inline Forms

**Use for**: Search, filters, quick actions

```
┌────────────────────────────────────────────────┐
│ ┌──────────────────────────┐ ┌──────────────┐  │
│ │ Search...                │ │    Search    │  │
│ └──────────────────────────┘ └──────────────┘  │
└────────────────────────────────────────────────┘
```

**Rules:**
- Single row on desktop, stack on mobile
- Label can be placeholder for simple forms
- Submit on Enter or button click

### 3.2 Form Validation

**Timing:**
1. Validate on blur (not on every keystroke)
2. Re-validate on submit
3. Clear errors when user starts fixing

**Error Display:**
```
┌────────────────────────────────────────────┐
│ Email *                                    │
│ ┌────────────────────────────────────────┐ │
│ │ invalid-email                          │ │  ← Red border
│ └────────────────────────────────────────┘ │
│ ⚠ Please enter a valid email address     │  ← Error below
└────────────────────────────────────────────┘
```

**Rules:**
1. Show one error per field (most important)
2. Error message should explain how to fix
3. Don't clear input on error
4. Focus first error field on submit failure

### 3.3 Buttons & Actions

#### 3.3.1 CTA Hierarchy

Understanding when to use primary vs secondary/contextual actions is critical for good UX.

**Primary CTA (`btn-primary`)**
- One per visible area (screen, modal, card)
- The main action the user came to perform
- Creates, submits, confirms, saves
- Examples: "Sign Up", "Save", "Submit", "Create Project"

**Secondary CTA (`btn-secondary` or `btn-ghost`)**
- Alternative actions, cancel, back
- Less visually prominent than primary
- Examples: "Cancel", "Back", "Skip", "Learn More"

**Contextual Actions (`btn-ghost` with muted color)**
- Actions on selected items (bulk actions)
- Toolbar actions, row actions
- Should NOT compete with primary CTA
- Use `text-base-content/70` for muted appearance
- Examples: "Archive", "Mark as Read", "Move to..."

**Destructive Actions (`text-error` or `btn-error`)**
- Delete, remove, permanently destroy
- Always requires confirmation
- Separated visually from other actions
- Examples: "Delete", "Remove", "Permanently Delete"

```
┌─────────────────────────────────────────────────────────┐
│ CTA Type         │ Style                   │ Use When  │
├─────────────────────────────────────────────────────────┤
│ Primary          │ btn-primary             │ Main goal │
│ Secondary        │ btn-ghost / btn-outline │ Cancel    │
│ Contextual       │ btn-ghost + muted       │ Bulk/tool │
│ Destructive      │ btn-ghost + text-error  │ Delete    │
└─────────────────────────────────────────────────────────┘
```

#### 3.3.2 Bulk Actions Pattern

When users select items, show contextual actions in an expandable bar.

```
┌────────────────────────────────────────────┐
│ ☑ Inbox                            Reset   │  ← Normal header
├────────────────────────────────────────────┤
│ 3 selected · Clear   [Read][Archive] | [🗑]│  ← Expands on selection
├────────────────────────────────────────────┤
│ ☑ Item 1                                   │
│ ☑ Item 2                                   │
└────────────────────────────────────────────┘
```

**Bulk Action Button Rules:**
1. **All contextual** - No primary buttons in bulk actions
2. **Muted by default** - `text-base-content/70 hover:text-base-content`
3. **Delete separated** - Divider before delete, uses `text-error`
4. **Icons + labels** - Labels hidden on mobile (`hidden sm:inline`)
5. **Position at top** - Not floating at bottom (obscures content)

```svelte
<!-- Correct bulk action styling -->
<button class="btn btn-ghost btn-sm text-base-content/70 hover:text-base-content">
  <Icon /> <span class="hidden sm:inline">Archive</span>
</button>

<div class="w-px h-5 bg-base-300"></div> <!-- Separator before delete -->

<button class="btn btn-ghost btn-sm text-error hover:bg-error/10">
  <TrashIcon /> <span class="hidden sm:inline">Delete</span>
</button>
```

#### 3.3.3 Button Placement

**Forms/Dialogs:**
```
┌────────────────────────────────────────────┐
│                                            │
│ Form content...                            │
│                                            │
├────────────────────────────────────────────┤
│           [Secondary]  [Primary]           │  ← Right-aligned
└────────────────────────────────────────────┘
```

**Cards with actions:**
```
┌────────────────────────────────────────────┐
│ Card Title                        [Action] │  ← Header action
├────────────────────────────────────────────┤
│ Content                                    │
├────────────────────────────────────────────┤
│ [Secondary]  [Primary]                     │  ← Footer actions
└────────────────────────────────────────────┘
```

**Rules:**
1. Primary action: Right side
2. Secondary/Cancel: Left of primary
3. Destructive: Left side or separate area
4. One primary action visible at a time

#### 3.3.4 Destructive Actions

**Pattern: Confirmation Modal**

```
┌────────────────────────────────────────────┐
│ Delete Project?                            │
├────────────────────────────────────────────┤
│                                            │
│ This will permanently delete "My Project"  │
│ and all its data. This cannot be undone.   │
│                                            │
├────────────────────────────────────────────┤
│                    [Cancel]  [Delete]      │
└────────────────────────────────────────────┘
```

**Rules:**
1. Confirm all destructive actions
2. Clearly state what will be deleted
3. Mention if irreversible
4. Use red/destructive button style
5. Don't auto-focus the destructive button

### 3.4 Modals & Dialogs

#### 3.4.1 Desktop: Center Dialog

```
     ┌─────────────────────────────────────┐
     │ Dialog Title                    [×] │
     ├─────────────────────────────────────┤
     │                                     │
     │ Content                             │
     │                                     │
     ├─────────────────────────────────────┤
     │            [Cancel]  [Primary]      │
     └─────────────────────────────────────┘
```

**Sizes:**
- `sm`: 400px (confirmations, simple forms)
- `md`: 500px (standard forms) - default
- `lg`: 600px (complex content)
- `full`: 100% with padding (mobile)

#### 3.4.2 Mobile: Bottom Sheet

```
┌────────────────────────────────────────────┐
│                                            │
│                                            │
│          (dimmed background)               │
│                                            │
│                                            │
├────────────────────────────────────────────┤
│               ─────                        │  ← Drag handle
│ Sheet Title                                │
├────────────────────────────────────────────┤
│                                            │
│ Content                                    │
│                                            │
│ [Primary Action - Full Width]              │
│                                            │
│ [Secondary - Full Width]                   │
│                                            │
│ (safe area padding)                        │
└────────────────────────────────────────────┘
```

**Rules:**
1. Backdrop click closes (unless form with data)
2. Escape key closes
3. Trap focus inside modal
4. Return focus to trigger on close
5. Scroll content, not entire modal

### 3.5 Navigation

#### 3.5.1 Desktop: Sidebar

```
┌─────────┬───────────────────────────────────┐
│         │ Page Title              [Actions] │
│  Logo   ├───────────────────────────────────┤
│         │                                   │
│ ─────── │                                   │
│         │                                   │
│ □ Home  │      Page Content                 │
│ □ Items │                                   │
│ □ Users │                                   │
│         │                                   │
│ ─────── │                                   │
│         │                                   │
│ □ Settn │                                   │
│         │                                   │
└─────────┴───────────────────────────────────┘
```

**Width:** 240-280px expanded, 64px collapsed

#### 3.5.2 Mobile: Bottom Tab Bar

```
┌────────────────────────────────────────────┐
│                                            │
│                                            │
│            Page Content                    │
│                                            │
│                                            │
├────────────────────────────────────────────┤
│   🏠      📋      ➕      👤      ⚙️      │
│  Home   Items   Create  Profile Settings   │
└────────────────────────────────────────────┘
```

**Rules:**
1. 3-5 items maximum
2. Icons + labels (not icons only)
3. Active state clearly visible
4. Touch targets: Full width of tab
5. "Create" action can be FAB instead

### 3.6 Loading States

#### 3.6.1 Initial Load: Skeleton

```
┌────────────────────────────────────────────┐
│ ████████████████                           │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░          │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│ ░░░░░░░░░░░░░░░░░░░░                       │
├────────────────────────────────────────────┤
│ ░░░░░░░░░░░░░                              │
└────────────────────────────────────────────┘
```

**Use when:** Loading known content structure (pages, cards, lists)

#### 3.6.2 Action Loading: Button Spinner

```
┌────────────────────────────────────┐
│          ◌ Saving...               │
└────────────────────────────────────┘
```

**Use when:** User-triggered action (submit, save)

#### 3.6.3 Content Loading: Inline Spinner

```
┌────────────────────────────────────────────┐
│ Section Title                              │
├────────────────────────────────────────────┤
│                                            │
│               ◌                            │
│          Loading...                        │
│                                            │
└────────────────────────────────────────────┘
```

**Use when:** Loading part of the page

**Loading Rules:**
1. < 100ms: Show nothing
2. 100-300ms: Show button spinner
3. > 300ms: Show skeleton or spinner
4. Always provide way to cancel long operations

### 3.7 Empty States

```
┌────────────────────────────────────────────┐
│                                            │
│                  📋                        │
│                                            │
│           No projects yet                  │
│                                            │
│   Create your first project to get        │
│   started with the dashboard.             │
│                                            │
│        [Create Project]                    │
│                                            │
└────────────────────────────────────────────┘
```

**Rules:**
1. Explain what would be here
2. Provide action to create/add
3. Use illustration or icon
4. Friendly, encouraging tone

### 3.8 Detail Views (Profile, Contact, Record Details)

**Key principle**: Information architecture matters more than visual tricks.

#### 3.8.1 Mobile: Always Single Column

```
┌────────────────────────────────────────────┐
│ ← Contact Details                    [···] │  ← Header with actions
├────────────────────────────────────────────┤
│                                            │
│            ┌───────────┐                   │
│            │    👤     │                   │  ← Hero: Avatar/Image
│            │           │                   │
│            └───────────┘                   │
│         John Merrifield                    │  ← Primary identifier
│         General Contractor                 │  ← Secondary identifier
│                                            │
├────────────────────────────────────────────┤
│ Contact                                    │  ← Section header
│                                            │
│ Phone                                      │  ← Label (muted)
│ (555) 123-4567                        📱   │  ← Value + action
│                                            │
│ Email                                      │
│ john@contractor.com                   ✉️   │
│                                            │
│ Location                                   │
│ San Francisco, CA                     📍   │
│                                            │
├────────────────────────────────────────────┤
│ Company                                    │
│                                            │
│ IFC Construction                           │
│ General Contractor · Est. 2015             │
│                                            │
├────────────────────────────────────────────┤
│ Notes                                      │
│                                            │
│ Reliable contractor, great communication.  │
│ Prefers morning calls.                     │
│                                            │
└────────────────────────────────────────────┘
```

#### 3.8.2 Tablet/Desktop: Two Columns for Related Fields

```
┌──────────────────────────────────────────────────────────────┐
│ ← Contact Details                           [Edit] [Delete]  │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────┐  John Merrifield                               │
│  │   👤    │  General Contractor                            │
│  │         │  IFC Construction                               │
│  └─────────┘                                                 │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│ Contact                                                      │
│                                                              │
│ Phone                          Email                         │
│ (555) 123-4567            📱   john@contractor.com      ✉️   │
│                                                              │
│ Mobile                         Website                       │
│ (555) 987-6543            📱   contractor.com           🔗   │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│ Address                                                      │
│                                                              │
│ 123 Main Street, Suite 100                                   │
│ San Francisco, CA 94102                                 📍   │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│ Notes                                                        │
│                                                              │
│ Reliable contractor, great communication. Prefers morning    │
│ calls. Has worked on 5 projects with us since 2020.         │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

#### 3.8.3 Detail View Field Anatomy

```
┌────────────────────────────────────────────┐
│ Label                                      │  ← 12-14px, muted color
│ Value with action                     [→]  │  ← 16px, primary color
│ Optional helper text                       │  ← 12px, muted
└────────────────────────────────────────────┘
```

**Label**: Above value (not inline)
- Font: 12-14px, muted/secondary color
- Weight: 500 (medium)

**Value**: The actual data
- Font: 16px, primary text color
- Weight: 400 (normal) for text, 500 for names
- Actionable values (phone, email, link) have icons

**Action icons**: Right-aligned
- Only show when value is actionable
- Phone → call, Email → compose, Address → map

#### 3.8.4 Information Hierarchy (Content Architecture)

**Order content by importance and frequency of use:**

```
1. HERO SECTION (Top)
   - Avatar/Image (large: 72-96px)
   - Primary identifier (Name)
   - Secondary identifier (Title, Role)
   - Quick status indicators (badges)

2. PRIMARY ACTIONS (Near hero or header)
   - Call, Message, Email buttons
   - Context menu for secondary actions

3. MOST-USED INFO (First section)
   - Contact details (phone, email)
   - Primary relationship info

4. SECONDARY INFO (Middle sections)
   - Address, location
   - Company details
   - Custom fields

5. EXTENDED INFO (Lower sections)
   - Notes, descriptions
   - History, activity log

6. METADATA (Bottom or collapsed)
   - Created/updated dates
   - IDs, technical info
```

#### 3.8.5 One Column vs Two Columns

| Scenario | Layout | Reason |
|----------|--------|--------|
| Mobile (< 640px) | **Always 1 column** | Touch targets, readability |
| Short values (phone, email) | **2 columns OK** | Efficient space use |
| Long values (addresses, notes) | **1 column** | Readability |
| Mixed content | **Hybrid** | Sections decide |
| Forms (editing) | **Always 1 column** | 40% higher completion |

**Rules:**
1. Mobile = single column, no exceptions
2. Two columns only for SHORT, RELATED fields (phone + email)
3. Never break a logical group across columns
4. Notes, descriptions, addresses = always full width
5. When in doubt, use single column

#### 3.8.6 Actionable Values

Make data useful by connecting it to actions:

| Data Type | Action | Icon |
|-----------|--------|------|
| Phone | Call | 📱 |
| Email | Compose | ✉️ |
| Address | Open maps | 📍 |
| URL | Open link | 🔗 |
| Date | Add to calendar | 📅 |
| File | Download | ⬇️ |

```
┌────────────────────────────────────────────┐
│ Phone                                      │
│ (555) 123-4567                        📱   │ ← Tapping calls
└────────────────────────────────────────────┘
```

#### 3.8.7 Empty Field Handling

**Option 1: Hide empty fields** (cleaner, less noise)
- Use when most fields are optional
- User can access via Edit mode

**Option 2: Show with placeholder** (discoverable)
```
┌────────────────────────────────────────────┐
│ Website                                    │
│ Not provided                         [+]   │ ← Muted, with add action
└────────────────────────────────────────────┘
```
- Use when field is important to encourage completion

**Option 3: Show "Add" link** (progressive disclosure)
```
┌────────────────────────────────────────────┐
│ + Add website                              │
└────────────────────────────────────────────┘
```

### 3.9 Error States

#### 3.9.1 Inline Error (Forms)

See Form Validation section.

#### 3.9.2 Section Error

```
┌────────────────────────────────────────────┐
│                  ⚠️                        │
│                                            │
│    Failed to load projects                 │
│                                            │
│    Check your connection and try again.   │
│                                            │
│             [Try Again]                    │
└────────────────────────────────────────────┘
```

#### 3.9.3 Toast Notification

For async errors (network, background operations):

```
                    ┌─────────────────────────┐
                    │ ❌ Failed to save       │
                    │    Connection lost      │
                    └─────────────────────────┘
```

**Toast Rules:**
1. Auto-dismiss success (3-5 seconds)
2. Persist errors until dismissed
3. Stack from top or bottom (be consistent)
4. Max 3 visible at once

### 3.10 Master Lists

Master lists are tappable list views that navigate to detail views. All master lists share the same **rhythm** (spacing, sizing) but differ in **content** based on the data type.

#### 3.10.1 List Row Anatomy

```
┌─────────────────────────────────────────────────────────────┐
│  ┌────┐                                                     │
│  │icon│  Primary Text              Secondary Info    ▶     │
│  │ 40 │  Secondary Text                                     │
│  └────┘                                                     │
└─────────────────────────────────────────────────────────────┘
   12px   12px gap                                    4px

Padding: 16px horizontal, 12px vertical
```

#### 3.10.2 Consistent Dimensions (The Rhythm)

| Element | Size | Notes |
|---------|------|-------|
| Row padding | `px-4 py-3` | 16px horizontal, 12px vertical |
| Gap | `gap-3` | 12px between elements |
| Icon/Avatar | 40-44px | Circular, consistent across all lists |
| Primary text | 15px (medium) | Merchant, contact name, title |
| Secondary text | 13px (muted) | Category, company, subtitle |
| Chevron | 16px | `text-base-content/30` |
| Dividers | 1px | `border-base-200` between rows |

#### 3.10.3 Content Varies by Data Type

| Data Type | Leading | Primary | Secondary | Trailing |
|-----------|---------|---------|-----------|----------|
| **Contacts** | Avatar | Name | Company | Chevron |
| **Transactions** | Category icon | Merchant | Category | Amount + Chevron |
| **Messages** | Avatar | Sender | Preview | Time + Badge |
| **Files** | Type icon | Filename | Size/Date | Chevron |
| **Tasks** | Checkbox | Title | Due date | Priority badge |

#### 3.10.4 Grouped Lists

When lists have natural groupings (by date, category, status):

```
┌─────────────────────────────────────────────┐
│ TODAY                                       │  ← Sticky header
├─────────────────────────────────────────────┤
│ Row 1                                       │
│ Row 2                                       │
├─────────────────────────────────────────────┤
│ YESTERDAY                                   │
├─────────────────────────────────────────────┤
│ Row 3                                       │
└─────────────────────────────────────────────┘
```

**Group Header Style:**
- Padding: `px-4 py-1.5`
- Text: `text-xs uppercase tracking-wide text-base-content/50`
- Background: `bg-base-200/50`
- Position: `sticky top-0` (stays visible while scrolling group)

#### 3.10.5 Status Indicators

Badges should be **consistent** between list and detail views:

```svelte
<!-- Same badge in list AND detail -->
<span class="px-2 py-0.5 rounded-full text-xs font-medium capitalize {statusStyle}">
  {status}
</span>
```

**Badge Colors:**
- Completed/Success: `bg-success/15 text-success`
- Pending/Warning: `bg-warning/15 text-warning`
- Failed/Error: `bg-error/15 text-error`

**Rule:** If badge appears in list, it must use identical styling in detail view for visual mapping.

#### 3.10.6 Semantic Labels in Details

Avoid generic labels. Use **contextual labels** that explain the data:

| Bad (Generic) | Good (Semantic) |
|---------------|-----------------|
| Date | Paid on, Received on, Created at |
| Status | (Use badge, not a field) |
| ID | Reference, Order #, Confirmation |
| Type | (Implied by icon/context) |

### 3.11 Form CTA Placement

Different form contexts require different CTA (Call-to-Action) placements. Industry research shows clear patterns.

#### 3.11.1 Public Forms: CTA at Bottom

**Use for**: Login, Signup, Contact Us, Lead Capture, Newsletter, Support Requests

```
┌────────────────────────────────────────────┐
│                                            │
│              [Logo/Header]                 │
│                                            │
│           Welcome / Contact Us             │
│           Brief description                │
│                                            │
├────────────────────────────────────────────┤
│                                            │
│ Name                                       │
│ ┌────────────────────────────────────────┐ │
│ │                                        │ │
│ └────────────────────────────────────────┘ │
│                                            │
│ Email                                      │
│ ┌────────────────────────────────────────┐ │
│ │                                        │ │
│ └────────────────────────────────────────┘ │
│                                            │
│ Message                                    │
│ ┌────────────────────────────────────────┐ │
│ │                                        │ │
│ └────────────────────────────────────────┘ │
│                                            │
│ ┌────────────────────────────────────────┐ │
│ │      Send Message (Full Width)         │ │  ← CTA at bottom
│ └────────────────────────────────────────┘ │
│                                            │
└────────────────────────────────────────────┘
```

**Why bottom CTA for public forms:**
1. User flows top-to-bottom (natural reading)
2. No navigation header to compete with
3. CTA appears after user commits to form
4. Full-width button maximizes touch target
5. Industry standard (Google, Apple, Stripe)

**Recipes**: `ContactFormPublicRecipe`, `LoginRecipe`, `SignupRecipe`

#### 3.11.2 In-App Forms: CTA in Header

**Use for**: Edit Profile, Edit Contact, Settings, any authenticated editing

```
┌────────────────────────────────────────────┐
│ ←  Edit Contact                     Save   │  ← Header with Save CTA
├────────────────────────────────────────────┤
│                                            │
│ Name                                       │
│ ┌────────────────────────────────────────┐ │
│ │ Jane Smith                             │ │
│ └────────────────────────────────────────┘ │
│                                            │
│ Email                                      │
│ ┌────────────────────────────────────────┐ │
│ │ jane@example.com                       │ │
│ └────────────────────────────────────────┘ │
│                                            │
│ Phone                                      │
│ ┌────────────────────────────────────────┐ │
│ │ (555) 123-4567                         │ │
│ └────────────────────────────────────────┘ │
│                                            │
│                                            │
│  (No CTA at bottom - Save is in header)    │
│                                            │
└────────────────────────────────────────────┘
```

**Why header CTA for in-app forms:**
1. User already committed by navigating to edit
2. Save is always visible (doesn't scroll away)
3. Matches mobile platform conventions (iOS/Android)
4. Enables dynamic enable/disable based on dirty state
5. More space for form fields below

**Header Save Button States:**
- **Inactive** (form unchanged): Muted color, disabled
- **Active** (form dirty): Primary color, enabled
- **Saving**: Loading spinner, disabled
- **Saved**: Checkmark briefly, then back to inactive

```svelte
<button
  class="{isDirty ? 'text-primary' : 'text-base-content/30 cursor-not-allowed'}"
  disabled={!isDirty || loading}
>
  {loading ? '◌' : 'Save'}
</button>
```

**Recipes**: `EditContactRecipe`, `ProfileRecipe`, `SettingsRecipe`

#### 3.11.3 Decision Matrix

| Form Type | Location | CTA Position | Button Width |
|-----------|----------|--------------|--------------|
| Login/Signup | Public | Bottom | Full width |
| Contact/Support | Public | Bottom | Full width |
| Newsletter | Public | Bottom | Full width |
| Edit Profile | In-app | Header | Text button |
| Edit Contact | In-app | Header | Text button |
| Settings | In-app | Header | Text button |
| Multi-step Wizard | In-app | Bottom | Full width (Next/Submit) |

### 3.12 Swipe Actions

Swipe gestures on list items for quick actions (delete, archive, etc.).

#### 3.12.1 Swipe Anatomy

```
◄───── Swipe Left ─────                 ───── Swipe Right ─────►

┌────────────────────────────────────────────┐
│ ┌──────────────────────────────────┐ ┌────┐│
│ │                                  │ │ 🗑 ││  ← Destructive (right)
│ │    List Item Content             │ └────┘│
│ │                                  │       │
│ └──────────────────────────────────┘       │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│┌────┐ ┌──────────────────────────────────┐ │
││ ✓  │ │                                  │ │  ← Positive (left)
│└────┘ │    List Item Content             │ │
│       │                                  │ │
│       └──────────────────────────────────┘ │
└────────────────────────────────────────────┘
```

**Rules:**
1. Swipe left → destructive (delete, remove)
2. Swipe right → positive (archive, complete, favorite)
3. Show action icon as user swipes
4. Require full swipe or explicit tap on revealed button
5. Always provide undo for destructive actions

### 3.13 Undo Pattern

Allow users to recover from destructive or significant actions.

```
┌────────────────────────────────────────────────────────┐
│  ✓ Message deleted                         [ Undo ]    │
└────────────────────────────────────────────────────────┘
                    ▲
                    │ Toast with undo action
                    │ Auto-dismiss after 5-8 seconds
```

**Implementation:**
1. Show toast immediately after action
2. Don't actually delete for 5-8 seconds
3. Undo button restores item
4. Toast auto-dismisses, then action finalizes

**Use for:**
- Delete operations
- Archive/Move operations
- Bulk actions
- Sent messages

### 3.14 Floating Action Button (FAB)

Single primary creation action for the current screen.

```
┌────────────────────────────────────────────┐
│                                            │
│                                            │
│            Page Content                    │
│                                            │
│                                            │
│                                       ┌──┐ │
│                                       │+ │ │  ← FAB
│                                       └──┘ │
├────────────────────────────────────────────┤
│   🏠      📋      ➕      👤      ⚙️      │
└────────────────────────────────────────────┘
```

**Rules:**
1. One FAB per screen maximum
2. Position: bottom-right (RTL: bottom-left)
3. Above bottom nav (16-24px gap)
4. Size: 56px (standard), 40px (mini)
5. Shadow: Elevated to stand out
6. Use for: Create, Compose, Add new

**When NOT to use FAB:**
- Multiple primary actions needed
- Action isn't creation-focused
- Form already has submit button

### 3.15 Pull-to-Refresh

Gesture to refresh content on scrollable lists.

```
     ↓ Pull down
┌────────────────────────────────────────────┐
│               ◌ Refreshing...              │  ← Spinner appears
├────────────────────────────────────────────┤
│ List Item 1                                │
│ List Item 2                                │
│ List Item 3                                │
└────────────────────────────────────────────┘
```

**Rules:**
1. Only on scrollable content at top
2. Show spinner while refreshing
3. Haptic feedback on trigger (iOS)
4. Disable during refresh
5. Auto-scroll back when complete

### 3.16 Optimistic Updates

Show action result immediately, sync in background.

```
User taps "Like"
    │
    ▼
┌─────────────────────────────────────┐
│ Instantly show filled heart ❤️      │  ← Optimistic UI
│ Send API request in background      │
└─────────────────────────────────────┘
    │
    ├── Success: Keep state
    │
    └── Failure: Revert + show error toast
```

**Use for:**
- Like/favorite
- Toggle actions
- Adding to lists
- Mark as read

**Don't use for:**
- Payments
- Destructive actions (without undo)
- Complex mutations

### 3.17 Infinite Scroll

Auto-load more content when user scrolls near the bottom.

```
┌────────────────────────────────────────────┐
│ Item 1                                     │
│ Item 2                                     │
│ Item 3                                     │
│ Item 4                                     │
│ Item 5                                     │
│───────────────── scroll ───────────────────│ ← User scrolls here
│ ┌────────────────────────────────────────┐ │
│ │ ░░░░░░░░░░░░░░░░░░░░░░░░ (skeleton)   │ │  ← Show skeleton
│ └────────────────────────────────────────┘ │
│ ┌────────────────────────────────────────┐ │
│ │ ░░░░░░░░░░░░░░░░░░░░░░░░ (skeleton)   │ │
│ └────────────────────────────────────────┘ │
└────────────────────────────────────────────┘
                    │
                    ▼ Data loads
┌────────────────────────────────────────────┐
│ Item 5                                     │
│ Item 6   ← New items replace skeletons     │
│ Item 7                                     │
└────────────────────────────────────────────┘
```

**Rules:**
1. **Auto-trigger** - No "Load More" button (trigger on scroll position)
2. **Skeleton placeholders** - Show 2-3 skeleton items while loading (not spinner)
3. **Trigger threshold** - Load when ~100-200px from bottom
4. **Debounce** - Prevent multiple simultaneous requests
5. **End indicator** - Show "You've reached the end" when no more items
6. **Maintain position** - Don't jump user's scroll position

**Don't use infinite scroll for:**
- Content where users need to reach footer
- Small datasets (< 50 items) - use pagination
- Content requiring specific item finding

### 3.18 Inputs with Icons (Wrapped Inputs)

When placing icons inside input fields, use a wrapper pattern to avoid framework style conflicts.

**Problem**: DaisyUI/FlyonUI applies styles to `<input>` elements that conflict with custom wrappers, creating nested field appearance.

**Solution**: Use `all: unset` on the input, let the wrapper handle styling.

```svelte
<!-- Wrapper provides border, background, focus states -->
<div class="flex items-center gap-2 px-3 h-12 border border-base-300 rounded-lg focus-within:border-primary">
  <!-- Icon -->
  <svg class="h-4 w-4 text-base-content/40 shrink-0">...</svg>

  <!-- Input with all styles stripped -->
  <input
    type="text"
    placeholder="Search..."
    style="all: unset; flex: 1; color: inherit; font: inherit;"
    bind:value={query}
  />
</div>
```

**When to use this pattern:**
- Search inputs with magnifying glass icon
- Inputs with prefix (currency symbol, country code)
- Inputs with suffix (units, clear button)
- Any input where icon/addon is inside the field border

**When NOT to use (use standard `input input-bordered`):**
- Standalone inputs without icons
- Inputs where icon is outside the border
- Standard form fields

**Key points:**
1. `all: unset` removes ALL styles including framework overrides
2. `flex: 1` makes input fill remaining space
3. `color: inherit; font: inherit` preserves text styling
4. `focus-within:border-primary` on wrapper handles focus state

### 3.19 Skeleton Loading

Show content structure while loading data.

```
┌────────────────────────────────────────────┐
│ ████████████████                           │  ← Title skeleton
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░          │  ← Line skeleton
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│ ░░░░░░░░░░░░░░░░░░░░                       │
├────────────────────────────────────────────┤
│ ┌────┐ ░░░░░░░░░░░░░░░░░░░░               │  ← Row skeleton
│ │ ○  │ ░░░░░░░░░░░░                        │
│ └────┘                                     │
├────────────────────────────────────────────┤
│ ┌────┐ ░░░░░░░░░░░░░░░░░░░░               │
│ │ ○  │ ░░░░░░░░░░░░                        │
│ └────┘                                     │
└────────────────────────────────────────────┘
```

**Rules:**
1. Match actual content structure
2. Subtle animation (pulse or shimmer)
3. Use for known content layout
4. Prefer skeleton over spinner for lists/cards
5. Don't animate on `prefers-reduced-motion`

---

## 4. Blocks

Reusable combinations of components for common use cases.

### 4.1 Auth Forms

#### 4.1.1 Login

```
┌────────────────────────────────────────────┐
│                                            │
│                  [Logo]                    │
│                                            │
│           Welcome back                     │
│        Sign in to continue                 │
│                                            │
│ Email                                      │
│ ┌────────────────────────────────────────┐ │
│ │                                        │ │
│ └────────────────────────────────────────┘ │
│                                            │
│ Password                    Forgot?        │
│ ┌────────────────────────────────────────┐ │
│ │                                        │ │
│ └────────────────────────────────────────┘ │
│                                            │
│ ┌────────────────────────────────────────┐ │
│ │            Sign In                     │ │
│ └────────────────────────────────────────┘ │
│                                            │
│ ─────────── or continue with ───────────  │
│                                            │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│ │  Google  │ │  GitHub  │ │  Apple   │   │
│ └──────────┘ └──────────┘ └──────────┘   │
│                                            │
│      Don't have an account? Sign up       │
│                                            │
└────────────────────────────────────────────┘
```

#### 4.1.2 Register

Similar structure, additional fields:
- Name (or split First/Last)
- Email
- Password (with strength indicator)
- Confirm Password (optional, debated)
- Terms acceptance checkbox

### 4.2 Settings Sections

```
┌────────────────────────────────────────────┐
│ Profile                                    │
│ Manage your public profile information     │
├────────────────────────────────────────────┤
│                                            │
│ ○───┐                                      │
│ │   │  Name                                │
│ └───┘  user@example.com                    │
│        [Change Avatar]                     │
│                                            │
│ Display Name                               │
│ ┌────────────────────────────────────────┐ │
│ │ John Doe                               │ │
│ └────────────────────────────────────────┘ │
│                                            │
│ Bio                                        │
│ ┌────────────────────────────────────────┐ │
│ │                                        │ │
│ │                                        │ │
│ └────────────────────────────────────────┘ │
│                                            │
│                         [Save Changes]     │
└────────────────────────────────────────────┘
```

### 4.3 Data Table

#### Desktop

```
┌──────────────────────────────────────────────────────────┐
│ Projects                                    [+ New]      │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ 🔍 Search projects...                    [Filters ▾] │ │
│ └──────────────────────────────────────────────────────┘ │
├────────────────────────────────────────────────────────┬─┤
│ □ │ Name ▲           │ Status    │ Updated    │       ││
├───┼──────────────────┼───────────┼────────────┼───────┼─┤
│ □ │ Project Alpha    │ ● Active  │ 2 hrs ago  │  ⋯   ││
│ □ │ Project Beta     │ ○ Draft   │ 1 day ago  │  ⋯   ││
│ □ │ Project Gamma    │ ● Active  │ 3 days ago │  ⋯   ││
├───┴──────────────────┴───────────┴────────────┴───────┴─┤
│ Showing 1-10 of 24                    [◀] 1 2 3 ... [▶] │
└──────────────────────────────────────────────────────────┘
```

#### Mobile (Card View)

```
┌────────────────────────────────────────────┐
│ Projects                            [+ ]   │
│ ┌────────────────────────────────────────┐ │
│ │ 🔍 Search...                           │ │
│ └────────────────────────────────────────┘ │
├────────────────────────────────────────────┤
│ ┌────────────────────────────────────────┐ │
│ │ Project Alpha              ● Active    │ │
│ │ Updated 2 hrs ago                 [⋯]  │ │
│ └────────────────────────────────────────┘ │
│ ┌────────────────────────────────────────┐ │
│ │ Project Beta                ○ Draft    │ │
│ │ Updated 1 day ago                 [⋯]  │ │
│ └────────────────────────────────────────┘ │
└────────────────────────────────────────────┘
```

### 4.4 Dashboard Cards

#### Stat Card

```
┌────────────────────────────────────────────┐
│ Total Revenue                         📈   │
│                                            │
│ $45,231.89                                │
│ ↑ 20.1% from last month                   │
└────────────────────────────────────────────┘
```

#### Activity Card

```
┌────────────────────────────────────────────┐
│ Recent Activity                      [···] │
├────────────────────────────────────────────┤
│ ○ John created Project X          2h ago  │
│ ○ Jane updated settings           3h ago  │
│ ○ System backup completed         5h ago  │
├────────────────────────────────────────────┤
│ View all activity                     →    │
└────────────────────────────────────────────┘
```

---

## 5. Pages

### 5.1 Page Layouts

#### 5.1.1 Standard Page

```
┌────────────────────────────────────────────────────────────┐
│ [Sidebar]  │  Page Title                        [Actions] │
│            │  Page description                            │
│            ├──────────────────────────────────────────────│
│            │                                              │
│            │  Page content                                │
│            │                                              │
└────────────┴──────────────────────────────────────────────┘
```

#### 5.1.2 Centered Page (Auth, Onboarding)

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│                                                            │
│                    ┌──────────────────┐                   │
│                    │                  │                   │
│                    │  Centered Card   │                   │
│                    │                  │                   │
│                    └──────────────────┘                   │
│                                                            │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

#### 5.1.3 Full Width (Dashboards, Tables)

```
┌────────────────────────────────────────────────────────────┐
│ [Sidebar]  │  Full width content                          │
│            │                                              │
│            │  ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│            │  │  Card    │ │  Card    │ │  Card    │     │
│            │  └──────────┘ └──────────┘ └──────────┘     │
│            │                                              │
│            │  ┌──────────────────────────────────────────┐│
│            │  │  Wide table or content                   ││
│            │  └──────────────────────────────────────────┘│
└────────────┴──────────────────────────────────────────────┘
```

### 5.2 Container Widths

| Size | Max Width | Use Case |
|------|-----------|----------|
| `sm` | 640px | Auth, simple forms |
| `md` | 768px | Content pages |
| `lg` | 1024px | Standard pages |
| `xl` | 1280px | Dashboards |
| `full` | 100% | Tables, complex layouts |

### 5.3 Page Header

```
┌────────────────────────────────────────────────────────────┐
│ Page Title                              [Secondary] [Primary] │
│ Description or breadcrumbs                                │
├────────────────────────────────────────────────────────────┤
│ [Tab 1] [Tab 2] [Tab 3]                                   │  ← Optional tabs
└────────────────────────────────────────────────────────────┘
```

---

## 6. Accessibility

### 6.1 Keyboard Navigation

**Required for all interactive elements:**
- Tab: Move to next focusable element
- Shift+Tab: Move to previous
- Enter/Space: Activate buttons, toggles
- Escape: Close modals, dropdowns
- Arrow keys: Navigate within components (menus, tabs)

### 6.2 Focus Management

**Rules:**
1. Focus ring visible on all interactive elements
2. Focus ring: 2px solid, 2px offset
3. Never remove focus outline without replacement
4. Trap focus in modals
5. Return focus to trigger on modal close

### 6.3 Screen Readers

**Required ARIA:**
- `aria-label`: Icon-only buttons
- `aria-describedby`: Form hints/errors
- `aria-live`: Dynamic content updates
- `aria-expanded`: Expandable sections
- `role="dialog"`: Modals
- `role="alert"`: Error messages

### 6.4 Color & Contrast

1. Never use color alone to convey meaning
2. 4.5:1 contrast for normal text
3. 3:1 contrast for large text and UI
4. Test with grayscale filter

### 6.5 Motion

1. Respect `prefers-reduced-motion`
2. Provide pause controls for animations
3. Avoid flashing content (3 per second max)

---

## Quick Reference

### Do's ✓

- Use single-column forms
- Put primary actions on the right
- Validate on blur
- Show loading states
- Provide empty states
- Use skeleton loaders for known content
- Trap focus in modals
- Always have button text or aria-label

### Don'ts ✗

- Don't use floating labels (accessibility issues)
- Don't validate on every keystroke
- Don't auto-focus destructive actions
- Don't use color alone for meaning
- Don't remove focus outlines
- Don't use more than one primary button
- Don't skip heading levels
- Don't use placeholders as labels
