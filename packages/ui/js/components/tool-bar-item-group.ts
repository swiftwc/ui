import { CleanupRegistry } from '../internal/class/cleanup-registry'
import { adaptiveSlot } from '../internal/decorators'
import { devFlags } from '../internal/utils'

@adaptiveSlot()
export class ToolBarItemGroup extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    if (devFlags.debug) console.debug(`${ToolBarItemGroup.name} ⚡️ connect`)
  }

  disconnectedCallback() {
    if (devFlags.debug) console.debug(`${ToolBarItemGroup.name} ⚡️ disconnect`)

    CleanupRegistry.unregister(this)
  }
}
