import { cssTime, frame } from '../internal/utils'
import { debounce, onoff, timeout } from '../internal/utils'
import { type TabViewDetail } from '../events'
import { type NavigationStack } from './navigation-stack'
import { type NavigationSplitView } from './navigation-split-view'
import { type TabDetail, type TabViewAdaptableTabBarPlacementDetail, type PageRevealSwapDetail } from '../events'
import { CleanupRegistry } from '../internal/class/cleanup-registry'
import { Snapshot } from '../snapshot'
import { NavigationPath } from '../internal/class/navigation-path'
import { CSSStyleObserver } from '../internal/class/css-style-observer'

const TAB_BAR_PLACEMENTS = ['bottom-bar', 'ornament', 'sidebar', 'top-bar'] as const

export type TabBarPlacement = (typeof TAB_BAR_PLACEMENTS)[number]

export class TabView extends HTMLElement {
  #debouncedHandler

  #cssStyleObserver?: CSSStyleObserver

  #afterTabRevealDelay = timeout()

  #cachedAdaptableTabBarPlacement?: TabBarPlacement = 'bottom-bar'

  static gatherTab(newTab: NavigationStack | NavigationSplitView) {
    const possibleParentNs = newTab?.parentElement?.closest<NavigationStack | NavigationSplitView>('navigation-stack,navigation-split-view')

    return [possibleParentNs, newTab].filter(Boolean) as (NavigationStack | NavigationSplitView)[]
  }

  constructor() {
    super()

    this.#debouncedHandler = debounce(this.#handleSelectionChange, 1)
  }

  disconnectedCallback() {
    console.debug(`${TabView.name} ⚡️ disconnect`)

    this.#afterTabRevealDelay.cancel()

    this.#cssStyleObserver?.disconnect()

    CleanupRegistry.unregister(this)
  }

  get tabBarPlacement() {
    return this.#cachedAdaptableTabBarPlacement
  }

  get moreTab() {
    return this.querySelector<NavigationStack>(':scope>navigation-stack:has(> navigation-stack,> navigation-split-view)')
  }

