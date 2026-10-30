import { debug } from '../internal/utils'

/**
 * @summary A view that arranges its children side by side.
 *
 * @attr {@Template} template — The main-axis grid template
 *
 * @attr {@Spacing} spacing — The gap between the primary axis
 *
 * @attr {@BlockAlignment} alignment — The cross-axis alignment
 * @attr {@InlineAlignment} distribution — The main-axis alignment
 * @attr {@InlinePlacement} placement — The main-axis alignment
 *
 * @slot — The default slot
 *
 */
export class HStack extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    debug(`${HStack.name} ⚡️ connect`)
  }

  disconnectedCallback() {
    debug(`${HStack.name} ⚡️ disconnect`)
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'h-stack': HStack
  }
}
