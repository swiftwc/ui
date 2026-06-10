import { Snapshot } from '../../snapshot'
import { CleanupRegistry } from '../class/cleanup-registry'
import { debug, onoff } from '../utils'

export default function (filter?: (el: HTMLElement) => boolean) {
  const handleMediaChange: (el: HTMLElement, evt: MediaQueryListEvent) => void = (el, { type, matches }) => {
    debug(`${el.localName} ⚡️ ${type}`)

    if (matches) {
      if (!el.matches(`[slot="cancellation-action"],[slot="primary-action"],[slot="confirmation-action"],[slot="destructive-action"]`)) return

      const newSlot = ['destructive-action'].includes(el.slot) ? 'bottom-bar-leading' : 'bottom-bar-trailing'

      if (el.slot !== newSlot) el.dataset.previousSlot = el.slot

      el.slot = newSlot
    } else {
      if (!el.matches(`[data-previous-slot]`)) return

      el.slot = el.dataset.previousSlot ?? ''

      delete el.dataset.previousSlot
    }
  }

  return function <T extends CustomElementConstructor>(Base: T, _context?: ClassDecoratorContext<T>): void {
    const originalConnected = Base.prototype.connectedCallback,
      originalDisconnected = Base.prototype.disconnectedCallback

    Base.prototype.connectedCallback = function (this: HTMLElement) {
      console.debug(`decorator:[${this.localName}] ⚡️ connect`)

      originalConnected?.call(this)

      if (filter && !filter(this)) return
      if (!this.closest('[is=sheet-view]')) return
      if (!self.matchMedia('(pointer: fine)').matches) return

      const handler1 = handleMediaChange.bind(null, this)

      CleanupRegistry.register(this, onoff('fine_dialog_sheet:change', handler1 as unknown as EventListener, Snapshot.on).on(), 'adaptive-slot')

      Snapshot.waitReady.then(() => {
        handleMediaChange(
          this,
          new MediaQueryListEvent(`media-change`, {
            matches: Snapshot.breakpoints?.get('fine_dialog_sheet'),
          })
        ) // Initial check
      })
    }

    Base.prototype.disconnectedCallback = function (this: HTMLElement) {
      console.debug(`decorator:[${this.localName}] ⚡️ disconnect`)

      originalDisconnected?.call(this)

      CleanupRegistry.unregister(this, 'adaptive-slot')
    }
  }
}
