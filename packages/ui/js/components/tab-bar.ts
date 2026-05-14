import { CleanupRegistry } from '../internal/class/cleanup-registry'
import { onoff, touchGlass } from '../internal/utils'
import { DialogBase } from '../namespace-browser/base'

/**
 * @summary A screen that lets users switch between different views using buttons, tabs, or other controls.
 */
export class TabBar extends DialogBase {
  constructor() {
    super()
  }

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

    CleanupRegistry.register(
      el,
      onoff(
        touchGlass(
          el,
          (t) => t,
          (evt: PointerEvent) => {
            if ((evt.target as HTMLElement).matches('[is=tab-bar]')) return false
            if ((evt.target as HTMLElement).closest('tool-bar-item')) return false

            return true
          }
        ),
        el
      ).on()
    )
    // })
  }

  static #handleClick = async (evt: Event) => {
    console.debug(`${TabBar.name} ⚡️ ${evt?.type}`)

    if ('DIALOG' === (evt.target as HTMLElement).tagName && 'tab-bar' === (evt.target as HTMLElement).getAttribute('is'))
      (evt?.target as HTMLDialogElement)?.close?.()
  }
}
