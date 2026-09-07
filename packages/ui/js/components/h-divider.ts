import { debug } from '../internal/utils'

export class HDivider extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    debug(`${HDivider.name} ⚡️ connect`)
  }

  disconnectedCallback() {
    debug(`${HDivider.name} ⚡️ disconnect`)
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    debug(`${HDivider.name} ⚡️ attr-change [${name}]`)
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'h-divider': HDivider
  }
}
