import { devFlags } from '../internal/utils'

export class DetailPlaceholder extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    if (devFlags.debug) console.debug(`${DetailPlaceholder.name} ⚡️ connect`)
  }

  disconnectedCallback() {
    if (devFlags.debug) console.debug(`${DetailPlaceholder.name} ⚡️ disconnect`)
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (devFlags.debug) console.debug(`${DetailPlaceholder.name} ⚡️ attr-change [${name}]`)

    //
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'detail-placeholder': DetailPlaceholder
  }
}
