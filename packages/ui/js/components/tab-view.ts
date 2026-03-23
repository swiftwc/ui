import { cssTime } from '../internal/utils'
import { debounce, onoff, timeout } from '../internal/utils'
import { type TabViewChangeDetail } from '../events'
import { type NavigationStack } from './navigation-stack'
import { type NavigationSplitView } from './navigation-split-view'
import { type TabRevealSwapDetail, type TabMoreStackAllowanceDetail } from '../events'
import { CleanupRegistry } from '../internal/class/cleanup-registry'
import { Snapshot } from '../snapshot'
import { NavigationPath } from '../internal/class/navigation-path'

export class TabView extends HTMLElement {
  #debouncedHandler

  #afterTabRevealDelay = timeout()

  #moreStackAllowed = false

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

    CleanupRegistry.unregister(this)
  }

  get moreTabAllowed() {
    return this.#moreStackAllowed
  }

  get moreTab() {
    return this.querySelector<NavigationStack>(':scope>navigation-stack:has(> navigation-stack,> navigation-split-view)')
  }

  connectedCallback() {
    console.debug(`${TabView.name} ⚡️ connect`)

    // NOTE: wait for config
    Snapshot.waitReady.then(() => {
      const query = `(orientation:portrait) and (max-width: ${Snapshot.config!['ipad-portrait-bp-max']})`, // iphone portrait only
        mediaQueryList = self.matchMedia(query)

      this.#handleMediaChange(
        // new MediaQueryListEvent(`tab-view:more-tab-${mediaQueryList.matches ? 'allowed' : 'disallowed'}`, {
        new MediaQueryListEvent('media-change', {
          matches: mediaQueryList.matches,
        })
      ) // Initial check

      mediaQueryList.addEventListener('change', this.#handleMediaChange)

      CleanupRegistry.register(
        this,
        onoff(
          [
            { types: 'tabreveal tabswap', listener: this.#debouncedHandler },
            { types: 'tabreveal tabswap', listener: this.#addAnimations },
          ],
          this
        ).on()
      )
    })
  }

  #handleMediaChange: (evt: MediaQueryListEvent) => void = (evt) => {
    console.debug(`${TabView.name} ⚡️ ${evt?.type}`)

    // trigger more-stack (dis)allowed event
    if (evt.matches !== this.#moreStackAllowed) {
      this.#moreStackAllowed = evt.matches

      const eventType = evt.matches ? 'tab-view:more-tab-allowed' : 'tab-view:more-tab-disallowed'

      this.dispatchEvent(new CustomEvent<TabMoreStackAllowanceDetail>(eventType, { detail: { moreTab: this.moreTab }, bubbles: true, composed: true }))
    }

    if (evt.matches) return // no button triggers should happen, already on iphone portrait

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
        // for (const tab of tabs)
        //   if (!ns.contains(tab)) {

        ns.dispatchEvent(new CustomEvent<TabRevealSwapDetail>('beforetabswap', { detail: { tag: ns.id }, bubbles: true, composed: true }))

        ns.hidden = true // triggers
        // }
      }

    for (const selector of selectors.reverse())
      for (const ns of this.querySelectorAll<HTMLElement>(
        `navigation-stack[hidden]${selector.replace('{{tag}}', 'navigation-stack')},navigation-split-view[hidden]${selector.replace('{{tag}}', 'navigation-split-view')}`
      )) {
        if (!tabs.some((tab) => ns.contains(tab))) continue // shouldRun
        // for (const tab of tabs)
        //   if (ns.contains(tab)) {

        ns.dispatchEvent(new CustomEvent<TabRevealSwapDetail>('beforetabreveal', { detail: { tag: ns.id }, bubbles: true, composed: true }))

        ns.hidden = false // triggers
        // }
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

  #handleSelectionChange = (event: Event) => {
    this.#triggerChangeEvent(event)
  }

  #triggerChangeEvent = (event: Event) => {
    const eventType = 'tab-view:change'

    this.#syncBodyFace()

    console.debug(`${TabView.name} 💡 ${eventType}`)

    this.dispatchEvent(new CustomEvent<TabViewChangeDetail>(eventType, { detail: { selection: this.selectedTab }, bubbles: true, composed: true }))
  }

  #syncBodyFace = () => {
    const tab = this.selectedTab.at(-1), //event.detail.selection.at(-1), //document.querySelector(`#${}`),
      path = new NavigationPath(tab),
      sv = [path, ...path.children()]
        .map((item) => item.body)
        .filter(Boolean)
        .at(-1) //queryBodyAll(tab).at(-1)

    if (!sv) return

    const style = self.getComputedStyle(sv)

    if (style.getPropertyValue('--face') === self.getComputedStyle(document.body).getPropertyValue('--face'))
      return document.body.style.removeProperty('--face')

    document.body.style.setProperty('--face', style.getPropertyValue('--face'))

    // if (tab?.matches('tab-view>navigation-stack>:scope')) return document.body.style.setProperty('--face', style.getPropertyValue('--face'))

    // if (tab?.matches('tab-view>:scope')) return document.body.style.setProperty('--face', style.getPropertyValue('--face'))
  }
}
