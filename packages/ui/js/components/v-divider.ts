import { debug } from '../internal/utils'

export class VDivider extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    debug(`${VDivider.name} ⚡️ connect`)
  }

  disconnectedCallback() {
    debug(`${VDivider.name} ⚡️ disconnect`)
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    debug(`${VDivider.name} ⚡️ attr-change [${name}]`)
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'v-divider': VDivider
  }
}
