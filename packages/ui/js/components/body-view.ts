import { devFlags } from '../internal/utils'

/**
 * @summary A container view that wraps a scroll view, marking it as a screen your app can navigate to.
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

declare global {
  interface HTMLElementTagNameMap {
    'body-view': BodyView
  }
}
