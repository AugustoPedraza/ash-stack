# Testing Strategy

> AI-optimized testing patterns for reliable, maintainable tests.

## Philosophy

1. **Property-based > many unit tests** — Define invariants, let StreamData generate cases
2. **Test behavior, not implementation** — What it does, not how
3. **Factories over fixtures** — Composable, readable test data
4. **E2E for critical paths** — Real browser for user journeys

---

## Test Types

### 1. Property-Based Tests (StreamData)

Best for: Data transformations, parsers, any function with clear invariants.

```elixir
defmodule MyApp.Accounts.UserPropertiesTest do
  use MyApp.DataCase
  use ExUnitProperties

  alias MyApp.Accounts

  # Custom generators
  defp email_generator do
    gen all name <- string(:alphanumeric, min_length: 1, max_length: 20),
            domain <- member_of(["gmail.com", "example.com", "test.org"]) do
      "#{name}@#{domain}"
    end
  end

  property "email is always stored lowercase" do
    check all email <- email_generator() do
      {:ok, user} = Accounts.create_user(%{email: String.upcase(email)})

      assert user.email == String.downcase(email)
    end
  end

  property "user creation is idempotent with same email" do
    check all email <- email_generator(), max_runs: 50 do
      {:ok, user1} = Accounts.create_user(%{email: email})
      result2 = Accounts.create_user(%{email: email})

      assert {:error, _} = result2  # Duplicate should fail
    end
  end

  property "user always has timestamps after creation" do
    check all email <- email_generator(), max_runs: 25 do
      {:ok, user} = Accounts.create_user(%{email: email})

      assert user.inserted_at != nil
      assert user.updated_at != nil
      assert DateTime.compare(user.inserted_at, DateTime.utc_now()) in [:lt, :eq]
    end
  end
end
```

### 2. Unit Tests (ExUnit)

Best for: Specific behaviors, edge cases, error conditions.

```elixir
defmodule MyApp.Accounts.UserTest do
  use MyApp.DataCase, async: true

  alias MyApp.Accounts

  describe "create_user/1" do
    test "creates user with valid params" do
      # Arrange
      params = %{email: "test@example.com", name: "Test User"}

      # Act
      result = Accounts.create_user(params)

      # Assert
      assert {:ok, user} = result
      assert user.email == "test@example.com"
      assert user.name == "Test User"
    end

    test "fails with invalid email" do
      params = %{email: "not-an-email", name: "Test"}

      assert {:error, error} = Accounts.create_user(params)
      assert "is invalid" in errors_on(error).email
    end

    test "fails with empty email" do
      params = %{email: "", name: "Test"}

      assert {:error, error} = Accounts.create_user(params)
      assert "can't be blank" in errors_on(error).email
    end

    test "fails with duplicate email" do
      _existing = insert(:user, email: "taken@example.com")
      params = %{email: "taken@example.com", name: "New User"}

      assert {:error, error} = Accounts.create_user(params)
      assert "has already been taken" in errors_on(error).email
    end
  end

  describe "get_user/1" do
    test "returns user when exists" do
      user = insert(:user)

      assert {:ok, found} = Accounts.get_user(user.id)
      assert found.id == user.id
    end

    test "returns error when not found" do
      fake_id = Ecto.UUID.generate()

      assert {:error, %Ash.Error.Query.NotFound{}} = Accounts.get_user(fake_id)
    end
  end
end
```

### 3. Integration Tests (LiveView)

Best for: Testing LiveView interactions, real-time features.

```elixir
defmodule MyAppWeb.UserLiveTest do
  use MyAppWeb.ConnCase
  import Phoenix.LiveViewTest

  describe "user list" do
    setup %{conn: conn} do
      user = insert(:user)
      conn = log_in_user(conn, user)
      %{conn: conn, user: user}
    end

    test "displays users", %{conn: conn} do
      users = insert_list(3, :user)

      {:ok, view, _html} = live(conn, ~p"/users")

      for user <- users do
        assert has_element?(view, "[data-testid='user-row']", user.name)
      end
    end

    test "creates user via form", %{conn: conn} do
      {:ok, view, _html} = live(conn, ~p"/users/new")

      view
      |> form("#user-form", user: %{email: "new@example.com", name: "New User"})
      |> render_submit()

      assert_redirect(view, ~p"/users")

      # Verify in database
      assert {:ok, _} = Accounts.get_user_by_email("new@example.com")
    end

    test "shows validation errors", %{conn: conn} do
      {:ok, view, _html} = live(conn, ~p"/users/new")

      view
      |> form("#user-form", user: %{email: "", name: ""})
      |> render_submit()

      assert has_element?(view, "[data-testid='error']", "can't be blank")
    end
  end
end
```

### 4. E2E Tests (Playwright)

Best for: Critical user journeys, cross-browser testing.

```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('user can sign up', async ({ page }) => {
    await page.goto('/signup');

    await page.fill('[data-testid="email"]', 'new@example.com');
    await page.fill('[data-testid="name"]', 'New User');
    await page.click('[data-testid="submit"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('[data-testid="welcome"]')).toContainText('New User');
  });

  test('shows error for invalid email', async ({ page }) => {
    await page.goto('/signup');

    await page.fill('[data-testid="email"]', 'not-valid');
    await page.click('[data-testid="submit"]');

    await expect(page.locator('[data-testid="error"]')).toBeVisible();
  });
});
```

