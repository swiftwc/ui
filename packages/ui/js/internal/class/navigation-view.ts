import { Snapshot } from '../../snapshot'
import { type TabRevealSwapDetail, type PageRevealSwapDetail } from '../../events'
import { debounce } from '../../internal/utils'

export class NavigationView extends HTMLElement {
  static observedAttributes = ['hidden']

  #debouncedHandler

  constructor() {
    super()

    this.#debouncedHandler = debounce(this.#handleSelectionChange, 1, true)
  }

  disconnectedCallback() {
    // this.removeEventListener('tabreveal', this.#handleTabReveal)
    this.removeEventListener('pagereveal', this.#debouncedHandler)
    this.removeEventListener('pageswap', this.#debouncedHandler)
  }

  connectedCallback() {
    // this.addEventListener('tabreveal', this.#handleTabReveal)
    this.addEventListener('pagereveal', this.#debouncedHandler)
    this.addEventListener('pageswap', this.#debouncedHandler)

    Snapshot.waitReady.then(() => {
      if (this.hasAttribute('hidden')) return // will be picked up by attr-change!

      if (this.parentElement?.matches('tab-view'))
        this.dispatchEvent(new CustomEvent<TabRevealSwapDetail>('tabreveal', { detail: { tag: this.id }, bubbles: true, composed: true }))
    })
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    Snapshot.waitReady.then(() => {
      switch (name) {
        case 'hidden':
          if (oldValue === newValue) break

          if (!this.parentElement?.matches('tab-view')) break

          const event = this.hasAttribute(name) ? 'tabswap' : 'tabreveal'

          console.debug(`${NavigationView.name} 💡 ${event}`)

          this.dispatchEvent(new CustomEvent<TabRevealSwapDetail>(event, { detail: { tag: this.id }, bubbles: true, composed: true }))

          break
      }
    })
  }

  #handleSelectionChange = (event: CustomEvent<PageRevealSwapDetail>) => {
    this.#triggerChangeEvent(event)
  }

  #triggerChangeEvent = (event: Event) => {
    const eventType = 'navigation-path:change'

    console.debug(`${NavigationView.name} 💡 ${eventType}`)

    this.dispatchEvent(new CustomEvent<TabViewChangeDetail>(eventType, { detail: { selection: this.selectedTab }, bubbles: true, composed: true }))
  }

  // #handleTabReveal = (event: CustomEvent<TabRevealSwapDetail>) => {
  //   console.debug(`${NavigationView.name} ⚡️ ${event?.type}`)

  //   if (this === event.target) return

  //   this.hidden = false
  // }
}
