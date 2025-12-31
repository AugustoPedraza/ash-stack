# Development Guide

> Complete guide for local development setup and workflows.

## Quick Start

```bash
# 1. Install mise (runtime manager)
curl https://mise.run | sh

# 2. Install runtimes
mise install

# 3. Install just (task runner)
# macOS
brew install just
# Linux
cargo install just

# 4. Start everything
just setup

# 5. Run development server
just dev
```

---

## Prerequisites

### Required

| Tool | Purpose | Install |
|------|---------|---------|
| **Docker** | Run PostgreSQL, services | [docker.com](https://docker.com) |
| **mise** | Manage Elixir/Node versions | `curl https://mise.run \| sh` |
| **just** | Task runner | `brew install just` or `cargo install just` |

### Optional

| Tool | Purpose | Install |
|------|---------|---------|
| **VS Code** | IDE with extensions | [code.visualstudio.com](https://code.visualstudio.com) |
| **GitHub CLI** | Repo management | `brew install gh` |

---

## Setup Options

### Option A: Native Development (Recommended)

Best for: Daily development, fast iteration

```bash
# 1. Install mise
curl https://mise.run | sh

# Add to shell (bash)
echo 'eval "$(mise activate bash)"' >> ~/.bashrc

# Add to shell (zsh)
echo 'eval "$(mise activate zsh)"' >> ~/.zshrc

# Restart shell or run
source ~/.bashrc  # or ~/.zshrc

# 2. Install runtimes
cd /path/to/project
mise install

# 3. Install just
brew install just  # macOS
# or
cargo install just  # Linux

# 4. Run setup
just setup
```

### Option B: DevContainer (VS Code)

Best for: Onboarding, consistent environment, GitHub Codespaces

1. Install [VS Code](https://code.visualstudio.com/)
2. Install [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
3. Open project in VS Code
4. Click "Reopen in Container" when prompted
5. Wait for container to build
6. Run `just setup` in terminal

### Option C: GitHub Codespaces

Best for: Cloud development, no local setup

1. Go to GitHub repository
2. Click "Code" → "Codespaces" → "Create codespace"
3. Wait for environment to load
4. Run `just setup` in terminal

---

## Daily Workflow

### Starting Development

```bash
# Start services + dev server with IEx
just dev

# Or separately:
just services        # Start PostgreSQL, Mailpit
just server          # Start Phoenix without IEx
```

### Common Commands

```bash
# View all available commands
just

# Run tests
just test

# Run tests with coverage
just test-cover

# Run code quality checks
just check

# Format code
just format

# Database operations
just db-migrate
just db-rollback
just db-reset

# Open PostgreSQL CLI
just psql

# Open IEx console
just console
```

---

## Project Structure

```
.
├── .devcontainer/          # VS Code DevContainer config
├── .github/workflows/      # CI/CD pipelines
├── assets/                 # Frontend assets
│   ├── css/               # Stylesheets
│   ├── js/                # JavaScript
│   └── svelte/            # Svelte components
├── config/                 # App configuration
├── docs/                   # Documentation
├── lib/                    # Elixir source code
│   ├── ash_stack/         # Business logic (Ash domains)
│   └── ash_stack_web/     # Web layer (Phoenix)
├── priv/                   # Static files, migrations
├── test/                   # Tests
├── .mise.toml              # Runtime versions
├── compose.yaml            # Docker services
└── Justfile                # Task runner commands
```

---

## Services

### PostgreSQL

- **Host**: localhost
- **Port**: 5432
- **User**: postgres
- **Password**: postgres
- **Database**: ash_stack_dev

```bash
# Connect via CLI
just psql

# Or with psql directly
psql postgres://postgres:postgres@localhost:5432/ash_stack_dev
```

### Mailpit (Email Testing)

Catches all outgoing emails for testing.

- **SMTP**: localhost:1025
- **Web UI**: http://localhost:8025

```elixir
# config/dev.exs
config :ash_stack, AshStack.Mailer,
  adapter: Swoosh.Adapters.SMTP,
  relay: "localhost",
  port: 1025
```

### Redis (Optional)

Uncomment in `compose.yaml` if needed.

- **Host**: localhost
- **Port**: 6379

---

## Environment Variables

### Development

Set in `.mise.toml` or create `.env`:

```bash
# .env (gitignored)
DATABASE_URL=postgres://postgres:postgres@localhost:5432/ash_stack_dev
SECRET_KEY_BASE=your_dev_secret_here
```

### Required Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `DATABASE_URL` | PostgreSQL connection | `postgres://user:pass@host:5432/db` |
| `SECRET_KEY_BASE` | Phoenix secret | Generate with `just secret` |
| `PHX_HOST` | Application host | `localhost` |

---

## Testing

### Run Tests

```bash
# All tests
just test

# With coverage
just test-cover

# Specific file
just test-file test/ash_stack/accounts_test.exs

# Tests matching tag
just test-only integration

# Property-based tests
just test-property

# Watch mode (requires mix_test_watch)
just test-watch
```

### Test Database

Tests use a separate database: `ash_stack_test`

```bash
# Reset test database
MIX_ENV=test mix ecto.reset
```

---

## Code Quality

### All Checks

```bash
just check
```

This runs:
1. `mix format --check-formatted` - Code formatting
2. `mix credo --strict` - Static analysis
3. `mix sobelow --config` - Security scanning
4. `mix dialyzer` - Type checking

### Individual Checks

```bash
just format        # Format code
just lint          # Run Credo
just security      # Run Sobelow
just types         # Run Dialyzer
```

### Pre-commit (Recommended)

Add to `.git/hooks/pre-commit`:

```bash
#!/bin/bash
just format
just check
```

---

## IDE Setup

### VS Code

Recommended extensions (auto-installed with DevContainer):

- **ElixirLS** - Elixir language server
- **Phoenix Framework** - Phoenix support
- **Svelte for VS Code** - Svelte support
- **Tailwind CSS IntelliSense** - Tailwind autocomplete
- **Prettier** - Code formatting
- **GitLens** - Git integration

Settings are configured in `.devcontainer/devcontainer.json`.

### Other IDEs

- **IntelliJ/RubyMine**: Install Elixir plugin
- **Neovim**: Use elixir-ls with nvim-lspconfig
- **Emacs**: Use elixir-mode + lsp-mode

---

## Troubleshooting

### PostgreSQL Connection Issues

```bash
# Check if PostgreSQL is running
docker compose ps

# Restart PostgreSQL
docker compose restart postgres

# View logs
docker compose logs postgres
```

### Mix Dependencies Issues

```bash
# Clean and reinstall
just clean
just deps
```

### Port Already in Use

```bash
# Find process using port 4000
lsof -i :4000

# Kill it
kill -9 <PID>
```

### Asset Build Issues

```bash
# Reinstall node modules
rm -rf assets/node_modules
npm install --prefix assets

# Rebuild assets
just assets-build
```

### Dialyzer First Run

Dialyzer builds a PLT (Persistent Lookup Table) on first run. This takes 5-10 minutes.

```bash
# Build PLT manually
mix dialyzer --plt
```

---

## CI/CD

The project uses GitHub Actions (`.github/workflows/ci.yml`):

1. **Quality** - Format, Credo, Sobelow, Dialyzer
2. **Test** - ExUnit with coverage
3. **Frontend** - Lint, Vitest
4. **E2E** - Playwright (on main/develop)

### Running CI Locally

```bash
just ci
```

This runs the same checks as CI.

---

## Updating Dependencies

```bash
# Check outdated
just outdated

# Update all
just update

# Update specific Elixir dep
mix deps.update some_dep

# Update specific npm package
npm update some-package --prefix assets
```

---

## Release

### Build Release

```bash
just release
```

### Build Docker Image

```bash
just docker-build
```

---

## Further Reading

- [STACK.md](STACK.md) - Technology decisions
- [CONVENTIONS.md](CONVENTIONS.md) - Code patterns
- [TESTING.md](TESTING.md) - Testing strategy
- [COMPONENTS.md](COMPONENTS.md) - UI components
