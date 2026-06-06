import { debug } from '../internal/utils'

export class BodyView extends HTMLElement {
  constructor() {
    super()
  }

  disconnectedCallback() {
    debug(`${BodyView.name} ⚡️ disconnect`)
  }

  connectedCallback() {
    debug(`${BodyView.name} ⚡️ connect`)
  }
}
