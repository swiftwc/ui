import { type ScrollView } from './scroll-view'
import { Snapshot } from '../snapshot'
import { slowHideShow, frame, onoff, timeout } from '../internal/utils'
import { CleanupRegistry } from '../internal/class/cleanup-registry'

const observing = new WeakSet()

export class NavigationLargeTitle extends HTMLElement {
  #observer?: IntersectionObserver

  #scrollSafetyTimer = timeout()

  constructor() {
    super()
  }

  disconnectedCallback() {
    console.debug(`${NavigationLargeTitle.name} ⚡️ disconnect`)

    this.#clearScrollState()

    CleanupRegistry.unregister(this)
  }

  connectedCallback() {
    console.debug(`${NavigationLargeTitle.name} ⚡️ connect`)

    const root = this.closest<ScrollView>('scroll-view') ?? undefined

    if (!root) return

    if (!root?.hasAttribute('navigation-bar-title-display-mode')) root?.setAttribute('navigation-bar-title-display-mode', 'large')

    // Snapshot.waitReady.then(async () => {
    frame(this).then((r) => {
      if (!r) return // NOTE: Required or BREAKS transitions  // self.requestAnimationFrame(() => {

      const blockSizeProp = getComputedStyle(this).getPropertyValue('--navigation-bar-block-size') || '0', //`${document.documentElement.computedStyleMap().get(`--navigation-bar-block-size`) ?? '0'}`, //
        blockSize = parseFloat(blockSizeProp) * (blockSizeProp.endsWith('rem') ? parseFloat(getComputedStyle(document.documentElement).fontSize) : 1)

      this.#observer = new IntersectionObserver(this.#handleIntersect, {
        root,
        rootMargin: `-${blockSize}px 0px 0px 0px`,
        threshold: [0, 1],
      })

      // this.#observer?.observe(this)

      const { on } = onoff(
        [
          { types: 'scroll', listener: this.#handleScroll, addOptions: { passive: true } },
          { types: 'scrollend', listener: this.#handleScrollend, addOptions: { passive: true } },
        ],
        root
      )

      CleanupRegistry.register(this, on())
      // })
      // })
    })
  }

  #clearScrollState = () => {
    if (observing.has(this)) {
      this.#observer?.unobserve(this)
      observing.delete(this)
    }

    this.#scrollSafetyTimer.cancel()
  }

  #handleScroll: EventListener = (event: Event) => {
    if (!observing.has(this)) {
      this.#observer?.observe(this)
      observing.add(this)
    }

    this.#scrollSafetyTimer.next(() => this.#clearScrollState(), 2000) // reset watchdog every scroll event
  }

  #handleScrollend: EventListener = (event: Event) => {
    this.#clearScrollState()
  }

  #handleIntersect = (entries: IntersectionObserverEntry[], { root }: IntersectionObserver) => {
    console.debug(`${NavigationLargeTitle.name} ⚡️ intersect (${entries?.[0]?.isIntersecting})`)

    if (!(root instanceof HTMLElement)) return

    for (const { isIntersecting } of entries) {
      const value = isIntersecting ? 'large' : 'inline'

      if (value === root?.getAttribute('navigation-bar-title-display-mode')) continue

      root?.setAttribute('navigation-bar-title-display-mode', value)

      if (this.closest('[hidden]')) return // if (0 === this.offsetHeight + this.offsetWidth) continue

      if (this.hasAttribute('navigation-bar-auto-hide')) slowHideShow(isIntersecting ? 'show' : 'hide', this)
    }
  }
}
