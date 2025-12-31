# Advanced Vibe Coding Workflows

> Strategies for maximizing AI-assisted development efficiency.

## The Goal

```
Manual Loop (Slow):              Automated Loop (Fast):
────────────────────             ─────────────────────
AI writes code                   AI writes code
     ↓                                ↓
You run app                      Hook compiles automatically
     ↓                                ↓
You find error                   Error piped to AI
     ↓                                ↓
You copy error                   AI fixes automatically
     ↓                                ↓
You paste to AI                  AI verifies fix
     ↓                                ↓
AI fixes                         Done ✓
     ↓
Repeat 5-10x
```

---

## Level 1: Better Prompting

### Be Specific About Patterns

```
❌ Bad: "Add a button to delete users"

✅ Good: "Add a delete button to the user list.
Use:
- hero-trash icon
- Button component with variant='danger'
- Confirm modal before delete
- Handle the delete in handle_event
Follow patterns in CLAUDE.md"
```

### Include Context

```
✅ Good: "I'm working on the chat feature in lib/my_app_web/live/chat_live.ex.
Add a message input that:
- Uses the Input component from ui_components
- Submits on Enter key
- Clears after submit
- Shows loading state

Here's the current code: [paste relevant section]"
```

### Request Verification

```
✅ Good: "After writing the code:
1. Run mix compile and fix any errors
2. Verify all icon names are valid
3. Check design tokens are used (not raw colors)
4. Show me the final code"
```

---

## Level 2: Claude Code Hooks

### What Are Hooks?

Claude Code can run commands automatically after tool use. This catches errors immediately.

### Configuration (`.claude/settings.json`)

```json
{
  "hooks": {
    "postToolUse": [
      {
        "matcher": {
          "tool": "Edit",
          "filePattern": "**/*.ex"
        },
        "commands": [
          {
            "command": "mix compile --warnings-as-errors 2>&1 | head -50",
            "timeout": 30000,
            "onFailure": "notify"
          }
        ]
      }
    ]
  }
}
```

### How It Works

1. You ask AI to edit an Elixir file
2. AI makes the edit
3. Hook automatically runs `mix compile`
4. If error, AI sees it immediately
5. AI can fix without you copying/pasting

### Recommended Hooks

| Trigger | Command | Purpose |
|---------|---------|---------|
| Edit `.ex` file | `mix compile` | Catch syntax/type errors |
| Edit `.heex` file | `mix compile` | Catch template errors |
| Edit test file | `mix test <file>` | Run affected test |
| Edit `.svelte` file | `npm run check` | Svelte errors |

---

## Level 3: Test-Driven AI Development

### The TDD Loop with AI

```
1. You: "Write a test for creating a user with email validation"
2. AI: Writes test
3. AI: Runs test (fails - no implementation)
4. AI: Writes implementation
5. AI: Runs test (passes or fails)
6. AI: Fixes until passing
7. You: Review final code
```

### Example Prompt

```
"Using TDD, implement email validation for users.

1. First write a test in test/my_app/accounts_test.exs that:
   - Tests valid emails pass
   - Tests invalid emails fail
   - Tests duplicate emails fail

2. Run the test (it should fail)

3. Implement the feature to make tests pass

4. Run tests again and fix any failures

Show me each step."
```

### Property-Based TDD

```
"Using property-based testing, implement phone number formatting.

1. Write a property test that verifies:
   - Any 10-digit input produces valid format
   - Format is always (XXX) XXX-XXXX
   - Non-digits are stripped

2. Run with mix test --only property

3. Implement to pass

4. Verify with 100 generated cases"
```

---

## Level 4: Agent Workflows

### What Are Agents?

Claude Code can spawn sub-agents for complex tasks. Use `/task` or the Task tool.

### Example: Feature Implementation Agent

```
You: "/task Implement the complete chat feature:
1. Create Ash resources (Message, Conversation)
2. Create LiveView with real-time updates
3. Create Svelte component for rich input
4. Write tests for all parts
5. Verify everything compiles and tests pass"
```

The agent will:
- Break down the task
- Implement each part
- Run verification
- Fix errors automatically
- Report back when done

### Example: Bug Fix Agent

```
You: "/task Fix this bug:

Error: ** (KeyError) key :messages not found in: %{...}

Context: This happens when loading the chat page.
File: lib/my_app_web/live/chat_live.ex

Find the cause, fix it, and verify the fix."
```

### Example: Refactoring Agent

```
You: "/task Refactor the user module:
1. Extract validation into separate module
2. Add property-based tests
3. Ensure all existing tests still pass
4. Run full quality check"
```

---

## Level 5: Continuous Verification

### Dev Server with Error Capture

Add this to your Phoenix endpoint for better error feedback:

