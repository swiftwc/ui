import { CleanupRegistry } from '../internal/class/cleanup-registry'
import { devFlags, onoff } from '../internal/utils'
import { ButtonBase } from '../namespace-browser/base'

export class PlainButton extends ButtonBase {
  constructor() {
    super()
  }

  static polyfillDisconnectedCallback(el: PlainButton) {
    if (devFlags.debug) console.debug(`${PlainButton.name} ⚡️ disconnect`)

    CleanupRegistry.unregister(el)
  }

  static polyfillConnectedCallback(el: PlainButton) {
    if (devFlags.debug) console.debug(`${PlainButton.name} ⚡️ connect`)

    el.tabIndex = 0

    CleanupRegistry.register(el, onoff('click', PlainButton.#handleClick, el).on())
  }

  static #handleClick = async (evt: Event) => {
    // alert(99)
  }
}
