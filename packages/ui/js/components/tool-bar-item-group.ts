import { DEBUG } from '../internal/flags.json' with { type: 'json' }
import { CleanupRegistry } from '../internal/class/cleanup-registry'
import { adaptiveSlot } from '../internal/decorators'

/**
 * @summary A container view that groups items together in the toolbar or navigation bar.
 */
@adaptiveSlot()
export class ToolBarItemGroup extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    DEBUG && console.debug(`${ToolBarItemGroup.name} ⚡️ connect`)
  }

  disconnectedCallback() {
    DEBUG && console.debug(`${ToolBarItemGroup.name} ⚡️ disconnect`)

    CleanupRegistry.unregister(this)
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tool-bar-item-group': ToolBarItemGroup
  }
}
