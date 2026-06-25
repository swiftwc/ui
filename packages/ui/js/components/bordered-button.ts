import { CleanupRegistry } from '../internal/class/cleanup-registry'
import { devFlags, ensurePlaceholder, onoff } from '../internal/utils'
import { ButtonBase } from '../namespace-browser/base'
import { Snapshot } from '../snapshot'

/**
 * @summary A button that applies standard border artwork based on the button’s context.
 *
 * @example <button is="bordered-button"><label-view system-image="hand-tap" title="Tap Me"></label-view></button>
 *
 * @slot overlay
 *
 */
export class BorderedButton extends ButtonBase {
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

  static polyfillDisconnectedCallback(el: BorderedButton) {
    if (devFlags.debug) console.debug(`${BorderedButton.name} ⚡️ disconnect`)

    CleanupRegistry.unregister(el)
  }

  static polyfillConnectedCallback(el: BorderedButton) {
    if (devFlags.debug) console.debug(`${BorderedButton.name} ⚡️ connect`)

    el.tabIndex = 0

    CleanupRegistry.register(el, onoff('click', BorderedButton.#handleClick, el).on())
  }

  static polyfillAttributeChangedCallback([{ attributeName, target, oldValue }]: Pick<MutationRecord, 'attributeName' | 'oldValue' | 'target'>[]) {
    if (devFlags.debug) console.debug(`${BorderedButton.name} ⚡️ attr-change [${attributeName}] ("${oldValue}" → "${(target as HTMLElement).getAttribute(attributeName ?? '')}")`)

    const node = target instanceof HTMLButtonElement
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

  static #handleClick = async (evt: Event) => {
    //
  }
}
