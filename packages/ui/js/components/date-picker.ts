import { type DatePickerSelectionDetail } from '../events'
import { I18n } from '../i18n'
import { CleanupRegistry } from '../internal/class/cleanup-registry'
import { FormAssociatedBase, getInternals, makeSlotchangeHandler } from '../internal/class/form-associated-base'
import { $, clamp, debug, kebabCase, onoff, set } from '../internal/utils'

const datePickerStyles = ['graphical', 'field', 'automatic'] as const
export type DatePickerStyle = (typeof datePickerStyles)[number] // type DatePickerStyle = 'decimal-pad' | 'number-pad' | 'automatic'

type DateParts = 'year' | 'month' | 'day'
type DateInput = HTMLInputElement & { name: DateParts }

export class DatePicker extends FormAssociatedBase {
  static get observedAttributes() {
    return [
      /**
       * The style of this element
       * @type {"graphical"|"field"|"automatic"}
       */
      'date-picker-style',
      'required',
      'prompt',
      'label',
      'name',
      'selection',
      'disabled',
      'minimum',
      'maximum',
    ]
  }

  static #templates: Map<string, DocumentFragment> = new Map()

  // #lastRenderedStyle?: DatePickerStyle //string | null

  #shadowRoot

  #customValidity: string = ''

  #slots?: Map<string, HTMLSlotElement> = new Map()
  // #validitiesSlot?: HTMLSlotElement

  #inputs: DateInput[] = []

