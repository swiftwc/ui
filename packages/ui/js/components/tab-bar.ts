import { DialogBase } from '../internal/class'

export class TabBar extends DialogBase {
  constructor() {
    super()
  }

  disconnectedCallback() {
    console.debug(`${TabBar.name} ⚡️ disconnect`)

    TabBar.polyfill(this, false)
  }

  connectedCallback() {
    TabBar.polyfill(this, true)
  }

  static polyfill(el: HTMLDialogElement, connected: boolean) {
    if (connected) el.addEventListener('click', TabBar.handleClick)
    else el.removeEventListener('click', TabBar.handleClick)
  }

  static handleClick = async (event: Event) => {
    if (
      'DIALOG' === (event.target as HTMLElement).tagName &&
      'tab-bar' === (event.target as HTMLElement).getAttribute('is')
    )
      (event?.target as HTMLDialogElement)?.close?.()
  }
}
