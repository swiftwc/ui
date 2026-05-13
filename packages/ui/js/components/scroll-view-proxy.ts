/**
 * @summary A wrapper to {hv}-stacks
 */
export class ScrollViewProxy extends HTMLElement {
  constructor() {
    super()
  }

  disconnectedCallback() {
    console.debug(`${ScrollViewProxy.name} ⚡️ disconnect`)
  }

  connectedCallback() {
    console.debug(`${ScrollViewProxy.name} ⚡️ connect`)
  }
}
