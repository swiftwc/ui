import { onoff, $, kebabCase, clamp, set } from '../internal/utils'
import { CleanupRegistry } from '../internal/class/cleanup-registry'
import { I18n } from '../i18n'
import { FormAssociatedBase, getInternals, makeSlotchangeHandler } from '../internal/class/form-associated-base'

const datePickerStyles = ['graphical', 'field', 'automatic'] as const
type DateParts = 'year' | 'month' | 'day'
type DateInput = HTMLInputElement & { name: DateParts }

export type DatePickerStyle = (typeof datePickerStyles)[number] // type DatePickerStyle = 'decimal-pad' | 'number-pad' | 'automatic'

export class DatePicker extends FormAssociatedBase {
  static get observedAttributes() {
    return ['date-picker-style', 'required', 'prompt', 'label', 'name', 'text', 'disabled', 'minimum', 'maximum']
  }

  static #template: HTMLTemplateElement

  static get template() {
    const [yyyy = '', mm = '', dd = ''] = new Date().toISOString().split('T').shift()?.split('-') ?? []

    return (this.#template ??= Object.assign(document.createElement('template'), {
      innerHTML: String.raw`
    <label part="root date-picker-stack">
    <div part="root date-picker-label-stack">
      <slot name="label"></slot>
    </div>
    <div part="root date-picker-input-stack">
      <input type="text" name="month" placeholder="${mm}" inputmode="numeric" pattern="\d*" minlength="1" maxlength="2" min="1" max="12" part="root input date-picker-form-input">
      <input type="text" name="day" placeholder="${dd}" inputmode="numeric" pattern="\d*" minlength="1" maxlength="2" min="1" max="31" part="root input date-picker-form-input">
      <input type="text" name="year" placeholder="${yyyy}" inputmode="numeric" pattern="\d*" minlength="4" maxlength="4" min="0" max="9999" part="root input date-picker-form-input">
    </div>
    <slot name="validity-datalist" hidden></slot>
  </label>`,
    }))
  }

  #shadowRoot

  #customValidity: string = ''

  #datalistSlot?: HTMLSlotElement

  #inputs: DateInput[]

  get #internals(): ElementInternals {
    return getInternals(this)
  }

  constructor() {
    super()

    this.#shadowRoot = this.attachShadow({ mode: 'closed' })

    this.#shadowRoot.appendChild(document.importNode((this.constructor as typeof DatePicker).template.content, true))

    this.#datalistSlot = this.#shadowRoot.querySelector<HTMLSlotElement>('slot[name=validity-datalist]') ?? undefined

    this.#inputs = [...this.#shadowRoot.querySelectorAll<DateInput>('input')]
      .sort((a, b) => I18n.dateOrder.indexOf(a.name) - I18n.dateOrder.indexOf(b.name))
      .map((input, index) => {
        input.style.order = `${index}`
        input.tabIndex = index + 1
        return input
      })

    CleanupRegistry.register(this, onoff('click', this.#handleClick, this).on())

    for (const input of this.#inputs)
      CleanupRegistry.register(
        this,
        onoff(
          [
            { types: 'focus', listener: this.#handleInputFocus },
            { types: 'blur', listener: this.#handleInputBlur },
            { types: 'input', listener: this.#handleInputInput },
            { types: 'beforeinput', listener: this.#handleInputBeforeinput as EventListener },
            { types: 'paste', listener: this.#handleInputPaste as EventListener },
            { types: 'keydown', listener: this.#handleInputKeydown as EventListener },
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
        const [y = '', m = '', d = ''] = (newValue ?? '').split(/\D+/)
        this.selection = { year: y, month: m, day: d }

        break
      case 'required':
        for (const input of this.#inputs) input.setAttribute(name, newValue ?? '') // else this.#input?.removeAttribute(name)
        this.#sendValueToForm()

        break
      case 'name':
      case 'minimum':
      case 'maximum':
        this.#sendValueToForm()

        break
      case 'prompt':
        const [py = '', pm = '', pd = ''] = (newValue ?? '').split(/\D+/),
          map = { year: py, month: pm, day: pd }

        for (const input of this.#inputs) input.setAttribute('placeholder', map[input.name] ?? '')

        break
      case 'label':
        let label = this.querySelector(':scope>[slot=label]')
        if (newValue) {
          label ??= this.appendChild($(`<span slot="label"></span>`))
          label.textContent = newValue
        } else label?.remove()

        this.#sendValueToForm()

        break
      case 'disabled':
        for (const input of this.#inputs) input.toggleAttribute('disabled', !newValue)

        break
    }
  }

  get datePickerStyle(): DatePickerStyle {
    return (datePickerStyles as readonly string[]).includes(this.getAttribute('date-picker-style') ?? '')
      ? (this.getAttribute('date-picker-style') as (typeof datePickerStyles)[number])
      : 'automatic'
  }

  get selection(): { year: string; month: string; day: string } {
    const map = Object.fromEntries(this.#inputs.map(({ name, value }) => [name, value])) as Partial<Record<DateParts, string>>

    return {
      year: map.year ?? '',
      month: map.month ?? '',
      day: map.day ?? '',
    }
  }

  set selection(v) {
    for (const input of this.#inputs) {
      const nv = v[input.name] ?? '',
        pattern = /^(\d+)?$/

      let finalValue = pattern.test(nv) ? nv : '',
        parsedValue = parseInt(finalValue)

      if (DatePicker.#min(input) > parsedValue) finalValue = ''
      else if (DatePicker.#max(input) < parsedValue) finalValue = ''

      input.value = finalValue
    }

    this.#sendValueToForm()
  }

  #handleClick = (evt: Event) => {
    console.debug(`${DatePicker.name} ⚡️ ${evt?.type}`)

    const input = (evt.target as HTMLElement)?.closest('input')
    if (input) return

    this.#shadowRoot.querySelector<HTMLInputElement>('input.focus')?.focus?.()

    evt.stopImmediatePropagation()
    evt.preventDefault()
    evt.stopPropagation()
  }

  #sendValueToForm = () => {
    // input.value has already been updated/synced !!
    if (this.matches(':disabled')) return this.setValidity({})

    if (this.#inputs.some((el) => el.matches(':invalid'))) {
      for (const input of this.#inputs) {
        if (input.matches(':invalid')) this.setValidity(input.validity, input.validationMessage, input)
      }
    } else if (null === this.valueAsDate) {
      this.setValidity({ badInput: true }, 'invalid-date')
    } else {
      const parts = ['year', 'month', 'day'] as const,
        input = (name: string) => this.#inputs.find((el) => el.name === name)

      const underflow = this.minimum && parts.find((p) => parseInt(this.minimum![p]) > parseInt(this.value[p])),
        overflow = this.maximum && parts.find((p) => parseInt(this.maximum![p]) < parseInt(this.value[p]))

      if (underflow) this.setValidity({ rangeUnderflow: true }, `${underflow}-underflow`, input(underflow))
      else if (overflow) this.setValidity({ rangeOverflow: true }, `${overflow}-overflow`, input(overflow))
      else this.setValidity({})
    }

    const entries = new FormData()

    entries.append(this.name, `${this.selection.year}-${this.selection.month}-${this.selection.day}`)

    this.#internals.setFormValue(entries)
  }

  #handleInputPaste = (evt: ClipboardEvent) => {
    console.debug(`${DatePicker.name} ⚡️ ${evt?.type}`)

    const input = evt.target as HTMLInputElement | null
    if (!input) return

    evt.preventDefault()

    const data = [...`${(evt.clipboardData?.getData('text') ?? '').trim()}`].reduce((acc, ch, i) => {
      if (/\d/.test(ch)) return `${acc}${ch}`
      else return acc // skip everything else
    }, '') // number is now sanitized but contains edge cases like '+' and also global one separator that could be wither dot or decimal.

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

    this.#sendValueToForm()
  }

  #handleInputBeforeinput = (evt: InputEvent) => {
    console.debug(`${DatePicker.name} ⚡️ ${evt?.type}`)

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
      before = input.value.slice(0, start),
      after = input.value.slice(end),
      newText = `${before}${data}${after}`

    if (0 === newText.length) return

    switch (input.getAttribute('inputmode')) {
      case 'numeric':
        if (/^(\d+)?$/.test(newText)) break // allow only digits

        evt.preventDefault()

        return this.shake() //.then(this.reportValidity)
    }
  }

  #handleInputKeydown = ({ type, target, key }: KeyboardEvent) => {
    console.debug(`${DatePicker.name} ⚡️ ${type}`)

    const input = target as DateInput
    if (!input) return

    const currentIndex = this.#inputs.indexOf(input)

    let index = currentIndex

    if (key === 'ArrowRight' && input.value.length === input.selectionStart) {
      if (-1 < currentIndex && currentIndex < this.#inputs.length - 1) index++
    } else if (key === 'ArrowLeft' && 0 === input.selectionStart) {
      if (0 < currentIndex) index -= 1
    }

    this.#inputs[index]?.focus()
  }

  #handleInputFocus = (evt: Event) => {
    console.debug(`${DatePicker.name} ⚡️ ${evt?.type}`)

    for (const input of this.#inputs) input.classList.toggle('focus', input === evt.target)
  }

  #handleInputBlur = (evt: Event) => {
    console.debug(`${DatePicker.name} ⚡️ ${evt?.type}`)

    const input = evt.target as DateInput

    if (0 === input.value.length) return

    const finalText = `${clamp(this.value[input.name] ?? '0', DatePicker.#min(input), DatePicker.#max(input))}`.padStart(
      parseInt(input.getAttribute('maxlength') ?? '0'),
      '0'
    )

    if (!set(input, 'value', finalText)) return

    this.selection = this.selection
  }

  #handleInputInput = (evt: Event) => {
    console.debug(`${DatePicker.name} ⚡️ ${evt?.type}`)

    this.#sendValueToForm()
  }

  // Optional: form participation properties
  get name() {
    return this.getAttribute('name') ?? this.getAttribute('label') ?? this.querySelector(':scope>[slot=label]')?.textContent ?? ''
  }

  get value() {
    // text allows special edge cases, like '0' for day and generally might be invalid day/month/year.
    // here we make sure it is date-like, to be used in date operations.

    const map = Object.fromEntries(this.#inputs.map(({ name, value }) => [name, value])) as Partial<Record<DateParts, string>>

    return {
      year: (map.year ?? '').padStart(4, '0'),
      month: (map.month ?? '').padStart(2, '0'),
      day: (map.day ?? '').padStart(2, '0'),
    }
  }

  get valueAsDate() {
    try {
      const d = new Date(`${this.value.year}-${this.value.month}-${this.value.day}`)

      if (!(d instanceof Date) || isNaN(d.getTime())) return null

      return d
    } catch {
      return null
    }
  }

  static #min(input?: HTMLInputElement) {
    if (!input?.hasAttribute('min')) return -Infinity

    const number = Number(input.getAttribute('min'))

    if (Number.isNaN(number)) return -Infinity

    return number
  }

  static #max(input?: HTMLInputElement) {
    if (!input?.hasAttribute('max')) return Infinity

    const number = Number(input.getAttribute('max'))

    if (Number.isNaN(number)) return Infinity

    return number
  }

  get minimum() {
    if (!this.hasAttribute('minimum')) return null

    try {
      new Date(this.getAttribute('minimum') ?? '')

      const [y = '', m = '', d = ''] = (this.getAttribute('minimum') ?? '').split(/\D+/)

      return {
        year: y.padStart(4, '0'),
        month: m.padStart(2, '0'),
        day: d.padStart(2, '0'),
      }
    } catch {
      return null
    }
  }

  get maximum() {
    if (!this.hasAttribute('maximum')) return null

    try {
      new Date(this.getAttribute('maximum') ?? '')

      const [y = '', m = '', d = ''] = (this.getAttribute('maximum') ?? '').split(/\D+/)

      return {
        year: y.padStart(4, '0'),
        month: m.padStart(2, '0'),
        day: d.padStart(2, '0'),
      }
    } catch {
      return null
    }
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

    return this.#internals.setValidity(flags, this.#customValidity || message, anchor ?? this.#inputs.at(0))
  }
  setCustomValidity = (message: string) => {
    this.#customValidity = message

    if (this.#customValidity) this.#internals.setValidity({ ...this.#internals.validity, customError: true }, message)
    else this.#sendValueToForm()
  }
  formAssociatedCallback = (form: HTMLFormElement) => {
    this.#sendValueToForm()
  }
  formDisabledCallback = (disabled: boolean) => {
    for (const input of this.#inputs) input.toggleAttribute('disabled', !disabled)
  }
  formResetCallback = () => {
    this.selection = {
      year: '',
      month: '',
      day: '',
    }
  }
}
