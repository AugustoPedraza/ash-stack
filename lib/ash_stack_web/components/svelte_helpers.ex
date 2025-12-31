defmodule AshStackWeb.SvelteHelpers do
  @moduledoc """
  Helper functions for using Svelte components in LiveView.

  ## Usage

  In your LiveView:

      use AshStackWeb, :live_view
      import AshStackWeb.SvelteHelpers

  Then in templates:

      <.svelte
        name="Button"
        variant="primary"
        size="lg"
        socket={@socket}
      >
        Click me
      </.svelte>

  ## With Ash Forms

      <.svelte_form for={@form} phx-submit="save">
        <.svelte_input field={@form[:name]} label="Name" />
        <.svelte_select field={@form[:role]} options={@roles} />
        <.svelte_submit>Save</.svelte_submit>
      </.svelte_form>
  """

  use Phoenix.Component
  import LiveSvelte

  # =============================================================================
  # Core Svelte Component Helper
  # =============================================================================

  @doc """
  Renders a Svelte component with simplified syntax.

  ## Examples

      <.svelte name="Button" variant="primary" socket={@socket}>
        Click me
      </.svelte>

      <.svelte name="Card" title="Welcome" socket={@socket}>
        <p>Content here</p>
      </.svelte>

  ## Options

  - `name` - The Svelte component name (required)
  - `socket` - The LiveView socket for events (required for interactive components)
  - All other attributes are passed as props
  """
  attr :name, :string, required: true
  attr :socket, :any, default: nil
  attr :class, :string, default: nil
  attr :rest, :global
  slot :inner_block

  def svelte(assigns) do
    # Build props from rest attributes
    props =
      assigns.rest
      |> Map.new()
      |> maybe_add_class(assigns.class)
      |> maybe_add_children(assigns.inner_block)

    assigns = assign(assigns, :props, props)

    ~H"""
    <.svelte
      name={@name}
      props={@props}
      socket={@socket}
    />
    """
  end

  defp maybe_add_class(props, nil), do: props
  defp maybe_add_class(props, class), do: Map.put(props, :class, class)

  defp maybe_add_children(props, []), do: props
  defp maybe_add_children(props, inner_block) do
    # For slot content, we'll pass it as a special prop
    # The Svelte component should handle this
    Map.put(props, :children, render_slot(inner_block))
  end

  # =============================================================================
  # Form Helpers
  # =============================================================================

  @doc """
  Renders a Svelte-powered form that integrates with AshPhoenix.Form.

  Automatically handles:
  - Form state management
  - Validation errors
  - Submitting state
  - Flash → Toast conversion

  ## Examples

      <.svelte_form for={@form} phx-submit="save">
        <.svelte_input field={@form[:email]} label="Email" />
        <.svelte_submit>Save</.svelte_submit>
      </.svelte_form>
  """
  attr :for, :any, required: true, doc: "The AshPhoenix.Form or Phoenix.HTML.Form"
  attr :rest, :global, include: ~w(phx-submit phx-change phx-trigger-action action method)
  slot :inner_block, required: true

  def svelte_form(assigns) do
    form = assigns.for
    form_id = form.id || "form-#{System.unique_integer([:positive])}"

    # Extract form metadata for Svelte
    form_props = %{
      id: form_id,
      valid: form_valid?(form),
      errors: form_errors(form),
      submitting: false
    }

    assigns =
      assigns
      |> assign(:form_id, form_id)
      |> assign(:form_props, form_props)

    ~H"""
    <.form for={@for} id={@form_id} {@rest}>
      <.svelte
        name="Form"
        props={@form_props}
        socket={nil}
      >
        <%= render_slot(@inner_block) %>
      </.svelte>
    </.form>
    """
  end

  @doc """
  Renders a Svelte Input component bound to a form field.

  ## Examples

      <.svelte_input field={@form[:email]} label="Email" />
      <.svelte_input field={@form[:password]} type="password" label="Password" />
  """
  attr :field, Phoenix.HTML.FormField, required: true
  attr :label, :string, default: nil
  attr :type, :string, default: "text"
  attr :rest, :global

  def svelte_input(assigns) do
    field = assigns.field
    error = field_error(field)

    props =
      %{
        name: field.name,
        id: field.id,
        value: field.value || "",
        type: assigns.type,
        invalid: error != nil
      }
      |> Map.merge(Map.new(assigns.rest))

    wrapper_props = %{
      label: assigns.label,
      error: error,
      name: field.name
    }

    assigns =
      assigns
      |> assign(:props, props)
      |> assign(:wrapper_props, wrapper_props)

    ~H"""
    <.svelte name="FormField" props={@wrapper_props} socket={nil}>
      <.svelte name="Input" props={@props} socket={nil} />
    </.svelte>
    """
  end

  @doc """
  Renders a Svelte Select component bound to a form field.

  ## Examples

      <.svelte_select
        field={@form[:role]}
        label="Role"
        options={[%{value: "admin", label: "Admin"}, %{value: "user", label: "User"}]}
      />
  """
  attr :field, Phoenix.HTML.FormField, required: true
  attr :label, :string, default: nil
  attr :options, :list, required: true
  attr :placeholder, :string, default: "Select..."
  attr :rest, :global

  def svelte_select(assigns) do
    field = assigns.field
    error = field_error(field)

    # Normalize options to expected format
    options = normalize_options(assigns.options)

    props =
      %{
        name: field.name,
        id: field.id,
        value: field.value || "",
        options: options,
        placeholder: assigns.placeholder,
        invalid: error != nil
      }
      |> Map.merge(Map.new(assigns.rest))

    wrapper_props = %{
      label: assigns.label,
      error: error,
      name: field.name
    }

    assigns =
      assigns
      |> assign(:props, props)
      |> assign(:wrapper_props, wrapper_props)

    ~H"""
    <.svelte name="FormField" props={@wrapper_props} socket={nil}>
      <.svelte name="Select" props={@props} socket={nil} />
    </.svelte>
    """
  end

  @doc """
  Renders a Svelte Textarea component bound to a form field.
  """
  attr :field, Phoenix.HTML.FormField, required: true
  attr :label, :string, default: nil
  attr :rows, :integer, default: 3
  attr :rest, :global

  def svelte_textarea(assigns) do
    field = assigns.field
    error = field_error(field)

    props =
      %{
        name: field.name,
        id: field.id,
        value: field.value || "",
        rows: assigns.rows,
        invalid: error != nil
      }
      |> Map.merge(Map.new(assigns.rest))

    wrapper_props = %{
      label: assigns.label,
      error: error,
      name: field.name
    }

    assigns =
      assigns
      |> assign(:props, props)
      |> assign(:wrapper_props, wrapper_props)

    ~H"""
    <.svelte name="FormField" props={@wrapper_props} socket={nil}>
      <.svelte name="Textarea" props={@props} socket={nil} />
    </.svelte>
    """
  end

  @doc """
  Renders a Svelte Checkbox component bound to a form field.
  """
  attr :field, Phoenix.HTML.FormField, required: true
  attr :label, :string, default: nil
  attr :description, :string, default: nil
  attr :rest, :global

  def svelte_checkbox(assigns) do
    field = assigns.field

    props =
      %{
        name: field.name,
        id: field.id,
        checked: field.value == true || field.value == "true",
        label: assigns.label,
        description: assigns.description
      }
      |> Map.merge(Map.new(assigns.rest))

    assigns = assign(assigns, :props, props)

    ~H"""
    <.svelte name="Checkbox" props={@props} socket={nil} />
    """
  end

  @doc """
  Renders a Svelte SubmitButton that auto-integrates with form state.
  """
  attr :variant, :string, default: "primary"
  attr :size, :string, default: "md"
  attr :rest, :global
  slot :inner_block, required: true

  def svelte_submit(assigns) do
    props =
      %{
        variant: assigns.variant,
        size: assigns.size
      }
      |> Map.merge(Map.new(assigns.rest))

    assigns = assign(assigns, :props, props)

    ~H"""
    <.svelte name="SubmitButton" props={@props} socket={nil}>
      <%= render_slot(@inner_block) %>
    </.svelte>
    """
  end

  # =============================================================================
  # Private Helpers
  # =============================================================================

  defp form_valid?(%{source: %Ash.Changeset{} = changeset}), do: changeset.valid?
  defp form_valid?(%{errors: errors}) when is_list(errors), do: errors == []
  defp form_valid?(_), do: true

  defp form_errors(%{errors: errors}) when is_list(errors) do
    errors
    |> Enum.map(fn {field, {msg, opts}} ->
      {field, translate_error({msg, opts})}
    end)
    |> Map.new()
  end
  defp form_errors(_), do: %{}

  defp field_error(%{errors: errors, field: field}) do
    case Keyword.get_values(errors, field) do
      [] -> nil
      [{msg, opts} | _] -> translate_error({msg, opts})
    end
  end
  defp field_error(_), do: nil

  defp translate_error({msg, opts}) do
    Enum.reduce(opts, msg, fn {key, value}, acc ->
      String.replace(acc, "%{#{key}}", fn _ -> to_string(value) end)
    end)
  end

  defp normalize_options(options) when is_list(options) do
    Enum.map(options, fn
      %{value: _, label: _} = opt -> opt
      {label, value} -> %{value: to_string(value), label: to_string(label)}
      value when is_binary(value) -> %{value: value, label: value}
      value when is_atom(value) -> %{value: Atom.to_string(value), label: Atom.to_string(value)}
    end)
  end
end
