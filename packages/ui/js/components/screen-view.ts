import { DialogBase } from '../namespace-browser/base'

export class ScreenView extends DialogBase {
  constructor() {
    super()
  }

  disconnectedCallback() {
    console.debug(`${ScreenView.name} ⚡️ disconnect`)
  }
}
