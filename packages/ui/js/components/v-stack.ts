import { debug } from '../internal/utils'

/**
 * @attr {leading|"leading fill"|center|trailing|fill|space-between} distribution - The distribution of cols
 *
 * @attr {"auto spacer"|"auto auto spacer"|"auto auto auto spacer"} template
 */
export class VStack extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    debug(`${VStack.name} ⚡️ connect`)
  }

  disconnectedCallback() {
    debug(`${VStack.name} ⚡️ disconnect`)
  }
}
