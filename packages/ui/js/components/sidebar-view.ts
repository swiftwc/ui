import { DialogBase } from '../internal/class'

export class SidebarView extends DialogBase {
  constructor() {
    super()
  }

  disconnectedCallback() {
    console.debug(`${SidebarView.name} ⚡️ disconnect`)

    SidebarView.polyfill(this, false)
  }

  connectedCallback() {
    SidebarView.polyfill(this, true)
  }

  static polyfill(el: HTMLDialogElement, connected: boolean) {
    if (connected) el.addEventListener('click', SidebarView.handleClick)
    else el.removeEventListener('click', SidebarView.handleClick)
  }

  static handleClick = async (event: Event) => {
    if (
      'DIALOG' === (event.target as HTMLElement).tagName &&
      'sidebar-view' === (event.target as HTMLElement).getAttribute('is')
    )
      (event?.target as HTMLDialogElement)?.close?.()
  }
}
