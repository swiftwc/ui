import { devFlags } from '../internal/utils'

/**
 * @summary A view that arranges its subviews in a horizontal line.
 *
 * @attr {@templateSet} template - The main-axis grid template
 *
 * @attr {@spacingSet} spacing - The gap between the primary axis
 *
 * @attr {@blockSet} alignment - The cross-axis alignment
 * @attr {@inlineSet} distribution - The main-axis alignment
 * @attr {@inlinePlacementSet} placement - The main-axis alignment
 *
 */
export class HStack extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    if (devFlags.debug) console.debug(`${HStack.name} ⚡️ connect`)
  }

  disconnectedCallback() {
    if (devFlags.debug) console.debug(`${HStack.name} ⚡️ disconnect`)
  }
}
