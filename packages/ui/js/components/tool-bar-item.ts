import { CleanupRegistry } from '../internal/class/cleanup-registry'
import { onoff, touchGlass } from '../internal/utils'

export class ToolBarItem extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    console.debug(`${ToolBarItem.name} ⚡️ connect`)

    CleanupRegistry.register(
      this,
      onoff(
        touchGlass(
          this,
          (t) => t.closest('tool-bar-item-group') ?? t,
          (event: Event) => {
            if ((event.target as HTMLElement).closest('menu-view[open]')) return false

            return true
          }
        ),
        this
      ).on()
    )
  }

  disconnectedCallback() {
    console.debug(`${ToolBarItem.name} ⚡️ disconnect`)

    CleanupRegistry.unregister(this)
  }
}
