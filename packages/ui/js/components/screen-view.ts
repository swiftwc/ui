import { DialogBase } from '../internal/class'

export class ScreenView extends DialogBase {
  constructor() {
    super()
  }

  disconnectedCallback() {
    console.debug(`${ScreenView.name} ⚡️ disconnect`)
  }
}
