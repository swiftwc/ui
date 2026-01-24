import { Snapshot } from '../snapshot'

export class ToolBar extends HTMLElement {
  static #template: HTMLTemplateElement

  static get template() {
    if (!this.#template)
      this.#template = Object.assign(document.createElement('template'), {
        innerHTML: `<navigation-bar part="root navigation-bar" exportparts="toolbar-leading-stack,toolbar-principal-stack,toolbar-trailing-stack">
    <slot name="navigation-bar-leading" slot="leading"></slot>
    <slot name="navigation-bar-principal"></slot>
    <slot name="navigation-bar-trailing" slot="trailing"></slot>
  </navigation-bar>
  <bottom-bar part="root bottom-bar" exportparts="toolbar-leading-stack,toolbar-principal-stack,toolbar-trailing-stack">
    <slot name="bottom-bar-leading" slot="leading"></slot>
    <slot name="bottom-bar-principal"></slot>
    <slot name="bottom-bar-trailing" slot="trailing"></slot>
  </bottom-bar>`,
      })

    return this.#template
  }

  #shadowRoot

  constructor() {
    super()

    this.#shadowRoot = this.attachShadow({ mode: 'open' })

    Snapshot.waitReady.then(() => {
      this.#shadowRoot.appendChild(
        document.importNode(
          (this.constructor as typeof ToolBar).template.content,
          true
        )
      )
    })
  }

  connectedCallback() {
    console.debug(`${ToolBar.name} ⚡️ connect`)
  }

  disconnectedCallback() {
    console.debug(`${ToolBar.name} ⚡️ disconnect`)
  }
}
