# Technology Stack

> Complete technology decisions with rationale for AI-assisted development.

## Overview

| Layer | Technology | Version | Rationale |
|-------|------------|---------|-----------|
| Language | Elixir | 1.17+ | Functional, concurrent, fault-tolerant |
| Framework | Phoenix | 1.7+ | Productive web framework |
| App Layer | Ash | 3.x | Declarative resources, AI-friendly |
| Realtime | LiveView | 1.0+ | Server-rendered reactivity |
| Rich UI | LiveSvelte | 0.13+ | Svelte components in LiveView |
| Frontend | Svelte | 5.x | Clean syntax, small bundles |
| Styling | Tailwind | 4.x | Utility-first, token-based |
| Database | PostgreSQL | 16+ | Robust, feature-rich |
| Jobs | Oban | 2.17+ | Reliable background processing |
| Auth | AshAuthentication | 4.x | Declarative auth strategies |

---

## Backend

### Ash Framework

Declarative, resource-oriented application framework.

**Why Ash:**
- Declarative = AI generates reliably
- Built-in authorization, validation, API generation
- Consistent patterns across all resources
- State machines, audit logging via extensions

**Resource Template:**

```elixir
defmodule MyApp.DomainName.ResourceName do
  use Ash.Resource,
    data_layer: AshPostgres.DataLayer,
    extensions: [AshGraphql.Resource],  # Optional
    domain: MyApp.DomainName

  postgres do
    table "table_name"
    repo MyApp.Repo
  end

  attributes do
    uuid_primary_key :id

    attribute :name, :string do
      allow_nil? false
      public? true
    end

    timestamps()
  end

  relationships do
    belongs_to :parent, MyApp.DomainName.Parent
    has_many :children, MyApp.DomainName.Child
  end

  actions do
    defaults [:read, :destroy]

    create :create do
      accept [:name, :parent_id]
      change relate_actor(:created_by)
    end

    update :update do
      accept [:name]
    end
  end

  policies do
    policy action_type(:read) do
      authorize_if always()
    end

    policy action_type(:create) do
      authorize_if actor_present()
    end
  end
end
```

**Domain Template:**

```elixir
defmodule MyApp.DomainName do
  use Ash.Domain

  resources do
    resource MyApp.DomainName.ResourceName
  end
end
```

### Ash Extensions

| Extension | Purpose | When to Use |
|-----------|---------|-------------|
| AshPostgres | Database layer | Always |
| AshGraphql | GraphQL API | External API needed |
| AshJsonApi | REST API | REST clients needed |
| AshAuthentication | Auth strategies | User authentication |
| AshStateMachine | State management | Workflow states |
| AshPaperTrail | Audit logging | Compliance, history |
| AshOban | Background jobs | Async processing |

### Phoenix + LiveView

Standard Phoenix 1.7+ patterns with LiveView for real-time.

**LiveView Template:**

```elixir
defmodule MyAppWeb.FeatureLive do
  use MyAppWeb, :live_view

  @impl true
  def mount(_params, _session, socket) do
    {:ok, assign(socket, items: [])}
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div class="p-4">
      <h1 class="text-2xl font-bold">Feature</h1>

      <%!-- Svelte for rich interactions --%>
      <.svelte
        name="FeatureComponent"
        props={%{items: @items}}
        socket={@socket}
      />
    </div>
    """
  end

  @impl true
  def handle_event("action", params, socket) do
    # Handle events from Svelte or LiveView
    {:noreply, socket}
  end
end
```

---

## Frontend

### LiveSvelte

Embeds Svelte components inside LiveView.

**Installation:**

```elixir
# mix.exs
{:live_svelte, "~> 0.13"}
```

**Usage in LiveView:**

```elixir
~H"""
<.svelte
  name="ComponentName"
  props={%{data: @data, user: @current_user}}
  socket={@socket}
/>
"""
```

**Svelte Component:**

