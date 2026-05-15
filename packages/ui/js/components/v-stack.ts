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
    console.debug(`${VStack.name} ⚡️ connect`)
  }

  disconnectedCallback() {
    console.debug(`${VStack.name} ⚡️ disconnect`)
  }
}
