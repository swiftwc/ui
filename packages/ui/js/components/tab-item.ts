import { type TabView } from './tab-view'
import { ButtonBase } from '../internal/privateNamespace'
import { Snapshot } from '../snapshot'
import { type TabRevealSwapDetail } from '../events'
import { type NavigationStack } from './navigation-stack'
import { type NavigationSplitView } from './navigation-split-view'

export class TabItem extends ButtonBase {
  static #cleanups = new WeakMap()

  constructor() {
    super()
  }

  disconnectedCallback() {
    TabItem.polyfillDisconnectedCallback(this)
  }

  connectedCallback() {
    TabItem.polyfillConnectedCallback(this)
  }

  static polyfillDisconnectedCallback(el: HTMLButtonElement) {
    console.debug(`${TabItem.name} ⚡️ disconnect`)

    el.removeEventListener('click', TabItem.#handleClick)

    for (const fn of this.#cleanups.get(el)) fn?.()

    this.#cleanups.delete(el)
  }

  static polyfillConnectedCallback(el: TabItem) {
    console.debug(`${TabItem.name} ⚡️ connect`)

    Object.assign(el, {
      tabIndex: 0,

      ariaSelected: 'false',
    })

    Snapshot.waitReady.then(() => {
      el.addEventListener('click', TabItem.#handleClick)

      const handler = TabItem.#handleTabRevealOrSwap.bind(null, el),
        tv = el.closest<TabView>('tab-view')

      tv?.addEventListener('tabreveal', handler)
      tv?.addEventListener('tabswap', handler)

      if (!this.#cleanups.has(el)) this.#cleanups.set(el, [])
      this.#cleanups.get(el).push(() => {
        tv?.removeEventListener('tabreveal', handler)
        tv?.removeEventListener('tabswap', handler)
      })

      // if (tv?.selectedTab?.map(({ id }) => id)?.includes(el.value))
      if (tv?.selectedTab?.id === el.value)
        void this.#handleTabRevealOrSwap(el, new CustomEvent<TabRevealSwapDetail>('tabreveal', { detail: { tag: el.value } }))
    })
  }

  static #handleTabRevealOrSwap = async (el: HTMLButtonElement, event: CustomEvent<TabRevealSwapDetail>) => {
    console.debug(`${TabItem.name} ⚡️ ${event?.type}`)

    if (event.detail?.tag !== el.value) return

    await Snapshot.waitReady

    const isSelected = 'tabreveal' === event?.type

    el.ariaSelected = `${isSelected}`

    if (isSelected)
      el.scrollIntoView({
        behavior: self.matchMedia('(prefers-reduced-motion: no-preference)').matches ? 'smooth' : 'instant',
        block: 'nearest',
        inline: 'nearest',
      })
  }

  static #handleClick = async (event: Event) => {
    console.debug(`${TabItem.name} ⚡️ ${event?.type}`)

    const tabItem = event.currentTarget as HTMLElement

    const tag = tabItem.getAttribute('value')
    if (!tag) return // sidebartoggle > tab-item //throw new DOMException(`Attribute "tag" is set but invalid`, 'InvalidStateError')

    const tv = tabItem.closest<TabView>('tab-view')
    if (!tv) throw new Error('Element not found')

    const newTab = tv?.querySelector<NavigationStack | NavigationSplitView>(`:scope>#${tag}`)

    tv.selectedTab = newTab
  }
}
