import { DialogBase } from '../namespace-browser/base'
import { touchGlass, onoff } from '../internal/utils'
import { Snapshot } from '../snapshot'
import { CleanupRegistry } from '../internal/class/cleanup-registry'

export class TabBar extends DialogBase {
  constructor() {
    super()
  }

  // disconnectedCallback() {
  //   TabBar.polyfillDisconnectedCallback(this)
  // }

  // connectedCallback() {
  //   TabBar.polyfillConnectedCallback(this)
  // }

  static polyfillDisconnectedCallback(el: HTMLDialogElement) {
    console.debug(`${TabBar.name} ⚡️ disconnect`)

    el.removeEventListener('click', TabBar.#handleClick)

    CleanupRegistry.unregister(el)
  }

  static polyfillConnectedCallback(el: HTMLDialogElement) {
    console.debug(`${TabBar.name} ⚡️ connect`)

    el.autofocus = true

    // Snapshot.waitReadyFor(el).then((r) => {
    //   if (!r) return

    CleanupRegistry.register(el, onoff('click', TabBar.#handleClick, el).on())

    const { on } = onoff(
      touchGlass(
        el,
        (t) => t,
        (event: PointerEvent) => {
          if ((event.target as HTMLElement).matches('[is=tab-bar]')) return false
          if ((event.target as HTMLElement).closest('tool-bar-item')) return false

          return true
        }
      ),
      el
    )

    CleanupRegistry.register(el, on())
    // })
  }

  static #handleClick = async (event: Event) => {
    console.debug(`${TabBar.name} ⚡️ ${event?.type}`)

    if ('DIALOG' === (event.target as HTMLElement).tagName && 'tab-bar' === (event.target as HTMLElement).getAttribute('is'))
      (event?.target as HTMLDialogElement)?.close?.()
  }
}