  get #internals(): ElementInternals {
    return getInternals(this)
  }

  get template(): DocumentFragment {
    if (!DatePicker.#templates.has(this.datePickerStyle))
      switch (this.datePickerStyle) {
        default:
          DatePicker.#templates.set(
            this.datePickerStyle,
            $(
              String.raw`
            <label part="root date-picker-stack">
            <div part="root date-picker-label-stack">
              <slot name="label"></slot>
            </div>
            <div part="root date-picker-input-stack">
              <input type="text" name="month" inputmode="numeric" pattern="\d*" minlength="1" maxlength="2" min="1" max="12" part="root input date-picker-form-input">
              <span part="root date-picker-separator"></span>
              <input type="text" name="day" inputmode="numeric" pattern="\d*" minlength="1" maxlength="2" min="1" max="31" part="root input date-picker-form-input">
              <span part="root date-picker-separator"></span>
              <input type="text" name="year" inputmode="numeric" pattern="\d*" minlength="4" maxlength="4" min="0" max="9999" part="root input date-picker-form-input">
            </div>
            <slot name="validity-options" hidden></slot>
          </label>`
            )
          )

          break
      }

    return DatePicker.#templates.get(this.datePickerStyle)!
  }

  constructor() {
    super()

    this.#shadowRoot = this.attachShadow({ mode: 'closed' })
  }

  connectedCallback() {
    super.connectedCallback()

    CleanupRegistry.register(this, onoff('click', this.#handleClick, this).on())

    this.#render()

    CleanupRegistry.register(
      this,
      onoff(
        'localechange',
        () => {
          this.#render()
        },
        I18n.on
      ).on()
    )

    // finally
    if (!this.hasAttribute('selection')) return

    const [y = '', m = '', d = ''] = (this.getAttribute('selection') ?? '').split(/\D+/)
    this.#selectedDate = { year: y, month: m, day: d }

    this.#sendValueToForm(false)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    debug(`${DatePicker.name} ⚡️ attr-change [${name}] ("${oldValue}" → "${newValue}")`)

    switch (name) {
      case 'selection':
        const [y = '', m = '', d = ''] = (newValue ?? '').split(/\D+/)
        this.#selectedDate = { year: y, month: m, day: d }

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
          label ??= this.appendChild($(`<span slot="label"></span>`, '>1'))
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
    return (datePickerStyles as readonly string[]).includes(this.getAttribute('date-picker-style') ?? '') ? (this.getAttribute('date-picker-style') as (typeof datePickerStyles)[number]) : 'automatic'
  }

  #render() {
    debug(`${DatePicker.name} ⚡️ render (${this.datePickerStyle})`)

    if (!this.isConnected) return

    // if (this.#lastRenderedStyle === this.datePickerStyle) return // skip if already applied
    // this.#lastRenderedStyle = this.datePickerStyle

    // clear shadow DOM
    this.#shadowRoot.replaceChildren(document.importNode(this.template, true))

    CleanupRegistry.unregister(this, 'slots')
    for (const slot of this.#shadowRoot.querySelectorAll<HTMLSlotElement>('slot')) this.#slots?.set(slot.name, slot)
    CleanupRegistry.register(
      this,
      () => {
        this.#slots = new Map()
      },
      'slots'
    )

    CleanupRegistry.unregister(this, 'validities')
    CleanupRegistry.register(this, onoff(makeSlotchangeHandler(this), this.#slots?.get('validity-options')).on(), 'validities')

    switch (this.datePickerStyle) {
      default:
        const [yyyy = '', mm = '', dd = ''] = new Date().toISOString().split('T').shift()?.split('-') ?? [],
          map = { year: yyyy, month: mm, day: dd }

        this.#inputs = [...this.#shadowRoot.querySelectorAll<DateInput>('input')]
          .sort((a, b) => I18n.dateOrder.indexOf(a.name) - I18n.dateOrder.indexOf(b.name))
          .map((input, i) => {
            input.style.order = `${i * 2}`
            input.tabIndex = i + 1
            input.setAttribute('placeholder', map[input.name])
            return input
          })

        for (const span of this.#shadowRoot.querySelectorAll<HTMLElement>('input~span')) {
          const prevOrder = Number((span.previousElementSibling as HTMLInputElement)?.style.getPropertyValue('order'))

          span.style.setProperty('order', `${prevOrder + 1}`)

          span.textContent = I18n.dateSeparator
        }

        CleanupRegistry.unregister(this, 'inputs:*')
        for (const input of this.#inputs) {
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
            ).on(),
            `inputs:${input.name}`
          )
        }

        break
    }
  }

  get #selectedDate(): { year: string; month: string; day: string } {
    const map = Object.fromEntries(this.#inputs.map(({ name, value }) => [name, value])) as Partial<Record<DateParts, string>>

    return {
      year: map.year ?? '',
      month: map.month ?? '',
      day: map.day ?? '',
    }
  }

  set #selectedDate(v) {
    for (const input of this.#inputs) {
      const nv = v[input.name] ?? '',
        pattern = /^(\d+)?$/

      let finalValue = pattern.test(nv) ? nv : '',
        parsedValue = parseInt(finalValue)

      if (DatePicker.#min(input) > parsedValue) finalValue = ''
      else if (DatePicker.#max(input) < parsedValue) finalValue = ''

      input.value = finalValue
    }
  }

  #handleClick = (evt: Event) => {
    debug(`${DatePicker.name} ⚡️ ${evt?.type}`)

    const { target } = evt
    if (!(target instanceof HTMLElement && target)) return

    const input = target.closest('input')
    if (input) return

    this.#shadowRoot.querySelector<HTMLInputElement>('input.focus')?.focus?.()

    evt.stopImmediatePropagation()
    evt.preventDefault()
    evt.stopPropagation()
  }

  #sendValueToForm = (dispatchEvent: boolean = true) => {
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

    const selection = `${this.#selectedDate.year}-${this.#selectedDate.month}-${this.#selectedDate.day}`

    const entries = new FormData()

    entries.append(this.name, selection)

    this.#internals.setFormValue(entries)

    if (dispatchEvent) this.dispatchEvent(new CustomEvent<DatePickerSelectionDetail>('selection', { detail: { selection }, bubbles: true, composed: true }))
  }

  #handleInputPaste = (evt: ClipboardEvent) => {
    debug(`${DatePicker.name} ⚡️ ${evt?.type}`)

    const input = evt.target instanceof HTMLInputElement && evt.target
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
    debug(`${DatePicker.name} ⚡️ ${evt?.type}`)

    const input = evt.target instanceof HTMLInputElement && evt.target
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
    debug(`${DatePicker.name} ⚡️ ${type}`)

    if (!(target instanceof HTMLInputElement && target)) return

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
    debug(`${DatePicker.name} ⚡️ ${evt?.type}`)

    for (const input of this.#inputs) input.classList.toggle('focus', input === evt.target)
  }

  #handleInputBlur = ({ target, type }: Event) => {
    debug(`${DatePicker.name} ⚡️ ${type}`)

    if (!(target instanceof HTMLInputElement && target)) return

    const input = target as DateInput

    if (0 === input.value.length) return

    const finalText = `${clamp(this.value[input.name] ?? '0', DatePicker.#min(input), DatePicker.#max(input))}`.padStart(parseInt(input.getAttribute('maxlength') ?? '0'), '0')

    if (!set(input, 'value', finalText)) return

    // this.selection = this.selection

    this.#sendValueToForm()
  }

  #handleInputInput = (evt: Event) => {
    debug(`${DatePicker.name} ⚡️ ${evt?.type}`)

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

      for (const el of this.#slots?.get('validity-options')?.assignedElements({ flatten: true }) ?? []) {
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

    debug(`${DatePicker.name} ⚡️ validity-change`)

    return this.#internals.setValidity(flags, this.#customValidity || message, anchor ?? this.#inputs.at(0))
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
    for (const input of this.#inputs) input.toggleAttribute('disabled', !disabled)
  }
  formResetCallback = () => {
    this.#selectedDate = {
      year: '',
      month: '',
      day: '',
    }

    this.#sendValueToForm()
  }
}
