defmodule AshStackWeb.AshFormHelpers do
  @moduledoc """
  Helpers for integrating Ash resources with Svelte form components.

  Provides utilities to:
  - Convert Ash forms to Svelte-compatible props
  - Handle form submission with proper error handling
  - Manage optimistic updates with server reconciliation

  ## Usage in LiveView

      defmodule MyAppWeb.UserLive.Edit do
        use MyAppWeb, :live_view
        import AshStackWeb.AshFormHelpers

        def mount(%{"id" => id}, _session, socket) do
          user = MyApp.Accounts.get_user!(id)
          form = user |> AshPhoenix.Form.for_update(:update) |> to_form()

          {:ok, assign(socket, form: form, user: user)}
        end

        def handle_event("validate", %{"form" => params}, socket) do
          form = AshPhoenix.Form.validate(socket.assigns.form.source, params)
          {:noreply, assign(socket, form: to_form(form))}
        end

        def handle_event("save", %{"form" => params}, socket) do
          case submit_form(socket.assigns.form.source, params) do
            {:ok, user} ->
              {:noreply,
               socket
               |> put_flash(:success, "User updated!")
               |> push_navigate(to: ~p"/users/\#{user.id}")}

            {:error, form} ->
              {:noreply, assign(socket, form: to_form(form))}
          end
        end
      end
  """

  alias AshPhoenix.Form

  @doc """
  Submits an Ash form and returns {:ok, result} or {:error, form}.

  Handles all Ash error types and converts them to form errors.

  ## Examples

      case submit_form(form, params) do
        {:ok, record} -> handle_success(record)
        {:error, form} -> assign(socket, form: to_form(form))
      end
  """
  def submit_form(%Form{} = form, params \\ %{}) do
    form
    |> Form.validate(params)
    |> Form.submit()
    |> case do
      {:ok, result} -> {:ok, result}
      {:error, form} -> {:error, form}
    end
  end

  @doc """
  Converts an Ash form to props suitable for Svelte components.

  Returns a map with:
  - `fields` - Map of field name to field props (value, errors, etc.)
  - `valid` - Whether the form is valid
  - `submitting` - Whether form is being submitted (always false, managed client-side)
  - `errors` - Map of field names to error messages

  ## Examples

      props = to_svelte_props(form)
      # => %{
      #   fields: %{
      #     "name" => %{value: "John", error: nil, ...},
      #     "email" => %{value: "", error: "is required", ...}
      #   },
      #   valid: false,
      #   errors: %{"email" => "is required"}
      # }
  """
  def to_svelte_props(%Form{} = form) do
    phoenix_form = Phoenix.Component.to_form(form)

    fields =
      form.source.attributes
      |> Enum.filter(&Map.get(&1, :public?, true))
      |> Enum.map(fn attr ->
        field_name = Atom.to_string(attr.name)
        field = phoenix_form[attr.name]

        field_props = %{
          name: field.name,
          id: field.id,
          value: field.value,
          type: ash_type_to_input_type(attr.type),
          error: field_error(field),
          required: !attr.allow_nil?,
          constraints: Map.get(attr, :constraints, %{})
        }

        {field_name, field_props}
      end)
      |> Map.new()

    errors =
      phoenix_form.errors
      |> Enum.map(fn {field, {msg, opts}} ->
        {Atom.to_string(field), translate_error({msg, opts})}
      end)
      |> Map.new()

    %{
      id: phoenix_form.id,
      fields: fields,
      valid: form.source.valid?,
      submitting: false,
      errors: errors
    }
  end

  @doc """
  Extracts select options from an Ash attribute's constraints.

  Useful for enum types or attributes with `one_of` constraints.

  ## Examples

      options = attribute_options(form, :status)
      # => [%{value: "active", label: "Active"}, %{value: "inactive", label: "Inactive"}]
  """
  def attribute_options(%Form{} = form, field) when is_atom(field) do
    attr = Enum.find(form.source.attributes, &(&1.name == field))

    cond do
      # Ash enum type
      attr && function_exported?(attr.type, :values, 0) ->
        attr.type.values()
        |> Enum.map(fn value ->
          %{value: to_string(value), label: humanize(value)}
        end)

      # one_of constraint
      attr && Map.get(attr.constraints, :one_of) ->
        attr.constraints.one_of
        |> Enum.map(fn value ->
          %{value: to_string(value), label: humanize(value)}
        end)

      true ->
        []
    end
  end

  @doc """
  Creates form data for a new Ash resource.

  ## Examples

      form = new_form(MyApp.Accounts.User, :create)
      # Use in assigns: assign(socket, form: form)
  """
  def new_form(resource, action, opts \\ []) do
    resource
    |> Form.for_create(action, opts)
    |> Phoenix.Component.to_form()
  end

  @doc """
  Creates form data for editing an existing Ash resource.

  ## Examples

      form = edit_form(user, :update)
  """
  def edit_form(record, action, opts \\ []) do
    record
    |> Form.for_update(action, opts)
    |> Phoenix.Component.to_form()
  end

  @doc """
  Creates form data for destroying an Ash resource.

  ## Examples

      form = delete_form(user, :destroy)
  """
  def delete_form(record, action, opts \\ []) do
    record
    |> Form.for_destroy(action, opts)
    |> Phoenix.Component.to_form()
  end

  # =============================================================================
  # Private Helpers
  # =============================================================================

  defp field_error(%{errors: errors, field: field}) do
    case Keyword.get_values(errors, field) do
      [] -> nil
      [{msg, opts} | _] -> translate_error({msg, opts})
    end
  end

  defp translate_error({msg, opts}) do
    Enum.reduce(opts, msg, fn {key, value}, acc ->
      String.replace(acc, "%{#{key}}", fn _ -> to_string(value) end)
    end)
  end

  defp ash_type_to_input_type(type) do
    case type do
      Ash.Type.String -> "text"
      Ash.Type.Integer -> "number"
      Ash.Type.Float -> "number"
      Ash.Type.Decimal -> "number"
      Ash.Type.Boolean -> "checkbox"
      Ash.Type.Date -> "date"
      Ash.Type.DateTime -> "datetime-local"
      Ash.Type.Time -> "time"
      Ash.Type.UUID -> "text"
      Ash.Type.Binary -> "file"
      _ -> "text"
    end
  end

  defp humanize(atom) when is_atom(atom) do
    atom
    |> Atom.to_string()
    |> humanize()
  end

  defp humanize(string) when is_binary(string) do
    string
    |> String.replace("_", " ")
    |> String.split()
    |> Enum.map(&String.capitalize/1)
    |> Enum.join(" ")
  end
end
