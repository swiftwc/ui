import { type ScrollView } from './scroll-view'
import { Snapshot } from '../snapshot'
import { slowHideShow, frame, onoff, timeout, add } from '../internal/utils'
import { CleanupRegistry } from '../internal/class/cleanup-registry'
import { CSSStyleObserver } from '../internal/class/css-style-observer'

const observing = new WeakSet()

function observeResizeEnd(el: HTMLElement, callback: (rect: DOMRect) => void, stableFrames = 4) {
  let rafId: number | null = null
  let lastRect = el.getBoundingClientRect()
  let stableCount = 0

  function check() {
    const rect = el.getBoundingClientRect()

    if (rect.width === lastRect.width && rect.height === lastRect.height) {
      stableCount++
    } else {
      stableCount = 0
      lastRect = rect
    }

    if (stableCount >= stableFrames) {
      rafId = null
      callback(rect)
      return
    }

    rafId = self.requestAnimationFrame(check)
  }

  const observer = new ResizeObserver(() => {
    stableCount = 0

    if (rafId === null) {
      lastRect = el.getBoundingClientRect()
      rafId = self.requestAnimationFrame(check)
    }
  })

  observer.observe(el)

  return () => {
    observer.disconnect()
    if (rafId) self.cancelAnimationFrame(rafId)
  }
}
function parseRootMargin(rootMargin = '0px 0px 0px 0px') {
  const parts = rootMargin.split(/\s+/).map((v) => parseInt(v))
  switch (parts.length) {
    case 1:
      return [parts[0], parts[0], parts[0], parts[0]]
    case 2:
      return [parts[0], parts[1], parts[0], parts[1]]
    case 3:
      return [parts[0], parts[1], parts[2], parts[1]]
    case 4:
      return parts
    default:
      return [0, 0, 0, 0]
  }
}
function isIntersectingWithContainer(el: HTMLElement, container: HTMLElement, rootMargin = '0px 0px 0px 0px') {
  if (!(el instanceof Element) || !(container instanceof Element)) return false

  const elRect = el.getBoundingClientRect()
  const contRect = container.getBoundingClientRect()

  const [topMargin, rightMargin, bottomMargin, leftMargin] = parseRootMargin(rootMargin)

  const marginRect = {
    top: contRect.top + topMargin,
    right: contRect.right - rightMargin,
    bottom: contRect.bottom - bottomMargin,
    left: contRect.left + leftMargin,
  }

  return !(elRect.bottom < marginRect.top || elRect.top > marginRect.bottom || elRect.right < marginRect.left || elRect.left > marginRect.right)
}

export class NavigationLargeTitle extends HTMLElement {
  #styleObserver?: CSSStyleObserver
  #scrollObserver?: IntersectionObserver

  #scrollSafetyTimer = timeout()

  #rootMarginTop = '0px'

  constructor() {
    super()
  }

  disconnectedCallback() {
    console.debug(`${NavigationLargeTitle.name} ⚡️ disconnect`)

    this.#clearScrollState()

    this.#styleObserver?.disconnect()

    CleanupRegistry.unregister(this)
  }

