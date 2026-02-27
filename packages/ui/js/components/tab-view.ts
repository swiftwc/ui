import { cssTime } from '../internal/utils'
import { debounce } from '../internal/utils'
import { type TabViewChangeDetail } from '../events'
import { type NavigationStack } from './navigation-stack'
import { type NavigationSplitView } from './navigation-split-view'

export class TabView extends HTMLElement {
  #debouncedHandler

  #afterTabRevealTimer?: number

  constructor() {
    super()

    this.#debouncedHandler = debounce(this.#handleSelectionChange, 1, true)
  }

  disconnectedCallback() {
    console.debug(`${TabView.name} ⚡️ disconnect`)

    this.removeEventListener('tabreveal', this.#debouncedHandler)
    this.removeEventListener('tabswap', this.#debouncedHandler)

    this.removeEventListener('tabreveal', this.#addAnimations)
    this.removeEventListener('tabswap', this.#addAnimations)
  }

  connectedCallback() {
    console.debug(`${TabView.name} ⚡️ connect`)

    this.addEventListener('tabreveal', this.#debouncedHandler)
    this.addEventListener('tabswap', this.#debouncedHandler)

    this.addEventListener('tabreveal', this.#addAnimations)
    this.addEventListener('tabswap', this.#addAnimations)
  }

  get selection() {
    return [...this.querySelectorAll<NavigationStack | NavigationSplitView>('navigation-stack:not([hidden]),navigation-split-view:not([hidden])')]
  }

  #handleSelectionChange = (event: Event) => {
    this.#triggerChangeEvent(event)
  }

  #addAnimations = (event: Event) => {
    // self.requestAnimationFrame(() => { DO NOT add this it breaks tabbar ipad/iphone, must be instant
    this.setAttribute('js-aftertabreveal', '')

    if (this.#afterTabRevealTimer) clearTimeout(this.#afterTabRevealTimer)

    this.#afterTabRevealTimer = self.setTimeout(
      () => {
        this.removeAttribute('js-aftertabreveal')
        this.#afterTabRevealTimer = undefined
      },
      cssTime(`${this.computedStyleMap().get(`--tabbar-after-tabreveal-duration`)}`)
    )
    // })
  }

  #triggerChangeEvent = (event: Event) => {
    const eventType = 'tab-view:change'

    console.debug(`${TabView.name} 💡 ${eventType}`)

    this.dispatchEvent(new CustomEvent<TabViewChangeDetail>(eventType, { detail: { selection: this.selection }, bubbles: true, composed: true }))
  }
}
