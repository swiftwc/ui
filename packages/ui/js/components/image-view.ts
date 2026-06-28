import { $, devFlags } from '../internal/utils'

export class ImageView extends HTMLElement {
  static get observedAttributes() {
    return ['system-name']
  }

  static #template: DocumentFragment

  static get template() {
    return (this.#template ??= $(String.raw`<slot></slot>`))
  }

  #shadowRoot

  constructor() {
    super()

    this.#shadowRoot = this.attachShadow({ mode: 'closed' })

    this.#shadowRoot.appendChild(document.importNode((this.constructor as typeof ImageView).template, true))
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (devFlags.debug) console.debug(`${ImageView.name} ⚡️ attr-change [${name}] ("${oldValue}" → "${newValue}")`)

    switch (name) {
      case 'system-name':
        if (oldValue === newValue) break

        // this.innerHTML = `<i style="line-height: 1.05" class="ph ph-${newValue}"></i>`

        //this.setAttribute('class', `ph ph-${newValue}`)
        let image = this.querySelector(':scope>:not([slot])')
        if (newValue) {
          const el = image ?? $(`<i style="line-height: 1.05"></i>`, '>1')
          el.setAttribute('class', `ph ph-${newValue}`)
          image ??= this.appendChild(el)
          // image ??= this.appendChild($(`<i style="line-height: 1.05"></i>`, '>1'))
          // image.setAttribute('class', `ph ph-${newValue}`)
        } else image?.remove()

        break
    }
  }

  disconnectedCallback() {
    if (devFlags.debug) console.debug(`${ImageView.name} ⚡️ disconnect`)
  }

  connectedCallback() {
    if (devFlags.debug) console.debug(`${ImageView.name} ⚡️ connect`)
  }
}
