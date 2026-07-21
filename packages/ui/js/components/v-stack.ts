import { devFlags } from '../internal/utils'

/**
 * @summary A view that arranges its subviews in a vertical line.
 *
 * @attr {leading|"leading fill"|center|trailing|fill|space-between} distribution - The distribution of cols
 *
 * @attr {@templateSet} template - The main-axis grid template
 *
 * @attr {@spacingSet} spacing - The gap between the primary axis
 *
 * @attr {@inlineSet} alignment - The cross-axis alignment
 * @attr {@blockSet} distribution - The main-axis alignment
 * @attr {@blockPlacementSet} placement - The main-axis alignment
 *
 */
export class VStack extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    if (devFlags.debug) console.debug(`${VStack.name} ⚡️ connect`)
  }

  disconnectedCallback() {
    if (devFlags.debug) console.debug(`${VStack.name} ⚡️ disconnect`)
  }
}
