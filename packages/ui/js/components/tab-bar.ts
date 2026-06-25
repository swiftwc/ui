import { CleanupRegistry } from '../internal/class/cleanup-registry'
import { devFlags, onoff, touchGlass } from '../internal/utils'
import { DialogBase } from '../namespace-browser/base'

/**
 * @summary A screen that lets users switch between different views using buttons, tabs, or other controls.
 */
export class TabBar extends DialogBase {
  constructor() {
    super()
  }

  static polyfillDisconnectedCallback(el: HTMLDialogElement) {
    if (devFlags.debug) console.debug(`${TabBar.name} ⚡️ disconnect`)

    el.removeEventListener('click', TabBar.#handleClick)

    CleanupRegistry.unregister(el)
  }

  static polyfillConnectedCallback(el: HTMLDialogElement) {
    if (devFlags.debug) console.debug(`${TabBar.name} ⚡️ connect`)

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
          ({ target }: PointerEvent) => {
            if (!(target instanceof HTMLElement)) return true

            if (target.matches('[is=tab-bar]')) return false
            if (target.closest('tool-bar-item')) return false

            return true
          }
        ),
        el
      ).on()
    )
    // })
  }

  static #handleClick = async ({ target, type }: Event) => {
    if (devFlags.debug) console.debug(`${TabBar.name} ⚡️ ${type}`)

    if (!(target instanceof HTMLElement)) return

    if (target instanceof HTMLDialogElement && 'tab-bar' === target.getAttribute('is')) target.close?.()
  }
}
