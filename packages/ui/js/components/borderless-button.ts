import { ButtonBase } from '../namespace-browser/base'
import { onoff } from '../internal/utils'
import { CleanupRegistry } from '../internal/class/cleanup-registry'

export class BorderlessButton extends ButtonBase {
  constructor() {
    super()
  }

  // disconnectedCallback() {
  //   BorderlessButton.polyfillDisconnectedCallback(this)
  // }

  // connectedCallback() {
  //   BorderlessButton.polyfillConnectedCallback(this)
  // }

  static polyfillDisconnectedCallback(el: BorderlessButton) {
    console.debug(`${BorderlessButton.name} ⚡️ disconnect`)

    CleanupRegistry.unregister(el)
  }

  static polyfillConnectedCallback(el: BorderlessButton) {
    console.debug(`${BorderlessButton.name} ⚡️ connect`)

    CleanupRegistry.register(el, onoff('click', BorderlessButton.#handleClick, el).on())
  }

  static #handleClick = async (event: Event) => {
    alert(99)
  }
}
