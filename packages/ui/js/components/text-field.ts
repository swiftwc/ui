import { type TextFieldCommitDetail } from '../events'
import { I18n } from '../i18n'
import { CleanupRegistry } from '../internal/class/cleanup-registry'
import { FormAssociatedBase, getInternals, makeSlotchangeHandler } from '../internal/class/form-associated-base'
import { $, compareBigDecimals, kebabCase, onoff, set } from '../internal/utils'

const keyboardTypes = ['decimal-pad', 'number-pad', 'default'] as const
export type KeyboardType = (typeof keyboardTypes)[number] // 'decimal-pad' | 'number-pad' | 'default'

/**
 * @slot label
 * @slot validity-options
 */
export class TextField extends FormAssociatedBase {
  static get observedAttributes() {
    return [
      'prompt',
      'minimum',
      'maximum',
      'min-length',
      'max-length',
      'label',
      'name',
      'text',
      'text-input-autocapitalization',
      'disable-autocorrection',
      'keyboard-type',
      'required',
      'disabled',
    ]
  }

  static #template: DocumentFragment

  static get template() {
    return (this.#template ??= $(
      String.raw`
    <label part="root text-field-stack">
    <div part="root text-field-label-stack">
      <slot name="label"></slot>
    </div>
    <div part="root text-field-input-stack">
      <input type="text" part="root input text-field-form-input">
    </div>
    <slot name="validity-options" hidden></slot>
  </label>`,
      ''
    ))
  }

  #shadowRoot

  // #internals: ElementInternals

  #customValidity: string = ''

  #validitiesSlot?: HTMLSlotElement

  #input?: HTMLInputElement

  get #internals(): ElementInternals {
    return getInternals(this)
  }

  constructor() {
    super()

    this.#shadowRoot = this.attachShadow({ mode: 'closed' })

    this.#shadowRoot.appendChild(document.importNode((this.constructor as typeof TextField).template, true))

    this.#validitiesSlot = this.#shadowRoot.querySelector<HTMLSlotElement>('slot[name=validity-options]') ?? undefined

    CleanupRegistry.unregister(this, 'validities')
    CleanupRegistry.register(this, onoff(makeSlotchangeHandler(this), this.#validitiesSlot).on(), 'validities')

    this.#input = this.#shadowRoot.querySelector('input') ?? undefined

    CleanupRegistry.register(this, onoff([{ types: 'focusin', listener: this.#handleFocusin }], this).on())

    CleanupRegistry.register(
      this,
      onoff(
        [
          { types: 'blur', listener: this.#handleInputBlur },
          { types: 'input', listener: this.#handleInputInput },
          { types: 'beforeinput', listener: this.#handleInputBeforeinput as EventListener },
          { types: 'paste', listener: this.#handleInputPaste as EventListener },
        ],
        this.#input
      ).on()
    )

    CleanupRegistry.register(
      this,
      onoff(
        'change',
        () => {
          this.text = this.text
        },
        I18n.on
      ).on()
    )
  }

  connectedCallback() {
    super.connectedCallback()

    // finally
    if (!this.hasAttribute('text')) return

    this.text = this.getAttribute('text') ?? '' // this.#input.value = this.getAttribute('text') ?? ''

    this.#sendValueToForm(false)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    console.debug(`${TextField.name} ⚡️ attr-change [${name}] ("${oldValue}" → "${newValue}")`)

    switch (name) {
      case 'keyboard-type':
        switch (newValue) {
          case 'decimal-pad':
            this.#input?.setAttribute('inputmode', 'decimal')

            break
          case 'number-pad':
            this.#input?.setAttribute('inputmode', 'numeric')

            break
          case 'default':
          default:
            this.#input?.removeAttribute('inputmode')

            break
        }

        this.#sendValueToForm()

        break
      case 'text-input-autocapitalization':
        switch (newValue) {
          case 'never':
            this.#input?.setAttribute('autocapitalize', 'off')

            break
          case 'characters':
            this.#input?.setAttribute('autocapitalize', newValue)

            break
          case 'words':
            this.#input?.setAttribute('autocapitalize', newValue)

            break
          default:
          case 'sentences':
            this.#input?.setAttribute('autocapitalize', 'on')

            break
        }

        break
      case 'disable-autocorrection':
        if ('' === newValue)
          for (const [k, v] of [
            ['autocomplete', 'off'],
            ['autocorrect', 'off'],
            ['spellcheck', 'false'],
          ])
            this.#input?.setAttribute(k, v)
        else for (const k of ['autocomplete', 'autocorrect', 'spellcheck']) this.#input?.removeAttribute(k)

        break
      case 'text':
        // if (this.#input) this.#input.value = newValue ?? ''
        this.text = newValue ?? ''

        break
      case 'required':
        this.#input?.setAttribute(name, newValue ?? '') // else this.#input?.removeAttribute(name)
        this.#sendValueToForm()

        break
      case 'name':
      case 'minimum':
      case 'maximum':
        this.#sendValueToForm()

        break
      case 'prompt':
        this.#input?.setAttribute('placeholder', newValue ?? '') // else this.#input?.removeAttribute(name)

        break
      case 'min-length':
        this.#input?.setAttribute('minlength', newValue ?? '')
        this.#sendValueToForm()

        break
      case 'max-length':
        this.#input?.setAttribute('maxlength', newValue ?? '')
        this.#sendValueToForm()

        break
      case 'label':
        let label = this.querySelector(':scope>[slot=label]')
        if (newValue) {
          label ??= this.appendChild($(`<span slot="label" foreground="secondary"></span>`))
          label.textContent = newValue
        } else label?.remove()

        this.#sendValueToForm()

        break
      case 'disabled':
        for (const el of this.#shadowRoot.querySelectorAll('input')) el.toggleAttribute('disabled', !newValue)

        break
    }

    // render pattern
    switch (this.keyboardType) {
      case 'decimal-pad':
        const allowedSignsRegex2 = String.raw`[+\-]?|[+\-]?(\d+([.,]\d*)?|[.,]\d*)`, // allow single '+' or '-', then allow only one ',' or '.' and finally only digits
          digitsDecimalsOnlyRegex = String.raw`(\d+([.,]\d*)?|[.,]\d*)?` // allow only one ',' or '.' and finally only digits

        this.#input?.setAttribute('pattern', this.negativeNumbersAllowed ? allowedSignsRegex2 : digitsDecimalsOnlyRegex)

        break
      case 'number-pad':
        const allowedSignsRegex = String.raw`([+\-]|\d+|[+\-]\d+)?`, // allow single '+' or '-', then allow only digits
          digitsOnlyRegex = String.raw`\d*` // allow only digits

        this.#input?.setAttribute('pattern', this.negativeNumbersAllowed ? allowedSignsRegex : digitsOnlyRegex)

        break
      default:
        this.#input?.removeAttribute('pattern')

        break
    }
  }

  get keyboardType(): KeyboardType {
    return (keyboardTypes as readonly string[]).includes(this.getAttribute('keyboard-type') ?? '')
      ? (this.getAttribute('keyboard-type') as (typeof keyboardTypes)[number])
      : 'default'
  }

  get text() {
    return this.#input?.value ?? ''
  }

  set text(v) {
    if (!this.#input) return

    const nv = this.#patternTest(v) ? v : ''

    set(this.#input, 'value', nv)

    // this.text AND this.value have NOW been updated to new values
    // if user is NOT interacting replace new-text/input.value with the formatted version of the new-text/input.value!
    if (document.activeElement !== this && 0 < this.#input.value.length) {
      const finalText = this.value.replace(/[.,]/g, I18n.decimalSeparator)

      set(this.#input, 'value', finalText) // if (this.text !== finalText) this.#input.value = finalText
    }
  }

  #handleFocusin = (evt: Event) => {
    console.debug(`${TextField.name} ⚡️ ${evt?.type}`)

    if (evt.target === this) this.#input?.focus()
  }

  #sendValueToForm = (dispatchEvent: boolean = true) => {
    // input.value has already been updated/synced !!
    if (this.matches(':disabled')) return this.setValidity({})

    // if (this.hasAttribute('required')) {
    if (this.#input?.matches(':invalid')) {
      this.setValidity(this.#input?.validity, this.#input?.validationMessage)
    } else if (['number-pad', 'decimal-pad'].includes(this.keyboardType) && (this.hasAttribute('minimum') || this.hasAttribute('maximum'))) {
      const underflow = compareBigDecimals(this.value, this.getAttribute('minimum') ?? '-Infinity'),
        overflow = compareBigDecimals(this.value, this.getAttribute('maximum') ?? 'Infinity')

      if (0 > underflow) this.setValidity({ rangeUnderflow: true })
      else if (0 < overflow) this.setValidity({ rangeOverflow: true })
      else this.setValidity({})
    } else {
      this.setValidity({})
    }

    const entries = new FormData()

    entries.append(this.name, this.text)

    this.#internals.setFormValue(entries)

    if (dispatchEvent) this.dispatchEvent(new CustomEvent<TextFieldCommitDetail>('commit', { detail: { text: this.text }, bubbles: true, composed: true }))
  }

  #handleInputPaste = (evt: ClipboardEvent) => {
    console.debug(`${TextField.name} ⚡️ ${evt?.type}`)

    const input = evt.target as HTMLInputElement | null
    if (!input) return

    evt.preventDefault()

    const data = this.#identity(evt.clipboardData?.getData('text') ?? '') // number is now sanitized but contains edge cases like '+' and also global one separator that could be wither dot or decimal.

    if (0 === data.length) return this.shake() //.then(this.reportValidity) // nothing to paste

    const start = input.selectionStart ?? 0,
      end = input.selectionEnd ?? 0,
      before = input.value.slice(0, start),
      after = input.value.slice(end),
      newText = `${before}${data}${after}`

    if (-1 < input.maxLength && input.maxLength < newText.length) return this.shake() //.then(this.reportValidity) // exceeding maxlength

    input.value = newText

    const newCaret = start + data.length
    input.setSelectionRange(newCaret, newCaret) // move caret after inserted char

    this.#sendValueToForm() // input.dispatchEvent(new InputEvent('input', { bubbles: true })) // Manually trigger input event so listeners react
  }

  // NOTE: identity MUST always pass beforeinput checks
  #identity = (str: string) => {
    // 'ab-1.2.3.4x yz ' // "-1.234"
    // '++12..34  ' // "+12.34"
    // '-+5.6.7.8 ' // "-5.678"
    // '  -+5.6,7.8  ' // "-5.678"
    // 'foo123bar  ' // "123"
    // '.12.3  ' // ".123"
    // '    http://localhost:5173/input.html' // "5173."
    // '    http://localhost:51,73/input.html' // "51,73"
    // '    +- 0000.' // "+0000."
    // '    +' // "+"
    // '    +0000234' // "+0000234"
    // '    +-1.2.3.4x yz ' // "+1.234"
    let seenSign = false

    switch (this.keyboardType) {
      case 'decimal-pad': // allow only ^+- and then only one instance of ., finally remove all non digit rest appearances
        let seenDot = false
        return [...`${str.trim()}`].reduce((acc, ch, i) => {
          // +- signs are allowed
          if (this.negativeNumbersAllowed)
            if (!seenSign && (ch === '+' || ch === '-')) {
              seenSign = true
              return `${acc}${ch}`
            }
          if ((ch === '.' || ch === ',') && !seenDot) {
            seenDot = true
            return `${acc}${ch}`
          }
          if (/\d/.test(ch)) return `${acc}${ch}`
          return acc // skip everything else
        }, '')

      case 'number-pad': // allow only ^+- finally remove all non digit rest appearances
        return [...`${str.trim()}`].reduce((acc, ch, i) => {
          // +- signs are allowed
          if (this.negativeNumbersAllowed)
            if (!seenSign && (ch === '+' || ch === '-')) {
              seenSign = true
              return `${acc}${ch}`
            }
          if (/\d/.test(ch)) return `${acc}${ch}`
          return acc // skip everything else
        }, '')

      default:
        return `${str}`
    }
  }

  #patternTest = (str: string) => {
    switch (this.keyboardType) {
      case 'decimal-pad':
        const allowedSignsRegex2 = /^[+-]?$|^[+-]?(\d+([.,]\d*)?|[.,]\d*)$/, // allow single '+' or '-', then allow only one ',' or '.' and finally only digits
          digitsDecimalsOnlyRegex = /^(\d+([.,]\d*)?|[.,]\d*)?$/ // allow only one ',' or '.' and finally only digits

        return (this.negativeNumbersAllowed ? allowedSignsRegex2 : digitsDecimalsOnlyRegex).test(str)
      //   // console.log(isValidDecimal(""));       // true
      //   // console.log(isValidDecimal("+"));      // true
      //   // console.log(isValidDecimal("-"));      // true
      //   // console.log(isValidDecimal("123"));    // true
      //   // console.log(isValidDecimal("+123"));   // true
      //   // console.log(isValidDecimal("-456"));   // true
      //   // console.log(isValidDecimal("12.34"));  // true
      //   // console.log(isValidDecimal("-0,56"));  // true
      //   // console.log(isValidDecimal(".78"));    // true
      //   // console.log(isValidDecimal(",9"));     // true
      //   // console.log(isValidDecimal("12.3.4")); // false
      //   // console.log(isValidDecimal("12,3,4")); // false
      //   // console.log(isValidDecimal("12-3"));   // false
      //   // console.log(isValidDecimal("12a"));    // false
      case 'number-pad':
        const allowedSignsRegex = /^([+-]|\d+|[+-]\d+)?$/, // allow single '+' or '-', then allow only digits
          digitsOnlyRegex = /^(\d+)?$/ // allow only digits

        return (this.negativeNumbersAllowed ? allowedSignsRegex : digitsOnlyRegex).test(str)
      //   // console.log(isValidInteger(""));      // true
      //   // console.log(isValidInteger("+"));     // true
      //   // console.log(isValidInteger("-"));     // true
      //   // console.log(isValidInteger("123"));   // true
      //   // console.log(isValidInteger("+123"));  // true
      //   // console.log(isValidInteger("-456"));  // true
      //   // console.log(isValidInteger("12-3"));  // false
      //   // console.log(isValidInteger("++123")); // false
      //   // console.log(isValidInteger("123a"));  // false
      default:
        return true
    }
  }

  #handleInputBeforeinput = (evt: InputEvent) => {
    console.debug(`${TextField.name} ⚡️ ${evt?.type}`)

    const input = evt.target as HTMLInputElement | null
    if (!input) return

    if ('insertText' !== evt.inputType) return

    const data = evt.data ?? ''

    if (-1 < input.maxLength && 0 === data.length) {
      evt.preventDefault()

      return this.shake() //.then(this.reportValidity)
    } // nothing to add

    const start = input.selectionStart ?? 0,
      end = input.selectionEnd ?? 0,
      before = this.text.slice(0, start),
      after = this.text.slice(end),
      newText = `${before}${data}${after}`

    if (0 === newText.length) return

    switch (input.getAttribute('inputmode')) {
      case 'decimal':
        // const allowedSignsRegex2 = /^[+-]?$|^[+-]?(\d+([.,]\d*)?|[.,]\d*)$/, // allow single '+' or '-', then allow only one ',' or '.' and finally only digits
        //   digitsDecimalsOnlyRegex = /^(\d+([.,]\d*)?|[.,]\d*)?$/ // allow only one ',' or '.' and finally only digits

        // if ((this.min < 0 ? allowedSignsRegex2 : digitsDecimalsOnlyRegex).test(newText)) break
        if (this.#patternTest(newText)) break

        evt.preventDefault()

        return this.shake() //.then(this.reportValidity)

      case 'numeric':
        // const allowedSignsRegex = /^([+-]|\d+|[+-]\d+)?$/, // allow single '+' or '-', then allow only digits
        //   digitsOnlyRegex = /^(\d+)?$/ // allow only digits

        // if ((this.min < 0 ? allowedSignsRegex : digitsOnlyRegex).test(newText)) break
        if (this.#patternTest(newText)) break

        evt.preventDefault()

        return this.shake() //.then(this.reportValidity)

      // this.setValidity(prevValidity, prevValiditationMessage) // restore
    }
  }

  #handleInputBlur = (evt: Event) => {
    console.debug(`${TextField.name} ⚡️ ${evt?.type}`)

    const input = evt.target as HTMLInputElement | null
    if (!input) return

    if (0 === input.value.length) return

    const finalText = this.value.replace(/[.,]/g, I18n.decimalSeparator)

    if (!set(input, 'value', finalText)) return

    this.#sendValueToForm()
  }

  #handleInputInput = (evt: Event) => {
    console.debug(`${TextField.name} ⚡️ ${evt?.type}`)

    this.#sendValueToForm()
  }

  // Optional: form participation properties
  get name() {
    return this.getAttribute('name') ?? this.getAttribute('label') ?? this.querySelector(':scope>[slot=label]')?.textContent ?? ''
  }

  get value() {
    // text allows special edge cases, like '-.' or '+' and generally might be invalid number. It might also be localized and not US based.
    // here we make sure it is number-like, to be used in number operations.
    switch (this.keyboardType) {
      case 'decimal-pad':
      case 'number-pad':
        if ('string' !== typeof this.text) return '0'

        const value = this.text.replace(/[.,]/g, '.')

        // Capture optional leading sign
        const sign = value.startsWith('-') ? '-' : ''

        // Strip sign for processing
        let s = value.replace(/^[+-]/, '')

        // Split on dot (take only first two parts in case of multiple dots — though
        // your input guarantees one, this is defensive)
        const [intPart = '', fracPart = ''] = s.split('.'),
          hasDot = s.includes('.')

        // Remove leading zeros from integer part, keep at least '0'
        const cleanInt = intPart.replace(/^0+/, '') || '0'

        // Remove trailing zeros from fractional part
        const cleanFrac = fracPart.replace(/0+$/, '')

        // Build result
        const result = hasDot && cleanFrac.length > 0 ? `${sign}${cleanInt}.${cleanFrac}` : `${sign}${cleanInt}`

        return result.replace(/^-0(\.0+)?$/, '0')

      default:
        return this.text
    }
  }

  get valueAsNumber() {
    switch (this.keyboardType) {
      case 'decimal-pad':
      case 'number-pad':
        return Number(this.value)

      default:
        return ''
    }
  }

  get negativeNumbersAllowed(): boolean {
    // switch (this.keyboardType) {
    //   case 'decimal-pad':
    //   case 'number-pad':
    const min = this.getAttribute('minimum') ?? '-Infinity',
      max = this.getAttribute('maximum') ?? 'Infinity'

    return compareBigDecimals('0', min) >= 0 && compareBigDecimals('0', max) <= 0

    //   default:
    //     return false
    // }
  }

  setValidity = (flags?: ValidityStateFlags, message?: string, anchor?: HTMLElement) => {
    // let msg

    // if (message)
    for (const k in flags) {
      const key = k as keyof ValidityStateFlags // ✅ type-safe cast
      if (true !== flags[key]) continue

      for (const el of this.#validitiesSlot?.assignedElements({ flatten: true }) ?? []) {
        if (!el.matches('option')) continue

        const option = el as HTMLOptionElement

        if (`${kebabCase(key)}` === option.value) {
          message = option.label
          break
        } else if (`${kebabCase(key)}:${message}` === option.value) {
          message = option.label
          break
        }
      }
    }

    if (!message)
      for (const k in flags) {
        const key = k as keyof ValidityStateFlags // ✅ type-safe cast
        if (true !== flags[key]) continue

        message = kebabCase(key)

        break
      }

    console.debug(`${TextField.name} ⚡️ validity-change`)

    return this.#internals.setValidity(flags, this.#customValidity || message, anchor ?? this.#input)
  }
  setCustomValidity = (message: string) => {
    this.#customValidity = message

    if (this.#customValidity) this.#internals.setValidity({ ...this.#internals.validity, customError: true }, message)
    else this.#sendValueToForm(false)
  }
  formAssociatedCallback = (form: HTMLFormElement) => {
    this.#sendValueToForm()
  }
  formDisabledCallback = (disabled: boolean) => {
    for (const el of this.#shadowRoot.querySelectorAll('input')) el.toggleAttribute('disabled', !disabled)
  }
  formResetCallback = () => {
    this.text = ''

    this.#sendValueToForm()
  }
}
