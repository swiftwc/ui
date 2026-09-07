import { DEBUG } from '../internal/flags.json' with { type: 'json' }

/**
 * @summary A container view that wraps a scroll view, marking it as a screen your app can navigate to.
 */
export class BodyView extends HTMLElement {
  constructor() {
    super()
  }

  disconnectedCallback() {
    DEBUG && console.debug(`${BodyView.name} ⚡️ disconnect`)
  }

  connectedCallback() {
    DEBUG && console.debug(`${BodyView.name} ⚡️ connect`)
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'body-view': BodyView
  }
}
