import { type PickerSelectionDetail } from '../events'
import { CleanupRegistry } from '../internal/class/cleanup-registry'
import { FormAssociatedBase, getInternals, makeSlotchangeHandler } from '../internal/class/form-associated-base'
import { MutationObserverSingleton } from '../internal/class/mutation-observer-singleton'
import { $, kebabCase, onoff } from '../internal/utils'

const pickerStyles = ['menu', 'inline', 'automatic'] as const
export type PickerStyle = (typeof pickerStyles)[number] // type DatePickerStyle = 'decimal-pad' | 'number-pad' | 'automatic'

const observers = new MutationObserverSingleton()

export class PickerView extends FormAssociatedBase {
  static get ATTR() {
    return {
      PLACEHOLDER: 'placeholder',
      LABEL: 'label',
      PICKER_STYLE: 'picker-style',
      SELECTION: 'selection',
    }
  }

  static get observedAttributes() {
    return Object.values(this.ATTR)
  }

  static #templates: Map<string, DocumentFragment> = new Map()

  #lastRenderedStyle?: PickerStyle //string | null

  #shadowRoot

  #customValidity: string = ''

  #validitiesSlot?: HTMLSlotElement

  #datalistSlot?: HTMLSlotElement
  #tagSlot?: HTMLSlotElement

  #trackedElements = new Set<Element>()

  #selection: string = ''

