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
          (evt: Event) => {
            const target = evt.target instanceof HTMLElement && evt.target
            if (!target) return true

            if (target.closest('menu-view[open]')) return false

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
