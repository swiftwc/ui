import { DEBUG } from '../internal/flags.json' with { type: 'json' }

export class HDivider extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    DEBUG && console.debug(`${HDivider.name} ⚡️ connect`)
  }

  disconnectedCallback() {
    DEBUG && console.debug(`${HDivider.name} ⚡️ disconnect`)
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    DEBUG && console.debug(`${HDivider.name} ⚡️ attr-change [${name}]`)
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'h-divider': HDivider
  }
}
