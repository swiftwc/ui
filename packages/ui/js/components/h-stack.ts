import { devFlags } from '../internal/utils'

/**
 *
 * @attr {@spacingSet} spacing - The gap between the primary axis
 *
 * @attr {leading|center|trailing} frame:alignment - The alignment of the stack on the cross-axis
 *
 * @attr {@alignmentSet} alignment - The cross-axis alignment
 * @attr {@distributionSet} distribution - The main-axis alignment
 * @attr {@placementSet} placement - The main-axis alignment
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
