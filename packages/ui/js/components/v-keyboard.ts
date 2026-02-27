import { type ScrollView } from './scroll-view'
import { $ } from '../internal/utils'

/**
 * BUG: Safari on IOS reports inaccurate innerHeight (which is what we really want) on orientationchange.
 * So we live with a pescy body-scrollbar that shows up on resize on desktops.
 */
export class VKeyboard extends HTMLElement {
  /**
   * Change like this:
   * document.querySelector('v-keyboard').shouldKeyboardBeOpen = () => document.activeElement.tagName === 'INPUT'
   */
  #shouldKeyboardBeOpenCallback = () => {
    return 'INPUT' === document.activeElement?.tagName && 'text' === document.activeElement?.getAttribute('type')
  }

  constructor() {
    super()
  }

  disconnectedCallback() {
    console.debug(`${VKeyboard.name} ⚡️ disconnect`)

    self.removeEventListener('resize', this.#handleWindowScroll)

    self.visualViewport?.removeEventListener('resize', this.#handleVisualViewportResize)

    self.removeEventListener('orientationchange', this.#handleWindowOrientationChange)

    document.body.removeEventListener('focusin', this.#handleBodyFocusIn)
  }

  connectedCallback() {
    console.debug(`${VKeyboard.name} ⚡️ connect`)

    this.inert = true

    self.addEventListener('scroll', this.#handleWindowScroll)

    self.visualViewport?.addEventListener('resize', this.#handleVisualViewportResize)

    this.#handleVisualViewportResize()

    //

    self.addEventListener('orientationchange', this.#handleWindowOrientationChange)

    document.body.addEventListener('focusin', this.#handleBodyFocusIn)
  }

  #handleWindowScroll = () => {
    self.scrollTo(0, 0)
  }

  #handleVisualViewportResize = () => {
    const dvh = self.visualViewport?.height ?? 0,
      fullLvh = this.offsetHeight

    const diff = Math.abs(self.outerHeight - (this.#shouldKeyboardBeOpenCallback() ? dvh : fullLvh))

    $.prop('--100lvh', 30 < diff ? `${dvh}px` : `${fullLvh}px`, document.documentElement) //document.documentElement.style.setProperty('--100lvh', 30 < diff ? `${dvh}px` : `${fullLvh}px`)
    $.prop('--keyboard-inset-top', 30 < diff ? `${dvh}px` : `${fullLvh}px`, document.documentElement) //document.documentElement.style.setProperty('--keyboard-inset-top', 30 < diff ? `${dvh}px` : `${fullLvh}px`)
    $.prop('--keyboard-inset-height', 30 < diff ? `${diff}px` : `0px`, document.documentElement) //document.documentElement.style.setProperty('--keyboard-inset-height', 30 < diff ? `${diff}px` : `0px`)

    // @ts-expect-error
    if (import.meta?.env?.DEV) {
      // @ts-expect-error
      document.querySelector('#console0').innerHTML = `${this.#shouldKeyboardBeOpenCallback()} (${diff}) (${self.innerHeight}) (${fullLvh}) (${dvh})`
      // @ts-expect-error
      document.querySelector('#console').hidePopover()
      // @ts-expect-error
      document.querySelector('#console').showPopover()
    }

    self.scrollTo(0, 0)
  }

  #handleWindowOrientationChange = () => {
    console.debug(`${VKeyboard.name} ⚡️ orientationchange`)

    self.requestAnimationFrame(this.#ifKeyboardScrollIntoActiveElement)
  }

  #handleBodyFocusIn = () => {
    console.debug(`${VKeyboard.name} ⚡️ focusin`)

    self.setTimeout(this.#ifKeyboardScrollIntoActiveElement, 100)
  }

  #ifKeyboardScrollIntoActiveElement = () => {
    if (!this.#shouldKeyboardBeOpenCallback() || !document.activeElement) return

    const parent = document.activeElement?.closest<ScrollView>('scroll-view')

    parent?.scrollToElement?.(document.activeElement)
  }

  set shouldKeyboardBeOpen(fn: () => boolean) {
    if (typeof fn !== 'function') throw new TypeError(`fn must be a function`)

    this.#shouldKeyboardBeOpenCallback = fn
  }
}
