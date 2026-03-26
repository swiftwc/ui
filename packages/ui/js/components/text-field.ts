import { onoff, $, kebabCase } from '../internal/utils'
import { CleanupRegistry } from '../internal/class/cleanup-registry'
import { MutationObserverSingleton } from '../internal/class/mutation-observer-singleton'

const observers = new MutationObserverSingleton()

export class TextField extends HTMLElement {
  static get observedAttributes() {
    return ['prompt', 'max-length', 'label', 'text', 'text-input-autocapitalization', 'disable-autocorrection', 'keyboard-type', 'required']
  }

  static get formAssociated() {
    return true
  }

  static #template: HTMLTemplateElement

  static get template() {
    return (this.#template ??= Object.assign(document.createElement('template'), {
      innerHTML: `
    <label part="root text-field-stack">
    <div part="root text-field-label-stack">
      <slot name="label"></slot>
    </div>
    <div part="root text-field-input-stack">
      <input type="text" part="root input text-field-form-input">
    </div>
    <slot name="validity-message"></slot>
  </label>`,
    }))
  }

  #shadowRoot

  #internals: ElementInternals

  #datalistSlot?: HTMLSlotElement
  #trackedElements = new Set<Element>()

  #input?: HTMLInputElement

  constructor() {
    super()

    this.#internals = this.attachInternals()

    this.#shadowRoot = this.attachShadow({ mode: 'closed' })

    this.#shadowRoot.appendChild(document.importNode((this.constructor as typeof TextField).template.content, true))

    this.#datalistSlot = this.#shadowRoot.querySelector<HTMLSlotElement>('slot[name=validity-message]') ?? undefined

    this.#input = this.#shadowRoot.querySelector('input') ?? undefined

    this.tabIndex = 0

    CleanupRegistry.register(this, onoff('focus', this.#handleFocus, this).on())

    CleanupRegistry.register(
      this,
      onoff(
        [
          { types: 'input', listener: this.#handleInputInput },
          { types: 'beforeinput', listener: this.#handleInputBeforeinput as EventListener },
          { types: 'paste', listener: this.#handleInputPaste as EventListener },
        ],
        this.#input
      ).on()
    )

    CleanupRegistry.unregister(this, 'datalist')
    CleanupRegistry.register(this, onoff('slotchange', this.#handleSlotchange, this.#datalistSlot).on(), 'datalist')
  }

  connectedCallback() {
    console.debug(`${TextField.name} ⚡️ connect`)
  }

  disconnectedCallback() {
    console.debug(`${TextField.name} ⚡️ disconnect`)

    CleanupRegistry.unregister(this)

    this.#trackedElements.clear()
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

        this.#setFormValue()

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
        this.text = newValue ?? ''

        break
      case 'required':
        this.#input?.setAttribute(name, newValue ?? '') // else this.#input?.removeAttribute(name)
        this.#setFormValue()

        break
      case 'prompt':
        this.#input?.setAttribute('placeholder', newValue ?? '') // else this.#input?.removeAttribute(name)

        break
      case 'max-length':
        this.#input?.setAttribute('maxlength', newValue ?? '')
        this.#setFormValue()

        break
      case 'label':
        let label = this.querySelector(':scope>[slot=label]')
        if (newValue) {
          label ??= this.appendChild($(`<span slot="label"></span>`))
          label.textContent = newValue
        } else label?.remove()

        break
    }
  }

  get text() {
    return this.#input?.value ?? ''
  }

  set text(v) {
    if (!this.#input) return

    this.#input.value = v

    this.#setFormValue()
  }

  #handleSlotchange = (evt: Event) => {
    console.debug(`${TextField.name} ⚡️ ${evt?.type}`)

    const slot = evt.target as HTMLSlotElement,
      assigned = slot.assignedElements({ flatten: true })

    for (const el of this.#trackedElements)
      if (!assigned.includes(el)) {
        observers.unobserve(el)
        this.#trackedElements.delete(el)
      }

    for (const el of assigned) {
      if (!this.#trackedElements.has(el))
        observers.observe(el, this.#handleTagMutation, {
          attributes: true,
          characterData: true,
          subtree: true,
          childList: true,
          attributeFilter: ['value', 'label'],
        })

      this.#trackedElements.add(el)
    }

    if (0 < assigned.length) this.#handleTagMutation()
  }

  #handleTagMutation = (entry?: MutationRecord) => {
    console.debug(`${TextField.name} ⚡️ mutation`)

    this.setValidity(this.validity, this.validationMessage)
  }

  #handleFocus = (evt: Event) => {
    console.debug(`${TextField.name} ⚡️ ${evt?.type}`)

    this.#input?.focus()
  }

  #setFormValue = () => {
    // input.value has already been updated/synced !!
    if (this.#input?.matches(':invalid')) {
      this.setValidity(this.#input?.validity, this.#input?.validationMessage)
    } else {
      if (!this.matches(':disabled') && this.hasAttribute('required') && this.text.length <= 0) {
        this.setValidity({ customError: true }, '1')
      } else {
        this.setValidity({})
      }
    }

    const entries = new FormData()

    entries.append(this.name, this.text)

    this.#internals.setFormValue(entries)
  }

  #handleInputPaste = (evt: ClipboardEvent) => {
    console.debug(`${TextField.name} ⚡️ ${evt?.type}`)

    const input = evt.target as HTMLInputElement | null
    if (!input) return

    this.#preventDefault(evt, input, evt.clipboardData?.getData('text') ?? '')
  }

  #handleInputBeforeinput = (evt: InputEvent) => {
    console.debug(`${TextField.name} ⚡️ ${evt?.type}`)

    const input = evt.target as HTMLInputElement | null
    if (!input) return

    if ('insertText' !== evt.inputType) return

    this.#preventDefault(evt, input, evt.data ?? '')
  }

  #preventDefault = (evt: Event, input: HTMLInputElement, data: string) => {
    const newValue = `${input.value.slice(0, input.selectionStart ?? 0)}${data}${input.value.slice(input.selectionEnd ?? 0)}`
    if (0 === newValue.length) return

    switch (this.#input?.getAttribute('inputmode')) {
      case 'numeric':
        if (/^([+-]|\d+|[+-]\d+)?$/.test(newValue)) break

        evt.preventDefault()

        // const prevValidity = this.validity,
        //   prevValiditationMessage = this.validationMessage

        // this.setValidity({ customError: true }, 'bad-input')

        this.#shake().then(this.reportValidity)

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

        return
      case 'decimal':
        if (/^[+-]?(\d+([.,]\d*)?|[.,]\d*|[+-])$/.test(newValue)) break

        evt.preventDefault()

        this.#shake().then(this.reportValidity)

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

        return
    }

    if (this.#input?.hasAttribute('maxlength') && 0 === data.length) {
      evt.preventDefault()

      this.#shake().then(this.reportValidity)
    }
  }

  #shake = async (times = 3, distance = 8, duration = 400) => {
    const frames = [{ transform: 'translateX(0)' }]

    for (let i = 0; i < times; i++) frames.push({ transform: `translateX(-${distance}px)` }, { transform: `translateX(${distance}px)` })

    frames.push({ transform: 'translateX(0)' })

    try {
      await this.animate(frames, { duration, easing: 'ease-in-out' }).finished
    } catch {
      //
    }
  }

  #handleInputInput = (evt: Event) => {
    console.debug(`${TextField.name} ⚡️ ${evt?.type}`)

    this.#setFormValue()
  }

  // Optional: form participation properties
  get form() {
    return this.#internals.form
  }
  get name() {
    return this.getAttribute('label') ?? ''
  }
  get type() {
    return this.localName
  }
  get validity() {
    return this.#internals.validity
  }
  get validationMessage() {
    return this.#internals.validationMessage
  }
  get willValidate() {
    return this.#internals.willValidate
  }

  setValidity = (flags?: ValidityStateFlags, message?: string, anchor?: HTMLElement) => {
    let msg

    if (message)
      for (const k in flags) {
        const key = k as keyof ValidityStateFlags // ✅ type-safe cast
        if (true !== flags[key]) continue

        for (const el of this.#datalistSlot?.assignedElements({ flatten: true }) ?? []) {
          if (!el.matches('option')) continue

          const option = el as HTMLOptionElement

          if (`${kebabCase(key)}` === option.value) {
            msg = option.label
            break
          } else if (`${kebabCase(key)}:${message}` === option.value) {
            msg = option.label
            break
          }
        }
      }

    return this.#internals.setValidity(flags, msg ?? message, anchor ?? this.#input)
  }
  checkValidity = () => {
    return this.#internals.checkValidity()
  }
  reportValidity = () => {
    return this.#internals.reportValidity()
  }
  formAssociatedCallback = (form: HTMLFormElement) => {
    this.#setFormValue()
  }
  formDisabledCallback = (disabled: boolean) => {
    if (this.#input) this.#input.disabled = disabled
  }
  formResetCallback = () => {
    this.text = ''
  }
}
