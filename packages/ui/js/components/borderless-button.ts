import { ButtonBase } from '../client/privateNamespace'

export class BorderlessButton extends ButtonBase {
  constructor() {
    super()
  }

  disconnectedCallback() {
    BorderlessButton.polyfillDisconnectedCallback(this)
  }

  connectedCallback() {
    BorderlessButton.polyfillConnectedCallback(this)
  }

  static polyfillDisconnectedCallback(el: BorderlessButton) {
    console.debug(`${BorderlessButton.name} ⚡️ disconnect`)

    el.removeEventListener('click', BorderlessButton.handleClick)
  }

  static polyfillConnectedCallback(el: BorderlessButton) {
    console.debug(`${BorderlessButton.name} ⚡️ connect`)

    el.addEventListener('click', BorderlessButton.handleClick)
  }

  static handleClick = async (event: Event) => {
    alert(99)
  }
}
