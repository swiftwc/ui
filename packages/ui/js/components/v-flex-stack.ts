import { debug } from '../internal/utils'

/**
 * @summary A view that arranges its children one on top of the other.
 *
 * @attr {@Template} template — The main-axis grid template
 *
 */
export class VFlexStack extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    debug(`${VFlexStack.name} ⚡️ connect`)
  }

  disconnectedCallback() {
    debug(`${VFlexStack.name} ⚡️ disconnect`)
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'v-flex-stack': VFlexStack
  }
}
