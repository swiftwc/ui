import { ButtonBase } from '../namespace-browser/base'
import { onoff } from '../internal/utils'
import { CleanupRegistry } from '../internal/class/cleanup-registry'

// class BorderlessButtonLogic {
//   host!: HTMLElement

//   connectedCallback() {
//     const open = this.host.hasAttribute('open')
//     const state = open ? 'open' : 'closed'

//     if (state !== this.host.dataset.state) {
//       this.host.dataset.state = state
//     }
//   }
// }

export class BorderlessButton extends ButtonBase {
  static get observedAttributes() {
    return ['role']
  }

  constructor() {
    super()
  }

  // static Logic = BorderlessButtonLogic

  // disconnectedCallback() {
  //   BorderlessButton.polyfillDisconnectedCallback(this)
  // }

  // connectedCallback() {
  //   BorderlessButton.polyfillConnectedCallback(this)
  // }

  static polyfillDisconnectedCallback(el: BorderlessButton) {
    console.debug(`${BorderlessButton.name} ⚡️ disconnect`)

    CleanupRegistry.unregister(el)
  }

  static polyfillConnectedCallback(el: BorderlessButton) {
    console.debug(`${BorderlessButton.name} ⚡️ connect`)

    el.tabIndex = 0

    CleanupRegistry.register(el, onoff('click', BorderlessButton.#handleClick, el).on())
  }

  static async polyfillAttributeChangedCallback([{ attributeName, target, oldValue }]: Pick<MutationRecord, 'attributeName' | 'oldValue' | 'target'>[]) {
    console.debug(
      `${BorderlessButton.name} ⚡️ attr-change [${attributeName}] ("${oldValue}" → "${(target as HTMLElement).getAttribute(attributeName ?? '')}")`
    )

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
    alert(99)
  }
}
