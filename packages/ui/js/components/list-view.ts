import { CleanupRegistry } from '../internal/class/cleanup-registry'
import { devFlags, listActive, onoff } from '../internal/utils'

/**
 * @attr {hidden} navigation-link-indicator-visibility — Hides accessories like right-arrow-chevron on NavigationLink buttons inside.
 */
export class ListView extends HTMLElement {
  constructor() {
    super()
  }

  disconnectedCallback() {
    if (devFlags.debug) console.debug(`${ListView.name} ⚡️ disconnect`)

    CleanupRegistry.unregister(this)
  }

  connectedCallback() {
    if (devFlags.debug) console.debug(`${ListView.name} ⚡️ connect`)

    CleanupRegistry.register(this, onoff(listActive(this), this).on())
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'list-view': ListView
  }
}
