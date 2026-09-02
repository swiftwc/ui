import { CleanupRegistry } from '../internal/class/cleanup-registry'
import { devFlags, listActive, onoff } from '../internal/utils'

/**
 * @summary A container view that arranges rows of data in a single column, optionally letting the user select one or more of them.
 *
 * @attr {hidden} navigation-link-indicator-visibility — Hides accessories like right-arrow-chevron on NavigationLink buttons inside
 *
 * @cssprop {length} --list-row-gap — The gap between rows
 * @cssprop {length} --list--media-inner-padding-inline-start — The inline paddint start for each row
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
