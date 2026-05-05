import { ButtonBase } from '../namespace-browser/base'
import { touchGlass, onoff } from '../internal/utils'
import { CleanupRegistry } from '../internal/class/cleanup-registry'

export class GlassProminentButton extends ButtonBase {
  constructor() {
    super()
  }

  static polyfillDisconnectedCallback(el: ButtonBase) {
    console.debug(`${GlassProminentButton.name} ⚡️ disconnect`)

    CleanupRegistry.unregister(el)
  }

  static polyfillConnectedCallback(el: ButtonBase) {
    console.debug(`${GlassProminentButton.name} ⚡️ connect`)

    CleanupRegistry.register(
      el,
      onoff(
        touchGlass(
          el,
          (t) => t,
          () => true
        ),
        el
      ).on()
    )

    el.tabIndex = 0
  }
}
