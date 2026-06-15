import { CleanupRegistry } from '../internal/class/cleanup-registry'
import { adaptiveSlot } from '../internal/decorators'
import { devFlags, ensurePlaceholder, onoff, touchGlass } from '../internal/utils'
import { Snapshot } from '../snapshot'

@adaptiveSlot((el) => !el.closest('tool-bar-item-group'))
export class ToolBarItem extends HTMLElement {
  static get observedAttributes() {
    return ['slot', 'data-previous-slot', 'title-key']
  }

  #mutationObserver?: MutationObserver

  constructor() {
    super()
  }

  disconnectedCallback() {
    if (devFlags.debug) console.debug(`${ToolBarItem.name} ⚡️ disconnect`)

    this.#mutationObserver?.disconnect()

    CleanupRegistry.unregister(this)
  }

  connectedCallback() {
    if (devFlags.debug) console.debug(`${ToolBarItem.name} ⚡️ connect`)

    CleanupRegistry.register(
      this,
      onoff(
        touchGlass(
          this,
          (t) => t.closest('tool-bar-item-group') ?? t,
          ({ target }: Event) => {
            if (!(target instanceof HTMLElement && target)) return true

            if (target.closest('menu-view[open]')) return false

            return true
          }
        ),
        this
      ).on()
    )
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (devFlags.debug) console.debug(`${ToolBarItem.name} ⚡️ attr-change [${name}] ("${oldValue}" → "${newValue}")`)

    switch (name) {
      case 'slot':
      case 'data-previous-slot':
      case 'title-key': {
        this.#mutationObserver?.disconnect()

        const role = this.getAttribute('data-previous-slot') ?? this.getAttribute('slot') ?? '',
          tKey = this.getAttribute('title-key')

        if (['confirmation-action', 'cancellation-action'].includes(role))
          Snapshot.waitReady.then(() => {
            ensurePlaceholder(this.querySelector<HTMLElement>(':scope>button'), role, tKey)

            this.#mutationObserver = new MutationObserver((mutations: MutationRecord[]) => {
              for (const { target } of mutations) if (target instanceof HTMLElement && target) ensurePlaceholder(this.querySelector<HTMLElement>(':scope>button'), role, tKey)
            })

            this.#mutationObserver.observe(this, {
              childList: true,
            })
          })

        break
      }
    }
  }
}
