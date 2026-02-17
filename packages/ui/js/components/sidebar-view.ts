import { DialogBase } from '../internal/privateNamespace'
import { touchGlass } from '../internal/utils'

export class SidebarView extends DialogBase {
  static #cleanups = new WeakMap()

  constructor() {
    super()
  }

  disconnectedCallback() {
    console.debug(`${SidebarView.name} ⚡️ disconnect`)

    SidebarView.polyfillDisconnectedCallback(this)
  }

  connectedCallback() {
    SidebarView.polyfillConnectedCallback(this)
  }

  static polyfillDisconnectedCallback(el: HTMLDialogElement) {
    el.removeEventListener('click', SidebarView.#handleClick)

    this.#cleanups.get(el)?.()

    this.#cleanups.delete(el)
  }

  static polyfillConnectedCallback(el: HTMLDialogElement) {
    el.addEventListener('click', SidebarView.#handleClick)

    const { on } = touchGlass(
      el,
      (t) => t,
      (event: PointerEvent) => {
        if ((event.target as HTMLElement).matches('[is=sidebar-view]')) return false
        if ((event.target as HTMLElement).closest('tool-bar-item')) return false

        return true
      }
    )

    this.#cleanups.set(el, on())

    el.autofocus = true
  }

  /** Autoclose on click outside. */
  static #handleClick = async (event: Event) => {
    if ('DIALOG' === (event.target as HTMLElement).tagName && 'sidebar-view' === (event.target as HTMLElement).getAttribute('is'))
      (event?.target as HTMLDialogElement)?.close?.()
  }
}
