import { devFlags } from '../internal/utils'

export class HDivider extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    devFlags.debug && console.debug(`${HDivider.name} ⚡️ connect`)
  }

  disconnectedCallback() {
    devFlags.debug && console.debug(`${HDivider.name} ⚡️ disconnect`)
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    devFlags.debug && console.debug(`${HDivider.name} ⚡️ attr-change [${name}]`)
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'h-divider': HDivider
  }
}
