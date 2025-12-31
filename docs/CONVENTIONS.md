# Code Conventions

> Patterns and rules for consistent, AI-friendly code generation.

## Naming Conventions

### Elixir

| Type | Convention | Example |
|------|------------|---------|
| Module | PascalCase | `MyApp.Accounts.User` |
| Function | snake_case | `get_user/1`, `create_user/1` |
| Variable | snake_case | `user_id`, `current_user` |
| Constant | @snake_case | `@max_retries` |
| Private fn | underscore prefix | `defp do_create/1` |
| Boolean fn | question mark | `def valid?/1` |
| Bang fn | exclamation | `def create!/1` |

### Svelte

| Type | Convention | Example |
|------|------------|---------|
| Component file | PascalCase.svelte | `Button.svelte` |
| Props | camelCase | `isLoading`, `userName` |
| Events | on:eventname | `on:click`, `on:select` |
| CSS classes | kebab-case | `message-bubble` |
| Stores | camelCase | `userStore` |

### Database

| Type | Convention | Example |
|------|------------|---------|
| Table | plural_snake_case | `users`, `chat_messages` |
| Column | snake_case | `created_at`, `user_id` |
| Foreign key | singular_id | `user_id`, `project_id` |
| Index | table_column_index | `users_email_index` |
| Enum type | singular_snake | `user_role`, `message_state` |

### Files & Directories

| Type | Convention | Example |
|------|------------|---------|
| Elixir module | snake_case.ex | `user.ex`, `chat_message.ex` |
| Elixir test | _test.ex suffix | `user_test.ex` |
| Svelte component | PascalCase.svelte | `Button.svelte` |
| CSS file | snake_case.css | `tokens.css` |
| Directory | snake_case | `live/`, `components/` |

---

## Directory Structure

### Ash Domains

```
lib/my_app/
├── accounts/                    # Domain
│   ├── accounts.ex              # Domain module
│   └── resources/
│       ├── user.ex              # Resource
│       └── token.ex             # Resource
├── chat/                        # Domain
│   ├── chat.ex                  # Domain module
│   └── resources/
│       ├── message.ex
│       └── conversation.ex
└── [domain]/
    ├── [domain].ex
    └── resources/
```

### Web Layer

```
lib/my_app_web/
├── components/
│   ├── core_components.ex       # Phoenix defaults
│   ├── ui_components.ex         # App UI components
│   └── layouts/
│       ├── app.html.heex
│       └── root.html.heex
├── live/
│   ├── [feature]_live.ex
│   └── [feature]_live/
│       └── components.ex        # Feature-specific
├── controllers/
│   └── [resource]_controller.ex
└── router.ex
```

### Svelte Components

```
assets/svelte/
├── components/
│   ├── ui/                      # Base UI
│   │   ├── Button.svelte
│   │   ├── Avatar.svelte
│   │   ├── Input.svelte
│   │   └── index.js             # Exports all
│   ├── layout/                  # Layout components
│   │   ├── Stack.svelte
│   │   └── Container.svelte
│   ├── patterns/                # Composite patterns
│   │   ├── Card.svelte
│   │   └── Modal.svelte
│   └── features/                # Feature-specific
│       ├── ChatBubble.svelte
│       └── ProjectCard.svelte
└── lib/
    └── stores/                  # Svelte stores
```

### Tests

```
test/
├── support/
│   ├── conn_case.ex
│   ├── data_case.ex
│   └── factory.ex               # ExMachina
├── my_app/                      # Mirror lib/my_app/
│   ├── accounts/
│   │   ├── user_test.exs
│   │   └── user_properties_test.exs
│   └── chat/
│       └── message_test.exs
└── my_app_web/
    └── live/
        └── chat_live_test.exs
```

---

## Code Patterns

### Ash Resource Checklist

Every Ash resource MUST have:

- [ ] `uuid_primary_key :id`
- [ ] `timestamps()`
- [ ] At least one policy (even if `authorize_if always()`)
- [ ] Registered in domain module
- [ ] Public attributes marked `public?: true`

### Svelte Component Checklist

Every Svelte component MUST:

- [ ] Use design tokens (no hardcoded colors/spacing)
- [ ] Have JSDoc comments for props
- [ ] Have default values for optional props
- [ ] Be exported from appropriate index.js
- [ ] Use semantic HTML elements

### Test Checklist

Every test file MUST:

- [ ] Follow AAA pattern (Arrange, Act, Assert)
- [ ] Use factories, not inline data
- [ ] Have descriptive test names
- [ ] Be in matching directory structure

---

## Patterns

### AAA Test Pattern

```elixir
test "creates user with valid email" do
  # Arrange
  params = %{email: "test@example.com", name: "Test User"}

  # Act
  result = Accounts.create_user(params)

  # Assert
  assert {:ok, user} = result
  assert user.email == "test@example.com"
end
```

### Property-Based Test Pattern

```elixir
property "email is always stored lowercase" do
  check all email <- email_generator() do
    # Arrange & Act
    {:ok, user} = Accounts.create_user(%{email: email})

    # Assert property
    assert user.email == String.downcase(email)
  end
end
```

### Factory Pattern

