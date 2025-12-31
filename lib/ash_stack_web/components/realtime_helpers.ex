defmodule AshStackWeb.RealtimeHelpers do
  @moduledoc """
  Real-time helpers for Phoenix PubSub ↔ Svelte integration.

  Provides:
  - PubSub subscription management
  - Broadcast helpers that sync to Svelte stores
  - Presence tracking with Svelte integration
  - Optimistic update reconciliation

  ## Usage

      defmodule MyAppWeb.ChatLive do
        use MyAppWeb, :live_view
        use AshStackWeb.RealtimeHelpers, pubsub: MyApp.PubSub

        def mount(%{"room_id" => room_id}, _session, socket) do
          if connected?(socket) do
            subscribe("room:#{room_id}")
            track_presence("room:#{room_id}", socket.assigns.current_user)
          end

          {:ok, assign(socket, room_id: room_id, messages: [])}
        end

        # Broadcasts auto-sync to Svelte stores
        def handle_event("send_message", %{"text" => text}, socket) do
          message = create_message(text, socket.assigns)

          broadcast("room:#{socket.assigns.room_id}", "message:new", %{
            message: message,
            store: "messages",
            action: "append"
          })

          {:noreply, socket}
        end

        # Handle incoming broadcasts
        def handle_info({:broadcast, "message:new", payload}, socket) do
          {:noreply, sync_to_store(socket, payload)}
        end
      end
  """

  defmacro __using__(opts) do
    pubsub = Keyword.get(opts, :pubsub, AshStack.PubSub)
    presence = Keyword.get(opts, :presence, AshStackWeb.Presence)

    quote do
      import AshStackWeb.RealtimeHelpers

      @pubsub unquote(pubsub)
      @presence unquote(presence)

      # Store subscriptions for cleanup
      @subscriptions []

      def subscribe(topic) do
        Phoenix.PubSub.subscribe(@pubsub, topic)
      end

      def unsubscribe(topic) do
        Phoenix.PubSub.unsubscribe(@pubsub, topic)
      end

      def broadcast(topic, event, payload) do
        Phoenix.PubSub.broadcast(@pubsub, topic, {:broadcast, event, payload})
      end

      def broadcast_from(topic, event, payload) do
        Phoenix.PubSub.broadcast_from(@pubsub, self(), topic, {:broadcast, event, payload})
      end

      # Presence helpers
      def track_presence(topic, user, meta \\ %{}) do
        AshStackWeb.RealtimeHelpers.track_presence(@presence, topic, user, meta)
      end

      def list_presence(topic) do
        AshStackWeb.RealtimeHelpers.list_presence(@presence, topic)
      end

      def update_presence(topic, user, meta) do
        AshStackWeb.RealtimeHelpers.update_presence(@presence, topic, user, meta)
      end
    end
  end

  # =============================================================================
  # PubSub Helpers
  # =============================================================================

  @doc """
  Syncs a broadcast payload to a Svelte store.

  The payload should contain:
  - `store` - Name of the Svelte store to update
  - `action` - One of: "set", "append", "prepend", "update", "remove"
  - `data` - The data to sync (for set/append/prepend)
  - `id` - Item ID (for update/remove actions)
  - `changes` - Changes to apply (for update action)

  ## Examples

      # Set entire store
      sync_to_store(socket, %{store: "users", action: "set", data: users})

      # Append to list
      sync_to_store(socket, %{store: "messages", action: "append", data: message})

      # Update item in list
      sync_to_store(socket, %{store: "todos", action: "update", id: id, changes: %{done: true}})

      # Remove from list
      sync_to_store(socket, %{store: "items", action: "remove", id: id})
  """
  def sync_to_store(socket, %{store: store, action: action} = payload) do
    event_payload = build_sync_payload(action, payload)

    Phoenix.LiveView.push_event(socket, "store:sync", %{
      store: store,
      action: action,
      payload: event_payload
    })
  end

  defp build_sync_payload("set", %{data: data}), do: %{data: data}
  defp build_sync_payload("append", %{data: data}), do: %{item: data}
  defp build_sync_payload("prepend", %{data: data}), do: %{item: data}
  defp build_sync_payload("update", %{id: id, changes: changes}), do: %{id: id, changes: changes}
  defp build_sync_payload("remove", %{id: id}), do: %{id: id}
  defp build_sync_payload(_, payload), do: payload

  @doc """
  Broadcasts a store sync to all subscribers.

  This is a convenience function that broadcasts a payload that will
  automatically sync to Svelte stores on all connected clients.
  """
  def broadcast_store_sync(pubsub, topic, store, action, data) do
    payload = %{
      store: store,
      action: action,
      data: data
    }

    Phoenix.PubSub.broadcast(pubsub, topic, {:store_sync, payload})
  end

  # =============================================================================
  # Presence Helpers
  # =============================================================================

  @doc """
  Track a user's presence in a topic.
  """
  def track_presence(presence_module, topic, user, meta \\ %{}) do
    meta = Map.merge(meta, %{
      online_at: System.system_time(:second),
      user_id: user.id,
      user_name: Map.get(user, :name, Map.get(user, :email, "Anonymous"))
    })

    presence_module.track(self(), topic, user.id, meta)
  end

  @doc """
  List all users present in a topic.
  """
  def list_presence(presence_module, topic) do
    presence_module.list(topic)
    |> Enum.map(fn {user_id, %{metas: [meta | _]}} ->
      Map.put(meta, :id, user_id)
    end)
  end

  @doc """
  Update a user's presence metadata.
  """
  def update_presence(presence_module, topic, user, meta) do
    presence_module.update(self(), topic, user.id, fn existing ->
      Map.merge(existing, meta)
    end)
  end

  @doc """
  Pushes presence state to Svelte.

  Call this in handle_info for presence_diff events.
  """
  def push_presence(socket, topic, presence_module) do
    users = list_presence(presence_module, topic)

    Phoenix.LiveView.push_event(socket, "presence:sync", %{
      topic: topic,
      users: users
    })
  end

  # =============================================================================
  # Optimistic Update Reconciliation
  # =============================================================================

  @doc """
  Reconciles an optimistic update with server state.

  When a client makes an optimistic update, it assigns a temporary ID.
  When the server confirms, this function tells the client to replace
  the temp ID with the real one.

  ## Examples

      def handle_event("create_todo", %{"temp_id" => temp_id, "text" => text}, socket) do
        case create_todo(text) do
          {:ok, todo} ->
            # Tell client to reconcile temp with real
            {:noreply, reconcile_optimistic(socket, "todos", temp_id, todo)}

          {:error, _} ->
            # Tell client to rollback
            {:noreply, rollback_optimistic(socket, "todos", temp_id)}
        end
      end
  """
  def reconcile_optimistic(socket, store, temp_id, real_item) do
    Phoenix.LiveView.push_event(socket, "store:reconcile", %{
      store: store,
      temp_id: temp_id,
      item: real_item
    })
  end

  @doc """
  Rolls back an optimistic update.
  """
  def rollback_optimistic(socket, store, temp_id, reason \\ nil) do
    Phoenix.LiveView.push_event(socket, "store:rollback", %{
      store: store,
      temp_id: temp_id,
      reason: reason
    })
  end

  @doc """
  Broadcasts an item change to all clients with optimistic reconciliation.

  Use this when you want all clients (including the one that made the change)
  to receive the update, while properly reconciling optimistic updates.
  """
  def broadcast_with_reconcile(pubsub, topic, store, action, item, opts \\ []) do
    temp_id = Keyword.get(opts, :temp_id)
    originator = Keyword.get(opts, :from)

    payload = %{
      store: store,
      action: action,
      item: item,
      temp_id: temp_id,
      originator: originator
    }

    Phoenix.PubSub.broadcast(pubsub, topic, {:store_sync_reconcile, payload})
  end
end
