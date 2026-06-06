import { debug } from '../internal/utils'

/**
 * @summary A wrapper to {hv}-stacks
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
