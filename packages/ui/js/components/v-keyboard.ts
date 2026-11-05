import { CleanupRegistry } from '../internal/class/cleanup-registry.ts'
import { debug, frame, onoff, prop, sleep } from '../internal/utils/index.ts'
import { Snapshot } from '../snapshot/index.ts'
import { type ScrollView } from './scroll-view.ts'

const NO_KEYBOARD_INPUT_TYPES = new Set(['button', 'checkbox', 'color', 'date', 'datetime-local', 'file', 'hidden', 'image', 'month', 'radio', 'range', 'reset', 'submit', 'time', 'week'])

const getDeepActiveElement = (root: Document | ShadowRoot = document): Element | null => {
  const el = root.activeElement

  return el?.shadowRoot?.activeElement ? getDeepActiveElement(el.shadowRoot) : el
}

/**
 * BUG: Safari on iOS reports inaccurate innerHeight (which is what we really want) on orientationchange.
 * So we live with a pesky body-scrollbar that shows up on resize on desktops.
 *
 * @summary Required component, used to handle the virtual keyboard on touch devices.
 *
 * @attr {Inter} system-font — Prefers the "Inter" font family, if loaded.
 */
export class VKeyboard extends HTMLElement {
  /**
   * Change like this:
   * document.querySelector('v-keyboard').shouldKeyboardBeOpen = () => document.activeElement.tagName === 'INPUT'
   */
  #shouldKeyboardBeOpenCallback: () => boolean = () => {
    const el = getDeepActiveElement()

    if (!(el instanceof HTMLElement) || 'none' === el.inputMode) return false
    if (el instanceof HTMLInputElement) return !el.readOnly && !NO_KEYBOARD_INPUT_TYPES.has(el.type)
    if (el instanceof HTMLTextAreaElement) return !el.readOnly

    return el.isContentEditable
  }

  disconnectedCallback() {
    debug(`${VKeyboard.name} ⚡️ disconnect`)

    CleanupRegistry.unregister(this)
  }

  connectedCallback() {
    debug(`${VKeyboard.name} ⚡️ connect`)

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

    CleanupRegistry.register(this, onoff('focusin', this.#handleBodyFocusin, document.body).on())

    void Snapshot.waitReady.then(() => {
      if (!this.isConnected) return // Element may have been removed while waiting; registering now would leak the listener past `unregister`.

      this.#syncRootFontSize()

      CleanupRegistry.register(this, onoff('transitionrun', this.#handleDocumentTransitionrun as EventListener, document.documentElement).on())
    })
  }

  #syncRootFontSize() {
    prop('--root-font-size', parseFloat(self.getComputedStyle(document.documentElement).fontSize).toFixed(5), document.documentElement)
  }

  #handleDocumentTransitionrun = (evt: TransitionEvent) => {
    if (evt.target !== document.documentElement || 'font-size' !== evt.propertyName) return

    this.#syncRootFontSize()
  }

  #handleWindowScroll = () => {
    self.scrollTo(0, 0)
  }

  #handleVisualViewportResize = () => {
    const dvh = self.visualViewport?.height ?? 0,
      fullLvh = this.offsetHeight

    const diff = Math.abs(self.outerHeight - (this.#shouldKeyboardBeOpenCallback() ? dvh : fullLvh)),
      isOpen = 30 < diff,
      height = `${isOpen ? dvh : fullLvh}px`

    prop('--100lvh', height, document.documentElement) //document.documentElement.style.setProperty('--100lvh', 30 < diff ? `${dvh}px` : `${fullLvh}px`)
    prop('--keyboard-inset-top', height, document.documentElement) //document.documentElement.style.setProperty('--keyboard-inset-top', 30 < diff ? `${dvh}px` : `${fullLvh}px`)
    prop('--keyboard-inset-height', isOpen ? `${diff}px` : '0px', document.documentElement) //document.documentElement.style.setProperty('--keyboard-inset-height', 30 < diff ? `${diff}px` : `0px`)

    self.scrollTo(0, 0)
  }

  #handleWindowOrientationchange = async () => {
    debug(`${VKeyboard.name} ⚡️ orientationchange`)

    if (!(await frame(this))) return //self.requestAnimationFrame(this.#ifKeyboardScrollIntoActiveElement)

    this.#ifKeyboardScrollIntoActiveElement()
  }

  #handleBodyFocusin = async () => {
    debug(`${VKeyboard.name} ⚡️ focusin`)

    await sleep(100) // self.setTimeout(this.#ifKeyboardScrollIntoActiveElement, 100)

    if (!this.isConnected) return

    this.#ifKeyboardScrollIntoActiveElement()
  }

  #ifKeyboardScrollIntoActiveElement = () => {
    const el = document.activeElement

    if (!el || !this.#shouldKeyboardBeOpenCallback()) return

    el.closest<ScrollView>('scroll-view')?.centerScrollToElement?.(el)
  }

  set shouldKeyboardBeOpen(fn: () => boolean) {
    if ('function' !== typeof fn) throw new TypeError(`fn must be typeof function`)

    this.#shouldKeyboardBeOpenCallback = fn
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'v-keyboard': VKeyboard
  }
}
