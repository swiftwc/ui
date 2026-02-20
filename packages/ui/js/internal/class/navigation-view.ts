import { Snapshot } from '../../snapshot'
import { type TabRevealDetail } from '../../events'

export class NavigationView extends HTMLElement {
  static observedAttributes = ['hidden']

  constructor() {
    super()
  }

  disconnectedCallback() {
    this.removeEventListener('tabreveal', this.#handleTabReveal)
  }

  connectedCallback() {
    this.addEventListener('tabreveal', this.#handleTabReveal)

    Snapshot.waitReady.then(() => {
      if (this.hasAttribute('hidden')) return // will be picked up by attr-change!

      if (this.closest('tab-view'))
        this.dispatchEvent(new CustomEvent<TabRevealDetail>('tabreveal', { detail: { tag: this.id }, bubbles: true, composed: true }))
    })
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    Snapshot.waitReady.then(() => {
      switch (name) {
        case 'hidden':
          if (oldValue === newValue) break

          if (!this.closest('tab-view')) break

          const event = this.hasAttribute(name) ? 'tabswap' : 'tabreveal'

          console.debug(`${NavigationView.name} 💡 ${event}`)

          this.dispatchEvent(new CustomEvent<TabRevealDetail>(event, { detail: { tag: this.id }, bubbles: true, composed: true }))

          break
      }
    })
  }

  #handleTabReveal = (event: CustomEvent<TabRevealDetail>) => {
    console.debug(`${NavigationView.name} ⚡️ ${event?.type}`)

    if (this === event.target) return

    this.hidden = false
  }
}
