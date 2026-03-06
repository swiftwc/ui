import { ButtonBase } from '../internal/privateNamespace'
import { onoff } from '../internal/utils'
import { CleanupRegistry } from '../internal/class/cleanup-registry'

export class BorderlessButton extends ButtonBase {
  constructor() {
    super()
  }

  disconnectedCallback() {
    BorderlessButton.polyfillDisconnectedCallback(this)
  }

  connectedCallback() {
    BorderlessButton.polyfillConnectedCallback(this)
  }

  static polyfillDisconnectedCallback(el: BorderlessButton) {
    console.debug(`${BorderlessButton.name} ⚡️ disconnect`)

    CleanupRegistry.unregister(el)
  }

  static polyfillConnectedCallback(el: BorderlessButton) {
    console.debug(`${BorderlessButton.name} ⚡️ connect`)

    const { on } = onoff('click', BorderlessButton.#handleClick, el)

    CleanupRegistry.register(el, on())
  }

  static #handleClick = async (event: Event) => {
    alert(99)
  }
}
