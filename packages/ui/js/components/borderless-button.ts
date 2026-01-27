import { ButtonBase } from '../client/privateNamespace'

export class BorderlessButton extends ButtonBase {
  constructor() {
    super()
  }

  disconnectedCallback() {
    console.debug(`${BorderlessButton.name} ⚡️ disconnect`)

    BorderlessButton.polyfillDisconnectedCallback(this)
  }

  connectedCallback() {
    console.debug(`${BorderlessButton.name} ⚡️ connect`)

    BorderlessButton.polyfillConnectedCallback(this)
  }

  static polyfillDisconnectedCallback(el: BorderlessButton) {
    el.removeEventListener('click', BorderlessButton.handleClick)
  }

  static polyfillConnectedCallback(el: BorderlessButton) {
    el.addEventListener('click', BorderlessButton.handleClick)
  }

  static handleClick = async (event: Event) => {
    alert(99)
  }
}
