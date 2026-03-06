import { DialogBase } from '../internal/privateNamespace'
import { onoff } from '../internal/utils'
import { CleanupRegistry } from '../internal/class/cleanup-registry'

export class SheetView extends DialogBase {
  constructor() {
    super()
  }

  disconnectedCallback() {
    SheetView.polyfillDisconnectedCallback(this)
  }

  connectedCallback() {
    SheetView.polyfillConnectedCallback(this)
  }

  static polyfillDisconnectedCallback(el: SheetView) {
    console.debug(`${SheetView.name} ⚡️ disconnect`)

    CleanupRegistry.unregister(el)
  }

  static polyfillConnectedCallback(el: SheetView) {
    console.debug(`${SheetView.name} ⚡️ connect`)

    const { on } = onoff('cancel', SheetView.#handleCancel, el)

    CleanupRegistry.register(el, on())

    el.autofocus = true
  }

  static #handleCancel = (event: Event) => {
    console.debug(`${SheetView.name} ⚡️ ${event?.type} (${event.cancelable})`)

    if (!event.cancelable) return

    event.preventDefault()
  }
}
