import { debug } from '../internal/utils'

export class TextView extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    debug(`${TextView.name} ⚡️ connect`)
  }

  disconnectedCallback() {
    debug(`${TextView.name} ⚡️ disconnect`)
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    debug(`${TextView.name} ⚡️ attr-change [${name}]`)

    //
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'text-view': TextView
  }
}