  connectedCallback() {
    console.debug(`${TabView.name} ⚡️ connect`)

    this.#cssStyleObserver = new CSSStyleObserver({
      properties: ['--adaptable-tab-bar-placement-index'],
    })
    this.#cssStyleObserver.observe(this, this.#handleStyleChange)
    Snapshot.waitReady.then(this.#handleStyleChange)

    // NOTE: wait for config
    Snapshot.waitReady.then(() => {
      // for (const [or, w, handler] of [
      //   ['portrait', `max-width:${Snapshot.config!['ipad-portrait-bp-max']}`, this.#handleMediaChange],
      //   ['landscape', `max-width:${Snapshot.config!['ipad-landscape-bp-max']}`, this.#handleMediaChange],
      //   ['portrait', `min-width:${Snapshot.config!['ipad-portrait-bp-min']}`, this.#handleMediaChange],
      //   ['landscape', `min-width:${Snapshot.config!['ipad-landscape-bp-min']}`, this.#handleMediaChange],
      // ]) {
      //   const mediaQueryList = self.matchMedia(`(orientation:${or}) and (${w})`)

      //   if (mediaQueryList.matches)
      //     this.#handleMediaChange(
      //       new MediaQueryListEvent('media-change', {
      //         matches: mediaQueryList.matches,
      //       })
      //     ) // Initial check

      //   CleanupRegistry.register(this, onoff('change', handler as EventListener, mediaQueryList).on())
      // }

      CleanupRegistry.register(
        this,
        onoff(
          [
            { types: 'tabreveal tabswap', listener: this.#debouncedHandler },
            { types: 'tabreveal tabswap', listener: this.#addAnimations },
            { types: 'tab-view:adaptable-tab-bar-placement-change', listener: this.#handleAdaptableTabBarPlacementChange as EventListener },
            { types: 'pagereveal', listener: this.#handleTabViewPagereveal as EventListener },
          ],
          this
        ).on()
      )
    })
  }

  #handleTabViewPagereveal = (evt: CustomEvent<PageRevealSwapDetail>) => {
    console.debug(`${TabView.name} ⚡️ ${evt?.type}`)

    void this.#syncBodyFace()
  }

  #handleStyleChange = () => {
    console.debug(`${TabView.name} ⚡️ style`)

    const style = self.getComputedStyle(this)

    const placement = style.getPropertyValue('--adaptable-tab-bar-placement'), // or do it manually without any computedstyle
      newValue = (TAB_BAR_PLACEMENTS as readonly string[]).includes(placement) ? (placement as (typeof TAB_BAR_PLACEMENTS)[number]) : 'bottom-bar'

    if (newValue !== this.#cachedAdaptableTabBarPlacement) {
      const oldValue = this.#cachedAdaptableTabBarPlacement

      this.#cachedAdaptableTabBarPlacement = newValue

      this.dispatchEvent(
        new CustomEvent<TabViewAdaptableTabBarPlacementDetail>('tab-view:adaptable-tab-bar-placement-change', {
          detail: { oldValue, newValue },
          bubbles: true,
          composed: true,
        })
      )
    }
  }

  #handleMediaChange: (evt: MediaQueryListEvent) => void = (evt) => {
    console.debug(`${TabView.name} ⚡️ ${evt?.type}`)

    if (!evt.matches) return

    this.#handleStyleChange()

    // if (evt.matches) {
    //   const placement = self.getComputedStyle(this).getPropertyValue('--adaptable-tab-bar-placement'), // or do it manually without any computedstyle
    //     newValue = (TAB_BAR_PLACEMENTS as readonly string[]).includes(placement) ? (placement as (typeof TAB_BAR_PLACEMENTS)[number]) : 'bottom-bar'

    //   if (newValue !== this.#cachedAdaptableTabBarPlacement) {
    //     const oldValue = this.#cachedAdaptableTabBarPlacement

    //     this.#cachedAdaptableTabBarPlacement = newValue

    //     this.dispatchEvent(
    //       new CustomEvent<TabViewAdaptableTabBarPlacementDetail>('tab-view:adaptable-tab-bar-placement-change', {
    //         detail: { oldValue, newValue },
    //         bubbles: true,
    //         composed: true,
    //       })
    //     )
    //   }
    // }

    // // trigger more-stack (dis)allowed event
    // if (evt.matches !== this.#moreStackAllowed) {
    //   this.#moreStackAllowed = evt.matches

    //   const eventType = evt.matches ? 'tab-view:more-tab-allowed' : 'tab-view:more-tab-disallowed'

    //   this.dispatchEvent(new CustomEvent<TabMoreStackAllowanceDetail>(eventType, { detail: { moreTab: this.moreTab }, bubbles: true, composed: true }))
    // }

    // if (evt.matches) return // no button triggers should happen, already on iphone portrait

    // const innerSelection = this.moreTab?.querySelector(':scope>navigation-stack:not([hidden]),:scope>navigation-split-view:not([hidden])')?.id
    // if (innerSelection) {
    //   const btn = this.querySelector<HTMLButtonElement>(`[is="tab-item"][value="${CSS.escape(innerSelection)}"]`)

    //   // NOTE: simulate btn click BU WITHOUT tabroot functionality!
    //   if (btn) {
    //     const newTab = this.querySelector<NavigationStack | NavigationSplitView>(`#${btn.getAttribute('value')}`)
    //     if (newTab) {
    //       this.selectedTab = TabView.gatherTab(newTab)

    //       return
    //     }
    //   }
    // }

    // const outerSelection = this?.querySelector(':scope>navigation-stack:not([hidden]),:scope>navigation-split-view:not([hidden])')?.id

    // if (outerSelection && outerSelection === this.moreTab?.id) {
    //   const btn = this.querySelector<HTMLButtonElement>(`[is="tab-item"]:not([value="${CSS.escape(outerSelection)}"])`)

    //   // NOTE: simulate btn click BU WITHOUT tabroot functionality!
    //   if (btn) {
    //     const newTab = this.querySelector<NavigationStack | NavigationSplitView>(`#${btn.getAttribute('value')}`)
    //     if (newTab) {
    //       this.selectedTab = TabView.gatherTab(newTab)

    //       return
    //     }
    //   }
    // }
  }

  #handleAdaptableTabBarPlacementChange = (evt: CustomEvent<TabViewAdaptableTabBarPlacementDetail>) => {
    console.debug(`${TabView.name} ⚡️ ${evt?.type}`)

    if ('bottom-bar' !== evt.detail.oldValue) return // button triggers should happen, ONLY when going FROM bottom-bar TO anything else

    const innerSelection = this.moreTab?.querySelector(':scope>navigation-stack:not([hidden]),:scope>navigation-split-view:not([hidden])')?.id
    if (innerSelection) {
      const btn = this.querySelector<HTMLButtonElement>(`[is="tab-item"][value="${CSS.escape(innerSelection)}"]`)

      // NOTE: simulate btn click BU WITHOUT tabroot functionality!
      if (btn) {
        const newTab = this.querySelector<NavigationStack | NavigationSplitView>(`#${btn.getAttribute('value')}`)
        if (newTab) {
          this.selectedTab = TabView.gatherTab(newTab)

          return
        }
      }
    }

    const outerSelection = this?.querySelector(':scope>navigation-stack:not([hidden]),:scope>navigation-split-view:not([hidden])')?.id

    if (outerSelection && outerSelection === this.moreTab?.id) {
      const btn = this.querySelector<HTMLButtonElement>(`[is="tab-item"]:not([value="${CSS.escape(outerSelection)}"])`)

      // NOTE: simulate btn click BU WITHOUT tabroot functionality!
      if (btn) {
        const newTab = this.querySelector<NavigationStack | NavigationSplitView>(`#${btn.getAttribute('value')}`)
        if (newTab) {
          this.selectedTab = TabView.gatherTab(newTab)

          return
        }
      }
    }
  }

  get selectedTab() {
    // return this.querySelector<NavigationStack | NavigationSplitView>(':scope>navigation-stack:not([hidden]),:scope>navigation-split-view:not([hidden])')
    return [...this.querySelectorAll<NavigationStack | NavigationSplitView>('navigation-stack:not([hidden]),navigation-split-view:not([hidden])')]
  }

  set selectedTab(tabs) {
    const valid = [...tabs].every((el, i, arr) => !i || arr[i - 1].contains(el))

    if (0 === tabs.length) throw new Error('Element not found')

    if (!valid) throw new Error('selectedTab[] must be in order of parent>child. You provided an element that contains the previous sibling.')

    //
    const selectors = [':not(:is(:scope>{{tag}}))', ':is(:scope>{{tag}})'] // first nested ones, then root ones

    for (const selector of selectors)
      for (const ns of this.querySelectorAll<HTMLElement>(
        `navigation-stack:not([hidden])${selector.replace('{{tag}}', 'navigation-stack')},navigation-split-view:not([hidden])${selector.replace('{{tag}}', 'navigation-split-view')}`
      )) {
        if (!tabs.some((tab) => !ns.contains(tab))) continue // shouldRun

        ns.dispatchEvent(new CustomEvent<TabDetail>('beforetabswap', { detail: { tag: ns.id }, bubbles: true, composed: true }))

        ns.hidden = true // triggers
      }

    for (const selector of selectors.reverse())
      for (const ns of this.querySelectorAll<HTMLElement>(
        `navigation-stack[hidden]${selector.replace('{{tag}}', 'navigation-stack')},navigation-split-view[hidden]${selector.replace('{{tag}}', 'navigation-split-view')}`
      )) {
        if (!tabs.some((tab) => ns.contains(tab))) continue // shouldRun

        ns.dispatchEvent(new CustomEvent<TabDetail>('beforetabreveal', { detail: { tag: ns.id }, bubbles: true, composed: true }))

        ns.hidden = false // triggers
      }
  }

  #addAnimations = (evt: Event) => {
    this.setAttribute('js-aftertabreveal', '')

    this.#afterTabRevealDelay.next(
      () => {
        this.removeAttribute('js-aftertabreveal')
      },
      cssTime(`${this.computedStyleMap().get(`--tabbar-after-tabreveal-duration`)}`)
    )

    // this.removeAttribute('js-aftertabreveal')

    // this.#afterTabRevealDelay = undefined
  }

  #handleSelectionChange = (evt: Event) => {
    this.#triggerToggleEvent(evt)
  }

  #triggerToggleEvent = (evt: Event) => {
    const eventType = 'tab-view:toggle'

    void this.#syncBodyFace()

    console.debug(`${TabView.name} 💡 ${eventType}`)

    this.dispatchEvent(new CustomEvent<TabViewDetail>(eventType, { detail: { selection: this.selectedTab }, bubbles: true, composed: true }))
  }

  #syncBodyFace = async () => {
    if (!(await frame(this))) return

    const tab = this.selectedTab.at(-1), //event.detail.selection.at(-1), //document.querySelector(`#${}`),
      path = new NavigationPath(tab),
      sv = [path, ...path.children()]
        .filter((item) => item.component?.matches(':not(dialog)'))
        .map((item) => item.body)
        .filter(Boolean)
        .at(-1) //queryBodyAll(tab).at(-1)

    if (!sv) return

    // const style = self.getComputedStyle(sv),
    //   hostStyle = self.getComputedStyle(document.documentElement)
    // console.log(999, tab, style.getPropertyValue('--face'), hostStyle.getPropertyValue('--face'))

    if (!sv.style.getPropertyValue('--face')) return document.body.style.removeProperty('--face')

    // if (style.getPropertyValue('--face') === hostStyle.getPropertyValue('--face'))

    document.body.style.setProperty('--face', sv.style.getPropertyValue('--face'))

    // if (tab?.matches('tab-view>navigation-stack>:scope')) return document.body.style.setProperty('--face', style.getPropertyValue('--face'))

    // if (tab?.matches('tab-view>:scope')) return document.body.style.setProperty('--face', style.getPropertyValue('--face'))
  }
}
