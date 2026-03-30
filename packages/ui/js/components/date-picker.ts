import { onoff, $, kebabCase } from '../internal/utils'
import { CleanupRegistry } from '../internal/class/cleanup-registry'
import { I18n } from '../i18n'
import { MutationObserverSingleton } from '../internal/class/mutation-observer-singleton'
import { FormAssociatedBase, getInternals, makeSlotchangeHandler } from '../internal/class/form-associated-base'

type DatePickerStyle = 'decimal-pad' | 'number-pad' | 'default'
const datePickerStyles = ['decimal-pad', 'number-pad', 'default'] as const

export class DatePicker extends FormAssociatedBase {
  static get observedAttributes() {
    return ['date-picker-style', 'required', 'prompt', 'label', 'name', 'text', 'disabled']
  }

  static #template: HTMLTemplateElement

  static get template() {
    return (this.#template ??= Object.assign(document.createElement('template'), {
      innerHTML: `
    <label part="root date-picker-stack">
    <div part="root date-picker-label-stack">
      <slot name="label"></slot>
    </div>
    <div part="root date-picker-input-stack">
      <input type="text" name="month" minlength="1" maxlength="2" min="1" max="12" part="root input date-picker-form-input">
      <input type="text" name="day" minlength="1" maxlength="2" min="1" max="31" part="root input date-picker-form-input">
      <input type="text" name="year" minlength="4" maxlength="4" min="0" max="9999" part="root input date-picker-form-input">
    </div>
    <slot name="validity-datalist" hidden></slot>
  </label>`,
    }))
  }

  #shadowRoot

  #customValidity: string = ''

  #datalistSlot?: HTMLSlotElement

  #inputs: HTMLInputElement[]

  #dayInput?: HTMLInputElement
  // #monthInput?: HTMLInputElement
  // #yearInput?: HTMLInputElement

  get #internals(): ElementInternals {
    return getInternals(this)
  }

  constructor() {
    super()

    this.#shadowRoot = this.attachShadow({ mode: 'closed' })

    this.#shadowRoot.appendChild(document.importNode((this.constructor as typeof DatePicker).template.content, true))

    this.#datalistSlot = this.#shadowRoot.querySelector<HTMLSlotElement>('slot[name=validity-datalist]') ?? undefined

    this.#inputs = [...this.#shadowRoot.querySelectorAll('input')]
      .sort((a, b) => I18n.dateOrder.indexOf(a.name) - I18n.dateOrder.indexOf(b.name))
      .map((input, index) => {
        input.style.order = `${index}`
        return input
      })

    this.#dayInput = this.#shadowRoot.querySelector('input[name=day]') ?? undefined
    // this.#monthInput = this.#shadowRoot.querySelector('input[name=month]') ?? undefined
    // this.#yearInput = this.#shadowRoot.querySelector('input[name=year]') ?? undefined

    CleanupRegistry.register(this, onoff('focusin', this.#handleFocusin, this).on())

    for (const input of this.#inputs)
      CleanupRegistry.register(
        this,
        onoff(
          [
            { types: 'blur', listener: this.#handleInputBlur },
            { types: 'input', listener: this.#handleInputInput },
            { types: 'beforeinput', listener: this.#handleInputBeforeinput as EventListener },
            { types: 'paste', listener: this.#handleInputPaste as EventListener },
          ],
          input
        ).on()
      )

    CleanupRegistry.unregister(this, 'datalist')
    CleanupRegistry.register(this, onoff(makeSlotchangeHandler(this), this.#datalistSlot).on(), 'datalist')
  }

  connectedCallback() {
    super.connectedCallback()
  }

  disconnectedCallback() {
    super.disconnectedCallback()
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    console.debug(`${DatePicker.name} ⚡️ attr-change [${name}] ("${oldValue}" → "${newValue}")`)

    switch (name) {
      case 'text':
        this.text = newValue ?? ''

        break
      case 'required':
        for (const input of this.#inputs) input.setAttribute(name, newValue ?? '') // else this.#input?.removeAttribute(name)
        this.#setFormValue()

        break
      case 'name':
        this.#setFormValue()

        break
      case 'prompt':
        let offset = 0

        for (const input of this.#inputs) {
          input.value = (newValue ?? '').slice(offset, offset + input.maxLength)

          offset += input.maxLength
        }

        break
      case 'label':
        let label = this.querySelector(':scope>[slot=label]')
        if (newValue) {
          label ??= this.appendChild($(`<span slot="label"></span>`))
          label.textContent = newValue
        } else label?.remove()

        this.#setFormValue()

        break
      case 'disabled':
        for (const input of this.#inputs) input.toggleAttribute('disabled', !newValue)

        break
    }
  }

  get datePickerStyle(): DatePickerStyle {
    return (datePickerStyles as readonly string[]).includes(this.getAttribute('date-picker-style') ?? '')
      ? (this.getAttribute('date-picker-style') as (typeof datePickerStyles)[number])
      : 'default'
  }

  get text() {
    let result = ''

    for (let i = 0; i < this.#inputs.length; i++) result += this.#inputs[i].value || ''

    return result
  }

  set text(v) {
    let offset = 0

    for (const input of this.#inputs) {
      input.value = v.slice(offset, offset + input.maxLength)

      offset += input.maxLength
    }

    this.#setFormValue()
  }

  #handleFocusin = (evt: Event) => {
    console.debug(`${DatePicker.name} ⚡️ ${evt?.type}`)

    if (evt.target === this) this.#dayInput?.focus()
  }

  #setFormValue = () => {
    // input.value has already been updated/synced !!
    if (this.matches(':disabled')) return this.setValidity({})

    if (this.hasAttribute('required')) {
      if (this.#dayInput?.matches(':invalid')) {
        this.setValidity(this.#dayInput?.validity, this.#dayInput?.validationMessage)
        // } else if (['number-pad', 'decimal-pad'].includes(this.getAttribute('date-picker-style') ?? '')) {
        // if (this.hasAttribute('min-number') && Number.parseInt(this.getAttribute('min-number') ?? '0') > Number.parseInt(this.text)) {
        //   this.setValidity({ rangeUnderflow: true })
        // } else if (this.hasAttribute('max-number') && Number.parseInt(this.getAttribute('max-number') ?? '0') < Number.parseInt(this.text)) {
        //   this.setValidity({ rangeOverflow: true })
        // } else {
        // this.setValidity({})
        // }
      } else {
        this.setValidity({})
      }
    } else {
      this.setValidity({})
    }

    const entries = new FormData()

    entries.append(this.name, this.text)

    this.#internals.setFormValue(entries)
  }

  #handleInputPaste = (evt: ClipboardEvent) => {
    console.debug(`${DatePicker.name} ⚡️ ${evt?.type}`)

    const input = evt.target as HTMLInputElement | null
    if (!input) return

    evt.preventDefault()

    const data = this.#identity(evt.clipboardData?.getData('text') ?? '') // number is now sanitized but contains edge cases like '+' and also global one separator that could be wither dot or decimal.

    if (0 === data.length) return this.shake().then(this.reportValidity) // nothing to paste

    const start = input.selectionStart ?? 0,
      end = input.selectionEnd ?? 0,
      before = input.value.slice(0, start),
      after = input.value.slice(end),
      newText = `${before}${data}${after}`

    if (-1 < input.maxLength && input.maxLength < newText.length) return this.shake().then(this.reportValidity) // exceeding maxlength

    input.value = newText

    const newCaret = start + data.length
    input.setSelectionRange(newCaret, newCaret) // move caret after inserted char

    this.#setFormValue()
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

    switch (this.datePickerStyle) {
      case 'decimal-pad': // allow only ^+- and then only one instance of ., finally remove all non digit rest appearances
        let seenDot = false
        return [...`${str.trim()}`].reduce((acc, ch, i) => {
          if (!seenSign && (ch === '+' || ch === '-')) {
            seenSign = true
            return acc + ch
          }
          if ((ch === '.' || ch === ',') && !seenDot) {
            seenDot = true
            return acc + ch
          }
          if (/\d/.test(ch)) return acc + ch
          return acc // skip everything else
        }, '')

      case 'number-pad': // allow only ^+- finally remove all non digit rest appearances
        return [...`${str.trim()}`].reduce((acc, ch, i) => {
          if (!seenSign && (ch === '+' || ch === '-')) {
            seenSign = true
            return acc + ch
          }
          if (/\d/.test(ch)) return acc + ch
          return acc // skip everything else
        }, '')

      default:
        return `${str}`
    }
  }

  #handleInputBeforeinput = (evt: InputEvent) => {
    console.debug(`${DatePicker.name} ⚡️ ${evt?.type}`)

    const input = evt.target as HTMLInputElement | null
    if (!input) return

    if ('insertText' !== evt.inputType) return

    const data = evt.data ?? ''

    if (-1 < input.maxLength && 0 === data.length) {
      evt.preventDefault()

      return this.shake().then(this.reportValidity)
    } // nothing to add

    const start = input.selectionStart ?? 0,
      end = input.selectionEnd ?? 0,
      before = this.text.slice(0, start),
      after = this.text.slice(end),
      newText = `${before}${data}${after}`

    if (0 === newText.length) return

    switch (input.getAttribute('inputmode')) {
      case 'decimal':
        if (/^[+-]?$|^[+-]?(\d+([.,]\d*)?|[.,]\d*)$/.test(newText)) break // allow single '+' or '-', then allow only one ',' or '.' and finally only digits

        evt.preventDefault()

        return this.shake().then(this.reportValidity)

      // console.log(isValidDecimal(""));       // true
      // console.log(isValidDecimal("+"));      // true
      // console.log(isValidDecimal("-"));      // true
      // console.log(isValidDecimal("123"));    // true
      // console.log(isValidDecimal("+123"));   // true
      // console.log(isValidDecimal("-456"));   // true
      // console.log(isValidDecimal("12.34"));  // true
      // console.log(isValidDecimal("-0,56"));  // true
      // console.log(isValidDecimal(".78"));    // true
      // console.log(isValidDecimal(",9"));     // true
      // console.log(isValidDecimal("12.3.4")); // false
      // console.log(isValidDecimal("12,3,4")); // false
      // console.log(isValidDecimal("12-3"));   // false
      // console.log(isValidDecimal("12a"));    // false
      case 'numeric':
        if (/^([+-]|\d+|[+-]\d+)?$/.test(newText)) break // allow single '+' or '-', then allow only digits

        evt.preventDefault()

        return this.shake().then(this.reportValidity)

      // this.setValidity(prevValidity, prevValiditationMessage) // restore
      // console.log(isValidInteger(""));      // true
      // console.log(isValidInteger("+"));     // true
      // console.log(isValidInteger("-"));     // true
      // console.log(isValidInteger("123"));   // true
      // console.log(isValidInteger("+123"));  // true
      // console.log(isValidInteger("-456"));  // true
      // console.log(isValidInteger("12-3"));  // false
      // console.log(isValidInteger("++123")); // false
      // console.log(isValidInteger("123a"));  // false
    }
  }

  #handleInputBlur = (evt: Event) => {
    console.debug(`${DatePicker.name} ⚡️ ${evt?.type}`)

    if (0 === this.text.length) return

    const finalText = this.value.replace(/[.,]/g, I18n.decimalSeparator)

    if (this.text !== finalText) this.text = finalText
  }

  #handleInputInput = (evt: Event) => {
    console.debug(`${DatePicker.name} ⚡️ ${evt?.type}`)

    this.#setFormValue()
  }

  // Optional: form participation properties
  get name() {
    return this.getAttribute('name') ?? this.getAttribute('label') ?? this.querySelector(':scope>[slot=label]')?.textContent ?? ''
  }
  // get maxLength() {
  //   if (!this.hasAttribute('max-length')) return -1

  //   const number = Number(this.getAttribute('max-length'))

  //   if (0 > number || number > Infinity) return -1

  //   return number
  // }
  // get minLength() {
  //   if (!this.hasAttribute('min-length')) return -1

  //   const number = Number(this.getAttribute('min-length'))

  //   if (0 > number || number > Infinity) return -1

  //   return number
  // }
  get value() {
    // text allows special edge cases, like '-.' or '+' and generally might be invalid number. It might also be localized and not US based.
    // here we make sure it is number-like, to be used in number operations.
    switch (this.datePickerStyle) {
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
    switch (this.datePickerStyle) {
      case 'decimal-pad':
      case 'number-pad':
        return Number(this.value)

      default:
        return ''
    }
  }
  get valueAsDate() {
    return new Date(this.value)
  }

  setValidity = (flags?: ValidityStateFlags, message?: string, anchor?: HTMLElement) => {
    // let msg

    // if (message)
    for (const k in flags) {
      const key = k as keyof ValidityStateFlags // ✅ type-safe cast
      if (true !== flags[key]) continue

      for (const el of this.#datalistSlot?.assignedElements({ flatten: true }) ?? []) {
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

    console.debug(`${DatePicker.name} ⚡️ validity-change`)

    return this.#internals.setValidity(flags, this.#customValidity || message, anchor ?? this.#dayInput)
  }
  setCustomValidity = (message: string) => {
    this.#customValidity = message

    if (this.#customValidity) this.#internals.setValidity({ ...this.#internals.validity, customError: true }, message)
    else this.#setFormValue()
  }
  formAssociatedCallback = (form: HTMLFormElement) => {
    this.#setFormValue()
  }
  formDisabledCallback = (disabled: boolean) => {
    for (const input of this.#inputs) input.toggleAttribute('disabled', !disabled)
  }
  formResetCallback = () => {
    this.text = ''
  }
}
