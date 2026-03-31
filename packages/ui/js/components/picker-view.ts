import { Snapshot } from '../snapshot'
import { MutationObserverSingleton } from '../internal/class/mutation-observer-singleton'
import { $, onoff } from '../internal/utils'
import { CleanupRegistry } from '../internal/class/cleanup-registry'

const observers = new MutationObserverSingleton()

export class PickerView extends HTMLElement {
  static get ATTR() {
    return {
      PLACEHOLDER: 'placeholder',
      LABEL: 'label',
      PICKER_STYLE: 'picker-style',
    }
  }

  static get observedAttributes() {
    return Object.values(this.ATTR)
  }

  static get formAssociated() {
    return true
  }

  static #templates: Map<string, HTMLTemplateElement> = new Map()

  #lastRenderedStyle?: string | null

  get template(): HTMLTemplateElement {
    const style = this.getAttribute((this.constructor as typeof PickerView).ATTR.PICKER_STYLE) ?? ''

    if (!PickerView.#templates.has(style))
      switch (style) {
        // case 'inline':
        //   template.innerHTML = `
        //     <list-view frame-width="infinity" part="root inline-form">
        //       <slot></slot>
        //     </list-view>
        //   `

        //   break
        case 'menu':
          // template.innerHTML = `<slot name="list"></slot><slot></slot>`
          PickerView.#templates.set(
            style,
            Object.assign(document.createElement('template'), {
              innerHTML: String.raw`
                <label part="root picker-stack">
            <div part="root picker-label-stack">
              <slot name="label"></slot>
            </div>
            <div part="root picker-input-stack">
              <slot></slot>
            </div>
            <slot name="list"></slot>
            <slot name="tag" hidden></slot>
          </label>
                `,
            })
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
        case 'gg':
          PickerView.#templates.set(
            style,
            Object.assign(document.createElement('template'), {
              innerHTML: String.raw`
      <label part="root text-field-stack">
      <div part="root text-field-label-stack">
        <slot name="label"></slot>
      </div>
      <div part="root text-field-input-stack">
        <input type="text" part="root input text-field-form-input" list="tickmarks">
        <datalist id="tickmarks">
          <option value="0" label="0%"></option>
        </datalist>
      </div>
      <slot name="list"></slot>
      </label>`,
            })
          )

          break
        case 'inline':
        default:
          PickerView.#templates.set(
            style,
            Object.assign(document.createElement('template'), {
              innerHTML: String.raw`
          <label part="root picker-stack">
          <div part="root picker-label-stack">
            <slot name="label"></slot>
          </div>
          <div part="root picker-input-stack">
            <slot></slot>
          </div>
          <slot name="list"></slot>
          <slot name="tag" hidden></slot>
        </label>`,
            })
          )

          break
      }

