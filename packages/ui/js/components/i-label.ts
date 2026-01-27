import { Snapshot } from '../snapshot'

export class ILabel extends HTMLElement {
  static observedAttributes = ['system-image']

  static #template: HTMLTemplateElement

  static get template() {
    if (!this.#template)
      this.#template = Object.assign(document.createElement('template'), {
        innerHTML: `<div part="root label-image-stack">
    <slot name="image"></slot>
  </div>
  <div part="root label-title-stack">
    <slot></slot>
  </div>`,
      })

    return this.#template
  }

  #shadowRoot

  constructor() {
    super()

    this.#shadowRoot = this.attachShadow({ mode: 'open' })

    Snapshot.waitReady.then(() => {
      this.#shadowRoot.appendChild(document.importNode((this.constructor as typeof ILabel).template.content, true))
    })
  }

  disconnectedCallback() {
    console.debug(`${ILabel.name} ⚡️ disconnect`)
  }

  connectedCallback() {
    console.debug(`${ILabel.name} ⚡️ connect`)
  }
}
