import { touchGlass, onoff } from '../internal/utils'
import { CleanupRegistry } from '../internal/class/cleanup-registry'

export class ToolBarItem extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    console.debug(`${ToolBarItem.name} ⚡️ connect`)

    const { on } = onoff(
      touchGlass(
        this,
        (t) => t.closest('tool-bar-item-group') ?? t,
        (event: Event) => {
          if ((event.target as HTMLElement).closest('menu-view[open]')) return false

          return true
        }
      ),
      this
    )

    CleanupRegistry.register(this, on())
  }

  disconnectedCallback() {
    console.debug(`${ToolBarItem.name} ⚡️ disconnect`)

    CleanupRegistry.unregister(this)
  }
}
