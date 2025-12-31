# Justfile - Task Runner
# https://github.com/casey/just
#
# Install: cargo install just (or brew install just)
# Usage: just <task>
# List tasks: just --list
#
# AI INSTRUCTIONS:
# - All common commands are here
# - Use these tasks, don't run raw commands
# - Add new tasks as needed

# Default task (runs when you just type 'just')
default:
    @just --list

# =============================================================================
# SETUP
# =============================================================================

# First-time setup for new developers
setup:
    #!/usr/bin/env bash
    set -e
    echo "🐳 Starting services..."
    docker compose up -d
    echo "⏳ Waiting for PostgreSQL..."
    sleep 3
    echo "📦 Installing Elixir dependencies..."
    mix deps.get
    echo "📦 Installing Node dependencies..."
    npm install --prefix assets
    echo "🗄️ Setting up database..."
    mix ecto.setup
    echo ""
    echo "✅ Setup complete!"
    echo "Run 'just dev' to start the development server."

# Install dependencies only
deps:
    mix deps.get
    npm install --prefix assets

# =============================================================================
# DEVELOPMENT
# =============================================================================

# Start development server (with services)
dev:
    #!/usr/bin/env bash
    docker compose up -d
    iex -S mix phx.server

# Start development server (no iex)
server:
    docker compose up -d
    mix phx.server

# Start services only (PostgreSQL, Mailpit, etc.)
services:
    docker compose up -d

# Stop services
services-stop:
    docker compose down

# View service logs
services-logs:
    docker compose logs -f

# Open PostgreSQL CLI
psql:
    docker compose exec postgres psql -U postgres -d ash_stack_dev

# Open IEx console
console:
    iex -S mix

# =============================================================================
# DATABASE
# =============================================================================

# Run migrations
db-migrate:
    mix ecto.migrate

# Rollback last migration
db-rollback:
    mix ecto.rollback

# Reset database (drop, create, migrate, seed)
db-reset:
    mix ecto.reset

# Create database
db-create:
    mix ecto.create

# Drop database
db-drop:
    mix ecto.drop

# Generate migration
db-gen name:
    mix ecto.gen.migration {{name}}

# =============================================================================
# TESTING
# =============================================================================

# Run all tests
test:
    mix test

# Run tests with coverage
test-cover:
    mix coveralls

# Run tests in watch mode
test-watch:
    mix test.watch

# Run specific test file
test-file file:
    mix test {{file}}

# Run tests matching pattern
test-only pattern:
    mix test --only {{pattern}}

# Run property-based tests only
test-property:
    mix test --only property

# =============================================================================
# CODE QUALITY
# =============================================================================

# Run all quality checks
check: format-check lint security types
    @echo "✅ All checks passed!"

# Format code
format:
    mix format
    npm run format --prefix assets 2>/dev/null || true

# Check formatting (CI)
format-check:
    mix format --check-formatted

# Run Credo linter
lint:
    mix credo --strict

# Run security scan
security:
    mix sobelow --config

# Run Dialyzer type checker
types:
    mix dialyzer

# Run all checks + tests (for CI)
ci: check test
    @echo "✅ CI passed!"

# =============================================================================
# ASH FRAMEWORK
# =============================================================================

# Generate Ash code
ash-codegen:
    mix ash.codegen

# Run Ash migrations
ash-migrate:
    mix ash_postgres.migrate

# Generate Ash migration
ash-gen-migration name:
    mix ash_postgres.generate_migrations --name {{name}}

# =============================================================================
# ASSETS
# =============================================================================

# Build assets for production
assets-build:
    mix assets.deploy

# Watch assets (separate terminal)
assets-watch:
    npm run dev --prefix assets

# =============================================================================
# RELEASES
# =============================================================================

# Build production release
release:
    MIX_ENV=prod mix release

# Build Docker image
docker-build:
    docker build -t ash-stack:latest .

