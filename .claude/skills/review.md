# /review - Code Review Skill

Review code for issues and improvements.

## Usage

```
/review [file path or paste code]
```

## Instructions

When the user runs `/review`, analyze the code for:

1. **Pattern Compliance (CLAUDE.md)**
   - Correct Phoenix component syntax
   - Valid icon names (hero-*)
   - Design tokens used (not raw colors)
   - Ash resource completeness

2. **Common Issues**
   - Missing assigns in mount
   - Missing socket in LiveSvelte
   - Missing policies in Ash
   - Hardcoded values

3. **Code Quality**
   - Clear naming
   - Appropriate function size
   - Error handling
   - Test coverage

4. **Security**
   - Authorization checks
   - Input validation
   - SQL injection risks
   - XSS risks

## Report Format

```
## Review: [file/module name]

### Issues (Must Fix)
- [ ] Issue 1: description
  - Line X: problem
  - Fix: solution

### Warnings (Should Fix)
- [ ] Warning 1: description

### Suggestions (Nice to Have)
- Suggestion 1: description

### Good Practices Found
- Thing done well 1
- Thing done well 2
```

## Example

User: `/review lib/my_app_web/live/chat_live.ex`

AI Response:
## Review: ChatLive

### Issues (Must Fix)
- [ ] Line 15: Using `hero-close` - invalid icon name
  - Fix: Change to `hero-x-mark`
- [ ] Line 42: `@user` accessed but not assigned in mount
  - Fix: Add `user: socket.assigns.current_user` in mount

### Warnings (Should Fix)
- [ ] Line 89: Using `bg-blue-500` instead of design token
  - Fix: Change to `bg-primary`

### Good Practices Found
- Proper error handling in handle_event
- Tests exist for main flows
