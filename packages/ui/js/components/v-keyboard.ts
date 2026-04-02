import { type ScrollView } from './scroll-view'
import { $, sleep, frame, onoff } from '../internal/utils'
import { CleanupRegistry } from '../internal/class/cleanup-registry'
import { Snapshot } from '../snapshot'

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

    CleanupRegistry.register(
      this,
      onoff(
        [
          { types: 'scroll', listener: this.#handleWindowScroll },
          { types: 'orientationchange', listener: this.#handleWindowOrientationchange },
        ],
        self
      ).on()
    )

    CleanupRegistry.register(this, onoff('resize', this.#handleVisualViewportResize, self.visualViewport ?? undefined, { passive: true }).on())

    this.#handleVisualViewportResize()

    //

    CleanupRegistry.register(this, onoff('focusin', this.#handleBodyFocusin, document.body).on())

    Snapshot.waitReady.then(() => {
      document.documentElement.style.setProperty('--root-font-size', parseFloat(self.getComputedStyle(document.documentElement).fontSize).toFixed(5))

      CleanupRegistry.register(this, onoff('transitionrun', this.#handleDocumentTransitionrun as EventListener, document.documentElement).on())
    })
  }

  #handleDocumentTransitionrun = (evt: TransitionEvent) => {
    if (evt.target !== document.documentElement || 'font-size' !== evt.propertyName) return

    document.documentElement.style.setProperty('--root-font-size', parseFloat(self.getComputedStyle(document.documentElement).fontSize).toFixed(5))
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

    if (!(await frame(this))) return //self.requestAnimationFrame(this.#ifKeyboardScrollIntoActiveElement)

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
