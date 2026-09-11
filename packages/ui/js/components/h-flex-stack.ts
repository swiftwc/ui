import { debug } from '../internal/utils'

/**
 * @summary A view that arranges its children side by side.
 *
 * @attr {@Spacing} spacing — The gap between the primary axis
 *
 */
export class HFlexStack extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    debug(`${HFlexStack.name} ⚡️ connect`)
  }

  disconnectedCallback() {
    debug(`${HFlexStack.name} ⚡️ disconnect`)
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'h-flex-stack': HFlexStack
  }
}
