import { onoff } from '../internal/utils'
import { CleanupRegistry } from '../internal/class/cleanup-registry'

export class StickyContainer extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    console.debug(`${StickyContainer.name} ⚡️ connect`)

    CleanupRegistry.register(this, onoff('transitionend transitionstart transitioncancel', this.#handleTransitionchange as unknown as EventListener, this).on())
  }

  disconnectedCallback() {
    console.debug(`${StickyContainer.name} ⚡️ disconnect`)

    CleanupRegistry.unregister(this)
  }

  #handleTransitionchange = ({ target, propertyName, pseudoElement }: TransitionEvent) => {
    if ('--stuck' !== propertyName || '::before' !== pseudoElement || !(target as HTMLElement)?.matches('sticky-container')) return

    const stuck = self.getComputedStyle(this, 'before').getPropertyValue('--stuck')

    this.toggleAttribute('stuck', '1' === stuck)
  }
}
