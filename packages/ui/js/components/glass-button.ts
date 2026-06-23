import { CleanupRegistry } from '../internal/class/cleanup-registry'
import { devFlags, ensurePlaceholder, onoff, touchGlass } from '../internal/utils'
import { ButtonBase } from '../namespace-browser/base'
import { Snapshot } from '../snapshot'

/**
 * @summary A button that applies glass border artwork based on the button’s context.
 *
 * @example <button is="glass-button"><label-view system-image="hand-tap" title="Tap Me"></label-view></button>
 *
 * @slot overlay
 *
 */
export class GlassButton extends ButtonBase {
  static get observedAttributes() {
    return [
      /**
       * A value that describes the purpose of a button
       * @type {destructive|confirm}
       */
      'role',
      'title-key',
    ]
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
