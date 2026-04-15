import { ButtonBase } from '../namespace-browser/base'
import { onoff } from '../internal/utils'
import { CleanupRegistry } from '../internal/class/cleanup-registry'

export class BorderedProminentButton extends ButtonBase {
  constructor() {
    super()
  }

  static polyfillDisconnectedCallback(el: BorderedProminentButton) {
    console.debug(`${BorderedProminentButton.name} ⚡️ disconnect`)

    CleanupRegistry.unregister(el)
  }

  static polyfillConnectedCallback(el: BorderedProminentButton) {
    console.debug(`${BorderedProminentButton.name} ⚡️ connect`)

    el.tabIndex = 0

    CleanupRegistry.register(el, onoff('click', BorderedProminentButton.#handleClick, el).on())
  }

  static #handleClick = async (evt: Event) => {
    alert(99)
  }
}
