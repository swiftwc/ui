import { CleanupRegistry } from '../internal/class/cleanup-registry'
import { devFlags, ensurePlaceholder, onoff, touchGlass } from '../internal/utils'
import { ButtonBase } from '../namespace-browser/base'
import { Snapshot } from '../snapshot'

/**
 * @slot overlay
 *
 */
export class GlassButton extends ButtonBase {
  static get observedAttributes() {
    return ['role', 'title-key']
  }

  constructor() {
    super()
  }

  static polyfillDisconnectedCallback(el: ButtonBase) {
    if (devFlags.debug) console.debug(`${GlassButton.name} ⚡️ disconnect`)

    CleanupRegistry.unregister(el)
  }

  static polyfillConnectedCallback(el: ButtonBase) {
    if (devFlags.debug) console.debug(`${GlassButton.name} ⚡️ connect`)

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

  static polyfillAttributeChangedCallback([{ attributeName, target, oldValue }]: Pick<MutationRecord, 'attributeName' | 'oldValue' | 'target'>[]) {
    if (devFlags.debug) console.debug(`${GlassButton.name} ⚡️ attr-change [${attributeName}] ("${oldValue}" → "${(target as HTMLElement).getAttribute(attributeName ?? '')}")`)

    const node = target instanceof HTMLButtonElement && target
    if (!node) return

    switch (attributeName) {
      case 'title-key':
      case 'role':
        Snapshot.waitReady.then(() => {
          ensurePlaceholder(target, target.getAttribute('role'), target.getAttribute('title-key'))
        })

        break
    }
  }
}