---

## Factories

```elixir
# test/support/factory.ex
defmodule MyApp.Factory do
  use ExMachina.Ecto, repo: MyApp.Repo

  # Base factories
  def user_factory do
    %MyApp.Accounts.User{
      email: sequence(:email, &"user#{&1}@example.com"),
      name: sequence(:name, &"User #{&1}"),
      role: :user
    }
  end

  def project_factory do
    %MyApp.Projects.Project{
      name: sequence(:name, &"Project #{&1}"),
      status: :active,
      owner: build(:user)
    }
  end

  def message_factory do
    %MyApp.Chat.Message{
      content: Faker.Lorem.sentence(),
      sender: build(:user),
      project: build(:project),
      sent_at: DateTime.utc_now()
    }
  end

  # Traits - composable modifications
  def admin(user) do
    %{user | role: :admin}
  end

  def with_projects(user, count \\ 3) do
    projects = insert_list(count, :project, owner: user)
    %{user | projects: projects}
  end

  def as_draft(message) do
    %{message | state: :draft, sent_at: nil}
  end
end
```

**Usage:**

```elixir
# Basic
user = insert(:user)

# With trait
admin = insert(:user) |> admin()

# With association
project = insert(:project, owner: insert(:user))

# With trait function
user_with_projects = insert(:user) |> with_projects(5)

# Build without insert (for unit tests)
user = build(:user)
```

---

## Test Helpers

### Error Helper

```elixir
# test/support/data_case.ex
def errors_on(result) do
  case result do
    %Ecto.Changeset{} = changeset ->
      Ecto.Changeset.traverse_errors(changeset, fn {msg, opts} ->
        Regex.replace(~r"%{(\w+)}", msg, fn _, key ->
          opts |> Keyword.get(String.to_existing_atom(key), key) |> to_string()
        end)
      end)

    %Ash.Error.Invalid{} = error ->
      error
      |> Ash.Error.to_error_class()
      |> Map.get(:errors, [])
      |> Enum.group_by(& &1.field, & &1.message)
  end
end
```

### Auth Helper

```elixir
# test/support/conn_case.ex
def log_in_user(conn, user) do
  token = MyApp.Accounts.generate_user_session_token(user)

  conn
  |> Phoenix.ConnTest.init_test_session(%{})
  |> Plug.Conn.put_session(:user_token, token)
end
```

---

## StreamData Generators

### Common Generators

```elixir
# test/support/generators.ex
defmodule MyApp.Generators do
  use ExUnitProperties

  def email do
    gen all name <- string(:alphanumeric, min_length: 1, max_length: 20),
            domain <- member_of(["gmail.com", "example.com", "test.org"]) do
      "#{String.downcase(name)}@#{domain}"
    end
  end

  def phone do
    gen all digits <- string(?0..?9, length: 10) do
      "+1#{digits}"
    end
  end

  def money do
    gen all dollars <- integer(0..100_000),
            cents <- integer(0..99) do
      Decimal.new("#{dollars}.#{String.pad_leading("#{cents}", 2, "0")}")
    end
  end

  def future_date do
    gen all days <- integer(1..365) do
      Date.add(Date.utc_today(), days)
    end
  end

  def past_date do
    gen all days <- integer(1..365) do
      Date.add(Date.utc_today(), -days)
    end
  end

  def uuid do
    constant(Ecto.UUID.generate())
  end
end
```

---

## AI Prompts for Test Generation

### Property Tests

```
Generate property-based tests for this Ash resource:

[Paste resource]

Properties to test:
1. Data integrity (what goes in comes out)
2. Validation rules (boundaries, required fields)
3. State transitions (if state machine)
4. Authorization (who can do what)

Use StreamData and ExUnitProperties.
```

### Unit Tests

```
Generate unit tests for this module:

[Paste module]

Test:
- Happy path for each public function
- Edge cases (empty, nil, max values)
- Error conditions
- Use factories from test/support/factory.ex
```

### E2E Tests

```
Generate Playwright tests for:

Feature: [Name]
User flow:
1. [Step 1]
2. [Step 2]
3. [Expected outcome]

Use data-testid selectors.
```

---

## CI Configuration

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: postgres
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4

      - name: Setup Elixir
        uses: erlef/setup-beam@v1
        with:
          elixir-version: '1.17'
          otp-version: '27'

      - name: Cache deps
        uses: actions/cache@v4
        with:
          path: |
            deps
            _build
          key: ${{ runner.os }}-mix-${{ hashFiles('**/mix.lock') }}

      - name: Install dependencies
        run: mix deps.get

      - name: Run tests
        run: mix test --cover
        env:
          DATABASE_URL: postgres://postgres:postgres@localhost/test

      - name: Upload coverage
        uses: codecov/codecov-action@v4
```

---

## Coverage Goals

| Type | Target | Rationale |
|------|--------|-----------|
| Domain logic | 90%+ | Core business rules |
| Web layer | 70%+ | LiveView, controllers |
| Components | 60%+ | UI components |
| E2E | Critical paths | User journeys |

Run coverage: `mix coveralls`
