import { CleanupRegistry } from '../internal/class/cleanup-registry'
import { devFlags, onoff } from '../internal/utils'
import { ButtonBase } from '../namespace-browser/base'

/**
 * @summary A button that controls a navigation presentation.
 */
export class NavigationLink extends ButtonBase {
  constructor() {
    super()
  }

  static polyfillDisconnectedCallback(el: NavigationLink) {
    if (devFlags.debug) console.debug(`${NavigationLink.name} ⚡️ disconnect`)

    CleanupRegistry.unregister(el)
  }

  static polyfillConnectedCallback(el: NavigationLink) {
    if (devFlags.debug) console.debug(`${NavigationLink.name} ⚡️ connect`)

    el.tabIndex = 0

    CleanupRegistry.register(el, onoff('click', NavigationLink.#handleClick, el).on())
  }

  static #handleClick = async (evt: Event) => {
    // alert(99)
  }
}
