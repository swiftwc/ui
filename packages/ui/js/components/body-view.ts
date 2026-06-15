import { devFlags } from '../internal/utils'

export class BodyView extends HTMLElement {
  constructor() {
    super()
  }

  disconnectedCallback() {
    if (devFlags.debug) console.debug(`${BodyView.name} ⚡️ disconnect`)
  }

  connectedCallback() {
    if (devFlags.debug) console.debug(`${BodyView.name} ⚡️ connect`)
  }
}
