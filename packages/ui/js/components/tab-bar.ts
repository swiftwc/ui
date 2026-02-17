import { DialogBase } from '../internal/privateNamespace'
import { touchGlass } from '../internal/utils'

export class TabBar extends DialogBase {
  static #cleanups = new WeakMap()

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

    this.#cleanups.get(el)?.()

    this.#cleanups.delete(el)
  }

  static polyfillConnectedCallback(el: HTMLDialogElement) {
    console.debug(`${TabBar.name} ⚡️ connect`)

    el.addEventListener('click', TabBar.#handleClick)

    const { on } = touchGlass(
      el,
      (t) => t,
      (event: PointerEvent) => {
        if ((event.target as HTMLElement).matches('[is=tab-bar]')) return false
        if ((event.target as HTMLElement).closest('tool-bar-item')) return false

        return true
      }
    )

    this.#cleanups.set(el, on())

    el.autofocus = true
  }

  static #handleClick = async (event: Event) => {
    if ('DIALOG' === (event.target as HTMLElement).tagName && 'tab-bar' === (event.target as HTMLElement).getAttribute('is'))
      (event?.target as HTMLDialogElement)?.close?.()
  }
}
