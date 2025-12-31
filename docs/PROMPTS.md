# Prompt Library

> Proven prompts for consistent, high-quality AI-assisted development.
> Copy, fill in the blanks, get reliable results.

---

## Quick Reference

| Task | Prompt | Skill |
|------|--------|-------|
| Fix bug | [Bug Fix](#bug-fix) | `/fix` |
| New feature | [Feature](#new-feature) | `/feature` |
| Refactor | [Refactor](#refactor) | `/refactor` |
| Add test | [Test](#add-test) | `/test` |
| Review code | [Review](#code-review) | `/review` |

---

## Bug Fix

### When to Use
- You have an error message
- Something isn't working as expected

### Prompt

```
FIX THIS BUG:

ERROR:
[Paste the full error message here]

FILE: [file path if known]

EXPECTED: [what should happen]
ACTUAL: [what's happening instead]

STEPS:
1. Write a test that reproduces this error
2. Run test (confirm it fails)
3. Fix the code
4. Run test (confirm it passes)
5. Run `just verify`

Follow patterns in CLAUDE.md.
```

### Example

```
FIX THIS BUG:

ERROR:
** (KeyError) key :current_user not found in: %{messages: [], project: %Project{}}
    lib/my_app_web/live/chat_live.ex:42: anonymous fn/2

FILE: lib/my_app_web/live/chat_live.ex

EXPECTED: Chat page loads with user info
ACTUAL: Crash on page load

STEPS:
1. Write a test that reproduces this error
2. Run test (confirm it fails)
3. Fix the code
4. Run test (confirm it passes)
5. Run `just verify`
```

---

## New Feature

### When to Use
- Building something new
- Adding functionality

### Prompt

```
IMPLEMENT FEATURE: [Feature Name]

BEHAVIORS:
1. [What user can do #1]
2. [What user can do #2]
3. [What happens on error]

REQUIREMENTS:
- [Technical requirement #1]
- [Technical requirement #2]

APPROACH:
1. Write tests for each behavior
2. Implement to pass tests
3. Run `just verify-full`

Follow patterns in CLAUDE.md.
Use design tokens for all styling.
Use hero-* icons (check heroicons.com for valid names).
```

### Example

```
IMPLEMENT FEATURE: User Profile Page

BEHAVIORS:
1. User can view their profile info (name, email, avatar)
2. User can edit their name
3. User sees error if name is empty
4. Changes save automatically (debounced)

REQUIREMENTS:
- LiveView at /profile
- Use AURA form components
- Avatar uses Avatar component with fallback initials

APPROACH:
1. Write tests for each behavior
2. Implement to pass tests
3. Run `just verify-full`

Follow patterns in CLAUDE.md.
```

---

## Refactor

### When to Use
- Improving existing code
- Extracting components
- Reducing duplication

### Prompt

```
REFACTOR: [What to refactor]

GOAL: [What should improve]

CURRENT PROBLEM:
[Describe what's wrong with current code]

CONSTRAINTS:
- All existing tests must pass
- No behavior changes
- [Other constraints]

STEPS:
1. Run existing tests (confirm passing)
2. Make refactoring changes
3. Run tests after each change
4. Run `just verify-full`
5. Show summary of changes
```

### Example

```
REFACTOR: ChatLive module

GOAL: Extract message list into separate component

CURRENT PROBLEM:
- chat_live.ex is 400+ lines
- Message rendering logic mixed with socket handling
- Hard to test message display separately

CONSTRAINTS:
- All existing tests must pass
- No behavior changes
- Keep in same directory for now

STEPS:
1. Run existing tests (confirm passing)
2. Extract MessageList component
3. Run tests after extraction
4. Run `just verify-full`
5. Show summary of changes
```

---

## Add Test

### When to Use
- Adding test coverage
- Testing edge cases
- Property-based testing

### Prompt

```
ADD TESTS FOR: [Module/Function]

SCENARIOS TO TEST:
1. [Happy path]
2. [Edge case #1]
3. [Edge case #2]
4. [Error case]

TEST TYPE: [unit | property | integration | e2e]

STEPS:
1. Write tests for each scenario
2. Run tests (should pass if code is correct)
3. If tests fail, either fix test or report bug
```

### Property-Based Test Prompt

```
ADD PROPERTY TESTS FOR: [Module/Function]

INVARIANTS (properties that must always hold):
1. [Property #1 - e.g., "output is always positive"]
2. [Property #2 - e.g., "input is preserved through round-trip"]
3. [Property #3 - e.g., "order doesn't matter"]

Use StreamData for generators.
Run with: mix test --only property
```

---

## Code Review

### When to Use
- Before committing
- Reviewing AI-generated code
- Finding issues

### Prompt

```
REVIEW THIS CODE:

[Paste code or file path]

CHECK FOR:
1. Follows patterns in CLAUDE.md
2. Uses design tokens (not raw colors)
3. All icon names are valid (hero-*)
4. Error handling is complete
5. Tests exist for main paths

REPORT:
- Issues found (with fixes)
- Suggestions for improvement
- Confirmation of what's good
```

---

## Component Creation

### When to Use
- Adding new UI components
- Svelte or Phoenix components

### Phoenix Component Prompt

```
CREATE PHOENIX COMPONENT: [Name]

PROPS:
- [prop_name]: [type] - [description]
- [prop_name]: [type] - [description]

VARIANTS: [if applicable]
- [variant1]
- [variant2]

EXAMPLE USAGE:
<.[component_name] prop={value} />

REQUIREMENTS:
- Use design tokens
- Add to ui_components.ex
- Add documentation in COMPONENTS.md
- Follow patterns in CLAUDE.md
```

### Svelte Component Prompt

```
CREATE SVELTE COMPONENT: [Name]

PROPS:
- [propName]: [type] - [description]
- [propName]: [type] - [description]

EVENTS:
- on:[event] - [when fired]

REQUIREMENTS:
- Use design tokens from tokens.css
- Add to assets/svelte/components/ui/
- Export from index.js
- Add JSDoc comments for props
- Follow patterns in CLAUDE.md
```

---

## Ash Resource

### When to Use
- Creating new data models
- Adding domain logic

### Prompt

```
CREATE ASH RESOURCE: [Name]

DOMAIN: [Domain module]

ATTRIBUTES:
- [name]: [type] - [description]
- [name]: [type] - [description]

RELATIONSHIPS:
- belongs_to [Parent]
- has_many [Children]

ACTIONS:
- create: accepts [fields]
- update: accepts [fields]
- [custom_action]: [description]

POLICIES:
- read: [who can read]
- create: [who can create]
- update: [who can update]
- destroy: [who can destroy]

REQUIREMENTS:
- Add to domain module
- Generate migration
- Add factory for tests
- Write basic CRUD tests
```

---

## LiveView

### When to Use
- Creating new pages
- Adding real-time features

### Prompt

```
CREATE LIVEVIEW: [Name]

ROUTE: [path]

FEATURES:
1. [Feature #1]
2. [Feature #2]

ASSIGNS NEEDED:
- [assign]: [type] - [description]

EVENTS TO HANDLE:
- [event_name]: [what it does]

REQUIREMENTS:
- Add route to router.ex
- Initialize all assigns in mount
- Use .svelte for rich interactions
- Follow patterns in CLAUDE.md
- Write LiveView tests
```

---

## Database Migration

### When to Use
- Schema changes
- Adding tables/columns

### Prompt

```
CREATE MIGRATION: [Description]

CHANGES:
- [Add/Remove/Modify] [table].[column] ([type])

CONSIDERATIONS:
- Is this reversible? [yes/no]
- Data migration needed? [yes/no]
- Indexes needed? [list]

STEPS:
1. Generate migration with Ash or Ecto
2. Review generated SQL
3. Run migration
4. Verify with `just psql`
```

---

## Debugging Session

### When to Use
- Complex bugs
- Need investigation

### Prompt

```
DEBUG THIS ISSUE:

SYMPTOM:
[What's happening]

STEPS TO REPRODUCE:
1. [Step 1]
2. [Step 2]
3. [Expected vs Actual]

INVESTIGATION NEEDED:
1. Check [area 1]
2. Check [area 2]
3. Add logging if needed
4. Identify root cause
5. Propose fix

Don't fix yet - just investigate and report findings.
```

---

## Performance Investigation

### When to Use
- Slow pages
- N+1 queries
- Memory issues

### Prompt

```
INVESTIGATE PERFORMANCE: [Area]

SYMPTOM:
[What's slow or heavy]

INVESTIGATE:
1. Check for N+1 queries
2. Check for unnecessary data loading
3. Check for missing indexes
4. Profile if needed

REPORT:
- Bottlenecks found
- Proposed optimizations
- Expected improvement
```

---

## Prompt Improvement

### When to Use
- A prompt worked well and should be saved
- A prompt failed and needs improvement

### Prompt

```
IMPROVE THIS PROMPT:

ORIGINAL PROMPT:
[What you asked]

RESULT:
[What happened - good or bad]

PROBLEM:
[What went wrong or could be better]

SUGGEST:
- Improved version of the prompt
- What to add/remove/clarify
```

---

## Tips for Better Prompts

### Do

- Be specific about file paths
- Include error messages completely
- Specify which patterns to follow
- Request verification steps
- Break complex tasks into steps

### Don't

- Assume AI remembers previous context
- Skip the verification step
- Use vague descriptions
- Ask for multiple unrelated things

### Pattern

```
[TASK TYPE]: [Specific thing]

[CONTEXT]:
- What exists
- What's the problem

[REQUIREMENTS]:
- Must do X
- Must not do Y

[STEPS]:
1. First do this
2. Then do this
3. Verify with this

Follow patterns in CLAUDE.md.
```
