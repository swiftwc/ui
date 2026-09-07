import { DEBUG } from '../internal/flags.json' with { type: 'json' }

export class VDivider extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    DEBUG && console.debug(`${VDivider.name} ⚡️ connect`)
  }

  disconnectedCallback() {
    DEBUG && console.debug(`${VDivider.name} ⚡️ disconnect`)
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    DEBUG && console.debug(`${VDivider.name} ⚡️ attr-change [${name}]`)
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'v-divider': VDivider
  }
}
