export class BodyView extends HTMLElement {
  constructor() {
    super()
  }

  disconnectedCallback() {
    console.debug(`${BodyView.name} ⚡️ disconnect`)
  }

  connectedCallback() {
    console.debug(`${BodyView.name} ⚡️ connect`)
  }
}
