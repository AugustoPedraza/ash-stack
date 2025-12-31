# Phoenix + Svelte Integration Guide

> Seamless integration between Phoenix LiveView, Ash Framework, and Svelte components.

## Quick Start

### 1. Setup in app.js

```javascript
import { Socket } from "phoenix"
import { LiveSocket } from "phoenix_live_view"
import { initLiveViewHooks, setLiveSocket } from "./svelte/lib/liveview"

let liveSocket = new LiveSocket("/live", Socket, {
  hooks: initLiveViewHooks(),
  params: { _csrf_token: csrfToken }
})

// Make LiveSocket available to Svelte components
setLiveSocket(liveSocket)

liveSocket.connect()
```

### 2. Import Helpers in LiveView

```elixir
defmodule MyAppWeb.UserLive.Index do
  use MyAppWeb, :live_view
  use AshStackWeb.LiveSvelteHelpers
  import AshStackWeb.SvelteHelpers
  import AshStackWeb.AshFormHelpers

  # Now you have access to all helpers
end
```

### 3. Add ToastContainer to Layout

```heex
<!-- In root.html.heex or app.html.heex -->
<.svelte name="ToastContainer" socket={@socket} />
```

---

## Form Integration

### Ash Form → Svelte Components

```elixir
defmodule MyAppWeb.UserLive.New do
  use MyAppWeb, :live_view
  import AshStackWeb.SvelteHelpers
  import AshStackWeb.AshFormHelpers

  def mount(_params, _session, socket) do
    form = new_form(MyApp.Accounts.User, :create)
    {:ok, assign(socket, form: form)}
  end

  def render(assigns) do
    ~H"""
    <.svelte_form for={@form} phx-submit="save" phx-change="validate">
      <.svelte_input field={@form[:name]} label="Name" />
      <.svelte_input field={@form[:email]} label="Email" type="email" />
      <.svelte_select
        field={@form[:role]}
        label="Role"
        options={[
          %{value: "admin", label: "Administrator"},
          %{value: "user", label: "Regular User"}
        ]}
      />
      <.svelte_checkbox field={@form[:active]} label="Active" />
      <.svelte_submit>Create User</.svelte_submit>
    </.svelte_form>
    """
  end

  def handle_event("validate", %{"form" => params}, socket) do
    form =
      socket.assigns.form.source
      |> AshPhoenix.Form.validate(params)
      |> to_form()

    {:noreply, assign(socket, form: form)}
  end

  def handle_event("save", %{"form" => params}, socket) do
    case submit_form(socket.assigns.form.source, params) do
      {:ok, user} ->
        {:noreply,
         socket
         |> put_flash_toast(:success, "User created!")
         |> push_navigate(to: ~p"/users/#{user.id}")}

      {:error, form} ->
        {:noreply, assign(socket, form: to_form(form))}
    end
  end
end
```

### Edit Existing Records

```elixir
def mount(%{"id" => id}, _session, socket) do
  user = MyApp.Accounts.get_user!(id)
  form = edit_form(user, :update)
  {:ok, assign(socket, form: form, user: user)}
end
```

---

## Flash → Toast

Flash messages automatically show as toast notifications.

```elixir
# Standard Phoenix flash - shows as toast automatically
socket
|> put_flash(:success, "Saved!")
|> put_flash(:error, "Something went wrong")

# Or use put_flash_toast for explicit control
socket
|> put_flash_toast(:success, "User created successfully!")

# Direct toast without flash (ephemeral, not persisted)
socket
|> push_toast(:info, "Processing...", duration: 0)
```

---

## Server → Client Events

### Push to Svelte Component

```elixir
# In LiveView
def handle_info({:user_added, user}, socket) do
  {:noreply, push_to_svelte(socket, "user-list", "user:added", %{user: user})}
end
```

```svelte
<!-- In Svelte component -->
<script>
  import { onMount } from 'svelte';
  import { subscribeToComponent } from '$lib';

  let users = [];

  onMount(() => {
    return subscribeToComponent('user-list', (event, payload) => {
      if (event === 'user:added') {
        users = [...users, payload.user];
      }
    });
  });
</script>

<div data-svelte-id="user-list">
  {#each users as user}
    <UserCard {user} />
  {/each}
</div>
```

### Update Svelte Stores from Server

```elixir
# In LiveView
def handle_info(:refresh_users, socket) do
  users = MyApp.Accounts.list_users()
  {:noreply, push_store_update(socket, "users", users)}
end
```

```svelte
<script>
  import { onMount } from 'svelte';
  import { createLiveStore } from '$lib';

  // Auto-syncs with server pushes
  const users = createLiveStore('users', []);

  onMount(() => users.destroy);
</script>
```

---

## Client → Server Events

### From Svelte Component

```svelte
<script>
  import { pushEvent, pushEventAsync } from '$lib';

  async function handleDelete(id) {
    // Fire and forget
    pushEvent('delete', { id });

    // Or wait for response
    const result = await pushEventAsync('delete', { id });
    if (result.ok) {
      toast.success('Deleted!');
    }
  }
</script>

<button on:click={() => handleDelete(item.id)}>Delete</button>
```

