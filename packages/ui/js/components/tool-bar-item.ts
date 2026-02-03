import { touchGlass } from '../internal/utils'

export class ToolBarItem extends HTMLElement {
  constructor() {
    super()
  }

  #cleanup?: () => void

  connectedCallback() {
    console.debug(`${ToolBarItem.name} ⚡️ connect`)

    const { on } = touchGlass(
      this,
      (t) => t.closest('tool-bar-item-group') ?? t,
      (event: Event) => {
        if ((event.target as HTMLElement).closest('menu-view[open]')) return false

        return true
      }
    )

    this.#cleanup = on()
  }

  disconnectedCallback() {
    console.debug(`${ToolBarItem.name} ⚡️ disconnect`)

    this.#cleanup?.()
  }
}
