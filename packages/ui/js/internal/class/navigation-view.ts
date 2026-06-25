import { lifecycleObserver } from '../../buses'
import type { TabBeforeDetail, TabDetail } from '../../events'
import { CleanupRegistry } from '../../internal/class/cleanup-registry'
import { devFlags, frame, onoff } from '../utils'

export class NavigationView extends HTMLElement {
  static get observedAttributes() {
    return ['hidden']
  }

  // pairedEventSystem
  #recentBefore?: { type: string; time: DOMHighResTimeStamp }

  constructor() {
    super()
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    switch (name) {
      case 'hidden':
        if (oldValue === newValue) break

        if (!this.closest('tab-view')) break // tabview stuff

        // trigger show/hide/reveal/swap on NEXT tick
        // show/hide run on initial render too (show on NEXT tick, is also taken care of on connected on initial render)
        let eventType = this.hasAttribute(name) ? 'tabhide' : 'tabshow',
          target = lifecycleObserver

        // isRecent by 100ms window
        // && performance.now() - this.#recentBefore.time <= 100) {
        if (this.#recentBefore) {
          if (['beforetabreveal', 'beforetabswap'].includes(this.#recentBefore.type)) {
            eventType = this.#recentBefore.type === 'beforetabreveal' ? 'tabreveal' : 'tabswap'
            target = this
          }

          // consume it (important so it doesn’t leak to next change)
          this.#recentBefore = undefined
        }

        if (devFlags.debug) console.debug(`${NavigationView.name} 💡 ${eventType}`)

        frame(this).then(() => target.dispatchEvent(new CustomEvent<TabDetail>(eventType, { detail: { tag: this.id }, bubbles: true, composed: true })))

        break
    }
  }

  disconnectedCallback() {
    CleanupRegistry.unregister(this)

    this.#recentBefore = undefined

    // trigger hide on NEXT tick
    if (!this.closest('tab-view')) return

    frame().then(() => lifecycleObserver.dispatchEvent(new CustomEvent<TabDetail>('tabhide', { detail: { tag: this.id }, bubbles: true, composed: true })))
  }

  connectedCallback() {
    if (!this.closest('tab-view')) return

    // wire befores
    CleanupRegistry.register(this, onoff('beforetabreveal beforetabswap', this.#handleBeforeTabRevealOrSwap as EventListener, this).on())

    // trigger show on NEXT tick
    if (this.hasAttribute('hidden')) return // skip if already rendered by attr-change during upgrade!

    frame(this).then(() => lifecycleObserver.dispatchEvent(new CustomEvent<TabDetail>('tabshow', { detail: { tag: this.id }, bubbles: true, composed: true })))
  }

  #handleBeforeTabRevealOrSwap = ({ type, detail }: CustomEvent<TabBeforeDetail>) => {
    if (devFlags.debug) console.debug(`${NavigationView.name} ⚡️ ${type}`)

    if (this.id !== detail?.tag) return

    this.#recentBefore = {
      type, // beforetabreveal / beforetabswap
      time: performance.now(),
    }

    self.queueMicrotask(() => {
      this.#recentBefore = undefined
    }) // auto-expire after current task
  }

  // #handleTabReveal = (event: CustomEvent<TabDetail>) => {
  //   if (devFlags.debug) console.debug(`${NavigationView.name} ⚡️ ${event?.type}`)

  //   if (this === event.target) return

  //   this.hidden = false
  // }
}
