import { type ScrollView } from './scroll-view'
import { Snapshot } from '../snapshot'
import { slowHideShow } from '../internal/utils'

// const observing = new WeakSet()

export class NavigationLargeTitle extends HTMLElement {
  #observer?: IntersectionObserver

  #sibling?: ScrollView

  constructor() {
    super()

    this.#sibling = this.closest<ScrollView>('scroll-view') ?? undefined
  }

  disconnectedCallback() {
    console.debug(`${NavigationLargeTitle.name} ⚡️ disconnect`)

    this.#observer?.unobserve(this)
    // if (observing.has(this)) observing.delete(this)
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

        this.#observer?.observe(this)
      })

      // this.#sibling?.addEventListener('scroll', (event) => {
      //   if (!observing.has(this)) {
      //     this.#observer?.observe(this)
      //     observing.add(this)
      //   }
      // })
      // this.#sibling?.addEventListener('scrollend', (event) => {
      //   if (observing.has(this)) {
      //     this.#observer?.unobserve(this)
      //     observing.delete(this)
      //   }
      // })
    })
  }

  #handleIntersect = async (entries: IntersectionObserverEntry[]) => {
    console.debug(`${NavigationLargeTitle.name} ⚡️ intersect (${entries?.[0]?.isIntersecting})`)

    for (const entry of entries) {
      this.#sibling?.setAttribute('navigation-bar-title-display-mode', entry.isIntersecting ? 'large' : 'inline')

      if (this.hasAttribute('navigation-bar-auto-hide')) slowHideShow(entry.isIntersecting ? 'show' : 'hide', this)
    }
  }
}
