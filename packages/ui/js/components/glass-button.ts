import { CleanupRegistry } from '../internal/class/cleanup-registry'
import { onoff, touchGlass } from '../internal/utils'
import { ButtonBase } from '../namespace-browser/base'

export class GlassButton extends ButtonBase {
  constructor() {
    super()
  }

  static polyfillDisconnectedCallback(el: ButtonBase) {
    console.debug(`${GlassButton.name} ⚡️ disconnect`)

    CleanupRegistry.unregister(el)
  }

  static polyfillConnectedCallback(el: ButtonBase) {
    console.debug(`${GlassButton.name} ⚡️ connect`)

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
