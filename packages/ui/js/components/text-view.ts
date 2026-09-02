import { devFlags } from '../internal/utils'

export class TextView extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    if (devFlags.debug) console.debug(`${TextView.name} ⚡️ connect`)
  }

  disconnectedCallback() {
    if (devFlags.debug) console.debug(`${TextView.name} ⚡️ disconnect`)
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (devFlags.debug) console.debug(`${TextView.name} ⚡️ attr-change [${name}]`)

    //
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'text-view': TextView
  }
}