    return PickerView.#templates.get(style)!
  }

  #shadowRoot

  #slot?: HTMLSlotElement
  #labelSlot?: HTMLSlotElement
  #datalistSlot?: HTMLSlotElement
  #tagSlot?: HTMLSlotElement

  #trackedElements = new Set<Element>()

  #internals?: ElementInternals

  constructor() {
    super()

    this.#shadowRoot = this.attachShadow({ mode: 'closed' })

    this.#internals = this.attachInternals()

    const { on } = onoff('click', this.#handleClick, this)

    CleanupRegistry.register(this, on())

    this.#render() // Snapshot.waitReady.then(this.#render.bind(this))
  }

  connectedCallback() {
    console.debug(`${PickerView.name} ⚡️ connect`)

    if (this.hasAttribute((this.constructor as typeof PickerView).ATTR.PICKER_STYLE)) return // will be picked up by attr-change!

    this.#render()
  }

  disconnectedCallback() {
    console.debug(`${PickerView.name} ⚡️ disconnect`)

    CleanupRegistry.unregister(this)

    this.#trackedElements.clear()
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    console.debug(`${PickerView.name} ⚡️ attr-change [${name}] ("${oldValue}" → "${newValue}")`)

    // Snapshot.waitReady.then(() => {
    switch (name) {
      case (this.constructor as typeof PickerView).ATTR.PLACEHOLDER:
        this.#reflectPlaceholder(newValue)

        break
      case (this.constructor as typeof PickerView).ATTR.LABEL:
        this.#reflectLabel(newValue)

        break
      case (this.constructor as typeof PickerView).ATTR.PICKER_STYLE:
        if (oldValue !== newValue) this.#render()

        break
    }
    // })
  }

  #render() {
    if (!this.isConnected) return

    console.debug(`${PickerView.name} ⚡️ render (${this.getAttribute((this.constructor as typeof PickerView).ATTR.PICKER_STYLE)})`)

    const style = this.getAttribute((this.constructor as typeof PickerView).ATTR.PICKER_STYLE)
    if (this.#lastRenderedStyle === style) return // skip if already applied
    this.#lastRenderedStyle = style

    // clear shadow DOM
    this.#shadowRoot.replaceChildren(document.importNode(this.template.content, true))

    this.#datalistSlot = this.#shadowRoot.querySelector('slot[name=list]') ?? undefined
    this.#labelSlot = this.#shadowRoot.querySelector('slot[name=label]') ?? undefined
    this.#tagSlot = this.#shadowRoot.querySelector('slot[name=tag]') ?? undefined
    this.#slot = this.#shadowRoot.querySelector('slot:not([name])') ?? undefined

    CleanupRegistry.unregister(this, 'datalist') //off1()
    CleanupRegistry.register(this, onoff('slotchange', this.#handleSlotchange, this.#datalistSlot).on(), 'datalist')

    CleanupRegistry.unregister(this, 'tags') //off2()
    CleanupRegistry.register(this, onoff('slotchange', this.#handleSlotchange, this.#tagSlot).on(), 'tags')

    // if (0 < (this.#datalistSlot?.assignedElements({ flatten: true }) ?? []).length) this.#handleTagMutation()
    // if (0 < (this.#tagSlot?.assignedElements({ flatten: true }) ?? []).length) this.#handleTagMutation()

    switch (this.getAttribute((this.constructor as typeof PickerView).ATTR.PICKER_STYLE)) {
      // case 'menu':
      //   // if (0 < (this.#datalistSlot?.assignedElements({ flatten: true }) ?? []).length) this.#handleMenuDatalistMutation()

      //   break
      case 'gg':
        // reattach input listener
        const input = this.#shadowRoot.querySelector('input')
        if (input) {
          input.addEventListener('input', () => {
            this.#internals!.setFormValue(input.value)
          })

          // restore placeholder if set
          const placeholder = this.getAttribute((this.constructor as typeof PickerView).ATTR.PLACEHOLDER)
          if (placeholder) input.setAttribute('placeholder', placeholder)
        }

        // restore label if set
        const label = this.getAttribute((this.constructor as typeof PickerView).ATTR.LABEL)
        if (label) this.#reflectLabel(label)

        break
      // case 'inline':
      // default:
      //   // if (0 < (this.#datalistSlot?.assignedElements({ flatten: true }) ?? []).length) this.#handleInlineDatalistMutation()

      //   break
    }
  }

  #handleClick(evt: Event) {
    console.debug(`${PickerView.name} ⚡️ ${evt?.type}`)

    const target = evt.target as HTMLElement,
      btn = target?.closest('button')

    if (!btn) return

    if (btn.hasAttribute('tag'))
      return this.dispatchEvent(new CustomEvent('selection', { detail: { tag: btn.getAttribute('tag') }, bubbles: true, composed: true }))

    return this.dispatchEvent(new CustomEvent('selection', { detail: { tag: btn.textContent }, bubbles: true, composed: true }))
  }

  #handleSlotchange = (evt: Event) => {
    console.debug(`${PickerView.name} ⚡️ ${evt?.type}`)

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
          // attributeFilter: ['value', 'label'], TODO:
        })

      this.#trackedElements.add(el)
    }

    if (0 < assigned.length) this.#handleTagMutation()
  }

  static sourceNodes(slot?: HTMLSlotElement) {
    switch (slot?.name) {
      case 'tag':
        return slot?.assignedElements({ flatten: true })

      case 'list':
      default:
        return slot?.assignedElements({ flatten: true })[0]?.querySelectorAll<HTMLOptionElement>(':scope>option')
    }
  }

  static wrapTag(node: Element, slotName?: string) {
    const btn = document.createElement('button')
    btn.type = 'button'
    btn.tabIndex = 0

    switch (slotName) {
      case 'tag':
        if (node.hasAttribute('tag')) btn.setAttribute('tag', node.getAttribute('tag') ?? '')

        btn.appendChild(node.cloneNode(true))

        break
      case 'list':
      default:
        if (node.hasAttribute('value')) btn.setAttribute('tag', node.getAttribute('value') ?? '')

        const label = document.createElement('label-view')

        if (node.hasAttribute('label')) label.setAttribute('title', node.getAttribute('label') ?? '')

        btn.appendChild(label)

        break
    }

    return btn
  }

  #handleTagMutation = (entry?: MutationRecord) => {
    console.debug(`${PickerView.name} ⚡️ mutation`)

    const sourceSlot = 0 < (this.#datalistSlot?.assignedElements({ flatten: true }) ?? []).length ? this.#datalistSlot : this.#tagSlot

    switch (this.getAttribute((this.constructor as typeof PickerView).ATTR.PICKER_STYLE)) {
      case 'menu':
        const menu = this.querySelector(':scope>menu-view:not([slot])') ?? this.appendChild($(`<menu-view></menu-view>`))

        menu.innerHTML = `<label-view slot="label" system-image="dots-three" title="rtyty"></label-view>`

        for (const el of PickerView.sourceNodes(sourceSlot) ?? []) menu.insertAdjacentElement('beforeend', PickerView.wrapTag(el, sourceSlot?.name))
        // let possibleMv = this.#slot?.assignedElements({ flatten: true })[0]

        // if ('MENU-VIEW' !== possibleMv?.tagName) possibleMv = this.appendChild(document.createElement('menu-view'))

        // possibleMv.innerHTML = `<label-view slot="label" system-image="dots-three" title="rtyty"></label-view>`

        // for (const el of PickerView.sourceNodes(sourceSlot) ?? []) possibleMv.insertAdjacentElement('beforeend', PickerView.wrapTag(el, sourceSlot?.name))

        break
      case 'inline':
      default:
        const list = this.querySelector(':scope>list-view:not([slot])') ?? this.appendChild($(`<list-view><section-view></section-view></list-view>`)),
          section = list.querySelector(':scope>section-view') ?? list.appendChild($(`<section-view></section-view>`))

        const label = this.getAttribute((this.constructor as typeof PickerView).ATTR.LABEL)

        // if (label) section.setAttribute('header', label)
        if (label) {
          const el = $(`<label-view></label-view>`)

          el.setAttribute('title', label)

          section.insertAdjacentElement('beforeend', el)
        } else section.innerHTML = ''

        for (const el of PickerView.sourceNodes(sourceSlot) ?? []) section.insertAdjacentElement('beforeend', PickerView.wrapTag(el, sourceSlot?.name))

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
  get form() {
    return this.#internals!.form
  }
  get name() {
    return this.getAttribute('name')
  }
  get type() {
    return 'text'
  }
}
