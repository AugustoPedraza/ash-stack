# Visual Hierarchy & UX Guidelines

> **AI-Consumable Reference** - Structured rules for consistent UI decisions.
> When generating UI code, follow these patterns strictly.

---

## 1. Action Hierarchy

Every screen has a clear action hierarchy. Never violate these rules.

### Primary Action (Highest Emphasis)
```
Rules:
- ONE per visible context (screen, modal, card)
- Filled button with primary color
- Positioned on RIGHT side (LTR languages)
- Largest touch target in the action group
- Clear verb label: "Save", "Submit", "Continue"

CSS: bg-primary text-primary-content font-semibold
```

### Secondary Action (Medium Emphasis)
```
Rules:
- Supports primary action (Cancel, Back, Skip)
- Outlined or ghost style (no fill)
- Positioned LEFT of primary action
- Same height as primary, less visual weight

CSS: border border-base-300 text-base-content
     OR bg-transparent text-base-content
```

### Tertiary Action (Lowest Emphasis)
```
Rules:
- Optional/auxiliary actions
- Text-only or icon-only
- Smallest visual weight
- Often in overflow menus or footers

CSS: text-base-content/70 hover:text-base-content
```

### Destructive Action (Special Case)
```
Rules:
- ONLY for irreversible actions (delete, remove permanently)
- ALWAYS requires confirmation step
- Uses error color to signal danger
- Never positioned as primary unless in confirmation modal
- Label clearly states consequence: "Delete Account" not "Delete"

CSS: bg-error text-error-content (in confirmation)
     OR text-error (as text link)
```

### Action Placement Pattern
```
┌─────────────────────────────────────────────────┐
│                                                 │
│  [Tertiary]              [Secondary] [Primary]  │
│                                                 │
└─────────────────────────────────────────────────┘

Examples:
- Form: [Cancel] [Save]
- Wizard: [Back] [Continue]
- Confirmation: [Cancel] [Delete]
- With tertiary: [Learn more]     [Cancel] [Submit]
```

---

## 2. Typography Hierarchy

Text has 5 levels. Use consistently across all screens.

### Level 1: Page Title
```
Purpose: Main heading, one per page
Size: 24-32px
Weight: Bold (700)
Color: Full contrast (text-base-content)
Spacing: Large margin below (16-24px)

CSS: text-2xl font-bold text-base-content
```

### Level 2: Section Title
```
Purpose: Groups related content
Size: 18-20px
Weight: Semibold (600)
Color: Full contrast
Spacing: Medium margin (12-16px)

CSS: text-lg font-semibold text-base-content
```

### Level 3: Card/Item Title
```
Purpose: Individual item headings
Size: 16px
Weight: Medium (500)
Color: Full contrast
Spacing: Small margin (8px)

CSS: text-base font-medium text-base-content
```

### Level 4: Body Text
```
Purpose: Primary content, descriptions
Size: 14-16px
Weight: Normal (400)
Color: Full or slightly reduced contrast
Spacing: Normal line height (1.5)

CSS: text-sm text-base-content OR text-base-content/90
```

### Level 5: Caption/Helper
```
Purpose: Metadata, timestamps, hints
Size: 12-13px
Weight: Normal (400)
Color: Muted (60-70% opacity)
Spacing: Tight line height (1.4)

CSS: text-xs text-base-content/60
```

### Typography Do's and Don'ts
```
DO:
- Skip at most one level (Title → Body is OK)
- Use weight AND size for hierarchy
- Maintain consistent sizes across app

DON'T:
- Use more than 3 sizes on one screen
- Rely only on size (use weight too)
- Use ALL CAPS for body text
- Mix font families unnecessarily
```

---

## 3. Color Semantics

Colors communicate meaning. Never use decoratively.

