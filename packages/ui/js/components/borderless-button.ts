import { ButtonBase } from '../internal/class'

export class BorderlessButton extends ButtonBase {
  constructor() {
    super()
  }

  disconnectedCallback() {
    console.debug(`${BorderlessButton.name} ⚡️ disconnect`)

    BorderlessButton.polyfill(this, false)
  }

  connectedCallback() {
    console.debug(`${BorderlessButton.name} ⚡️ connect`)

    BorderlessButton.polyfill(this, true)
  }

  static polyfill(el: BorderlessButton, connected: boolean) {
    if (connected) el.addEventListener('click', BorderlessButton.handleClick)
    else el.removeEventListener('click', BorderlessButton.handleClick)
  }

  static handleClick = async (event: Event) => {
    alert(99)
  }
}