```elixir
# In LiveView
def handle_event("delete", %{"id" => id}, socket) do
  case MyApp.delete_item(id) do
    :ok ->
      {:reply, %{ok: true}, socket}

    {:error, reason} ->
      {:reply, %{error: reason}, socket}
  end
end
```

### Form Handler Pattern

```svelte
<script>
  import { createFormHandler, toast } from '$lib';

  let name = '';
  let email = '';

  const handleSubmit = createFormHandler({
    event: 'save',
    getData: () => ({ name, email }),
    onSuccess: () => {
      toast.success('Saved!');
      name = '';
      email = '';
    },
    onError: (err) => toast.error(err.message || 'Failed to save')
  });
</script>

<form on:submit={handleSubmit}>
  <Input bind:value={name} placeholder="Name" />
  <Input bind:value={email} type="email" placeholder="Email" />
  <Button type="submit">Save</Button>
</form>
```

---

## Real-time Updates Pattern

### Optimistic Update + Server Sync

```svelte
<script>
  import { createOptimisticList, pushEventAsync, toast } from '$lib';

  const todos = createOptimisticList([], { getId: (t) => t.id });

  async function addTodo(text) {
    const tempId = `temp_${Date.now()}`;
    const tempTodo = { id: tempId, text, completed: false };

    try {
      await todos.add(tempTodo, async () => {
        const result = await pushEventAsync('create_todo', { text });
        if (result.error) throw new Error(result.error);
        return result.todo;
      });
    } catch (error) {
      toast.error('Failed to add todo');
    }
  }

  async function deleteTodo(id) {
    try {
      await todos.remove(id, () => pushEventAsync('delete_todo', { id }));
    } catch (error) {
      toast.error('Failed to delete');
    }
  }
</script>
```

---

## Component Patterns

### Data Table with Server Sorting

```heex
<.svelte
  name="DataTable"
  columns={@columns}
  data={@users}
  sortBy={@sort_by}
  sortDirection={@sort_dir}
  socket={@socket}
/>
```

```elixir
def handle_event("sort", %{"column" => col, "direction" => dir}, socket) do
  users = MyApp.Accounts.list_users(sort: [{String.to_atom(dir), String.to_atom(col)}])
  {:noreply, assign(socket, users: users, sort_by: col, sort_dir: dir)}
end
```

### Infinite Scroll

```heex
<.svelte
  name="InfiniteScroll"
  loading={@loading}
  hasMore={@has_more}
  socket={@socket}
>
  <%= for item <- @items do %>
    <.item_card item={item} />
  <% end %>
</.svelte>
```

```elixir
def handle_event("loadMore", _, socket) do
  %{items: items, page: page} = socket.assigns
  new_items = MyApp.list_items(page: page + 1)

  {:noreply,
   assign(socket,
     items: items ++ new_items,
     page: page + 1,
     has_more: length(new_items) == 20
   )}
end
```

---

## Helpers Reference

### Elixir Helpers

| Module | Function | Purpose |
|--------|----------|---------|
| `SvelteHelpers` | `svelte/1` | Render Svelte component |
| `SvelteHelpers` | `svelte_form/1` | Form wrapper |
| `SvelteHelpers` | `svelte_input/1` | Input with field binding |
| `SvelteHelpers` | `svelte_select/1` | Select with field binding |
| `SvelteHelpers` | `svelte_textarea/1` | Textarea with field binding |
| `SvelteHelpers` | `svelte_checkbox/1` | Checkbox with field binding |
| `SvelteHelpers` | `svelte_submit/1` | Submit button |
| `AshFormHelpers` | `new_form/2` | Create form for new record |
| `AshFormHelpers` | `edit_form/2` | Create form for edit |
| `AshFormHelpers` | `submit_form/2` | Submit and handle errors |
| `LiveSvelteHelpers` | `push_toast/3` | Push toast notification |
| `LiveSvelteHelpers` | `push_to_svelte/4` | Push event to component |
| `LiveSvelteHelpers` | `push_store_update/3` | Update Svelte store |
| `LiveSvelteHelpers` | `put_flash_toast/3` | Flash + Toast |

### JavaScript Helpers

| Function | Purpose |
|----------|---------|
| `pushEvent(event, payload)` | Send event to LiveView |
| `pushEventAsync(event, payload)` | Send and await response |
| `pushEventTo(selector, event, payload)` | Send to LiveComponent |
| `subscribeToComponent(id, callback)` | Listen for component events |
| `registerStore(name, store)` | Register store for server sync |
| `createLiveStore(name, initial)` | Create auto-synced store |
| `createFormHandler(options)` | Create form submit handler |
| `initLiveViewHooks()` | Get hooks for LiveSocket |
| `setLiveSocket(socket)` | Set socket for helpers |
