import { CleanupRegistry } from '../internal/class/cleanup-registry'
import { onoff, touchGlass } from '../internal/utils'
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
          (evt: PointerEvent) => {
            if ((evt.target as HTMLElement).matches('[is=sidebar-view]')) return false
            if ((evt.target as HTMLElement).closest('tool-bar-item')) return false

            return true
          }
        ),
        el
      ).on()
    )

    el.autofocus = true
  }

  /** Autoclose on click outside. */
  static #handleClick = async (evt: Event) => {
    console.debug(`${SidebarView.name} ⚡️ ${evt?.type}`)

    if ('DIALOG' === (evt.target as HTMLElement).tagName && 'sidebar-view' === (evt.target as HTMLElement).getAttribute('is')) (evt?.target as HTMLDialogElement)?.close?.()
  }
}
