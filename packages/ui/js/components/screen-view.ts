import { devFlags } from '../internal/utils'
import { DialogBase } from '../namespace-browser/base'

export class ScreenView extends DialogBase {
  constructor() {
    super()
  }

  disconnectedCallback() {
    if (devFlags.debug) console.debug(`${ScreenView.name} ⚡️ disconnect`)
  }
}
