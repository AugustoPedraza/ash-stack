defmodule AshStackWeb.LiveSvelteHelpers do
  @moduledoc """
  LiveView lifecycle helpers for Svelte integration.

  Provides:
  - Flash → Toast auto-conversion
  - Event helpers for Svelte ↔ LiveView communication
  - Presence integration utilities

  ## Setup

  Add to your LiveView:

      defmodule MyAppWeb.MyLive do
        use MyAppWeb, :live_view
        use AshStackWeb.LiveSvelteHelpers

        # Flash messages now auto-show as Toasts
        # Use push_toast/3 for manual toasts
      end

  ## In your app.js

      import { initLiveViewHooks } from "./svelte/lib/liveview"

      let liveSocket = new LiveSocket("/live", Socket, {
        hooks: {
          ...initLiveViewHooks()
        }
      })
  """

  defmacro __using__(_opts) do
    quote do
      import AshStackWeb.LiveSvelteHelpers

      # Intercept flash and convert to toast
      on_mount {AshStackWeb.LiveSvelteHelpers, :flash_to_toast}
    end
  end

  @doc """
  Mount hook that converts flash messages to toast events.

  Automatically attached when you `use AshStackWeb.LiveSvelteHelpers`.
  """
  def on_mount(:flash_to_toast, _params, _session, socket) do
    {:cont,
     Phoenix.LiveView.attach_hook(socket, :flash_to_toast, :handle_info, fn
       {:flash_to_toast, kind, message}, socket ->
         {:halt, push_toast(socket, kind, message)}

       _msg, socket ->
         {:cont, socket}
     end)}
  end

  @doc """
  Pushes a toast notification to the client.

  ## Examples

      socket
      |> push_toast(:success, "Changes saved!")
      |> push_toast(:error, "Something went wrong")
      |> push_toast(:info, "Processing...", duration: 0)  # Persistent
  """
  def push_toast(socket, kind, message, opts \\ []) do
    variant = kind_to_variant(kind)
    duration = Keyword.get(opts, :duration, 5000)
    action = Keyword.get(opts, :action, nil)

    payload = %{
      message: message,
      variant: variant,
      duration: duration,
      action: action
    }

    Phoenix.LiveView.push_event(socket, "toast", payload)
  end

  @doc """
  Pushes an event to a specific Svelte component.

  ## Examples

      # Push to component with id "user-list"
      push_to_svelte(socket, "user-list", "user:added", %{user: user})
  """
  def push_to_svelte(socket, component_id, event, payload \\ %{}) do
    Phoenix.LiveView.push_event(socket, "svelte:#{component_id}", %{
      event: event,
      payload: payload
    })
  end

  @doc """
  Pushes updated data to a Svelte store.

  ## Examples

      # Update a store named "users"
      push_store_update(socket, "users", users)
  """
  def push_store_update(socket, store_name, data) do
    Phoenix.LiveView.push_event(socket, "store:update", %{
      store: store_name,
      data: data
    })
  end

  @doc """
  Enhanced put_flash that also triggers toast.

  Use instead of Phoenix.LiveView.put_flash/3 to get both
  flash message and toast notification.
  """
  def put_flash_toast(socket, kind, message) do
    socket
    |> Phoenix.LiveView.put_flash(kind, message)
    |> push_toast(kind, message)
  end

  # =============================================================================
  # Event Handling Helpers
  # =============================================================================

  @doc """
  Macro for defining Svelte event handlers with less boilerplate.

  ## Examples

      # Instead of:
      def handle_event("svelte:user-list:delete", %{"id" => id}, socket) do
        ...
      end

      # You can use:
      handle_svelte_event "user-list", "delete" do
        %{"id" => id}, socket ->
          {:noreply, socket}
      end
  """
  defmacro handle_svelte_event(component, event, do: block) do
    event_name = "svelte:#{component}:#{event}"

    quote do
      def handle_event(unquote(event_name), unquote(block))
    end
  end

  # =============================================================================
  # Private Helpers
  # =============================================================================

  defp kind_to_variant(:success), do: "success"
  defp kind_to_variant(:error), do: "error"
  defp kind_to_variant(:warning), do: "warning"
  defp kind_to_variant(:info), do: "info"
  defp kind_to_variant(kind), do: to_string(kind)
end
