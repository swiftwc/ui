import { CleanupRegistry } from '../internal/class/cleanup-registry.ts'
import { adaptiveSlot } from '../internal/decorators/index.ts'
import { debug } from '../internal/utils/index.ts'

/**
 * @summary A container view that groups items together in the toolbar or navigation bar.
 *
 * @slot — The default slot
 */
@adaptiveSlot()
export class ToolBarItemGroup extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    debug(`${ToolBarItemGroup.name} ⚡️ connect`)
  }

  disconnectedCallback() {
    debug(`${ToolBarItemGroup.name} ⚡️ disconnect`)

    CleanupRegistry.unregister(this)
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tool-bar-item-group': ToolBarItemGroup
  }
}
