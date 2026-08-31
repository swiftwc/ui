import type { ToggleChangeDetail } from '../events'
import { CleanupRegistry } from '../internal/class/cleanup-registry'
import { FormAssociatedBase, getInternals } from '../internal/class/form-associated-base'
import { MutationObserverSet } from '../internal/class/mutation-observer-set'
import { $, devFlags, kebabCase, onoff, touchGlass } from '../internal/utils'
import { queryMorph } from '../morphdom'
import { html } from '../tpl'

const toggleStyles = ['switch', 'button'] as const

export type ToggleStyle = (typeof toggleStyles)[number]

/**
 * @summary A control that switches between on and off states.
 *
 * @fires toggle:change — User toggled the control
 *
 * @slot label
 * @slot {HTMLOptionElement[]} validity-options
 */
export class ToggleView extends FormAssociatedBase {
  static get observedAttributes() {
    return [
      'label',
      'name',
      'value',
      /**
       * @type {boolean}
       */
      'is-on',
      /**
       * @type {boolean}
       */
      'required',
      /**
       * @type {boolean}
       */
      'disabled',
    ]
  }

  static #template: DocumentFragment

  static get template() {
    return (this.#template ??= $(
      html`<label part="root toggle-stack">
        <div part="root toggle-label-stack">
          <slot name="label"></slot>
        </div>
        <div part="root toggle-input-stack">
          <div part="root toggle-track" tabindex="0"></div>
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

  #track?: HTMLElement

  #value: string | null = 'on'
  #isOn: boolean = false

  #didDrag: boolean = false
  #trackWidth: number = 0
  #dotSize: number = 0
  get #trackMinX(): number {
    return 0
  }
  get #trackMaxX(): number {
    return this.#trackWidth - this.#dotSize
  }
  #handleMeasure = ([{ target, borderBoxSize }]: ResizeObserverEntry[]) => {
    if (devFlags.debug) console.debug(`${ToggleView.name} ⚡️ measure`)

    if (!(target instanceof HTMLElement)) return

    this.#trackWidth = borderBoxSize.at(0)?.inlineSize ?? 0

    this.#dotSize = borderBoxSize.at(0)?.blockSize ?? 0
  }
  #resizeObserver = new ResizeObserver(this.#handleMeasure)

  get #isDragging(): boolean {
    return '0ms' === this.#track?.style.getPropertyValue('--toggle--dot-transition-duration')
  }

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

    this.#track = this.#shadowRoot.querySelector('[part*=toggle-track]') ?? undefined

    CleanupRegistry.register(this, onoff([{ types: 'focusin', listener: this.#handleFocusin }], this).on())

    CleanupRegistry.register(
      this,
      onoff(
        [
          { types: 'keydown', listener: this.#handleTrackKeydown as EventListener },
          { types: 'click', listener: this.#handleTrackClick as EventListener },
          { types: 'pointerdown', listener: this.#handleTrackPointerdown as EventListener },
          { types: 'pointerup', listener: this.#handleTrackPointerup as EventListener },
          { types: 'pointercancel', listener: this.#handleTrackPointercancel as EventListener },
          { types: 'pointermove', listener: this.#handleTrackPointermove as EventListener },
          { types: 'lostpointercapture', listener: this.#handleTrackPointercancel as EventListener },
        ],
        this.#track
      ).on()
    )

    CleanupRegistry.register(this, onoff([{ types: 'blur', listener: this.#handleWindowBlur }], self).on())
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (devFlags.debug) console.debug(`${ToggleView.name} ⚡️ attr-change [${name}] ("${oldValue}" → "${newValue}")`)

    switch (name) {
      case 'value':
        this.value = String(newValue) // this.#input?.setAttribute('checked', newValue ?? '')

        this.#sendValueToForm(false)

        break
      case 'is-on':
        this.isOn = newValue !== null // this.#input?.setAttribute('checked', newValue ?? '')

        this.#sendValueToForm(false)

        break
      case 'required':
        // this.#input?.setAttribute(name, newValue ?? '')

        this.#sendValueToForm(false)

        break
      case 'name':
        this.#sendValueToForm(false)

        break
      case 'label':
        queryMorph('[slot=label]', html`<label-view slot="label">${newValue ? html`<span>${newValue}</span>` : null}</label-view>`, this)

        break
      case 'disabled':
        for (const el of this.#shadowRoot.querySelectorAll('input')) el.toggleAttribute('disabled', !newValue)

        break
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback()

    if (this.#track) this.#resizeObserver.unobserve(this.#track)

    this.#validityObservers.unobserveAll()
  }

  connectedCallback() {
    super.connectedCallback()

    if (this.hasAttribute('is-on')) this.isOn = this.hasAttribute('is-on')

    this.#sendValueToForm(false)

    if (this.#track) this.#resizeObserver.observe(this.#track)

    CleanupRegistry.register(
      this,
      onoff(
        touchGlass(
          this,
          (t) => t,
          ({ clientX, clientY }) => this.#measurePointerIsOverDot(clientX, clientY) ?? false
        ),
        this
      ).on()
    )
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

    if (target === this) this.#track?.focus()
  }

  #handleTrackClick = ({ type }: Event) => {
    if (devFlags.debug) console.debug(`${ToggleView.name} ⚡️ ${type}`)

    if (this.#didDrag) return (this.#didDrag = false)

    this.#applyIsOnWithFlip(!this.isOn)

    this.#sendValueToForm(true)
  }

  #measurePointerIsOverDot = (clientX: number, clientY: number) => {
    if (!this.#track) return

    const { left, top, height } = this.#track.getBoundingClientRect()

    const dotLeft = left + parseFloat(self.getComputedStyle(this.#track, '::before').left)
    const dotCenterX = dotLeft + this.#dotSize / 2
    const dotCenterY = top + height / 2

    return Math.hypot(clientX - dotCenterX, clientY - dotCenterY) <= this.#dotSize / 2
  }

  #dragOffsetX: number = 0

  get #baseX(): number {
    return this.isOn ? this.#trackMaxX : this.#trackMinX
  }

  #handleTrackPointerdown = ({ type, pointerId, clientX, clientY }: PointerEvent) => {
    if (devFlags.debug) console.debug(`${ToggleView.name} ⚡️ ${type}`)

    if (!this.#track) return

    if (!this.#measurePointerIsOverDot(clientX, clientY)) return // ignore taps elsewhere on the track

    this.#didDrag = true // dot was engaged — settle() will own the outcome, click must be swallowed

    const currentDelta = parseFloat(self.getComputedStyle(this.#track).getPropertyValue('--toggle--dot-x')) || 0
    const currentAbsoluteX = this.#baseX + currentDelta

    this.#dragOffsetX = clientX - this.#track.getBoundingClientRect().left - currentAbsoluteX

    this.#track.style.setProperty('--toggle--dot-transition-duration', '0ms')

    this.#track.setPointerCapture(pointerId)

    // this.#updateFromEvent(clientX)
  }

  #handleTrackPointermove = ({ type, clientX }: PointerEvent) => {
    if (devFlags.debug) console.debug(`${ToggleView.name} ⚡️ ${type}`)

    if (!this.#isDragging) return

    this.#updateFromEvent(clientX)
  }

  #handleTrackPointerup = ({ type, pointerId }: PointerEvent) => {
    if (devFlags.debug) console.debug(`${ToggleView.name} ⚡️ ${type}`)

    if (!this.#isDragging) return // pointerdown never engaged (missed the dot) — plain click, nothing to settle

    this.#track?.style.removeProperty('--toggle--dot-transition-duration')

    this.#track?.releasePointerCapture(pointerId)

    this.#settle()
  }

  #handleTrackPointercancel = ({ type }: PointerEvent) => {
    if (devFlags.debug) console.debug(`${ToggleView.name} ⚡️ ${type}`)

    if (!this.#isDragging) return // already settled via pointerup, or nothing to settle

    this.#track?.style.removeProperty('--toggle--dot-transition-duration')

    this.#settle()
  }

  #handleWindowBlur = () => {
    if (!this.#isDragging) return

    this.#track?.style.removeProperty('--toggle--dot-transition-duration')

    this.#settle()
  }

  #updateFromEvent = (clientX: number) => {
    if (!this.#track) return

    const { left } = this.#track.getBoundingClientRect()

    const absoluteX = Math.min(Math.max(clientX - left - this.#dragOffsetX, this.#trackMinX), this.#trackMaxX)

    this.#track.style.setProperty('--toggle--dot-x', `${Math.round(absoluteX - this.#baseX)}px`)
  }

  #settle = () => {
    if (!this.#track) return

    const deltaX = parseFloat(self.getComputedStyle(this.#track).getPropertyValue('--toggle--dot-x')) || 0
    const absoluteX = this.#baseX + deltaX

    const nextIsOn = absoluteX > this.#trackMaxX / 2

    if (nextIsOn === this.isOn) return this.#track.style.removeProperty('--toggle--dot-x') // pure transform animation back to rest, inset untouched

    this.#applyIsOnWithFlip(nextIsOn)

    this.#sendValueToForm(true)
  }

  #handleTrackKeydown = (evt: KeyboardEvent) => {
    if (devFlags.debug) console.debug(`${ToggleView.name} ⚡️ ${evt?.type}`)

    if (' ' !== evt.key) return

    evt.preventDefault()

    this.#applyIsOnWithFlip(!this.isOn)

    this.#sendValueToForm(true)
  }

  #applyIsOnWithFlip = (nextIsOn: boolean) => {
    if (!this.#track || nextIsOn === this.isOn) return

    // capture current visual position under the OLD base, before flipping state
    const deltaX = parseFloat(self.getComputedStyle(this.#track).getPropertyValue('--toggle--dot-x')) || 0,
      oldAbsoluteX = this.#baseX + deltaX

    this.isOn = nextIsOn // changes --toggle--dot-inset-inline-start/-end via aria-checked

    const compensationX = oldAbsoluteX - this.#baseX // baseX now reflects the NEW state

    // make inset + transform jump together, instantly, so nothing is visibly out of sync
    this.#track.style.setProperty('--toggle--dot-transition-duration', '0ms')
    this.#track.style.setProperty('--toggle--dot-x', `${Math.round(compensationX)}px`)

    void this.#track.offsetWidth // force reflow so the instant jump is committed before re-enabling transitions

    this.#track.style.removeProperty('--toggle--dot-transition-duration')

    self.requestAnimationFrame(() => {
      this.#track?.style.removeProperty('--toggle--dot-x') // only transform animates from here — single source of motion
    })
  }

  #sendValueToForm = (dispatchEvent: boolean = true) => {
    // input.value has already been updated/synced !!
    if (this.matches(':disabled')) return this.setValidity({})

    if (this.hasAttribute('required') && !this.isOn) {
      this.setValidity({ valueMissing: true })
    } else this.setValidity({})

    const entries = new FormData()

    if (this.value) entries.append(this.name, this.value)

    this.#internals.setFormValue(entries)

    if (dispatchEvent) this.dispatchEvent(new CustomEvent<ToggleChangeDetail>('toggle:change', { detail: { value: this.value, isOn: this.isOn }, bubbles: true, composed: true }))
  }

  /**
   * Form participation property
   */
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

    return this.#internals.setValidity(flags, this.#customValidity || message, anchor ?? this.#track)
  }
  setCustomValidity = (message: string) => {
    this.#customValidity = message

    if (this.#customValidity) this.#internals.setValidity({ ...this.#internals.validity, customError: true }, message)
    else this.#sendValueToForm(false)
  }
  formStateRestoreCallback(state: string, reason: string) {
    this.value = state
  }
  formAssociatedCallback(form: HTMLFormElement) {
    this.#sendValueToForm(false)
  }
  formDisabledCallback(disabled: boolean) {
    for (const el of this.#shadowRoot.querySelectorAll('input')) el.toggleAttribute('disabled', !disabled)
  }
  formResetCallback() {
    this.value = ''

    this.#sendValueToForm(false)
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'toggle-view': ToggleView
  }
}
