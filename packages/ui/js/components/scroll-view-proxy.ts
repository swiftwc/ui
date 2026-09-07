import { DEBUG } from '../internal/flags.json' with { type: 'json' }

/**
 * @summary A wrapper for {hv}-stacks
 */
export class ScrollViewProxy extends HTMLElement {
  constructor() {
    super()
  }

  disconnectedCallback() {
    DEBUG && console.debug(`${ScrollViewProxy.name} ⚡️ disconnect`)
  }

  connectedCallback() {
    DEBUG && console.debug(`${ScrollViewProxy.name} ⚡️ connect`)
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'scroll-view-proxy': ScrollViewProxy
  }
}