```elixir
# test/support/factory.ex
defmodule MyApp.Factory do
  use ExMachina.Ecto, repo: MyApp.Repo

  def user_factory do
    %MyApp.Accounts.User{
      email: sequence(:email, &"user#{&1}@example.com"),
      name: sequence(:name, &"User #{&1}")
    }
  end

  # Traits
  def admin(user) do
    %{user | role: :admin}
  end
end
```

### LiveView Event Pattern

```elixir
def handle_event("create", %{"item" => params}, socket) do
  case Domain.create_item(params) do
    {:ok, item} ->
      {:noreply,
        socket
        |> put_flash(:info, "Created!")
        |> stream_insert(:items, item)}

    {:error, changeset} ->
      {:noreply, assign(socket, :form, to_form(changeset))}
  end
end
```

### Svelte Component Pattern

```svelte
<script>
  /**
   * Button component
   * @type {'primary' | 'secondary' | 'ghost' | 'danger'}
   */
  export let variant = 'primary';

  /** @type {'sm' | 'md' | 'lg'} */
  export let size = 'md';

  /** @type {boolean} */
  export let disabled = false;

  /** @type {boolean} */
  export let loading = false;

  // Variant classes (using design tokens via Tailwind)
  const variants = {
    primary: 'bg-primary text-on-primary hover:bg-primary-hover',
    secondary: 'bg-secondary text-on-secondary hover:bg-secondary-hover',
    ghost: 'bg-transparent text-text hover:bg-surface-sunken',
    danger: 'bg-error text-on-error hover:opacity-90',
  };

  const sizes = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-base',
    lg: 'h-12 px-6 text-lg',
  };
</script>

<button
  class="
    inline-flex items-center justify-center
    font-medium rounded-lg
    transition-colors duration-fast
    disabled:opacity-50 disabled:cursor-not-allowed
    {variants[variant]}
    {sizes[size]}
  "
  {disabled}
  disabled={disabled || loading}
  on:click
>
  {#if loading}
    <span class="animate-spin mr-2">...</span>
  {/if}
  <slot />
</button>
```

---

## Anti-Patterns (DO NOT)

### Elixir

```elixir
# ❌ Raw Ecto when Ash is available
Repo.insert(%User{email: "test@test.com"})

# ✅ Use Ash actions
Accounts.User
|> Ash.Changeset.for_create(:create, %{email: "test@test.com"})
|> Ash.create!()
```

```elixir
# ❌ Business logic in controllers/LiveView
def handle_event("create", params, socket) do
  %User{}
  |> User.changeset(params)
  |> Repo.insert()
  # ...
end

# ✅ Call domain functions
def handle_event("create", params, socket) do
  case Accounts.create_user(params) do
    # ...
  end
end
```

### Svelte

```svelte
<!-- ❌ Hardcoded values -->
<div style="padding: 16px; color: #3b82f6; border-radius: 8px;">

<!-- ✅ Design tokens via Tailwind -->
<div class="p-4 text-primary rounded-lg">
```

```svelte
<!-- ❌ Inline complex logic -->
<button onclick={() => {
  fetch('/api/thing')
    .then(r => r.json())
    .then(data => { /* complex handling */ })
}}>

<!-- ✅ Extract to functions -->
<script>
  async function handleClick() {
    const data = await fetchThing();
    processData(data);
  }
</script>
<button onclick={handleClick}>
```

### Tests

```elixir
# ❌ Inline test data
test "creates user" do
  user = %User{email: "test@test.com", name: "Test"} |> Repo.insert!()
  # ...
end

# ✅ Use factories
test "creates user" do
  user = insert(:user)
  # ...
end
```

```elixir
# ❌ Testing implementation details
test "calls the database" do
  expect(Repo, :insert, fn _ -> {:ok, %User{}} end)
  # ...
end

# ✅ Test behavior
test "creates user with valid params" do
  assert {:ok, user} = Accounts.create_user(valid_params())
  assert user.email == valid_params().email
end
```

---

## Error Handling

### Ash Results

```elixir
case Accounts.create_user(params) do
  {:ok, user} ->
    # Success
  {:error, %Ash.Error.Invalid{} = error} ->
    # Validation error - extract messages
    messages = Ash.Error.to_error_class(error)
  {:error, %Ash.Error.Forbidden{}} ->
    # Authorization failed
  {:error, error} ->
    # Other error
end
```

### LiveView Flash

```elixir
def handle_event("action", params, socket) do
  case Domain.action(params) do
    {:ok, result} ->
      {:noreply,
        socket
        |> put_flash(:info, "Success!")
        |> assign(:result, result)}

    {:error, %Ash.Error.Invalid{} = error} ->
      {:noreply, put_flash(socket, :error, format_errors(error))}

    {:error, %Ash.Error.Forbidden{}} ->
      {:noreply, put_flash(socket, :error, "Not authorized")}
  end
end

defp format_errors(error) do
  error
  |> Ash.Error.to_error_class()
  |> Map.get(:errors, [])
  |> Enum.map(& &1.message)
  |> Enum.join(", ")
end
```

### Svelte Error Handling

```svelte
<script>
  import { pushEvent } from 'live_svelte';

  let error = $state(null);
  let loading = $state(false);

  async function handleSubmit() {
    loading = true;
    error = null;

    try {
      await pushEvent(live, 'submit', data);
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
    }
  }
</script>

{#if error}
  <div class="text-error bg-error-soft p-3 rounded-lg">{error}</div>
{/if}
```
