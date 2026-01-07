<script>
  /**
   * Input Component
   * Text input with states using design tokens.
   *
   * @prop {'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url'} [type='text']
   * @prop {'sm' | 'md' | 'lg'} [size='md']
   * @prop {string} [value='']
   * @prop {string} [placeholder='']
   * @prop {boolean} [invalid=false] - Error state
   * @prop {boolean} [disabled=false]
   * @prop {boolean} [readonly=false]
   * @prop {string} [id] - For label association
   * @prop {string} [name]
   * @prop {string} [autocomplete]
   * @prop {string} [inputmode] - Virtual keyboard hint (numeric, tel, email, etc.)
   * @prop {number} [maxlength] - Max input length
   * @prop {boolean} [textCenter=false] - Center-align text (for OTP inputs)
   * @prop {(e: Event) => void} [oninput]
   * @prop {(e: Event) => void} [onblur]
   * @prop {(e: Event) => void} [onfocus]
   * @prop {(e: KeyboardEvent) => void} [onkeydown]
   */

  let {
    type = 'text',
    size = 'md',
    value = $bindable(''),
    placeholder = '',
    invalid = false,
    disabled = false,
    readonly = false,
    id = undefined,
    name = undefined,
    autocomplete = undefined,
    inputmode = undefined,
    maxlength = undefined,
    textCenter = false,
    oninput = undefined,
    onblur = undefined,
    onfocus = undefined,
    onkeydown = undefined
  } = $props();

  // Size classes using 8px grid
  const sizes = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-4 text-base'
  };

  const baseClasses = `
    w-full
    bg-background text-foreground
    border rounded-md
    transition-colors duration-150
    placeholder:text-muted-foreground
    focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
    disabled:bg-muted disabled:text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed
    read-only:bg-muted
  `;

  // Use $derived to fix state_referenced_locally warning
  const stateClasses = $derived(invalid
    ? 'border-destructive focus:ring-destructive'
    : 'border-input');
</script>

<input
  {type}
  {id}
  {name}
  {placeholder}
  {disabled}
  {readonly}
  {autocomplete}
  {inputmode}
  {maxlength}
  bind:value
  class="{baseClasses} {sizes[size]} {stateClasses} {textCenter ? 'text-center' : ''}"
  aria-invalid={invalid}
  {oninput}
  {onblur}
  {onfocus}
  {onkeydown}
/>
