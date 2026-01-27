import { DialogBase } from '../client/privateNamespace'

export class ScreenView extends DialogBase {
  constructor() {
    super()
  }

  disconnectedCallback() {
    console.debug(`${ScreenView.name} ⚡️ disconnect`)
  }
}
