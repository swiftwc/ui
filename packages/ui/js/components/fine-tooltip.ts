import { CleanupRegistry } from '../internal/class/cleanup-registry'
import { onoff } from '../internal/utils'

export class FineTooltip extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    console.debug(`${FineTooltip.name} ⚡️ connect`)

    this.popover = 'manual'

    this.showPopover()

    // CleanupRegistry.register(this, onoff('transitionend transitionstart transitioncancel', this.#handleTransitionrun as unknown as EventListener, this).on())
    // CleanupRegistry.register(this, onoff('transitionrun', this.#handleTransitionrun as unknown as EventListener, this).on())
  }

  disconnectedCallback() {
    console.debug(`${FineTooltip.name} ⚡️ disconnect`)

    CleanupRegistry.unregister(this)
  }

  #handleTransitionrun = ({ target, propertyName, pseudoElement }: TransitionEvent) => {
    if (!(target instanceof HTMLElement && target)) return

    if ('--stuck' !== propertyName || '::before' !== pseudoElement || !target.matches('sticky-container')) return

    const stuck = self.getComputedStyle(this, 'before').getPropertyValue('--stuck')

    this.toggleAttribute('stuck', '1' === stuck)
  }
}
