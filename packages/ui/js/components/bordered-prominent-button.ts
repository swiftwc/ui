import { CleanupRegistry } from '../internal/class/cleanup-registry'
import { ensurePlaceholder, onoff } from '../internal/utils'
import { ButtonBase } from '../namespace-browser/base'
import { Snapshot } from '../snapshot'

/**
 * @slot overlay
 *
 */
export class BorderedProminentButton extends ButtonBase {
  static get observedAttributes() {
    return ['role', 'title-key']
  }

  constructor() {
    super()
  }

  static polyfillDisconnectedCallback(el: BorderedProminentButton) {
    console.debug(`${BorderedProminentButton.name} ⚡️ disconnect`)

    CleanupRegistry.unregister(el)
  }

  static polyfillConnectedCallback(el: BorderedProminentButton) {
    console.debug(`${BorderedProminentButton.name} ⚡️ connect`)

    el.tabIndex = 0

    CleanupRegistry.register(el, onoff('click', BorderedProminentButton.#handleClick, el).on())
  }

  static polyfillAttributeChangedCallback([{ attributeName, target, oldValue }]: Pick<MutationRecord, 'attributeName' | 'oldValue' | 'target'>[]) {
    console.debug(`${BorderedProminentButton.name} ⚡️ attr-change [${attributeName}] ("${oldValue}" → "${(target as HTMLElement).getAttribute(attributeName ?? '')}")`)

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

  static #handleClick = async (evt: Event) => {
    //
  }
}
