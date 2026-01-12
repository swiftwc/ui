import { DialogBase } from '../internal/class'

export class SheetView extends DialogBase {
  constructor() {
    super()
  }

  disconnectedCallback() {
    console.debug(`${SheetView.name} ⚡️ disconnect`)

    SheetView.polyfill(this, false)
  }

  connectedCallback() {
    console.debug(`${SheetView.name} ⚡️ connect`)

    SheetView.polyfill(this, true)
  }

  static polyfill(el: SheetView, connected: boolean) {
    if (connected) el.addEventListener('cancel', SheetView.handleCancel)
    else el.removeEventListener('cancel', SheetView.handleCancel)
  }

  static handleCancel = (event: Event) => {
    console.debug(`${SheetView.name} ⚡️ cancel (${event.cancelable})`)

    if (!event.cancelable) return

    event.preventDefault()
  }
}
