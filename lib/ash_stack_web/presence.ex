defmodule AshStackWeb.Presence do
  @moduledoc """
  Phoenix Presence for real-time user tracking.

  Provides:
  - Online user tracking per topic/room
  - Typing indicators
  - User activity status

  ## Usage in LiveView

      defmodule MyAppWeb.ChatLive do
        use AshStackWeb.RealtimeHelpers, presence: AshStackWeb.Presence

        def mount(%{"room_id" => room_id}, _session, socket) do
          if connected?(socket) do
            topic = "room:#{room_id}"
            subscribe(topic)
            track_presence(topic, socket.assigns.current_user)

            # Subscribe to presence changes
            AshStackWeb.Presence.subscribe(topic)
          end

          {:ok, assign(socket, room_id: room_id)}
        end

        # Handle presence changes
        def handle_info(%{event: "presence_diff"} = diff, socket) do
          {:noreply, push_presence(socket, "room:#{socket.assigns.room_id}", AshStackWeb.Presence)}
        end
      end

  ## Typing Indicators

      # Start typing
      update_presence(topic, user, %{typing: true})

      # Stop typing (with debounce on client)
      update_presence(topic, user, %{typing: false})
  """

  use Phoenix.Presence,
    otp_app: :ash_stack,
    pubsub_server: AshStack.PubSub

  @doc """
  Subscribe to presence changes for a topic.
  """
  def subscribe(topic) do
    Phoenix.PubSub.subscribe(AshStack.PubSub, "presence:#{topic}")
  end

  @doc """
  Get formatted list of online users for a topic.

  Returns a list of maps with user info and metadata.
  """
  def list_users(topic) do
    list(topic)
    |> Enum.map(fn {user_id, %{metas: metas}} ->
      # Get most recent meta (in case of multiple connections)
      meta = List.first(metas)

      %{
        id: user_id,
        name: meta[:user_name],
        avatar: meta[:avatar],
        online_at: meta[:online_at],
        typing: meta[:typing] || false,
        status: meta[:status] || "online"
      }
    end)
  end

  @doc """
  Get users who are currently typing.
  """
  def typing_users(topic) do
    list_users(topic)
    |> Enum.filter(& &1.typing)
  end

  @doc """
  Check if a specific user is online.
  """
  def online?(topic, user_id) do
    case get_by_key(topic, user_id) do
      [] -> false
      _ -> true
    end
  end

  @doc """
  Get count of online users.
  """
  def count(topic) do
    list(topic) |> map_size()
  end

  # =============================================================================
  # Presence Callbacks
  # =============================================================================

  @doc """
  Called when presence state should be fetched.
  """
  def fetch(_topic, presences) do
    presences
  end

  @doc """
  Handle presence join - broadcast to presence topic.
  """
  def handle_metas(topic, %{joins: joins, leaves: leaves}, presences, state) do
    for {user_id, presence} <- joins do
      Phoenix.PubSub.broadcast(
        AshStack.PubSub,
        "presence:#{topic}",
        %{event: "presence_join", user_id: user_id, meta: hd(presence.metas)}
      )
    end

    for {user_id, _presence} <- leaves do
      Phoenix.PubSub.broadcast(
        AshStack.PubSub,
        "presence:#{topic}",
        %{event: "presence_leave", user_id: user_id}
      )
    end

    {:ok, state}
  end
end
