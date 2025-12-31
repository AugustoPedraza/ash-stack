# /feature - New Feature Skill

Implement a new feature using TDD.

## Usage

```
/feature [feature name]
[describe what it should do]
```

## Instructions

When the user runs `/feature`, follow this workflow:

1. **Clarify Requirements**
   - List the behaviors this feature needs
   - Confirm with user if unclear
   - Identify which files will be created/modified

2. **Write Tests First**
   - For each behavior, write a test
   - Run tests (they should fail - no implementation yet)
   - Tests define the expected behavior

3. **Implement**
   - Write minimal code to pass tests
   - Follow patterns in CLAUDE.md
   - Use design tokens for styling
   - Use valid hero-* icon names

4. **Verify**
   - Run tests (should all pass)
   - Run `just verify-full`
   - Report summary of what was built

## Checklist Before Done

- [ ] All tests pass
- [ ] Uses design tokens (not raw colors)
- [ ] Icons are valid (hero-*)
- [ ] LiveSvelte components have socket={@socket}
- [ ] Ash resources have policies
- [ ] `just verify` passes

## Example

User: `/feature user avatar upload`

AI Response:
1. Behaviors needed:
   - User can upload image
   - Image is resized/optimized
   - Avatar displays in header
   - Fallback to initials if no image

2. Writing tests for each behavior...
3. Tests written and failing (no implementation)
4. Implementing upload LiveView...
5. Implementing image processing...
6. All tests passing
7. `just verify-full` passes

Feature complete!
