import { DEBUG } from '../internal/flags.json' with { type: 'json' }

/**
 * @summary A view that arranges its children side by side.
 *
 * @attr {@Template} template — The main-axis grid template
 *
 * @attr {@Spacing} spacing — The gap between the primary axis
 *
 * @attr {@blockSet} alignment — The cross-axis alignment
 * @attr {@inlineSet} distribution — The main-axis alignment
 * @attr {@inlinePlacementSet} placement — The main-axis alignment
 *
 */
export class HStack extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    DEBUG && console.debug(`${HStack.name} ⚡️ connect`)
  }

  disconnectedCallback() {
    DEBUG && console.debug(`${HStack.name} ⚡️ disconnect`)
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'h-stack': HStack
  }
}
