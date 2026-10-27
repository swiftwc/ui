import { debug } from '../internal/utils'
import { DialogBase } from '../namespace-browser/base'

export class ScreenView extends DialogBase {
  constructor() {
    super()
  }

  override disconnectedCallback() {
    debug(`${ScreenView.name} ⚡️ disconnect`)
  }
}
