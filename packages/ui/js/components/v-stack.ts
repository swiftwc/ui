import { devFlags } from '../internal/utils'

/**
 * @attr {leading|"leading fill"|center|trailing|fill|space-between} distribution - The distribution of cols
 *
 * @attr {"auto spacer"|"auto auto spacer"|"auto auto auto spacer"} template
 *
 * @attr {@spacingSet} spacing - The gap between the primary axis
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
