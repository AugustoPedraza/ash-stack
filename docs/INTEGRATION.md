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

## Phoenix PubSub → Svelte Stores

### Setup Real-time Hooks

```javascript
// In app.js
import { initLiveViewHooks, setLiveSocket } from "./svelte/lib/liveview"
import { initRealtimeHooks } from "./svelte/lib/realtime"

let liveSocket = new LiveSocket("/live", Socket, {
  hooks: {
    ...initLiveViewHooks(),
    ...initRealtimeHooks()  // Add real-time hooks
  }
})

setLiveSocket(liveSocket)
```

### Use RealtimeHelpers in LiveView

```elixir
defmodule MyAppWeb.ChatLive do
  use MyAppWeb, :live_view
  use AshStackWeb.RealtimeHelpers, pubsub: MyApp.PubSub

  def mount(%{"room_id" => room_id}, _session, socket) do
    if connected?(socket) do
      topic = "room:#{room_id}"
      subscribe(topic)
      track_presence(topic, socket.assigns.current_user)
    end

    {:ok, assign(socket, room_id: room_id, messages: [])}
  end

  # Handle incoming broadcasts
  def handle_info({:broadcast, "message:new", payload}, socket) do
    {:noreply, sync_to_store(socket, payload)}
  end

  # Handle presence changes
  def handle_info(%{event: "presence_diff"}, socket) do
    {:noreply, push_presence(socket, "room:#{socket.assigns.room_id}", AshStackWeb.Presence)}
  end
end
```

### Broadcast to Svelte Stores

```elixir
# Broadcast that auto-syncs to Svelte stores
def handle_event("send_message", %{"text" => text}, socket) do
  message = create_message(text, socket.assigns)

  # Broadcasts to all subscribers and syncs to their "messages" store
  broadcast("room:#{socket.assigns.room_id}", "message:new", %{
    store: "messages",
    action: "append",
    data: message
  })

  {:noreply, socket}
end
```

---

## Real-time Svelte Stores

### Create Auto-syncing Store

```svelte
<script>
  import { createRealtimeStore, initRealtimeHooks } from '$lib';

  // Creates store that auto-syncs with server broadcasts
  const messages = createRealtimeStore('messages', [], {
    getId: (m) => m.id,
    sort: (a, b) => new Date(a.created_at) - new Date(b.created_at)
  });

  // Store operations
  // - messages.append(item) - add to end
  // - messages.prepend(item) - add to start
  // - messages.updateItem(id, changes) - update by ID
  // - messages.remove(id) - remove by ID
  // - messages.set(items) - replace all

  // Optimistic updates with reconciliation
  function sendMessage(text) {
    const tempId = `temp_${Date.now()}`;

    // Add optimistically
    messages.addOptimistic(tempId, { text, user: currentUser });

    // Send to server (reconciliation happens automatically via hooks)
    pushEvent('send_message', { text, temp_id: tempId });
  }
</script>

{#each $messages as message (message.id)}
  <MessageBubble {message} optimistic={message._optimistic} />
{/each}
```

### RealtimeList Component

```svelte
<script>
  import { RealtimeList } from '$lib/components/ui';

  let messages = [];
</script>

<RealtimeList
  store="messages"
  items={messages}
  getId={(m) => m.id}
  sort={(a, b) => a.created_at - b.created_at}
  let:item
  let:optimistic
>
  <div class:opacity-70={optimistic}>
    <strong>{item.user}</strong>: {item.text}
  </div>

  <svelte:fragment slot="empty">
    <p class="text-text-muted">No messages yet</p>
  </svelte:fragment>
</RealtimeList>
```

---

## Presence Tracking

### Track Online Users

```elixir
# In LiveView mount
def mount(%{"room_id" => room_id}, _session, socket) do
  if connected?(socket) do
    topic = "room:#{room_id}"

    # Subscribe to PubSub topic
    subscribe(topic)

    # Track this user's presence
    track_presence(topic, socket.assigns.current_user, %{
      status: "online",
      typing: false
    })

    # Subscribe to presence changes
    AshStackWeb.Presence.subscribe(topic)
  end

  {:ok, assign(socket, room_id: room_id)}
end
```

