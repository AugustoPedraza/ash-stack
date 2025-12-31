# /fix - Bug Fix Skill

Fix a bug using error-driven development.

## Usage

```
/fix [paste error message or describe the bug]
```

## Instructions

When the user runs `/fix`, follow this workflow:

1. **Understand the Error**
   - Parse the error message
   - Identify the file and line number
   - Understand what's expected vs actual

2. **Write Reproducing Test**
   - Create a test that reproduces the error
   - Run the test to confirm it fails
   - If test passes, the bug description may be wrong

3. **Fix the Code**
   - Make the minimal fix needed
   - Follow patterns in CLAUDE.md
   - Don't refactor unrelated code

4. **Verify**
   - Run the test (should pass now)
   - Run `just verify` for full check
   - Report what was fixed and why

## Example

User: `/fix ** (KeyError) key :user not found in socket assigns`

AI Response:
1. The error indicates `@user` is accessed but not assigned in mount
2. Writing test to reproduce...
3. Test confirms the bug
4. Adding `user: nil` to mount assigns
5. Test passes, `just verify` passes
6. Fixed: Added missing `:user` assign in mount/3
