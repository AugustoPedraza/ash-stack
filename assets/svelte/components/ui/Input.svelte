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

  // Size classes using design tokens
  const sizes = {
    sm: 'h-[var(--input-sm)] px-3 text-sm',
    md: 'h-[var(--input-md)] px-4 text-sm',
    lg: 'h-[var(--input-lg)] px-4 text-base'
  };

  const baseClasses = `
    w-full
    bg-surface text-text
    border rounded-[var(--radius-md)]
    transition-[border-color,box-shadow]
    duration-[var(--duration-fast)]
    placeholder:text-text-muted
    focus:outline-none focus:border-border-focus focus:ring-1 focus:ring-border-focus
    disabled:bg-surface-sunken disabled:text-text-disabled disabled:cursor-not-allowed
    read-only:bg-surface-sunken
  `;

  const stateClasses = invalid
    ? 'border-error focus:border-error focus:ring-error'
    : 'border-border';
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