  connectedCallback() {
    console.debug(`${NavigationLargeTitle.name} ⚡️ connect`)

    const root = this.closest<ScrollView>('scroll-view') ?? undefined

    if (!root) return

    if (!root?.hasAttribute('navigation-bar-title-display-mode')) root?.setAttribute('navigation-bar-title-display-mode', 'large')

    frame(this).then((r) => {
      if (!r) return // NOTE: Required or BREAKS transitions  // self.requestAnimationFrame(() => {

      this.#styleObserver = new CSSStyleObserver()
      this.#styleObserver.observe(this, this.#handleStyleChange)

      Snapshot.waitReady.then(this.#handleStyleChange)

      // this.#observer?.observe(this)

      CleanupRegistry.register(
        this,
        onoff(
          [
            { types: 'scroll', listener: this.#handleScroll, addOptions: { passive: true } },
            { types: 'scrollend', listener: this.#handleScrollend, addOptions: { passive: true } },
          ],
          root
        ).on()
      )

      observeResizeEnd(root, () => {
        const isIntersecting = isIntersectingWithContainer(this, root, `${this.#rootMarginTop} 0px 0px 0px`)

        this.#applySlowness(root, isIntersecting)
      })
    })
  }

  #handleStyleChange = () => {
    console.debug(`${NavigationLargeTitle.name} ⚡️ style`)

    const root = this.closest<ScrollView>('scroll-view') ?? undefined
    if (!root) return

    const style = self.getComputedStyle(this)

    const blockSizeProp = style.getPropertyValue('--navigation-bar-block-size') || '0', //`${document.documentElement.computedStyleMap().get(`--navigation-bar-block-size`) ?? '0'}`, //
      blockSize = parseFloat(blockSizeProp) * (blockSizeProp.endsWith('rem') ? parseFloat(style.getPropertyValue('--root-font-size')) || 16 : 1)
    // blockSize = parseFloat(blockSizeProp) * (blockSizeProp.endsWith('rem') ? parseFloat(self.getComputedStyle(document.documentElement).fontSize) : 1)

    const rootMarginTop = `${blockSize}px`

    if (this.#rootMarginTop === rootMarginTop) return

    this.#rootMarginTop = rootMarginTop

    // Tear down old observer cleanly before replacing it
    const wasObserving = observing.delete(this)
    this.#scrollObserver?.disconnect()

    this.#scrollObserver = new IntersectionObserver(this.#handleIntersect, {
      root,
      rootMargin: `-${this.#rootMarginTop} 0px 0px 0px`,
      threshold: [0, 1],
    })

    // Re-observe immediately if we were mid-scroll
    if (wasObserving) {
      observing.add(this)
      this.#scrollObserver.observe(this)
    }
  }

  #clearScrollState = () => {
    if (observing.delete(this)) this.#scrollObserver?.unobserve(this)

    this.#scrollSafetyTimer.cancel()
  }

  #handleScroll: EventListener = (evt: Event) => {
    if (add(observing, this)) this.#scrollObserver?.observe(this)

    this.#scrollSafetyTimer.next(() => this.#clearScrollState(), 2000) // reset watchdog every scroll event
  }

  #handleScrollend: EventListener = (evt: Event) => {
    this.#clearScrollState()
  }

  // #handleResizeend: EventListener = (evt: Event) => {
  //   const root = evt.target as HTMLElement

  //   const isIntersecting = isIntersectingWithContainer(this, root, `${this.#rootMarginTop} 0px 0px 0px`)

  //   this.#applySlowness(root, isIntersecting)
  // }

  #handleIntersect = (entries: IntersectionObserverEntry[], { root }: IntersectionObserver) => {
    console.debug(`${NavigationLargeTitle.name} ⚡️ intersect (${entries?.[0]?.isIntersecting})`)

    if (!(root instanceof HTMLElement)) return

    for (const { isIntersecting } of entries) this.#applySlowness(root, isIntersecting)
    // for (const { isIntersecting } of entries) {
    //   const value = isIntersecting ? 'large' : 'inline'

    //   if (value === root?.getAttribute('navigation-bar-title-display-mode')) continue

    //   root?.setAttribute('navigation-bar-title-display-mode', value)

    //   if (this.closest('[hidden]')) continue // if (0 === this.offsetHeight + this.offsetWidth) continue

    //   if (this.hasAttribute('navigation-bar-auto-hide')) slowHideShow(isIntersecting ? 'show' : 'hide', this)
    // }
  }

  #applySlowness = (root: HTMLElement, isIntersecting: boolean) => {
    const value = isIntersecting ? 'large' : 'inline'

    if (value === root?.getAttribute('navigation-bar-title-display-mode')) return

    root?.setAttribute('navigation-bar-title-display-mode', value)

    if (this.closest('[hidden]')) return // if (0 === this.offsetHeight + this.offsetWidth) continue

    if (this.hasAttribute('navigation-bar-auto-hide')) slowHideShow(isIntersecting ? 'show' : 'hide', this)
  }
}
