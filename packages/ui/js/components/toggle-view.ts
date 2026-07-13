import type { ToggleChangeDetail, ToggleViewEventMap } from '../events'
import { CleanupRegistry } from '../internal/class/cleanup-registry'
import { FormAssociatedBase, getInternals } from '../internal/class/form-associated-base'
import { MutationObserverSet } from '../internal/class/mutation-observer-set'
import { $, devFlags, kebabCase, onoff, renderLabel } from '../internal/utils'
import type { TypedEventTargetMethods } from '../namespace-browser/event'

const toggleStyles = ['switch', 'button'] as const

export type ToggleStyle = (typeof toggleStyles)[number] // 'decimal-pad' | 'number-pad' | 'default'

/**
 * @slot label
 * @slot validity-options
 */
export class ToggleView extends FormAssociatedBase {
  declare addEventListener: TypedEventTargetMethods<ToggleViewEventMap>['addEventListener']
  declare removeEventListener: TypedEventTargetMethods<ToggleViewEventMap>['removeEventListener']

  static get observedAttributes() {
    return ['label', 'name', 'value', 'is-on', 'keyboard-type', 'required', 'disabled']
  }

  static #template: DocumentFragment

  static get template() {
    return (this.#template ??= $(
      String.raw`
    <label part="root toggle-stack">
    <div part="root toggle-label-stack">
      <slot name="label"></slot>
    </div>
    <div part="root toggle-input-stack">
      <!--<input type="checkbox" part="root input toggle-form-input">-->
      <div part="root toggle-form-input" tabindex="0"></div>
    </div>
    <slot name="validity-options" hidden></slot>
  </label>`
    ))
  }

  #renderValidityMsgs = (entries: MutationRecord[]) => {
    if (devFlags.debug) console.debug(`${ToggleView.name} ⚡️ mutation`)

    this.setValidity(this.validity, this.validationMessage)
  }

  #shadowRoot

  #customValidity: string = ''

  #slots?: Map<string, HTMLSlotElement> = new Map()
  #validityObservers = new MutationObserverSet(this.#renderValidityMsgs)

  #input?: HTMLInputElement

  #value: string | null = 'on'
  #isOn: boolean = false
  #connected: boolean = false

  get #internals(): ElementInternals {
    return getInternals(this)
  }

  constructor() {
    super()

    this.#shadowRoot = this.attachShadow({ mode: 'closed' })

    this.#shadowRoot.appendChild(document.importNode((this.constructor as typeof ToggleView).template, true))

    for (const slot of this.#shadowRoot.querySelectorAll<HTMLSlotElement>('slot')) this.#slots?.set(slot.name, slot)
    CleanupRegistry.register(this, () => {
      this.#slots = new Map()
    })

    CleanupRegistry.unregister(this, 'validities')
    CleanupRegistry.register(this, onoff('slotchange', this.#handleValiditiesSlotchange, this.#slots?.get('validity-options')).on(), 'validities')

    this.#input = this.#shadowRoot.querySelector('[part*=toggle-form-input]') ?? undefined

    this.#input?.addEventListener('click', () => {
      this.isOn = !this.isOn

      this.#sendValueToForm(this.#connected)
    })

    CleanupRegistry.register(this, onoff([{ types: 'focusin', listener: this.#handleFocusin }], this).on())

    CleanupRegistry.register(this, onoff([{ types: 'keydown', listener: this.#handleInputKeydown as EventListener }], this.#input).on())

    // CleanupRegistry.register(this, onoff([{ types: 'input', listener: this.#handleInputInput }], this.#input).on())
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (devFlags.debug) console.debug(`${ToggleView.name} ⚡️ attr-change [${name}] ("${oldValue}" → "${newValue}")`)

    switch (name) {
      case 'value':
        this.value = String(newValue) // this.#input?.setAttribute('checked', newValue ?? '')

        this.#sendValueToForm(this.#connected)

        break
      case 'is-on':
        this.isOn = newValue !== null // this.#input?.setAttribute('checked', newValue ?? '')

        this.#sendValueToForm(this.#connected)

        break
      case 'required':
        // this.#input?.setAttribute(name, newValue ?? '')

        this.#sendValueToForm(this.#connected)

        break
      case 'name':
        this.#sendValueToForm(this.#connected)

        break
      case 'label':
        renderLabel(':scope>label-view[slot=label]', `<label-view slot="label"><span></span></label-view>`, this, newValue)

        break
      case 'disabled':
        for (const el of this.#shadowRoot.querySelectorAll('input')) el.toggleAttribute('disabled', !newValue)

        break
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback()

    this.#validityObservers.unobserveAll()
  }

  connectedCallback() {
    super.connectedCallback()

    // finally
    // if (this.hasAttribute('value')) this.value = this.getAttribute('value') ?? ''

    if (this.hasAttribute('is-on')) this.isOn = this.hasAttribute('is-on')

    this.#sendValueToForm(false)

    this.#connected = true
  }

  get toggleStyle(): ToggleStyle {
    return (toggleStyles as readonly string[]).includes(this.getAttribute('toggle-style') ?? '') ? (this.getAttribute('toggle-style') as (typeof toggleStyles)[number]) : 'switch'
  }

  get isOn() {
    return this.#isOn
  }

  set isOn(v) {
    this.#isOn = Boolean(v)

    this.#value = this.#isOn ? (this.getAttribute('value') ?? 'on') : null

    this.ariaChecked = `${this.#isOn}`
  }

  #handleValiditiesSlotchange = ({ type, target: slot }: Event) => {
    if (devFlags.debug) console.debug(`${ToggleView.name} ⚡️ ${type}`)

    if (!(slot instanceof HTMLSlotElement)) return

    const assigned = slot.assignedElements()

    this.#validityObservers.syncObservations(assigned, ['value', 'label'])

    this.#renderValidityMsgs([])
  }

  #handleFocusin = ({ type, target }: Event) => {
    if (devFlags.debug) console.debug(`${ToggleView.name} ⚡️ ${type}`)

    if (target === this) this.#input?.focus()
  }

  #sendValueToForm = (dispatchEvent: boolean = true) => {
    // input.value has already been updated/synced !!
    if (this.matches(':disabled')) return this.setValidity({})

    if (this.hasAttribute('required') && !this.isOn) {
      this.setValidity({ valueMissing: true })
    } else {
      this.setValidity({})
    }

    const entries = new FormData()

    if (this.value) entries.append(this.name, this.value)

    this.#internals.setFormValue(entries)

    if (dispatchEvent) this.dispatchEvent(new CustomEvent<ToggleChangeDetail>('commit', { detail: { value: this.value, isOn: this.isOn }, bubbles: true, composed: true }))
  }

  #handleInputKeydown = (evt: KeyboardEvent) => {
    if (devFlags.debug) console.debug(`${ToggleView.name} ⚡️ ${evt?.type}`)

    this.isOn = !this.isOn

    this.#sendValueToForm()
  }

  #handleInputInput = (evt: Event) => {
    if (devFlags.debug) console.debug(`${ToggleView.name} ⚡️ ${evt?.type}`)

    this.#sendValueToForm()
  }

  // Optional: form participation properties
  get name() {
    return this.getAttribute('name') ?? this.getAttribute('label') ?? this.querySelector(':scope>[slot=label]')?.textContent ?? ''
  }

  get value() {
    return this.#value
  }

  set value(v) {
    this.#value = this.isOn ? String(v) : null
  }

  setValidity = (flags?: ValidityStateFlags, message?: string, anchor?: HTMLElement) => {
    // let msg

    // if (message)
    for (const k in flags) {
      const key = k as keyof ValidityStateFlags // ✅ type-safe cast
      if (true !== flags[key]) continue

      for (const el of this.#slots?.get('validity-options')?.assignedElements({ flatten: true }) ?? []) {
        if (!el.matches('option')) continue

        const { label, value } = el as HTMLOptionElement

        if (`${kebabCase(key)}` === value) {
          message = label
          break
        } else if (`${kebabCase(key)}:${message}` === value) {
          message = label
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

    if (devFlags.debug) console.debug(`${ToggleView.name} ⚡️ validity-change`)

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
    this.value = ''

    this.#sendValueToForm()
  }
}
