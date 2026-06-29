import { devFlags } from '../internal/utils'

/**
 *
 * @attr {@spacingSet} spacing - The gap between the primary axis
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
