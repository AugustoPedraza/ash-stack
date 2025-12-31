# /refactor - Refactoring Skill

Safely refactor code while maintaining behavior.

## Usage

```
/refactor [what to refactor]
[goal of refactoring]
```

## Instructions

When the user runs `/refactor`, follow this workflow:

1. **Verify Test Coverage**
   - Run existing tests: `mix test`
   - If tests fail, stop and report
   - If no tests exist, write tests first

2. **Understand Current Code**
   - Read the code to refactor
   - Identify what behavior must be preserved
   - Plan the refactoring steps

3. **Refactor Incrementally**
   - Make one small change
   - Run tests
   - If tests fail, revert and try different approach
   - Repeat until done

4. **Verify**
   - All tests still pass
   - Run `just verify-full`
   - No behavior changes (unless intended)

## Safety Rules

- NEVER change behavior during refactor
- ALWAYS run tests after each change
- STOP if tests fail unexpectedly
- Keep changes reversible

## Common Refactorings

### Extract Component
1. Identify repeated UI pattern
2. Create new component with props
3. Replace usages one at a time
4. Test after each replacement

### Extract Function
1. Identify code block to extract
2. Determine inputs and outputs
3. Create function with clear name
4. Replace original with function call
5. Test

### Rename
1. Use IDE rename or grep to find all usages
2. Rename in all locations
3. Update tests
4. Run `just verify`

## Report Format

```
## Refactoring Complete

### Changes Made
- [Change 1]
- [Change 2]

### Files Modified
- file1.ex
- file2.ex

### Tests
- Before: X passing
- After: X passing (no change)

### Verification
- `just verify-full`: ✅ passing
```

## Example

User: `/refactor ChatLive - extract message list component`

AI Response:
1. Running existing tests... 12 passing
2. Analyzing ChatLive...
3. Extracting MessageList component...
4. Tests still passing
5. Updating ChatLive to use new component...
6. Tests still passing
7. `just verify-full` passing

Refactoring complete!
- Created: lib/my_app_web/components/message_list.ex
- Modified: lib/my_app_web/live/chat_live.ex
- Lines reduced in ChatLive: 80 → 45
