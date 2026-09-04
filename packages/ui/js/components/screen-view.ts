import { devFlags } from '../internal/utils'
import { DialogBase } from '../namespace-browser/base'

export class ScreenView extends DialogBase {
  constructor() {
    super()
  }

  disconnectedCallback() {
    devFlags.debug && console.debug(`${ScreenView.name} ⚡️ disconnect`)
  }
}
