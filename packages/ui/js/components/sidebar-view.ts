import { CleanupRegistry } from '../internal/class/cleanup-registry'
import { devFlags, onoff, touchGlass } from '../internal/utils'
import { DialogBase } from '../namespace-browser/base'

export class SidebarView extends DialogBase {
  constructor() {
    super()
  }

  static polyfillDisconnectedCallback(el: HTMLDialogElement) {
    el.removeEventListener('click', SidebarView.#handleClick)

    CleanupRegistry.unregister(el)
  }

  static polyfillConnectedCallback(el: HTMLDialogElement) {
    CleanupRegistry.register(el, onoff('click', SidebarView.#handleClick, el).on())

    CleanupRegistry.register(
      el,
      onoff(
        touchGlass(
          el,
          (t) => t,
          ({ target }: PointerEvent) => {
            if (!(target instanceof HTMLElement && target)) return true

            if (target.matches('[is=sidebar-view]')) return false
            if (target.closest('tool-bar-item')) return false

            return true
          }
        ),
        el
      ).on()
    )

    el.autofocus = true
  }

  /** Autoclose on click outside. */
  static #handleClick = async ({ target, type }: Event) => {
    if (devFlags.debug) console.debug(`${SidebarView.name} ⚡️ ${type}`)

    if (!(target instanceof HTMLElement && target)) return

    if (target instanceof HTMLDialogElement && 'sidebar-view' === target.getAttribute('is')) target.close?.()
  }
}
