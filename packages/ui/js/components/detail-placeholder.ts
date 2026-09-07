import { DEBUG } from '../internal/flags.json' with { type: 'json' }

export class DetailPlaceholder extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    DEBUG && console.debug(`${DetailPlaceholder.name} ⚡️ connect`)
  }

  disconnectedCallback() {
    DEBUG && console.debug(`${DetailPlaceholder.name} ⚡️ disconnect`)
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    DEBUG && console.debug(`${DetailPlaceholder.name} ⚡️ attr-change [${name}]`)
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'detail-placeholder': DetailPlaceholder
  }
}
