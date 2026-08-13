import { devFlags } from '../internal/utils'

/**
 * @summary The content and behavior of the view.
 */
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
