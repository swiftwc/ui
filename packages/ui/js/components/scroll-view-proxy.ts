import { debug } from '../internal/utils'

/**
 * @summary A wrapper for {hv}-stacks
 *
 * @slot — The default slot
 */
export class ScrollViewProxy extends HTMLElement {
  constructor() {
    super()
  }

  disconnectedCallback() {
    debug(`${ScrollViewProxy.name} ⚡️ disconnect`)
  }

  connectedCallback() {
    debug(`${ScrollViewProxy.name} ⚡️ connect`)
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'scroll-view-proxy': ScrollViewProxy
  }
}
