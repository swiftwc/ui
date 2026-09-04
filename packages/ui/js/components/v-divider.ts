import { devFlags } from '../internal/utils'

export class VDivider extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    devFlags.debug && console.debug(`${VDivider.name} ⚡️ connect`)
  }

  disconnectedCallback() {
    devFlags.debug && console.debug(`${VDivider.name} ⚡️ disconnect`)
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    devFlags.debug && console.debug(`${VDivider.name} ⚡️ attr-change [${name}]`)
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'v-divider': VDivider
  }
}
