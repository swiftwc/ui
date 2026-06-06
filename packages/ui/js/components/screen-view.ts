import { debug } from '../internal/utils'
import { DialogBase } from '../namespace-browser/base'

export class ScreenView extends DialogBase {
  constructor() {
    super()
  }

  disconnectedCallback() {
    debug(`${ScreenView.name} ⚡️ disconnect`)
  }
}
