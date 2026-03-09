import { type ScrollView } from './scroll-view'
import { Snapshot } from '../snapshot'
import { slowHideShow, frame, onoff, timeout } from '../internal/utils'
import { CleanupRegistry } from '../internal/class/cleanup-registry'

const observing = new WeakSet()

export class NavigationLargeTitle extends HTMLElement {
  #observer?: IntersectionObserver

  #sibling?: ScrollView

  #scrollSafetyTimer = timeout()

  constructor() {
    super()

    this.#sibling = this.closest<ScrollView>('scroll-view') ?? undefined
  }

  disconnectedCallback() {
    console.debug(`${NavigationLargeTitle.name} ⚡️ disconnect`)

    this.#clearScrollState()

    CleanupRegistry.unregister(this)
  }

  connectedCallback() {
    console.debug(`${NavigationLargeTitle.name} ⚡️ connect`)

    if (!this.#sibling) return

    if (!this.#sibling?.hasAttribute('navigation-bar-title-display-mode')) this.#sibling?.setAttribute('navigation-bar-title-display-mode', 'large')

    Snapshot.waitReady.then(async () => {
      if (!(await frame(this))) return // NOTE: Required or BREAKS transitions  // self.requestAnimationFrame(() => {

      const blockSizeProp = getComputedStyle(this).getPropertyValue('--navigation-bar-block-size') || '0', //`${document.documentElement.computedStyleMap().get(`--navigation-bar-block-size`) ?? '0'}`, //
        blockSize = parseFloat(blockSizeProp) * (blockSizeProp.endsWith('rem') ? parseFloat(getComputedStyle(document.documentElement).fontSize) : 1)

      this.#observer = new IntersectionObserver(this.#handleIntersect, {
        root: this.#sibling,
        rootMargin: `-${blockSize}px 0px 0px 0px`,
        threshold: [0, 1],
      })

      // this.#observer?.observe(this)

      const { on } = onoff(
        [
          { types: 'scroll', listener: this.#handleScroll, addOptions: { passive: true } },
          { types: 'scrollend', listener: this.#handleScrollend, addOptions: { passive: true } },
        ],
        this.#sibling
      )

      CleanupRegistry.register(this, on())
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

  #handleIntersect = (entries: IntersectionObserverEntry[]) => {
    console.debug(`${NavigationLargeTitle.name} ⚡️ intersect (${entries?.[0]?.isIntersecting})`)

    for (const { isIntersecting } of entries) {
      const value = isIntersecting ? 'large' : 'inline'

      if (value === this.#sibling?.getAttribute('navigation-bar-title-display-mode')) break

      this.#sibling?.setAttribute('navigation-bar-title-display-mode', value)

      if (this.hasAttribute('navigation-bar-auto-hide')) slowHideShow(isIntersecting ? 'show' : 'hide', this)
    }
  }
}
