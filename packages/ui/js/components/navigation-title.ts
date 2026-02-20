import { type ScrollView } from './scroll-view'
import { Snapshot } from '../snapshot'
import { resolveDoc } from '../client'

const observing = new WeakSet()

export class NavigationTitle extends HTMLElement {
  #observer?: IntersectionObserver

  #sibling?: ScrollView

  constructor() {
    super()

    this.#sibling = this.closest<ScrollView>('scroll-view') ?? undefined
  }

  disconnectedCallback() {
    console.debug(`${NavigationTitle.name} ⚡️ disconnect`)

    this.#observer?.unobserve(this)
    if (observing.has(this)) observing.delete(this)
  }

  connectedCallback() {
    console.debug(`${NavigationTitle.name} ⚡️ connect`)

    if (!this.#sibling) return

    if (!this.#sibling?.hasAttribute('navigation-bar-title-display-mode')) this.#sibling?.setAttribute('navigation-bar-title-display-mode', 'large')

    Snapshot.waitReady.then(() => {
      const blockSizeProp = getComputedStyle(this).getPropertyValue('--navigation-bar-block-size') || '0',
        blockSize = parseFloat(blockSizeProp) * (blockSizeProp.endsWith('rem') ? parseFloat(getComputedStyle(document.documentElement).fontSize) : 1)

      this.#observer = new IntersectionObserver(this.#handleIntersect, {
        root: this.#sibling,
        rootMargin: `-${blockSize}px 0px 0px 0px`,
        threshold: [0, 1],
      })

      // self.requestAnimationFrame(() => this.#observer?.observe(this))

      this.#sibling?.addEventListener('scroll', (event) => {
        if (!observing.has(this)) {
          this.#observer?.observe(this)
          observing.add(this)
        }
      })

      this.#sibling?.addEventListener('scrollend', (event) => {
        if (observing.has(this)) {
          this.#observer?.unobserve(this)
          observing.delete(this)
        }
      })

      // this.addEventListener('transitionend', (event) => {
      //   if (event.propertyName !== 'opacity') return

      //   event.target.classList.remove('ggg')
      //   console.log(4444, event)
      // })
    })
  }

  #handleIntersect = async (entries: IntersectionObserverEntry[]) => {
    console.debug(`${NavigationTitle.name} ⚡️ intersect (${entries?.[0]?.isIntersecting})`)
    // console.log(999, entries[0], getComputedStyle(resolveDoc(this.#sibling)).transform)
    // self.requestAnimationFrame(() => {
    for (const entry of entries) this.#sibling?.setAttribute('navigation-bar-title-display-mode', entry.isIntersecting ? 'large' : 'inline')
    //   this.classList.toggle('ggg', !entry.isIntersecting)
    // } //

    // })
  }
}
