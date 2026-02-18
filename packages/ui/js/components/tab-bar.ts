import { DialogBase } from '../internal/privateNamespace'
import { touchGlass } from '../internal/utils'
import { Snapshot } from '../snapshot'

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

    for (const fn of this.#cleanups.get(el)) fn?.()

    this.#cleanups.delete(el)
  }

  static polyfillConnectedCallback(el: HTMLDialogElement) {
    console.debug(`${TabBar.name} ⚡️ connect`)

    el.autofocus = true

    Snapshot.waitReady.then(() => {
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

      if (!this.#cleanups.has(el)) this.#cleanups.set(el, [])
      this.#cleanups.get(el).push(on())
    })
  }

  static #handleClick = async (event: Event) => {
    console.debug(`${TabBar.name} ⚡️ ${event?.type}`)

    if ('DIALOG' === (event.target as HTMLElement).tagName && 'tab-bar' === (event.target as HTMLElement).getAttribute('is'))
      (event?.target as HTMLDialogElement)?.close?.()
  }
}