### Semantic Color Map
```
primary     → Brand actions, links, focus states
             "This is interactive/important"

secondary   → Supporting UI, less emphasis
             "This is available but not primary"

success     → Positive outcomes, confirmations
             "This worked" / "This is good"

warning     → Caution, non-blocking issues
             "Be careful" / "Attention needed"

error       → Failures, destructive, blocking
             "This failed" / "This is dangerous"

info        → Neutral information, tips
             "FYI" / "Helpful context"

base-content    → Primary text
base-content/70 → Secondary text
base-content/50 → Disabled/placeholder text
```

### Color Usage Rules
```
1. Never use color ALONE to convey meaning
   Bad:  Red text for errors (colorblind users miss it)
   Good: Red text + error icon + "Error:" prefix

2. Interactive elements use primary color
   Links, buttons, toggles, selected states

3. Status colors only for status
   Don't use error-red for non-error decoration
   Don't use success-green for non-success UI

4. Backgrounds vs Foregrounds
   Soft backgrounds: color/10 or color/15
   Strong backgrounds: full color
   Text on color: use -content variant
```

---

## 4. Spacing System

Consistent spacing creates visual rhythm.

### Spacing Scale
```
0    → 0px    (flush)
1    → 4px    (tight)
2    → 8px    (compact)
3    → 12px   (default)
4    → 16px   (comfortable)
6    → 24px   (spacious)
8    → 32px   (loose)
12   → 48px   (section breaks)
```

### Spacing Rules
```
1. Related items: 8-12px apart
   Form label to input: 6-8px
   Input to next field: 16px
   Items in a list: 8-12px

2. Grouped sections: 24-32px apart
   Card to card: 16px
   Section to section: 24-32px

3. Page padding: 16-20px
   Mobile: 16px horizontal
   Desktop: 24-32px horizontal

4. Touch targets: minimum 44x44px
   Buttons, links, interactive elements
   Include padding in calculation
```

### Component Internal Spacing
```
Button:     px-4 py-2 (16px horizontal, 8px vertical)
Input:      px-3 py-2 (12px horizontal, 8px vertical)
Card:       p-4 (16px all sides)
List item:  px-4 py-3 (16px horizontal, 12px vertical)
Modal:      p-6 (24px all sides)
```

---

## 5. Interactive States

Every interactive element needs 5 states.

### State Definitions
```
Default     → Resting state, no interaction
Hover       → Mouse over (desktop only)
Focus       → Keyboard focus (accessibility critical)
Active      → Being pressed/clicked
Disabled    → Not interactive
```

### State Styling Patterns
```
BUTTONS (Filled):
  Default:  bg-primary text-primary-content
  Hover:    bg-primary brightness-105, slight lift
  Focus:    ring-2 ring-primary/50 ring-offset-2
  Active:   scale-98, darker background
  Disabled: opacity-50 cursor-not-allowed

BUTTONS (Outlined):
  Default:  border-base-300 text-base-content
  Hover:    bg-base-200
  Focus:    ring-2 ring-primary/50
  Active:   bg-base-300
  Disabled: opacity-50 cursor-not-allowed

INPUTS:
  Default:  border-base-300
  Hover:    border-base-400 (subtle)
  Focus:    border-primary ring-2 ring-primary/20
  Active:   (same as focus)
  Disabled: bg-base-200 opacity-60 cursor-not-allowed
  Invalid:  border-error ring-error/20

LIST ITEMS:
  Default:  bg-transparent
  Hover:    bg-base-200
  Focus:    ring-2 ring-inset ring-primary/50
  Active:   bg-base-300
  Selected: bg-primary/10 text-primary
```

### Focus Visibility Rules
```
1. Focus MUST be visible (accessibility law)
2. Use ring utility: ring-2 ring-primary/50 ring-offset-2
3. Never remove outline without replacement
4. Focus-visible for keyboard-only focus
```

---

## 6. Loading & Empty States

Every data-driven UI needs these states.

