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
