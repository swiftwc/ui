import { devFlags } from '../internal/utils'

/**
 * @summary A wrapper for {hv}-stacks
 */
export class ScrollViewProxy extends HTMLElement {
  constructor() {
    super()
  }

  disconnectedCallback() {
    devFlags.debug && console.debug(`${ScrollViewProxy.name} ⚡️ disconnect`)
  }

  connectedCallback() {
    devFlags.debug && console.debug(`${ScrollViewProxy.name} ⚡️ connect`)
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'scroll-view-proxy': ScrollViewProxy
  }
}
