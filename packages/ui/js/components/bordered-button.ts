import { CleanupRegistry } from '../internal/class/cleanup-registry'
import { onoff } from '../internal/utils'
import { ButtonBase } from '../namespace-browser/base'

export class BorderedButton extends ButtonBase {
  constructor() {
    super()
  }

  static polyfillDisconnectedCallback(el: BorderedButton) {
    console.debug(`${BorderedButton.name} ⚡️ disconnect`)

    CleanupRegistry.unregister(el)
  }

  static polyfillConnectedCallback(el: BorderedButton) {
    console.debug(`${BorderedButton.name} ⚡️ connect`)

    el.tabIndex = 0

    CleanupRegistry.register(el, onoff('click', BorderedButton.#handleClick, el).on())
  }

  static #handleClick = async (evt: Event) => {
    //
  }
}
