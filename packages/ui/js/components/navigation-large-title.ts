import { type ScrollView } from './scroll-view'
import { Snapshot } from '../snapshot'
import { slowHideShow } from '../internal/utils'

const observing = new WeakSet()

export class NavigationLargeTitle extends HTMLElement {
  #observer?: IntersectionObserver

  #sibling?: ScrollView

  #scrollSafetyTimer?: number

  constructor() {
    super()

    this.#sibling = this.closest<ScrollView>('scroll-view') ?? undefined
  }

  disconnectedCallback() {
    console.debug(`${NavigationLargeTitle.name} ⚡️ disconnect`)

    this.#clearScrollState()

    this.#sibling?.removeEventListener('scroll', this.#handleScroll)

    this.#sibling?.removeEventListener('scrollend', this.#handleScrollend)
  }

  connectedCallback() {
    console.debug(`${NavigationLargeTitle.name} ⚡️ connect`)

    if (!this.#sibling) return

    if (!this.#sibling?.hasAttribute('navigation-bar-title-display-mode')) this.#sibling?.setAttribute('navigation-bar-title-display-mode', 'large')

    Snapshot.waitReady.then(() => {
      // NOTE: Required or BREAKS transitions
      self.requestAnimationFrame(() => {
        const blockSizeProp = `${document.documentElement.computedStyleMap().get(`--navigation-bar-block-size`) ?? '0'}`, //getComputedStyle(this).getPropertyValue('--navigation-bar-block-size') || '0',
          blockSize = parseFloat(blockSizeProp) * (blockSizeProp.endsWith('rem') ? parseFloat(getComputedStyle(document.documentElement).fontSize) : 1)

        this.#observer = new IntersectionObserver(this.#handleIntersect, {
          root: this.#sibling,
          rootMargin: `-${blockSize}px 0px 0px 0px`,
          threshold: [0, 1],
        })

        // this.#observer?.observe(this)

        this.#sibling?.addEventListener('scroll', this.#handleScroll)

        this.#sibling?.addEventListener('scrollend', this.#handleScrollend)
      })
    })
  }

  #clearScrollState = () => {
    if (!observing.has(this)) return

    this.#observer?.unobserve(this)
    observing.delete(this)

    clearTimeout(this.#scrollSafetyTimer)
    this.#scrollSafetyTimer = undefined
  }

  #handleScroll = (event: Event) => {
    if (!observing.has(this)) {
      this.#observer?.observe(this)
      observing.add(this)
    }

    clearTimeout(this.#scrollSafetyTimer) // reset watchdog every scroll event

    this.#scrollSafetyTimer = self.setTimeout(() => this.#clearScrollState, 2000)
  }

  #handleScrollend = (event: Event) => {
    this.#clearScrollState()
  }

  #handleIntersect = async (entries: IntersectionObserverEntry[]) => {
    console.debug(`${NavigationLargeTitle.name} ⚡️ intersect (${entries?.[0]?.isIntersecting})`)

    for (const { isIntersecting } of entries) {
      const value = isIntersecting ? 'large' : 'inline'

      if (value !== this.#sibling?.getAttribute('navigation-bar-title-display-mode')) this.#sibling?.setAttribute('navigation-bar-title-display-mode', value)

      if (this.hasAttribute('navigation-bar-auto-hide')) slowHideShow(isIntersecting ? 'show' : 'hide', this)
    }
  }
}
