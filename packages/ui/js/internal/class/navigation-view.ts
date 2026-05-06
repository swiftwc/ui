import { type TabDetail } from '../../events'
import { CleanupRegistry } from '../../internal/class/cleanup-registry'
import { LifecycleObserver } from '../../lifecycle-observer'
import { frame, onoff } from '../utils'

export class NavigationView extends HTMLElement {
  static get observedAttributes() {
    return ['hidden']
  }

  // pairedEventSystem
  #recentBefore?: { type: string; time: DOMHighResTimeStamp }

  constructor() {
    super()
  }

  disconnectedCallback() {
    CleanupRegistry.unregister(this)

    this.#recentBefore = undefined

    // this.removeEventListener('tabreveal', this.#handleTabReveal)
    if (this.closest('tab-view'))
      frame().then(() => LifecycleObserver.dispatchEvent(new CustomEvent<TabDetail>('tabhide', { detail: { tag: this.id }, bubbles: true, composed: true })))
  }

  connectedCallback() {
    if (this.closest('tab-view')) {
      // frame(this).then((r) => {
      //   if (!r) return

      //   this.dispatchEvent(new CustomEvent<TabDetail>('tabshow', { detail: { tag: this.id }, bubbles: true, composed: true }))
      // })

      CleanupRegistry.register(this, onoff('beforetabreveal beforetabswap', this.#handleBeforeTabRevealOrSwap as EventListener, this).on())
    }

    // Snapshot.waitReady.then(async () => {
    if (this.hasAttribute('hidden')) return // will be picked up by attr-change!

    if (this.closest('tab-view'))
      frame(this).then(() => {
        // if (!r) return

        LifecycleObserver.dispatchEvent(new CustomEvent<TabDetail>('tabshow', { detail: { tag: this.id }, bubbles: true, composed: true }))
      })
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    switch (name) {
      case 'hidden':
        if (oldValue === newValue) break

        if (!this.closest('tab-view')) break // tabview stuff

        let eventType = this.hasAttribute(name) ? 'tabshow' : 'tabhide',
          target = LifecycleObserver

        // isRecent by 100ms window
        if (this.#recentBefore && performance.now() - this.#recentBefore.time <= 100) {
          if (this.#recentBefore.type === 'beforetabreveal') {
            eventType = 'tabreveal'
            target = this
          } else if (this.#recentBefore.type === 'beforetabswap') {
            eventType = 'tabswap'
            target = this
          }

          // consume it (important so it doesn’t leak to next change)
          this.#recentBefore = undefined
        }

        console.debug(`${NavigationView.name} 💡 ${eventType}`)

        frame(this).then(() => {
          // if (!r) return

          target.dispatchEvent(new CustomEvent<TabDetail>(eventType, { detail: { tag: this.id }, bubbles: true, composed: true }))
        })

        break
    }
  }

  #handleBeforeTabRevealOrSwap = (evt: CustomEvent<TabDetail>) => {
    console.debug(`${NavigationView.name} ⚡️ ${evt?.type}`)

    if (this.id !== evt.detail?.tag) return

    this.#recentBefore = {
      type: evt.type, // beforetabreveal / beforetabswap
      time: performance.now(),
    }
  }

  // #handleTabReveal = (event: CustomEvent<TabDetail>) => {
  //   console.debug(`${NavigationView.name} ⚡️ ${event?.type}`)

  //   if (this === event.target) return

  //   this.hidden = false
  // }
}
