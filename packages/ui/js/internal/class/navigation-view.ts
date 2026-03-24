import { frame } from '../utils'
import { Snapshot } from '../../snapshot'
import { type TabDetail } from '../../events'
import { LifecycleObserver } from '../../lifecycle-observer'

export class NavigationView extends HTMLElement {
  static observedAttributes = ['hidden']

  constructor() {
    super()
  }

  disconnectedCallback() {
    // this.removeEventListener('tabreveal', this.#handleTabReveal)
    if (this.closest('tab-view'))
      frame().then(() => LifecycleObserver.dispatchEvent(new CustomEvent<TabDetail>('tabhide', { detail: { tag: this.id }, bubbles: true, composed: true })))
  }

  connectedCallback() {
    if (this.closest('tab-view'))
      frame(this).then((r) => {
        if (!r) return

        this.dispatchEvent(new CustomEvent<TabDetail>('tabshow', { detail: { tag: this.id }, bubbles: true, composed: true }))
      })

    // Snapshot.waitReady.then(async () => {
    if (this.hasAttribute('hidden')) return // will be picked up by attr-change!

    if (this.closest('tab-view'))
      frame(this).then((r) => {
        if (!r) return

        this.dispatchEvent(new CustomEvent<TabDetail>('tabreveal', { detail: { tag: this.id }, bubbles: true, composed: true }))
      })
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    // Snapshot.waitReady.then(async () => {
    //   if (!this.isConnected) return

    switch (name) {
      case 'hidden':
        if (oldValue === newValue) break

        if (!this.closest('tab-view')) break

        const eventType = this.hasAttribute(name) ? 'tabswap' : 'tabreveal'

        console.debug(`${NavigationView.name} 💡 ${eventType}`)

        frame(this).then((r) => {
          if (!r) return

          this.dispatchEvent(new CustomEvent<TabDetail>(eventType, { detail: { tag: this.id }, bubbles: true, composed: true }))
        })

        break
    }
    // })
  }

  // #handleTabReveal = (event: CustomEvent<TabDetail>) => {
  //   console.debug(`${NavigationView.name} ⚡️ ${event?.type}`)

  //   if (this === event.target) return

  //   this.hidden = false
  // }
}