# =============================================================================
# AI / VIBE CODING
# =============================================================================

# Lint for design token violations (colors, spacing, etc.)
lint-tokens:
    #!/usr/bin/env bash
    echo "🎨 Checking design token usage..."
    ERRORS=0

    # Check for raw Tailwind colors
    if grep -rn --include="*.svelte" --include="*.ex" --include="*.heex" \
        -E "(bg|text|border|ring|fill|stroke)-(red|blue|green|yellow|gray|slate|zinc|neutral|stone|orange|amber|lime|emerald|teal|cyan|sky|indigo|violet|purple|fuchsia|pink|rose)-[0-9]" \
        lib/ assets/ 2>/dev/null; then
        echo "❌ Found raw Tailwind colors. Use design tokens instead:"
        echo "   bg-primary, bg-surface, text-muted, border-border, etc."
        ERRORS=1
    fi

    # Check for arbitrary values (escape hatches)
    if grep -rn --include="*.svelte" --include="*.ex" --include="*.heex" \
        -E "class=\"[^\"]*\[(#|[0-9]+px|[0-9]+rem)" \
        lib/ assets/ 2>/dev/null; then
        echo "❌ Found arbitrary values in classes. Use design tokens instead."
        ERRORS=1
    fi

    # Check for common wrong spacing (p-5, p-7, m-5, etc.)
    if grep -rn --include="*.svelte" --include="*.ex" --include="*.heex" \
        -E "(^|[^0-9a-z-])(p|m|px|py|mx|my|gap|space)-(5|7|9|10|11|14|18|22)" \
        lib/ assets/ 2>/dev/null; then
        echo "⚠️  Found non-standard spacing. Available: 0,1,2,3,4,6,8,12,16,20,24"
        ERRORS=1
    fi

    if [ $ERRORS -eq 0 ]; then
        echo "✅ All design tokens valid"
    else
        exit 1
    fi

# Verify code after AI changes (quick check)
verify: lint-tokens
    #!/usr/bin/env bash
    echo "🔍 Verifying code..."
    mix compile --warnings-as-errors 2>&1 | head -30
    if [ $? -eq 0 ]; then
        echo "✅ Compilation OK"
    else
        echo "❌ Compilation failed - see errors above"
        exit 1
    fi

# Full verification (compile + test + credo)
verify-full: verify
    #!/usr/bin/env bash
    echo "🧪 Running tests..."
    mix test --max-failures 3
    echo "🔍 Running Credo..."
    mix credo --strict --format=oneline | head -20

# Show recent errors
errors:
    @echo "=== Compilation Check ==="
    @mix compile 2>&1 | grep -A3 "error:\|warning:" | head -30 || echo "✅ No errors"
    @echo ""
    @echo "=== Last Runtime Error ==="
    @cat tmp/last_error.txt 2>/dev/null || echo "No runtime errors captured"

# Validate all icon names in codebase
validate-icons:
    @echo "Scanning for icon usage..."
    @grep -rh "hero-[a-z-]*" lib/ --include="*.ex" --include="*.heex" -o | sort | uniq -c | sort -rn | head -20

# AI-friendly task: implement with TDD
tdd feature:
    @echo "Starting TDD for: {{feature}}"
    @echo "1. Write test in test/ directory"
    @echo "2. Run: just test"
    @echo "3. Implement feature"
    @echo "4. Run: just test"
    @echo "5. Refactor"
    @echo "6. Run: just verify-full"

# =============================================================================
# UTILITIES
# =============================================================================

# Generate secret key
secret:
    mix phx.gen.secret

# Open routes in browser
routes:
    mix phx.routes

# Clean build artifacts
clean:
    mix clean
    rm -rf _build deps node_modules assets/node_modules

# Update dependencies
update:
    mix deps.update --all
    npm update --prefix assets

# Show outdated dependencies
outdated:
    mix hex.outdated
    npm outdated --prefix assets || true