```elixir
# lib/my_app_web/error_capture.ex
defmodule MyAppWeb.ErrorCapture do
  @moduledoc """
  Captures errors in dev for AI feedback.
  """

  require Logger

  def log_error(conn, error, stacktrace) do
    error_info = """
    === ERROR CAPTURED ===
    Path: #{conn.request_path}
    Error: #{inspect(error)}
    Stacktrace:
    #{Exception.format_stacktrace(stacktrace)}
    ======================
    """

    Logger.error(error_info)

    # Optionally write to file for easy copy
    File.write!("tmp/last_error.txt", error_info)
  end
end
```

### Browser Error Capture

Add to your app.js:

```javascript
// assets/js/error_capture.js
window.onerror = function(msg, url, line, col, error) {
  const errorInfo = {
    message: msg,
    url: url,
    line: line,
    column: col,
    stack: error?.stack
  };

  console.error('=== BROWSER ERROR ===');
  console.error(JSON.stringify(errorInfo, null, 2));
  console.error('=====================');

  // Could also send to server endpoint
  return false;
};

window.addEventListener('unhandledrejection', function(event) {
  console.error('=== UNHANDLED PROMISE ===');
  console.error(event.reason);
  console.error('=========================');
});
```

### Justfile Task for Error Check

```just
# Check for recent errors
errors:
    @echo "=== Recent Compilation Errors ==="
    @mix compile 2>&1 | grep -A5 "error:" || echo "No errors"
    @echo ""
    @echo "=== Last Runtime Error ==="
    @cat tmp/last_error.txt 2>/dev/null || echo "No runtime errors"
```

---

## Level 6: Custom Verification Scripts

### Pre-commit Checks

```bash
#!/bin/bash
# .git/hooks/pre-commit

echo "Running pre-commit checks..."

# Format
mix format --check-formatted
if [ $? -ne 0 ]; then
  echo "❌ Format check failed. Run 'mix format'"
  exit 1
fi

# Compile
mix compile --warnings-as-errors
if [ $? -ne 0 ]; then
  echo "❌ Compilation failed"
  exit 1
fi

# Quick Credo
mix credo --strict --format=oneline
if [ $? -ne 0 ]; then
  echo "❌ Credo check failed"
  exit 1
fi

echo "✅ Pre-commit checks passed"
```

### Icon Validator

```elixir
# scripts/validate_icons.exs
# Run with: mix run scripts/validate_icons.exs

valid_icons = ~w(
  hero-user hero-users hero-check hero-check-circle
  hero-x-mark hero-trash hero-pencil hero-plus
  hero-arrow-right hero-arrow-left hero-bars-3
  hero-exclamation-circle hero-exclamation-triangle
  hero-information-circle hero-home hero-cog
  hero-bell hero-envelope hero-chat-bubble-left
)

IO.puts("Scanning for invalid icon names...")

Path.wildcard("lib/**/*.{ex,heex}")
|> Enum.flat_map(fn file ->
  content = File.read!(file)
  Regex.scan(~r/hero-[\w-]+/, content)
  |> List.flatten()
  |> Enum.map(&{file, &1})
end)
|> Enum.reject(fn {_file, icon} -> icon in valid_icons end)
|> case do
  [] -> IO.puts("✅ All icons valid")
  invalid ->
    IO.puts("❌ Invalid icons found:")
    Enum.each(invalid, fn {file, icon} ->
      IO.puts("  #{file}: #{icon}")
    end)
    System.halt(1)
end
```

---

## Workflow Summary

| Level | Effort | Impact | When to Use |
|-------|--------|--------|-------------|
| Better Prompting | Low | Medium | Always |
| Claude Code Hooks | Medium | High | Set up once |
| TDD with AI | Medium | High | New features |
| Agent Workflows | Low | High | Complex tasks |
| Continuous Verification | Medium | High | Set up once |
| Custom Scripts | High | Medium | Project-specific |

---

## Quick Start Checklist

1. [ ] Read CLAUDE.md before each session
2. [ ] Enable hooks in `.claude/settings.json`
3. [ ] Use specific prompts with context
4. [ ] Request verification in prompts
5. [ ] Use TDD for new features
6. [ ] Use agents for complex tasks
7. [ ] Run `just check` before committing

---

## Example Session

```
You: "I need to add a user profile page. Use TDD approach.
Follow patterns in CLAUDE.md.
Run compilation after each file change.
Use design tokens for all styling.
Show me the test first."

AI: [Writes test]
AI: [Runs test - fails]
AI: [Implements LiveView]
AI: [Runs compile - catches error]
AI: [Fixes error]
AI: [Runs test - passes]
AI: "Done! Here's the summary: ..."
```

This loop happens automatically with hooks enabled.