  get #internals(): ElementInternals {
    return getInternals(this)
  }

  get template(): DocumentFragment {
    // const style = this.getAttribute((this.constructor as typeof PickerView).ATTR.PICKER_STYLE) ?? ''

    if (!PickerView.#templates.has(this.pickerStyle))
      switch (this.pickerStyle) {
        // case 'inline':
        //   template.innerHTML = `
        //     <list-view frame-width="infinity" part="root inline-form">
        //       <slot></slot>
        //     </list-view>
        //   `

        //   break
        case 'menu':
          // template.innerHTML = `<slot name="options"></slot><slot></slot>`
          PickerView.#templates.set(
            this.pickerStyle,
            $(
              String.raw`
                <label part="root picker-stack">
            <div part="root picker-label-stack">
              <slot name="label"></slot>
            </div>
            <div part="root picker-input-stack">
              <slot></slot>
            </div>
            <slot name="options" hidden></slot>
            <slot name="tag" hidden></slot>
            <slot name="validity-options" hidden></slot>
          </label>
                `,
              ''
            )
          )

          //   break
          // case 'compact':
          //   PickerView.#templates.set(
          //     style,
          //     Object.assign(document.createElement('template'), {
          //       innerHTML: String.raw`
          //     <label part="compact-picker">
          //       <input type="text" part="compact-input">
          //     </label>
          //   `,
          //     })
          //   )

          //   break
          // case 'fancy':
          //   PickerView.#templates.set(
          //     style,
          //     Object.assign(document.createElement('template'), {
          //       innerHTML: String.raw`
          //     <div part="fancy-picker">
          //       <span>Fancy Picker</span>
          //       <input type="text" part="fancy-input">
          //     </div>
          //   `,
          //     })
          //   )

          break
        //   case 'gg':
        //     PickerView.#templates.set(
        //       style,
        //       Object.assign(document.createElement('template'), {
        //         innerHTML: String.raw`
        // <label part="root text-field-stack">
        // <div part="root text-field-label-stack">
        //   <slot name="label"></slot>
        // </div>
        // <div part="root text-field-input-stack">
        //   <input type="text" part="root input text-field-form-input" list="tickmarks">
        //   <datalist id="tickmarks">
        //     <option value="0" label="0%"></option>
        //   </datalist>
        // </div>
        // <slot name="options" hidden></slot>
        // </label>`,
        //       })
        //     )

        //     break
        case 'inline':
        default:
          PickerView.#templates.set(
            this.pickerStyle,
            $(
              String.raw`
          <label part="root picker-stack">
          <div part="root picker-label-stack">
            <slot name="label"></slot>
          </div>
          <div part="root picker-input-stack">
            <slot></slot>
          </div>
          <slot name="options" hidden></slot>
          <slot name="tag" hidden></slot>
          <slot name="validity-options" hidden></slot>
        </label>`,
              ''
            )
          )

          break
      }

    return PickerView.#templates.get(this.pickerStyle)!
  }

  constructor() {
    super()

    this.#shadowRoot = this.attachShadow({ mode: 'closed' })

    // this.#render() // Snapshot.waitReady.then(this.#render.bind(this))
  }

  connectedCallback() {
    console.debug(`${PickerView.name} ⚡️ connect`)

    CleanupRegistry.register(this, onoff('click', this.#handleClick, this).on())

    if (!this.hasAttribute((this.constructor as typeof PickerView).ATTR.PICKER_STYLE)) this.#render() // will be picked up by attr-change!

    // finally
    if (!this.hasAttribute('selection')) return

    this.#selection = this.getAttribute('selection') ?? ''

    this.#sendValueToForm(false)
  }

  disconnectedCallback() {
    console.debug(`${PickerView.name} ⚡️ disconnect`)

    CleanupRegistry.unregister(this)

    observers.clearObservationsSet(this.#trackedElements)
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    console.debug(`${PickerView.name} ⚡️ attr-change [${name}] ("${oldValue}" → "${newValue}")`)

    switch (name) {
      case (this.constructor as typeof PickerView).ATTR.PLACEHOLDER:
        this.#reflectPlaceholder(newValue)

        break
      case (this.constructor as typeof PickerView).ATTR.LABEL:
        this.#reflectLabel(newValue)

        this.#sendValueToForm()

        break
      case (this.constructor as typeof PickerView).ATTR.PICKER_STYLE:
        if (oldValue === newValue) break

        this.#render()

        // this.#sendValueToForm()

        break
      case (this.constructor as typeof PickerView).ATTR.SELECTION:
        // nothing happens

        break
    }
  }

  get pickerStyle(): PickerStyle {
    return (pickerStyles as readonly string[]).includes(this.getAttribute((this.constructor as typeof PickerView).ATTR.PICKER_STYLE) ?? '')
      ? (this.getAttribute((this.constructor as typeof PickerView).ATTR.PICKER_STYLE) as (typeof pickerStyles)[number])
      : 'automatic'
  }

  #render() {
    console.debug(`${PickerView.name} ⚡️ render (${this.pickerStyle})`)

    if (!this.isConnected) return

    // const style = this.getAttribute((this.constructor as typeof PickerView).ATTR.PICKER_STYLE)
    if (this.#lastRenderedStyle === this.pickerStyle) return // skip if already applied
    this.#lastRenderedStyle = this.pickerStyle

    // clear shadow DOM
    this.#shadowRoot.replaceChildren(document.importNode(this.template, true))

    this.#validitiesSlot = this.#shadowRoot.querySelector<HTMLSlotElement>('slot[name=validity-options]') ?? undefined

    this.#datalistSlot = this.#shadowRoot.querySelector<HTMLSlotElement>('slot[name=options]') ?? undefined
    this.#tagSlot = this.#shadowRoot.querySelector<HTMLSlotElement>('slot[name=tag]') ?? undefined

    CleanupRegistry.unregister(this, 'validities')
    CleanupRegistry.register(this, onoff(makeSlotchangeHandler(this), this.#validitiesSlot).on(), 'validities')

    CleanupRegistry.unregister(this, 'datalist') //off1()
    CleanupRegistry.register(this, onoff('slotchange', this.#handleSlotchange, this.#datalistSlot).on(), 'datalist')

    CleanupRegistry.unregister(this, 'tags') //off2()
    CleanupRegistry.register(this, onoff('slotchange', this.#handleSlotchange, this.#tagSlot).on(), 'tags')

    // if (0 < (this.#datalistSlot?.assignedElements({ flatten: true }) ?? []).length) this.#handleTagMutation()
    // if (0 < (this.#tagSlot?.assignedElements({ flatten: true }) ?? []).length) this.#handleTagMutation()

    //this.getAttribute((this.constructor as typeof PickerView).ATTR.PICKER_STYLE)) {
    switch (
      this.pickerStyle
      // case 'menu':
      //   // if (0 < (this.#datalistSlot?.assignedElements({ flatten: true }) ?? []).length) this.#handleMenuDatalistMutation()

      //   break
      // case 'gg':
      //   // reattach input listener
      //   const input = this.#shadowRoot.querySelector('input')
      //   if (input) {
      //     input.addEventListener('input', () => {
      //       this.#internals!.setFormValue(input.value)
      //     })

      //     // restore placeholder if set
      //     const placeholder = this.getAttribute((this.constructor as typeof PickerView).ATTR.PLACEHOLDER)
      //     if (placeholder) input.setAttribute('placeholder', placeholder)
      //   }

      //   // restore label if set
      //   const label = this.getAttribute((this.constructor as typeof PickerView).ATTR.LABEL)
      //   if (label) this.#reflectLabel(label)

      //   break
      // case 'inline':
      // default:
      //   // if (0 < (this.#datalistSlot?.assignedElements({ flatten: true }) ?? []).length) this.#handleInlineDatalistMutation()

      //   break
    ) {
    }
  }

  #sendValueToForm = (dispatchEvent: boolean = true) => {
    // input.value has already been updated/synced !!
    if (this.matches(':disabled')) return this.setValidity({})

    if (this.hasAttribute('required')) {
      if (!this.#selection) {
        this.setValidity({ badInput: true }, 'invalid-selection')
      } else this.setValidity({})
    } else this.setValidity({})

    const entries = new FormData()

    entries.append(this.name, this.#selection)

    this.#internals.setFormValue(entries)

    if (dispatchEvent)
      this.dispatchEvent(new CustomEvent<PickerSelectionDetail>('selection', { detail: { selection: this.#selection }, bubbles: true, composed: true }))
  }

  #handleClick(evt: Event) {
    console.debug(`${PickerView.name} ⚡️ ${evt?.type}`)

    const target = evt.target as HTMLElement,
      btn = target?.closest('button')

    if (!btn) return

    if (btn.hasAttribute('tag')) {
      this.#selection = btn.getAttribute('tag') ?? '' //return this.dispatchEvent(new CustomEvent('selection', { detail: { tag: btn.getAttribute('tag') }, bubbles: true, composed: true }))
    } else {
      this.#selection = btn.textContent //this.dispatchEvent(new CustomEvent('selection', { detail: { tag: btn.textContent }, bubbles: true, composed: true }))
    }

    this.#sendValueToForm()
  }

  #handleSlotchange = (evt: Event) => {
    console.debug(`${PickerView.name} ⚡️ ${evt?.type}`)

    const slot = evt.target as HTMLSlotElement,
      assigned = slot.assignedElements({ flatten: true })

    observers.syncObservations(this.#trackedElements, assigned, this.#handleTagMutation)

    // for (const el of this.#trackedElements)
    //   if (!assigned.includes(el)) {
    //     observers.unobserve(el)
    //     this.#trackedElements.delete(el)
    //   }

    // for (const el of assigned) {
    //   if (!this.#trackedElements.has(el))
    //     observers.observe(el, this.#handleTagMutation, {
    //       attributes: true,
    //       characterData: true,
    //       subtree: true,
    //       childList: true,
    //       // attributeFilter: ['value', 'label'],
    //     })

    //   this.#trackedElements.add(el)
    // }

    if (0 < assigned.length) this.#handleTagMutation()
  }

  static wrapTag(node: Element, slotName?: string) {
    const btn = $(`<button type="button" tabindex="0"></button>`) //document.createElement('button')
    // btn.type = 'button'
    // btn.tabIndex = 0

    switch (slotName) {
      case 'tag':
        if (node.hasAttribute('tag')) btn.setAttribute('tag', node.getAttribute('tag') ?? '')

        btn.appendChild(node.cloneNode(true))

        break
      case 'options':
      default:
        if (node.hasAttribute('value')) btn.setAttribute('tag', node.getAttribute('value') ?? '')

        const label = $(`<label-view></label-view>`) //document.createElement('label-view')

        if (node.hasAttribute('label')) label.setAttribute('title', node.getAttribute('label') ?? '')

        btn.appendChild(label)

        break
    }

    return btn
  }

  #handleTagMutation = (entry?: MutationRecord) => {
    console.debug(`${PickerView.name} ⚡️ mutation`)

    const sourceSlot = 0 < (this.#datalistSlot?.assignedElements({ flatten: true }) ?? []).length ? this.#datalistSlot : this.#tagSlot

    // switch (this.getAttribute((this.constructor as typeof PickerView).ATTR.PICKER_STYLE)) {
    switch (this.pickerStyle) {
      case 'menu':
        const menu = this.querySelector(':scope>menu-view:not([slot])') ?? this.appendChild($(`<menu-view tabindex="0"></menu-view>`))

        menu.innerHTML = `<label-view slot="label" system-image="dots-three" title="rtyty"></label-view>`

        for (const el of sourceSlot?.assignedElements({ flatten: true }) ?? [])
          menu.insertAdjacentElement('beforeend', PickerView.wrapTag(el, sourceSlot?.name))
        // let possibleMv = this.#slot?.assignedElements({ flatten: true })[0]

        // if ('MENU-VIEW' !== possibleMv?.tagName) possibleMv = this.appendChild(document.createElement('menu-view'))

        // possibleMv.innerHTML = `<label-view slot="label" system-image="dots-three" title="rtyty"></label-view>`

        // for (const el of PickerView.sourceNodes(sourceSlot) ?? []) possibleMv.insertAdjacentElement('beforeend', PickerView.wrapTag(el, sourceSlot?.name))

        break
      case 'inline':
      default:
        const inlineList = this.querySelector(':scope>list-view:not([slot])') ?? this.appendChild($(`<list-view><section-view></section-view></list-view>`)),
          section = inlineList.querySelector(':scope>section-view') ?? inlineList.appendChild($(`<section-view></section-view>`))

        const label = this.getAttribute((this.constructor as typeof PickerView).ATTR.LABEL)

        // if (label) section.setAttribute('header', label)
        if (label) {
          const el = $(`<label-view></label-view>`)

          el.setAttribute('title', label)

          section.insertAdjacentElement('beforeend', el)
        } else section.innerHTML = ''

        for (const el of sourceSlot?.assignedElements({ flatten: true }) ?? [])
          section.insertAdjacentElement('beforeend', PickerView.wrapTag(el, sourceSlot?.name))

        // let possibleLv = this.#slot?.assignedElements({ flatten: true })[0]

        // if ('LIST-VIEW' !== possibleLv?.tagName) possibleLv = this.appendChild(document.createElement('list-view'))

        // const sv = document.createElement('section-view')
        // sv.setAttribute('header', 'section-header')

        // possibleLv.appendChild(sv)

        // for (const el of PickerView.sourceNodes(sourceSlot) ?? []) sv.insertAdjacentElement('beforeend', PickerView.wrapTag(el, sourceSlot?.name))

        // for (const el of this.querySelectorAll(':scope>:not([slot])')) el.remove()

        // for (const el of PickerView.sourceNodes(sourceSlot) ?? []) {
        //   const btn = document.createElement('button')
        //   btn.type = 'button'
        //   btn.tabIndex = 0

        //   btn.appendChild(PickerView.wrapTag(el, sourceSlot?.name))

        //   this.insertAdjacentElement('beforeend', btn)
        // }

        break
    }
  }

  #reflectPlaceholder(value: string | null) {
    const input = this.#shadowRoot.querySelector('input')
    if (input) {
      if (value) input.setAttribute('placeholder', value)
      else input.removeAttribute('placeholder')
    }
  }

  #reflectLabel(value: string | null) {
    // switch (this.getAttribute('picker-style')) {
    //   case 'menu':
    //     this.#slot!.assignedElements({ flatten: true })[0].setAttribute('label', value ?? '')
    //     // if (!mv) {
    //     //   mv = document.createElement('label-view')
    //     //   mv.slot = 'label'
    //     //   this.append(mv)
    //     // }

    //     // mv.textContent = newValue //el2.replaceChildren(escapeHTMLPolicy.createHTML(newValue))

    //     break
    //   default:
    let label = this.querySelector(':scope>[slot=label]')
    if (value) {
      label ??= this.appendChild($(`<span slot="label"></span>`))
      label.textContent = value
    } else label?.remove()

    this.#handleTagMutation()

    // const el =
    //   (this.#labelSlot?.assignedElements({ flatten: true })[0] as HTMLElement) ??
    //   (() => {
    //     const el = document.createElement('span')
    //     el.slot = 'label'
    //     return this.appendChild(el)
    //   })()

    // el.textContent = value ?? '' // el.replaceChildren(escapeHTMLPolicy.createHTML(newValue))
    // break
    // }

    // const assigned = this.#labelSlot?.assignedElements({ flatten: true }) as HTMLElement[] | undefined
    // let el = assigned?.[0]
    // if (!el) {
    //   el = document.createElement('span')
    //   el.slot = 'label'
    //   this.append(el)
    // }
    // el.textContent = value ?? ''
  }

  // Optional: form participation properties
  get name() {
    return this.getAttribute('name') ?? this.getAttribute('label') ?? this.querySelector(':scope>[slot=label]')?.textContent ?? ''
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

    console.debug(`${PickerView.name} ⚡️ validity-change`)

    return this.#internals.setValidity(flags, this.#customValidity || message, anchor)
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
    for (const btn of this.#shadowRoot.querySelectorAll('button')) btn.toggleAttribute('disabled', !disabled)
  }
  formResetCallback = () => {
    this.#selection = ''
  }
}