```svelte
<script>
  // Props from LiveView
  export let data = [];
  export let user = null;

  // LiveView socket for pushing events
  import { pushEvent } from 'live_svelte';
  export let live = null;

  // Local state (Svelte 5 runes)
  let selected = $state(null);

  // Push event to LiveView
  function handleSelect(item) {
    selected = item;
    pushEvent(live, 'select', { id: item.id });
  }
</script>

<div class="component">
  {#each data as item (item.id)}
    <button onclick={() => handleSelect(item)}>
      {item.name}
    </button>
  {/each}
</div>
```

### Svelte 5

Latest Svelte with runes for reactivity.

**Key Patterns:**

```svelte
<script>
  // Reactive state
  let count = $state(0);

  // Derived values
  let doubled = $derived(count * 2);

  // Effects
  $effect(() => {
    console.log('Count changed:', count);
  });
</script>
```

### Tailwind CSS 4

Utility-first CSS consuming design tokens.

**Configuration:**

```css
/* assets/css/app.css */
@import "tailwindcss";
@import "./tokens.css";

@theme {
  --color-primary: var(--color-primary);
  --color-secondary: var(--color-secondary);
  /* ... map all tokens */
}
```

---

## Testing

### Backend Testing

| Tool | Purpose | Pattern |
|------|---------|---------|
| ExUnit | Framework | All tests |
| ExMachina | Factories | Test data |
| StreamData | Property-based | Invariants |
| Mox | Mocking | External services |
| Machete | Assertions | Pattern matching |

### Frontend Testing

| Tool | Purpose | Pattern |
|------|---------|---------|
| Vitest | Unit tests | Component logic |
| Testing Library | Components | User interactions |
| Playwright | E2E | User journeys |
| MSW | Mocking | API responses |

---

## Infrastructure

### Development

```bash
mix setup        # One-time setup
mix phx.server   # Start server
iex -S mix phx.server  # With REPL
```

### Production

- **Deployment**: Render, Fly.io, or self-hosted
- **Database**: Managed PostgreSQL
- **Assets**: Built at deploy time
- **Release**: Mix releases

### CI/CD

```yaml
# GitHub Actions
jobs:
  quality:
    - mix format --check-formatted
    - mix credo --strict
    - mix dialyzer
    - mix sobelow --config

  test:
    - mix test --cover
    - npm test --prefix assets

  deploy:
    - Deploy to Render/Fly.io
```

---

## Dependencies

### Required (mix.exs)

```elixir
defp deps do
  [
    # Phoenix
    {:phoenix, "~> 1.7"},
    {:phoenix_html, "~> 4.0"},
    {:phoenix_live_view, "~> 1.0"},
    {:phoenix_live_reload, "~> 1.5", only: :dev},

    # Ash
    {:ash, "~> 3.0"},
    {:ash_postgres, "~> 2.0"},
    {:ash_phoenix, "~> 2.0"},

    # Frontend
    {:live_svelte, "~> 0.13"},
    {:tailwind, "~> 0.2"},
    {:esbuild, "~> 0.8"},

    # Database
    {:ecto_sql, "~> 3.10"},
    {:postgrex, ">= 0.0.0"},

    # Background Jobs
    {:oban, "~> 2.17"},

    # Quality
    {:credo, "~> 1.7", only: [:dev, :test]},
    {:dialyxir, "~> 1.4", only: [:dev, :test]},
    {:sobelow, "~> 0.13", only: [:dev, :test]},

    # Testing
    {:ex_machina, "~> 2.7", only: :test},
    {:stream_data, "~> 1.0", only: :test},
    {:excoveralls, "~> 0.18", only: :test},

    # Monitoring
    {:telemetry_metrics, "~> 1.0"},
    {:telemetry_poller, "~> 1.0"},
  ]
end
```

### Frontend (package.json)

```json
{
  "devDependencies": {
    "svelte": "^5.0.0",
    "@sveltejs/vite-plugin-svelte": "^4.0.0",
    "vite": "^5.0.0",
    "vitest": "^2.0.0",
    "@testing-library/svelte": "^5.0.0",
    "@playwright/test": "^1.40.0"
  }
}
```
