import { CleanupRegistry } from '../internal/class/cleanup-registry'
import { debug, ensurePlaceholder, onoff, touchGlass } from '../internal/utils'
import { ButtonBase } from '../namespace-browser/base'
import { Snapshot } from '../snapshot'

/**
 * @slot overlay
 *
 */
export class GlassProminentButton extends ButtonBase {
  static get observedAttributes() {
    return ['role', 'title-key']
  }

  constructor() {
    super()
  }

  static polyfillDisconnectedCallback(el: ButtonBase) {
    debug(`${GlassProminentButton.name} ⚡️ disconnect`)

    CleanupRegistry.unregister(el)
  }

  static polyfillConnectedCallback(el: ButtonBase) {
    debug(`${GlassProminentButton.name} ⚡️ connect`)

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
    debug(`${GlassProminentButton.name} ⚡️ attr-change [${attributeName}] ("${oldValue}" → "${(target as HTMLElement).getAttribute(attributeName ?? '')}")`)

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
