import { CleanupRegistry } from '../internal/class/cleanup-registry'
import { devFlags, onoff } from '../internal/utils'

export class StickyContainer extends HTMLElement {
  constructor() {
    super()
  }

  disconnectedCallback() {
    if (devFlags.debug) console.debug(`${StickyContainer.name} ⚡️ disconnect`)

    CleanupRegistry.unregister(this)
  }

  connectedCallback() {
    if (devFlags.debug) console.debug(`${StickyContainer.name} ⚡️ connect`)

    // CleanupRegistry.register(this, onoff('transitionend transitionstart transitioncancel', this.#handleTransitionrun as unknown as EventListener, this).on())
    CleanupRegistry.register(this, onoff('transitionrun', this.#handleTransitionrun as unknown as EventListener, this).on())
  }

  #handleTransitionrun = ({ target, propertyName, pseudoElement }: TransitionEvent) => {
    if (!(target instanceof HTMLElement)) return

    if ('--stuck' !== propertyName || '::before' !== pseudoElement || !target.matches('sticky-container')) return

    const stuck = self.getComputedStyle(this, 'before').getPropertyValue('--stuck')

    this.toggleAttribute('stuck', '1' === stuck)
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sticky-container': StickyContainer
  }
}
