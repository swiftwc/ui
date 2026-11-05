import { CleanupRegistry } from '../internal/class/cleanup-registry.ts'
import { debug, onoff } from '../internal/utils/index.ts'
import { ButtonBase } from '../namespace-browser/base.ts'

export class PlainButton extends ButtonBase {
  constructor() {
    super()
  }

  static override polyfillDisconnectedCallback(el: PlainButton) {
    debug(`${PlainButton.name} ⚡️ disconnect`)

    CleanupRegistry.unregister(el)
  }

  static override polyfillConnectedCallback(el: PlainButton) {
    debug(`${PlainButton.name} ⚡️ connect`)

    el.tabIndex = 0

    CleanupRegistry.register(el, onoff('click', PlainButton.#handleClick, el).on())
  }

  static #handleClick = async (evt: Event) => {
    // alert(99)
  }
}
