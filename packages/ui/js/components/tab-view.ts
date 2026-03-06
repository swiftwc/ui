import { cssTime } from '../internal/utils'
import { debounce, timeout, onoff } from '../internal/utils'
import { type TabViewChangeDetail } from '../events'
import { type NavigationStack } from './navigation-stack'
import { type NavigationSplitView } from './navigation-split-view'
import { type TabRevealSwapDetail } from '../events'
import { CleanupRegistry } from '../internal/class/cleanup-registry'

export class TabView extends HTMLElement {
  #debouncedHandler

  #afterTabRevealDelay?: ReturnType<typeof timeout> ////number

  constructor() {
    super()

    this.#debouncedHandler = debounce(this.#handleSelectionChange, 1, true)
  }

  disconnectedCallback() {
    console.debug(`${TabView.name} ⚡️ disconnect`)

    CleanupRegistry.unregister(this)
  }

  connectedCallback() {
    console.debug(`${TabView.name} ⚡️ connect`)

    const { on } = onoff(
      [
        { types: 'tabreveal tabswap', listener: this.#debouncedHandler },
        { types: 'tabreveal tabswap', listener: this.#addAnimations },
      ],
      this
    )

    CleanupRegistry.register(this, on())
  }

  get selectedTab() {
    return this.querySelector<NavigationStack | NavigationSplitView>(':scope>navigation-stack:not([hidden]),:scope>navigation-split-view:not([hidden])')
    // return [...this.querySelectorAll<NavigationStack | NavigationSplitView>(':scope>navigation-stack:not([hidden]),:scope>navigation-split-view:not([hidden])')]
  }

  set selectedTab(newTab) {
    if (!newTab) throw new Error('Element not found')

    for (const ns of this.querySelectorAll<HTMLElement>(':scope>navigation-stack:not([hidden]),:scope>navigation-split-view:not([hidden])'))
      if (!ns.contains(newTab)) {
        ns.dispatchEvent(new CustomEvent<TabRevealSwapDetail>('beforetabswap', { detail: { tag: ns.id }, bubbles: true, composed: true }))

        ns.hidden = true // triggers
      }

    for (const ns of this.querySelectorAll<HTMLElement>(':scope>navigation-stack[hidden],:scope>navigation-split-view[hidden]'))
      if (ns.contains(newTab)) {
        ns.dispatchEvent(new CustomEvent<TabRevealSwapDetail>('beforetabreveal', { detail: { tag: ns.id }, bubbles: true, composed: true }))

        ns.hidden = false // triggers
      }
  }

  #addAnimations = async (event: Event) => {
    //DO NOT add this it breaks tabbar ipad/iphone, must be instant
    // self.requestAnimationFrame(() => {
    this.setAttribute('js-aftertabreveal', '')

    this.#afterTabRevealDelay?.cancel() //if (this.#afterTabRevealDelay) clearTimeout(this.#afterTabRevealDelay)

    this.#afterTabRevealDelay = timeout(cssTime(`${this.computedStyleMap().get(`--tabbar-after-tabreveal-duration`)}`))
    //self.setTimeout(
    // () => {
    //   this.removeAttribute('js-aftertabreveal')
    //   this.#afterTabRevealDelay = undefined
    // },
    // cssTime(`${this.computedStyleMap().get(`--tabbar-after-tabreveal-duration`)}`)

    await this.#afterTabRevealDelay.promise

    this.removeAttribute('js-aftertabreveal')

    this.#afterTabRevealDelay = undefined
    // })
  }

  #handleSelectionChange = (event: Event) => {
    this.#triggerChangeEvent(event)
  }

  #triggerChangeEvent = (event: Event) => {
    const eventType = 'tab-view:change'

    console.debug(`${TabView.name} 💡 ${eventType}`)

    this.dispatchEvent(new CustomEvent<TabViewChangeDetail>(eventType, { detail: { selection: this.selectedTab }, bubbles: true, composed: true }))
  }
}
