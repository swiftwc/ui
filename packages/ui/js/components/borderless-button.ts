import { CleanupRegistry } from '../internal/class/cleanup-registry'
import { onoff,buttonRole } from '../internal/utils'
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

    switch (attributeName) {
      case 'role':
        // let label = this.querySelector(':scope>[slot=label]')
        // if (newValue) {
        //   label ??= this.appendChild($(`<label-view slot="label"></label-view>`))
        //   label.setAttribute('title', newValue)
        // } else label?.remove()

        break
    }
  }

  static #handleClick = async (evt: Event) => {
    // alert(99)
  }
}
