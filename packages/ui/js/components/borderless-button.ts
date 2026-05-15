import { CleanupRegistry } from '../internal/class/cleanup-registry'
import { buttonRole, onoff } from '../internal/utils'
import { ButtonBase } from '../namespace-browser/base'

export class BorderlessButton extends ButtonBase {
  static get observedAttributes() {
    return ['role']
  }

  constructor() {
    super()
  }

  static polyfillDisconnectedCallback(el: BorderlessButton) {
    console.debug(`${BorderlessButton.name} ⚡️ disconnect`)

    CleanupRegistry.unregister(el)
  }

  static polyfillConnectedCallback(el: BorderlessButton) {
    console.debug(`${BorderlessButton.name} ⚡️ connect`)

    el.tabIndex = 0

    CleanupRegistry.register(el, onoff('click', BorderlessButton.#handleClick, el).on())
  }

  static polyfillAttributeChangedCallback([{ attributeName, target, oldValue }]: Pick<MutationRecord, 'attributeName' | 'oldValue' | 'target'>[]) {
    console.debug(`${BorderlessButton.name} ⚡️ attr-change [${attributeName}] ("${oldValue}" → "${(target as HTMLElement).getAttribute(attributeName ?? '')}")`)

    const node = target instanceof HTMLButtonElement && target
    if (!node) return

    switch (attributeName) {
      case 'role':
        buttonRole(target, attributeName)

        break
    }
  }

  static #handleClick = async (evt: Event) => {
    // alert(99)
  }
}
