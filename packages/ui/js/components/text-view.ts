import { DEBUG } from '../internal/flags.json' with { type: 'json' }

export class TextView extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    DEBUG && console.debug(`${TextView.name} ⚡️ connect`)
  }

  disconnectedCallback() {
    DEBUG && console.debug(`${TextView.name} ⚡️ disconnect`)
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    DEBUG && console.debug(`${TextView.name} ⚡️ attr-change [${name}]`)

    //
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'text-view': TextView
  }
}
