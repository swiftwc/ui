import { FormBase } from '../client/privateNamespace'

export class TabBarStack extends FormBase {
  constructor() {
    super()
  }

  disconnectedCallback() {
    TabBarStack.polyfillDisconnectedCallback(this)
  }

  connectedCallback() {
    TabBarStack.polyfillConnectedCallback(this)
  }

  static polyfillDisconnectedCallback(el: HTMLFormElement) {
    console.debug(`${TabBarStack.name} ⚡️ disconnect`)
  }

  static polyfillConnectedCallback(el: HTMLFormElement) {
    console.debug(`${TabBarStack.name} ⚡️ connect`)

    el.method = 'dialog'
  }
}
