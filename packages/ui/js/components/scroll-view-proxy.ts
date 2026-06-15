import { devFlags } from '../internal/utils'

/**
 * @summary A wrapper to {hv}-stacks
 */
export class ScrollViewProxy extends HTMLElement {
  constructor() {
    super()
  }

  disconnectedCallback() {
    if (devFlags.debug) console.debug(`${ScrollViewProxy.name} ⚡️ disconnect`)
  }

  connectedCallback() {
    if (devFlags.debug) console.debug(`${ScrollViewProxy.name} ⚡️ connect`)
  }
}
