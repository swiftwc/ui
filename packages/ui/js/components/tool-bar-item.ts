import { CleanupRegistry } from '../internal/class/cleanup-registry'
import { buttonRole, onoff, touchGlass } from '../internal/utils'
import { Snapshot } from '../snapshot'

export class ToolBarItem extends HTMLElement {
  static get observedAttributes() {
    return ['slot', 'data-previous-slot', 'title-key']
  }

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

    // if (this.closest('tool-bar-item-group')) return
    // if (!this.closest('[is=sheet-view]')) return
    // if (!self.matchMedia('(pointer: fine)').matches) return

    // const handler1 = toolbarRepositioner.bind(null, this)

    // CleanupRegistry.register(this, onoff('fine_dialog_sheet:change', handler1 as unknown as EventListener, Snapshot.on).on())

    // Snapshot.waitReady.then(() => {
    //   toolbarRepositioner(
    //     this,
    //     new MediaQueryListEvent(`media-change`, {
    //       matches: Snapshot.breakpoints?.get('fine_dialog_sheet'),
    //     })
    //   ) // Initial check
    // })
  }

  disconnectedCallback() {
    console.debug(`${ToolBarItem.name} ⚡️ disconnect`)

    CleanupRegistry.unregister(this)
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    console.debug(`${ToolBarItem.name} ⚡️ attr-change [${name}] ("${oldValue}" → "${newValue}")`)

    switch (name) {
      case 'slot':
      case 'data-previous-slot':
      case 'title-key':
        const target = this.querySelector<HTMLElement>(':scope>button'),
          nv = this.getAttribute('data-previous-slot') ?? this.getAttribute('slot') ?? ''

        if (target && ['confirmation-action', 'cancellation-action'].includes(nv))
          Snapshot.waitReady.then(() => {
            buttonRole(target, nv, this.getAttribute('title-key'))
          })

        break
    }
  }
}
