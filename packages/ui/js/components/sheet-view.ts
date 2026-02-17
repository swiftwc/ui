import { DialogBase } from '../internal/privateNamespace'

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

    el.removeEventListener('cancel', SheetView.#handleCancel)
  }

  static polyfillConnectedCallback(el: SheetView) {
    console.debug(`${SheetView.name} ⚡️ connect`)

    el.addEventListener('cancel', SheetView.#handleCancel)

    el.autofocus = true
  }

  static #handleCancel = (event: Event) => {
    console.debug(`${SheetView.name} ⚡️ ${event?.type} (${event.cancelable})`)

    if (!event.cancelable) return

    event.preventDefault()
  }
}
