import { DialogBase } from '../internal/class'

export class SheetView extends DialogBase {
  constructor() {
    super()
  }

  disconnectedCallback() {
    console.debug(`${SheetView.name} ⚡️ disconnect`)

    SheetView.polyfillDisconnectedCallback(this)
  }

  connectedCallback() {
    console.debug(`${SheetView.name} ⚡️ connect`)

    SheetView.polyfillConnectedCallback(this)
  }

  static polyfillDisconnectedCallback(el: SheetView) {
    el.removeEventListener('cancel', SheetView.handleCancel)
  }
  static polyfillConnectedCallback(el: SheetView) {
    el.addEventListener('cancel', SheetView.handleCancel)
  }

  static handleCancel = (event: Event) => {
    console.debug(`${SheetView.name} ⚡️ cancel (${event.cancelable})`)

    if (!event.cancelable) return

    event.preventDefault()
  }
}
