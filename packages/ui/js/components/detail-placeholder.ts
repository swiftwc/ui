import { debug } from '../internal/utils'

export class DetailPlaceholder extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    debug(`${DetailPlaceholder.name} ⚡️ connect`)
  }

  disconnectedCallback() {
    debug(`${DetailPlaceholder.name} ⚡️ disconnect`)
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    debug(`${DetailPlaceholder.name} ⚡️ attr-change [${name}]`)
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'detail-placeholder': DetailPlaceholder
  }
}
