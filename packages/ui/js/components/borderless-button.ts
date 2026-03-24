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

    CleanupRegistry.register(el, onoff('click', BorderlessButton.#handleClick, el).on())
  }

  static #handleClick = async (evt: Event) => {
    alert(99)
  }
}
