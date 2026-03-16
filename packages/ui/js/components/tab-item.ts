import { type TabView } from './tab-view'
import { ButtonBase } from '../namespace-browser/base'
import { Snapshot } from '../snapshot'
import { type TabRevealSwapDetail, type TabMoreStackAllowanceDetail } from '../events'
import { type NavigationStack } from './navigation-stack'
import { type NavigationSplitView } from './navigation-split-view'
import { CleanupRegistry } from '../internal/class/cleanup-registry'
import { onoff } from '../internal/utils'

export class TabItem extends ButtonBase {
  constructor() {
    super()
  }

  disconnectedCallback() {
    TabItem.polyfillDisconnectedCallback(this)
  }

  connectedCallback() {
    TabItem.polyfillConnectedCallback(this)
  }

  static polyfillDisconnectedCallback(btn: HTMLButtonElement) {
    console.debug(`${TabItem.name} ⚡️ disconnect`)

    CleanupRegistry.unregister(btn)
  }

  static polyfillConnectedCallback(btn: TabItem) {
    console.debug(`${TabItem.name} ⚡️ connect`)

    Object.assign(btn, {
      tabIndex: 0,

      ariaSelected: 'false',
    })

    Snapshot.waitReadyFor(btn).then((r) => {
      if (!r) return

      CleanupRegistry.register(btn, onoff('click', TabItem.#handleClick, btn).on())

      const handler1 = TabItem.#handleTabRevealOrSwap.bind(null, btn),
        handler2 = TabItem.#handleTabMoreStackAllowance.bind(null, btn),
        tv = btn.closest<TabView>('tab-view') ?? undefined

      CleanupRegistry.register(btn, onoff('tabreveal tabswap', handler1 as unknown as EventListener, tv).on())

      CleanupRegistry.register(btn, onoff('tab-view:more-tab-allowed tab-view:more-tab-disallowed', handler2 as unknown as EventListener, tv).on())

      // if (tv?.selectedTab?.id === el.value)
      if (tv?.selectedTab?.map(({ id }) => id)?.includes(btn.value))
        void this.#handleTabRevealOrSwap(btn, new CustomEvent<TabRevealSwapDetail>('tabreveal', { detail: { tag: btn.value } }))

      if (tv?.moreTab)
        this.#handleTabMoreStackAllowance(
          btn,
          new CustomEvent<TabMoreStackAllowanceDetail>(`tab-view:more-tab-${tv?.moreTabAllowed ? 'allowed' : 'disallowed'}`, {
            detail: { moreTab: tv?.moreTab },
          })
        )
    })
  }

  static #handleTabMoreStackAllowance = async (btn: HTMLButtonElement, event: CustomEvent<TabMoreStackAllowanceDetail>) => {
    console.debug(`${TabItem.name} ⚡️ ${event?.type}`)

    if (event.detail?.moreTab?.id !== btn.value) return

    btn.hidden = event.type === 'tab-view:more-tab-disallowed'
  }

  static #handleTabRevealOrSwap = async (btn: HTMLButtonElement, event: CustomEvent<TabRevealSwapDetail>) => {
    console.debug(`${TabItem.name} ⚡️ ${event?.type}`)

    if (event.detail?.tag !== btn.value) return

    // await Snapshot.waitReady

    const isSelected = 'tabreveal' === event?.type

    btn.ariaSelected = `${isSelected}`

    if (isSelected)
      btn.scrollIntoView({
        behavior: self.matchMedia('(prefers-reduced-motion: no-preference)').matches ? 'smooth' : 'instant',
        block: 'nearest',
        inline: 'nearest',
      })
  }

  static #handleClick = async (event: Event) => {
    console.debug(`${TabItem.name} ⚡️ ${event?.type}`)

    const btn = event.currentTarget as HTMLElement

    const tag = btn.getAttribute('value')
    if (!tag) return // sidebartoggle > tab-item //throw new DOMException(`Attribute "tag" is set but invalid`, 'InvalidStateError')

    const tv = btn.closest<TabView>('tab-view')
    if (!tv) throw new Error('Element not found')

    const newTab = tv?.querySelector<NavigationStack | NavigationSplitView>(`#${tag}`),
      possibleParentNs = newTab?.parentElement?.closest<NavigationStack | NavigationSplitView>('navigation-stack,navigation-split-view')

    if (!newTab) return

    const tabs = [newTab]

    if (possibleParentNs) tabs.unshift(possibleParentNs)

    tv.selectedTab = tabs
    // if (possibleParentNs) {
    //   tv.selectedTab = [possibleParentNs, newTab]

    //   return
    // }

    // tv.selectedTab = [newTab]
  }
}
