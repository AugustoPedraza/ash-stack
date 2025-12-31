# Ash Stack

> A Phoenix application template optimized for AI-assisted "vibe coding" development.

## Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Language | Elixir 1.17+ | Backend logic |
| Framework | Phoenix 1.7+ | Web framework |
| App Layer | Ash 3.x | Declarative resources |
| Frontend | Svelte 5 | Rich UI components |
| Integration | LiveSvelte | Svelte in LiveView |
| Styling | Tailwind CSS 4 | Utility-first CSS |
| Database | PostgreSQL 16+ | Primary datastore |
| Jobs | Oban | Background processing |

## Quick Start

### Prerequisites

| Tool | Purpose | Install |
|------|---------|---------|
| **Docker** | PostgreSQL, services | [docker.com](https://docker.com) |
| **mise** | Elixir/Node versions | `curl https://mise.run \| sh` |
| **just** | Task runner | `brew install just` |

### Setup

```bash
# Clone
git clone <repo-url> my_app
cd my_app

# Install runtimes (Elixir, Node)
mise install

# One-command setup (installs deps, starts DB, runs migrations)
just setup

# Start development server
just dev
```

Visit [http://localhost:4000](http://localhost:4000)

### Common Commands

```bash
just              # List all commands
just dev          # Start dev server with IEx
just test         # Run tests
just check        # Run all quality checks (format, credo, dialyzer)
just db-migrate   # Run migrations
just db-reset     # Reset database
```

See [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) for complete guide.

## Project Structure

```
lib/
├── ash_stack/              # Business logic (Ash domains)
│   └── accounts/           # Example domain
└── ash_stack_web/          # Web layer
    ├── components/         # Phoenix + Svelte components
    └── live/               # LiveViews

assets/
├── css/tokens.css          # Design tokens (source of truth)
├── svelte/components/      # Svelte components
└── js/hooks/               # LiveView hooks

docs/
├── STACK.md               # Technology decisions
├── CONVENTIONS.md         # Code patterns
├── TESTING.md             # Testing strategy
├── COMPONENTS.md          # UI component catalog
└── decisions/             # Architecture Decision Records

test/
├── ash_stack/             # Domain tests
└── ash_stack_web/         # Web layer tests
```

## Key Concepts

### Design Tokens

All styling uses CSS custom properties defined in `assets/css/tokens.css`.
Tailwind is configured to consume these tokens.

```svelte
<!-- Use tokens via Tailwind classes -->
<button class="bg-primary text-on-primary px-4 py-2 rounded-lg">
  Click me
</button>
```

### Ash Resources

Business logic is defined declaratively using Ash Framework:

```elixir
defmodule AshStack.Accounts.User do
  use Ash.Resource,
    data_layer: AshPostgres.DataLayer,
    domain: AshStack.Accounts

  attributes do
    uuid_primary_key :id
    attribute :email, :ci_string, allow_nil?: false
    timestamps()
  end

  actions do
    defaults [:read, :create, :update, :destroy]
  end
end
```

### LiveSvelte Components

Rich UI interactions use Svelte components embedded in LiveView:

```elixir
def render(assigns) do
  ~H"""
  <.svelte name="ChatInterface" props={%{messages: @messages}} socket={@socket} />
  """
end
```

### Property-Based Testing

Data transformations are tested with StreamData:

```elixir
property "email is always lowercase" do
  check all email <- email_generator() do
    {:ok, user} = Accounts.create_user(%{email: email})
    assert user.email == String.downcase(email)
  end
end
```

## Documentation

- [STACK.md](docs/STACK.md) - Technology decisions and rationale
- [CONVENTIONS.md](docs/CONVENTIONS.md) - Code patterns and rules
- [TESTING.md](docs/TESTING.md) - Testing strategy and examples
- [COMPONENTS.md](docs/COMPONENTS.md) - UI component catalog

## Renaming the App

To use this template for a new project:

```bash
# Using the rename script
./scripts/rename.sh new_app NewApp

# Or manually replace:
# - ash_stack -> new_app (snake_case)
# - AshStack -> NewApp (PascalCase)
# - ash-stack -> new-app (kebab-case)
```

## License

MIT
