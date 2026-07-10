import { devFlags } from '../internal/utils'

/**
 * @attr {leading|"leading fill"|center|trailing|fill|space-between} distribution - The distribution of cols
 *
 * @attr {"auto spacer"|"auto auto spacer"|"auto auto auto spacer"} template
 *
 * @attr {leading|center|trailing} frame:alignment - The alignment of the stack on the cross-axis
 *
 * @attr {@spacingSet} spacing - The gap between the primary axis
 *
 * @attr {@alignmentSet} alignment - The cross-axis alignment
 * @attr {@distributionSet} distribution - The main-axis alignment
 * @attr {@placementSet} placement - The main-axis alignment
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