### Presence Store in Svelte

```svelte
<script>
  import { createPresenceStore, TypingIndicator } from '$lib';

  const presence = createPresenceStore('room:lobby');

  // Derived stores
  const typingUsers = presence.typingUsers;
  const onlineCount = presence.count;
</script>

<div class="online-users">
  <span>{$onlineCount} online</span>

  {#each $presence as user}
    <Avatar src={user.avatar} status={user.status} />
  {/each}
</div>

<TypingIndicator users={$typingUsers} />
```

---

## Typing Indicators

### Server-side Typing Updates

```elixir
# Handle typing events
def handle_event("typing:start", _, socket) do
  update_presence(
    "room:#{socket.assigns.room_id}",
    socket.assigns.current_user,
    %{typing: true}
  )
  {:noreply, socket}
end

def handle_event("typing:stop", _, socket) do
  update_presence(
    "room:#{socket.assigns.room_id}",
    socket.assigns.current_user,
    %{typing: false}
  )
  {:noreply, socket}
end
```

### Client-side Typing Manager

```svelte
<script>
  import { createTypingIndicator, pushEvent } from '$lib';
  import { Input, TypingIndicator } from '$lib/components/ui';

  let message = '';

  // Creates debounced typing indicator
  const typing = createTypingIndicator({
    onStart: () => pushEvent('typing:start'),
    onStop: () => pushEvent('typing:stop'),
    debounce: 1500  // Stop typing after 1.5s of no input
  });

  function handleSubmit() {
    typing.stop();  // Force stop when submitting
    pushEvent('send_message', { text: message });
    message = '';
  }
</script>

<form on:submit|preventDefault={handleSubmit}>
  <Input
    bind:value={message}
    on:input={typing.onInput}
    placeholder="Type a message..."
  />
</form>

<TypingIndicator users={$typingUsers} maxNames={2} />
```

### TypingIndicator Component

```svelte
<TypingIndicator
  users={$typingUsers}
  maxNames={2}
/>

<!-- Output examples:
  - "Alice is typing"
  - "Alice and Bob are typing"
  - "Alice, Bob and 3 others are typing"
-->

<!-- Custom format -->
<TypingIndicator
  users={$typingUsers}
  format={(users) => `${users.length} people typing...`}
/>

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
| `RealtimeHelpers` | `subscribe/1` | Subscribe to PubSub topic |
| `RealtimeHelpers` | `broadcast/3` | Broadcast to topic |
| `RealtimeHelpers` | `sync_to_store/2` | Sync payload to Svelte store |
| `RealtimeHelpers` | `track_presence/3` | Track user presence |
| `RealtimeHelpers` | `push_presence/3` | Push presence to Svelte |
| `RealtimeHelpers` | `reconcile_optimistic/4` | Reconcile optimistic update |
| `RealtimeHelpers` | `rollback_optimistic/3` | Rollback optimistic update |
| `Presence` | `list_users/1` | Get online users |
| `Presence` | `typing_users/1` | Get typing users |
| `Presence` | `online?/2` | Check if user online |

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
| `createRealtimeStore(name, initial, opts)` | Create auto-syncing store |
| `getRealtimeStore(name)` | Get registered realtime store |
| `createPresenceStore(topic)` | Create presence tracking store |
| `getPresenceStore(topic)` | Get registered presence store |
| `initRealtimeHooks()` | Get realtime hooks for LiveSocket |
| `createTypingIndicator(options)` | Create typing indicator manager |
| `mergeStrategies` | Conflict resolution strategies |

### Svelte Components

| Component | Props | Purpose |
|-----------|-------|---------|
| `RealtimeList` | `store`, `items`, `getId`, `sort`, `duration` | Auto-syncing list |
| `TypingIndicator` | `users`, `maxNames`, `format` | Show who's typing |
