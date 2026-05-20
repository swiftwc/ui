import { CleanupRegistry } from '../internal/class/cleanup-registry'
import { buttonRole, onoff } from '../internal/utils'
import { ButtonBase } from '../namespace-browser/base'
import { Snapshot } from '../snapshot'

/**
 * @slot overlay
 *
 */
export class BorderedButton extends ButtonBase {
  static get observedAttributes() {
    return ['role']
  }

  constructor() {
    super()
  }

  static polyfillDisconnectedCallback(el: BorderedButton) {
    console.debug(`${BorderedButton.name} ⚡️ disconnect`)

    CleanupRegistry.unregister(el)
  }

  static polyfillConnectedCallback(el: BorderedButton) {
    console.debug(`${BorderedButton.name} ⚡️ connect`)

    el.tabIndex = 0

    CleanupRegistry.register(el, onoff('click', BorderedButton.#handleClick, el).on())
  }

  static polyfillAttributeChangedCallback([{ attributeName, target, oldValue }]: Pick<MutationRecord, 'attributeName' | 'oldValue' | 'target'>[]) {
    console.debug(`${BorderedButton.name} ⚡️ attr-change [${attributeName}] ("${oldValue}" → "${(target as HTMLElement).getAttribute(attributeName ?? '')}")`)

    const node = target instanceof HTMLButtonElement && target
    if (!node) return

    switch (attributeName) {
      case 'role':
        Snapshot.waitReady.then(() => {
          buttonRole(target, target.getAttribute(attributeName))
        })

        break
    }
  }

  static #handleClick = async (evt: Event) => {
    //
  }
}
