# Migration Guide

> Strategy for migrating an existing Phoenix/LiveView project to Ash Stack patterns.

## Overview

This guide covers incremental migration using the **Strangler Fig Pattern** — gradually replacing old code with new patterns while keeping the application working.

## Migration Phases

### Phase 1: Foundation (No Breaking Changes)

Add new dependencies alongside existing code:

```elixir
# mix.exs - Add these deps
{:ash, "~> 3.0"},
{:ash_postgres, "~> 2.0"},
{:ash_phoenix, "~> 2.0"},
{:live_svelte, "~> 0.13"},
{:stream_data, "~> 1.0", only: :test},
```

Add design tokens:
```bash
# Copy tokens.css to your assets/css/
cp ash-stack/assets/css/tokens.css your-project/assets/css/
```

Configure Tailwind to use tokens (see STACK.md).

### Phase 2: New Development Only

All NEW features use new patterns:

| Area | Old Pattern | New Pattern |
|------|-------------|-------------|
| Components | Existing components | Use design tokens |
| Rich UI | Alpine.js/JS | LiveSvelte |
| Backend | Ecto contexts | Ash resources (new domains only) |
| Tests | Unit tests | Add property-based tests |

### Phase 3: Gradual Migration

Migrate existing code opportunistically:

1. When fixing bugs in old code
2. When refactoring anyway
3. Low-risk components first

### Phase 4: Cleanup

Remove old patterns once all code migrated.

---

## Adding LiveSvelte

### Installation

```elixir
# mix.exs
{:live_svelte, "~> 0.13"}
```

```javascript
// assets/package.json
{
  "dependencies": {
    "svelte": "^5.0.0"
  }
}
```

### Usage

```elixir
# In LiveView
def render(assigns) do
  ~H"""
  <.svelte name="MyComponent" props={%{data: @data}} socket={@socket} />
  """
end
```

```svelte
<!-- assets/svelte/components/MyComponent.svelte -->
<script>
  export let data = [];
  import { pushEvent } from 'live_svelte';
  export let live = null;
</script>
```

---

## Adding Ash Framework

### Start Small

Add Ash for ONE new domain first:

```elixir
# lib/my_app/new_domain/new_domain.ex
defmodule MyApp.NewDomain do
  use Ash.Domain

  resources do
    resource MyApp.NewDomain.SomeResource
  end
end
```

Keep existing Ecto contexts working. Don't migrate working code.

### Migrate Gradually

Only migrate existing contexts when:
- Adding significant new features to them
- Major refactoring needed anyway
- Clear benefit from Ash features (policies, state machines)

---

## Adding Property-Based Tests

```elixir
# test/support/generators.ex
defmodule MyApp.Generators do
  use ExUnitProperties

  def email do
    gen all name <- string(:alphanumeric, min_length: 1, max_length: 20),
            domain <- member_of(["example.com", "test.org"]) do
      "#{String.downcase(name)}@#{domain}"
    end
  end
end
```

```elixir
# test/my_app/accounts/user_properties_test.exs
defmodule MyApp.Accounts.UserPropertiesTest do
  use MyApp.DataCase
  use ExUnitProperties
  import MyApp.Generators

  property "email is always lowercase" do
    check all email <- email() do
      {:ok, user} = Accounts.create_user(%{email: String.upcase(email)})
      assert user.email == String.downcase(email)
    end
  end
end
```

---

## Team Coordination

### PR Labels

```
migration:component - Component migration
migration:backend   - Backend migration
feature:new         - New feature (must use new patterns)
bugfix              - Bug fix (can use existing patterns)
```

### Review Rules

For `feature:new`:
- Must use design tokens
- Must use new patterns
- No adding to old component libraries

For `bugfix`:
- Can use existing patterns
- Don't scope creep into migration

---

## Success Metrics

Track migration progress:

```bash
# Count old vs new pattern usage
grep -r "OldPattern" lib/ | wc -l
grep -r "NewPattern" lib/ | wc -l
```

Celebrate milestones:
- [ ] First LiveSvelte component shipped
- [ ] First Ash resource in production
- [ ] 50% components migrated
- [ ] Old patterns fully removed
