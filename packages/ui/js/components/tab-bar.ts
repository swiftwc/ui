import { DialogBase } from '../client/privateNamespace'

export class TabBar extends DialogBase {
  constructor() {
    super()
  }

  disconnectedCallback() {
    TabBar.polyfillDisconnectedCallback(this)
  }

  connectedCallback() {
    TabBar.polyfillConnectedCallback(this)
  }

  static polyfillDisconnectedCallback(el: HTMLDialogElement) {
    console.debug(`${TabBar.name} ⚡️ disconnect`)

    el.removeEventListener('click', TabBar.#handleClick)
  }

  static polyfillConnectedCallback(el: HTMLDialogElement) {
    console.debug(`${TabBar.name} ⚡️ connect`)

    el.addEventListener('click', TabBar.#handleClick)

    el.autofocus = true
  }

  static #handleClick = async (event: Event) => {
    if ('DIALOG' === (event.target as HTMLElement).tagName && 'tab-bar' === (event.target as HTMLElement).getAttribute('is'))
      (event?.target as HTMLDialogElement)?.close?.()
  }
}
