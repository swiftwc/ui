import { DialogBase } from '../internal/class'

export class SidebarView extends DialogBase {
  constructor() {
    super()
  }

  disconnectedCallback() {
    console.debug(`${SidebarView.name} ⚡️ disconnect`)

    SidebarView.polyfillDisconnectedCallback(this)
  }

  connectedCallback() {
    SidebarView.polyfillConnectedCallback(this)
  }

  static polyfillDisconnectedCallback(el: HTMLDialogElement) {
    el.removeEventListener('click', SidebarView.handleClick)
  }

  static polyfillConnectedCallback(el: HTMLDialogElement) {
    el.addEventListener('click', SidebarView.handleClick)
  }

  static handleClick = async (event: Event) => {
    if (
      'DIALOG' === (event.target as HTMLElement).tagName &&
      'sidebar-view' === (event.target as HTMLElement).getAttribute('is')
    )
      (event?.target as HTMLDialogElement)?.close?.()
  }
}
