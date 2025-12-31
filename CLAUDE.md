# CLAUDE.md - AI Assistant Context

> This file provides context for AI assistants working on this codebase.
> Template version: 1.0.0

## Project Overview

This is a Phoenix application template using the "Vibe Coding Stack":
- **Backend**: Elixir 1.17+, Phoenix 1.7+, Ash Framework 3.x
- **Frontend**: Svelte 5 via LiveSvelte, Tailwind CSS 4
- **Database**: PostgreSQL 16+
- **Testing**: ExUnit, StreamData (property-based), Playwright (E2E)

## Quick Reference

### Directory Structure

```
lib/
├── ash_stack/              # Business logic (Ash domains)
│   ├── accounts/           # User management domain
│   │   ├── accounts.ex     # Domain module
│   │   └── resources/      # Ash resources
│   └── [domain]/           # Other domains follow same pattern
│
└── ash_stack_web/          # Web layer
    ├── components/         # Phoenix components
    │   ├── core_components.ex
    │   ├── ui_components.ex
    │   └── layouts/
    ├── live/               # LiveViews
    └── router.ex

assets/
├── css/
│   ├── tokens.css          # Design tokens (SOURCE OF TRUTH)
│   └── app.css             # Tailwind imports
├── svelte/
│   └── components/
│       ├── ui/             # Base components (Button, Avatar, Input)
│       └── features/       # Feature-specific components
└── js/
    └── hooks/              # LiveView hooks
```

### Key Patterns

#### Creating Ash Resources

```elixir
defmodule AshStack.DomainName.ResourceName do
  use Ash.Resource,
    data_layer: AshPostgres.DataLayer,
    extensions: [AshGraphql.Resource],  # If API exposed
    domain: AshStack.DomainName

  postgres do
    table "table_name"
    repo AshStack.Repo
  end

  attributes do
    uuid_primary_key :id
    # attributes here
    timestamps()
  end

  relationships do
    # belongs_to, has_many, etc.
  end

  actions do
    defaults [:read, :destroy]

    create :create do
      accept [:field1, :field2]
    end
  end

  policies do
    policy action_type(:read) do
      authorize_if always()
    end
  end
end
```

#### Creating Svelte Components

```svelte
<script>
  /** @type {'primary' | 'secondary'} */
  export let variant = 'primary';

  // LiveView integration
  import { pushEvent } from 'live_svelte';
  export let live = null;
</script>

<div class="[use design tokens via Tailwind]">
  <slot />
</div>
```

#### Writing Property-Based Tests

```elixir
property "invariant description" do
  check all input <- generator() do
    result = Module.function(input)
    assert property_holds?(result)
  end
end
```

### Common Commands

```bash
# Development
mix setup                    # Install deps, create DB, migrate
mix phx.server              # Start Phoenix server
npm run dev --prefix assets # Start Svelte dev (separate terminal)

# Testing
mix test                    # Run all tests
mix test --only property    # Property-based tests only
mix coveralls               # Run with coverage

# Code Quality
mix format                  # Format code
mix credo --strict          # Static analysis
mix dialyzer               # Type checking
mix sobelow --config       # Security analysis

# Ash
mix ash.codegen            # Generate Ash code
mix ash_postgres.migrate   # Run Ash migrations
```

### Design Tokens

All styling uses CSS custom properties from `assets/css/tokens.css`:

```css
/* Spacing: --space-{1,2,3,4,5,6,8,10} */
/* Colors: --color-{primary,secondary,surface,text,border,...} */
/* Typography: --text-{xs,sm,base,lg,xl,2xl} */
/* Radii: --radius-{none,sm,md,lg,xl,full} */
```

Use via Tailwind: `class="p-4 bg-primary text-on-primary rounded-lg"`

### Code Generation Rules

1. **Ash Resources**: Always include `uuid_primary_key`, `timestamps()`, and at least one policy
2. **Svelte Components**: Always use design tokens, never hardcode colors/spacing
3. **Tests**: Use property-based for data transformations, unit for edge cases
4. **LiveView**: Use `.svelte` components for rich interactions via LiveSvelte

### Architecture Decisions

See `docs/decisions/` for Architecture Decision Records (ADRs).

## Current State

[Update this section as project evolves]

- Template status: Initial setup
- Focus: Foundation and patterns
