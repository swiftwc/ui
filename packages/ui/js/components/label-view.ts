import { $, devFlags } from '../internal/utils'

export class LabelView extends HTMLElement {
  static get observedAttributes() {
    return ['system-image', 'title', 'line-limit', 'truncation-mode']
  }

  static #template: DocumentFragment

  static get template() {
    return (this.#template ??= $(
      String.raw`
    <slot name="icon"></slot>
    <slot></slot>
    `
      //     String.raw`
      // <div part="root label-image-stack">
      //   <slot name="image"></slot>
      // </div>
      // <div part="root label-title-stack">
      //   <slot></slot>
      // </div>`
    ))
  }

  #shadowRoot

  constructor() {
    super()

    this.#shadowRoot = this.attachShadow({ mode: 'closed' })

    this.#shadowRoot.appendChild(document.importNode((this.constructor as typeof LabelView).template, true))
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (devFlags.debug) console.debug(`${LabelView.name} ⚡️ attr-change [${name}] ("${oldValue}" → "${newValue}")`)

    if (oldValue === newValue) return

    switch (name) {
      case 'system-image':
        let image = this.querySelector(':scope>[slot=icon]')
        if (newValue) {
          image ??= this.appendChild($(`<i slot="icon" style="line-height: 1.05"></i>`, '>1'))
          image.setAttribute('class', `ph ph-${newValue}`)
        } else image?.remove()

        break
      case 'title':
        let title = this.querySelector(':scope>:not([slot])')
        if (newValue) {
          title ??= this.appendChild($(`<span></span>`, '>1'))
          title.textContent = newValue
        } else title?.remove()

        break
    }
  }

  disconnectedCallback() {
    if (devFlags.debug) console.debug(`${LabelView.name} ⚡️ disconnect`)
  }

  connectedCallback() {
    if (devFlags.debug) console.debug(`${LabelView.name} ⚡️ connect`)
  }
}