### Loading States
```
0-100ms:    Show nothing (perceived as instant)
100-300ms:  Show spinner in button/inline
300ms+:     Show skeleton loader
1000ms+:    Show skeleton + "Loading..." text
5000ms+:    Show skeleton + "Taking longer than usual..."

Skeleton patterns:
- Match layout of expected content
- Animate with subtle pulse/shimmer
- Never block interaction with loaded parts
```

### Empty States
```
Required elements:
1. Icon or illustration (optional but recommended)
2. Title: What's empty ("No messages")
3. Description: Why or what to do
4. Action: CTA to resolve ("Compose message")

Empty state hierarchy:
- First-time empty: Welcoming, educational
- Search empty: Helpful, suggest alternatives
- Error empty: Apologetic, offer retry
- Filtered empty: Explain filter, offer clear
```

### Error States
```
Inline errors (forms):
- Appear below invalid field
- Red color + icon
- Specific message: "Email must include @"
- Persist until fixed

Banner errors (page-level):
- Top of content area
- Dismissible for non-blocking
- Action button for resolution
- Don't stack multiple banners

Toast errors (transient):
- For failed actions
- Auto-dismiss after 5-8 seconds
- Include retry action if applicable
```

---

## 7. Mobile-First Patterns

Design for mobile, enhance for desktop.

### Touch Targets
```
Minimum: 44x44px (Apple HIG)
Recommended: 48x48px
Spacing between targets: 8px minimum

Exceptions:
- Inline text links (rely on line height)
- Dense data tables (use row selection)
```

### Mobile Navigation Patterns
```
Bottom Tab Bar:
- 3-5 primary destinations
- Icons + labels (always both)
- Active state clearly visible
- "More" tab for overflow

Top Header:
- Back button (left)
- Title (center)
- Primary action (right)
- Max 2 actions visible

Sheets/Modals:
- Slide up from bottom
- Drag handle for dismiss
- Don't cover full screen (show context)
```

### Thumb Zone
```
┌─────────────────┐
│   HARD REACH    │  <- Nav actions, menus
│                 │
│   COMFORTABLE   │  <- Primary content
│                 │
│   EASY REACH    │  <- Primary actions, tabs
└─────────────────┘

Place primary actions in easy reach zone (bottom third)
```

---

## 8. Form Patterns

Forms are where users give us data. Minimize friction.

### Field Layout
```
Rules:
1. Single column layout (higher completion rates)
2. Labels above inputs (not placeholder-only)
3. Group related fields visually
4. Required fields marked with asterisk (*)
5. Optional fields labeled "(optional)"

Field spacing:
- Label to input: 6-8px
- Input to helper text: 4px
- Field to field: 16-20px
- Field group to group: 24-32px
```

### Validation Patterns
```
When to validate:
- On blur (after leaving field)
- On submit (all fields)
- NOT on every keystroke (too aggressive)

Error display:
- Inline, below the field
- Red color + specific message
- Focus first error on submit
- Clear error when user starts fixing

Success validation:
- Only for critical fields (password strength)
- Green checkmark inline
- Don't overuse (feels patronizing)
```

### Input Types
```
Use correct HTML input types:
- email    → Email keyboard on mobile
- tel      → Phone keyboard on mobile
- number   → Numeric keyboard (use inputmode for better control)
- password → Hidden input, show/hide toggle
- search   → Search keyboard with "Go"

Autocomplete attributes:
- name, email, tel, address → Enable autofill
- new-password → Trigger password manager
- one-time-code → OTP autofill on mobile
```

---

## 9. Animation & Motion

Motion should be purposeful, not decorative.

### When to Animate
```
DO animate:
- State changes (open/close, show/hide)
- Loading transitions
- Success/error feedback
- Spatial navigation (slide between views)

DON'T animate:
- Every hover state
- Static content appearance
- Critical error states (show immediately)
- When prefers-reduced-motion is set
```

