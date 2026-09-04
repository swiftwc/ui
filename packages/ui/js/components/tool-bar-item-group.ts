import { CleanupRegistry } from '../internal/class/cleanup-registry'
import { adaptiveSlot } from '../internal/decorators'
import { devFlags } from '../internal/utils'

/**
 * @summary A container view that groups items together in the toolbar or navigation bar.
 */
@adaptiveSlot()
export class ToolBarItemGroup extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    devFlags.debug && console.debug(`${ToolBarItemGroup.name} ⚡️ connect`)
  }

  disconnectedCallback() {
    devFlags.debug && console.debug(`${ToolBarItemGroup.name} ⚡️ disconnect`)

    CleanupRegistry.unregister(this)
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tool-bar-item-group': ToolBarItemGroup
  }
}
