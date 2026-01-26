import { DialogBase } from '../internal/class'

export class TabBar extends DialogBase {
  constructor() {
    super()
  }

  disconnectedCallback() {
    console.debug(`${TabBar.name} ⚡️ disconnect`)

    TabBar.polyfillDisconnectedCallback(this)
  }

  connectedCallback() {
    TabBar.polyfillConnectedCallback(this)
  }

  static polyfillDisconnectedCallback(el: HTMLDialogElement) {
    el.removeEventListener('click', TabBar.#handleClick)
  }

  static polyfillConnectedCallback(el: HTMLDialogElement) {
    el.addEventListener('click', TabBar.#handleClick)

    el.autofocus = true
  }

  static #handleClick = async (event: Event) => {
    if (
      'DIALOG' === (event.target as HTMLElement).tagName &&
      'tab-bar' === (event.target as HTMLElement).getAttribute('is')
    )
      (event?.target as HTMLDialogElement)?.close?.()
  }
}
