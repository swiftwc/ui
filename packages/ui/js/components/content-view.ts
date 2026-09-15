import { debug } from '../internal/utils'

/**
 * @summary A container view that wraps a scroll view, marking it as a screen your app can navigate to.
 */
export class ContentView extends HTMLElement {
  constructor() {
    super()
  }

  disconnectedCallback() {
    debug(`${ContentView.name} ⚡️ disconnect`)
  }

  connectedCallback() {
    debug(`${ContentView.name} ⚡️ connect`)
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'content-view': ContentView
  }
}
