import { DEBUG } from '../internal/flags.json' with { type: 'json' }
import { DialogBase } from '../namespace-browser/base'

export class ScreenView extends DialogBase {
  constructor() {
    super()
  }

  disconnectedCallback() {
    DEBUG && console.debug(`${ScreenView.name} ⚡️ disconnect`)
  }
}
