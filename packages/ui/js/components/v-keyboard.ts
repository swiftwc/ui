import { type ScrollView } from './scroll-view'
import { $, sleep, frame, onoff } from '../internal/utils'
import { CleanupRegistry } from '../internal/class/cleanup-registry'

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

    CleanupRegistry.unregister(this)
  }

  connectedCallback() {
    console.debug(`${VKeyboard.name} ⚡️ connect`)

    this.inert = true

    const { on: on1 } = onoff(
      [
        { types: 'scroll', listener: this.#handleWindowScroll },
        { types: 'orientationchange', listener: this.#handleWindowOrientationchange },
      ],
      self
    )

    CleanupRegistry.register(this, on1())

    const { on: on2 } = onoff('resize', this.#handleVisualViewportResize, self.visualViewport ?? undefined, { passive: true })

    CleanupRegistry.register(this, on2())

    this.#handleVisualViewportResize()

    //

    const { on: on3 } = onoff('focusin', this.#handleBodyFocusin, document.body)

    CleanupRegistry.register(this, on3())
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

    self.scrollTo(0, 0)
  }

  #handleWindowOrientationchange = async () => {
    console.debug(`${VKeyboard.name} ⚡️ orientationchange`)

    await frame() //self.requestAnimationFrame(this.#ifKeyboardScrollIntoActiveElement)

    if (!this.isConnected) return

    this.#ifKeyboardScrollIntoActiveElement()
  }

  #handleBodyFocusin = async () => {
    console.debug(`${VKeyboard.name} ⚡️ focusin`)

    await sleep(100) // self.setTimeout(this.#ifKeyboardScrollIntoActiveElement, 100)

    if (!this.isConnected) return

    this.#ifKeyboardScrollIntoActiveElement()
  }

  #ifKeyboardScrollIntoActiveElement = () => {
    if (!this.#shouldKeyboardBeOpenCallback() || !document.activeElement) return

    const parent = document.activeElement?.closest<ScrollView>('scroll-view')

    parent?.scrollToElement?.(document.activeElement)
  }

  set shouldKeyboardBeOpen(fn: () => boolean) {
    if ('function' !== typeof fn) throw new TypeError(`fn must be typeof function`)

    this.#shouldKeyboardBeOpenCallback = fn
  }
}
