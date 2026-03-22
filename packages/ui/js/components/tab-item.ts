import { TabView } from './tab-view'
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

  // disconnectedCallback() {
  //   TabItem.polyfillDisconnectedCallback(this)
  // }

  // connectedCallback() {
  //   TabItem.polyfillConnectedCallback(this)
  // }

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

    // Snapshot.waitReadyFor(btn).then((r) => {
    //   if (!r) return

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
    // })
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

    // const tag = btn.getAttribute('value')
    // if (!tag) return // sidebartoggle > tab-item //throw new DOMException(`Attribute "tag" is set but invalid`, 'InvalidStateError')

    const tv = btn.closest<TabView>('tab-view')
    if (!tv) throw new Error('TabView not found')

    const newTab = tv?.querySelector<NavigationStack | NavigationSplitView>(`#${btn.getAttribute('value')}`)
    if (!newTab) return

    // console.log(99, TabView.gatherTab(newTab))

    // const possibleParentNs = newTab?.parentElement?.closest<NavigationStack | NavigationSplitView>('navigation-stack,navigation-split-view')

    const tabs = TabView.gatherTab(newTab) //[possibleParentNs, newTab].filter(Boolean) as (NavigationStack | NavigationSplitView)[]

    // if (possibleParentNs) tabs.unshift(possibleParentNs)

    // SECTION: before submitting new tabs, check for tabroot

    // iphone cases:
    // current -> new
    // ns1 -> ns1 tabroot💡ns1       1 1 ===                            ===
    // more -> more tabroot💡more    1 1 ===                            ===
    // ns1 -> more tabroot💡more     1 1 !==                            ->
    // more,settings -> more tabroot💡more  2 1 !==                     ↖

    // more,settings -> ns1          2 1 !==                            <-
    // ns1 -> more tabroot💡more     1 1 !==                            ->

    // ipad cases:
    // ns1 -> ns1 tabroot💡ns1                            1 1 ===       ===
    // more,settings -> more,settings tabroot💡settings   2 2 ===       ===

    // more,settings -> more,ns3  2 2 !==                               <->
    // more,ns3 -> more,settings  2 2 !==                               <->
    // ns1 -> more,settings       1 2 !==                               ↘

    const seed1 = tv.selectedTab.map((item) => item.id).join(','),
      seed2 = tabs.map((item) => item.id).join(',')

    const dir =
      tv.selectedTab.length < tabs.length
        ? '↘'
        : tv.selectedTab.length > tabs.length
          ? tv.selectedTab.at(0) === tabs.at(0)
            ? '↖'
            : '<-'
          : seed1 === seed2
            ? '==='
            : tv.moreTab === tabs.at(-1)
              ? '->'
              : '<->'

    if (['===', '↖'].includes(dir)) {
      for (const tab of tabs.reverse())
        if (tv.selectedTab.includes(tab)) {
          const eventType = 'tabroot'
          console.debug(`${TabItem.name} 💡 ${eventType}`)

          tab?.dispatchEvent(new CustomEvent(eventType, { bubbles: true, composed: true }))

          return // skip rest no selection!
        }
    } else if ('->' === dir) {
      const eventType = 'tabroot'
      console.debug(`${TabItem.name} 💡 ${eventType}`)

      tabs.at(0)?.dispatchEvent(new CustomEvent(eventType, { bubbles: true, composed: true }))
    }

    // SECTION: finally, submit new tabs

    tv.selectedTab = tabs
  }
}