### Duration Guidelines
```
Micro-interactions: 100-200ms
  Button press, toggle, checkbox

Small transitions: 200-300ms
  Dropdown open, tooltip appear, fade

Medium transitions: 300-400ms
  Modal open/close, sheet slide

Large transitions: 400-500ms
  Page transitions, complex reveals

Never exceed: 500ms (feels sluggish)
```

### Easing Functions
```
ease-out:    Elements entering (fast start, slow end)
             Feels responsive, natural arrival

ease-in:     Elements leaving (slow start, fast end)
             Feels like moving away

ease-in-out: Continuous motion, position changes
             Smooth throughout

linear:      Progress bars, continuous motion
             Mechanical, consistent speed

Spring:      Playful UI, bouncy interactions
             Use sparingly, can feel childish
```

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 10. Accessibility Checklist

Non-negotiable requirements for all UI.

### Keyboard Navigation
```
□ All interactive elements focusable
□ Focus order matches visual order
□ Focus indicator visible (2px+ ring)
□ Escape closes modals/dropdowns
□ Enter/Space activates buttons
□ Arrow keys navigate lists/menus
□ Tab moves between fields
```

### Screen Reader Support
```
□ All images have alt text (or alt="" for decorative)
□ Icon-only buttons have aria-label
□ Form inputs have associated labels
□ Error messages linked via aria-describedby
□ Live regions for dynamic content (aria-live)
□ Headings in correct hierarchy (h1 → h2 → h3)
□ Landmarks for page regions (main, nav, aside)
```

### Color & Contrast
```
□ Text contrast ratio: 4.5:1 minimum (WCAG AA)
□ Large text (18px+): 3:1 minimum
□ UI components: 3:1 against background
□ Never color alone for meaning
□ Works in grayscale (test it)
□ Supports dark mode properly
```

### Interaction
```
□ Touch targets 44x44px minimum
□ No time limits (or adjustable)
□ No content that flashes >3/second
□ Errors clearly identified and described
□ Form errors don't clear user input
□ Can complete without precise movements
```

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────┐
│                  ACTION BUTTONS                      │
├─────────────────────────────────────────────────────┤
│ Primary:    bg-primary     → Main action, one only  │
│ Secondary:  border-base-300 → Support action        │
│ Destructive: text-error    → Delete, requires confirm│
│ Ghost:      text-primary   → Tertiary/link style    │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                  TEXT STYLES                         │
├─────────────────────────────────────────────────────┤
│ Title:      text-2xl font-bold                      │
│ Section:    text-lg font-semibold                   │
│ Body:       text-base text-base-content             │
│ Muted:      text-sm text-base-content/70            │
│ Caption:    text-xs text-base-content/60            │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                  STATE COLORS                        │
├─────────────────────────────────────────────────────┤
│ Interactive: text-primary                           │
│ Success:     text-success, bg-success/10            │
│ Warning:     text-warning, bg-warning/10            │
│ Error:       text-error, bg-error/10                │
│ Disabled:    opacity-50                             │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                  SPACING                             │
├─────────────────────────────────────────────────────┤
│ Tight:      4px  (gap-1)  → Icon to label          │
│ Compact:    8px  (gap-2)  → Related items          │
│ Default:    12px (gap-3)  → List items             │
│ Comfort:    16px (gap-4)  → Form fields            │
│ Spacious:   24px (gap-6)  → Sections               │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                  REQUIRED STATES                     │
├─────────────────────────────────────────────────────┤
│ □ Loading state (skeleton or spinner)               │
│ □ Empty state (message + action)                    │
│ □ Error state (message + retry)                     │
│ □ Disabled state (opacity-50)                       │
│ □ Focus state (ring-2 ring-primary/50)              │
└─────────────────────────────────────────────────────┘
```

---

## References

- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Material Design 3](https://m3.material.io/)
- [Nielsen Norman Group](https://www.nngroup.com/articles/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Refactoring UI](https://www.refactoringui.com/)
