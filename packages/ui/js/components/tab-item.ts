import { type TabView, type TabRevealDetail } from './tab-view'
import { ButtonBase } from '../client/privateNamespace'
import { Snapshot } from '../snapshot'

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

    this.#cleanups.get(el)?.()

    this.#cleanups.delete(el)
  }

  static polyfillConnectedCallback(el: TabItem) {
    console.debug(`${TabItem.name} ⚡️ connect`)

    el.tabIndex = 0

    Snapshot.waitReady.then(() => {
      el.addEventListener('click', TabItem.#handleClick)

      const handler = TabItem.#handleTabReveal.bind(null, el),
        tv = el.closest<TabView>('tab-view')

      tv?.addEventListener('tabreveal', handler)

      this.#cleanups.set(el, () => {
        tv?.removeEventListener('tabreveal', handler)
      })

      if (tv?.selection?.id === el.value) void this.#handleTabReveal(el, new CustomEvent<TabRevealDetail>('slotchange', { detail: { tag: el.value } }))
    })
  }

  static #handleTabReveal = async (el: HTMLButtonElement, event: CustomEvent<TabRevealDetail>) => {
    await Snapshot.waitReady

    if (event.detail?.tag === el.value) el.style.setProperty('anchor-name', '--tab-view-selection')
    else el.style.removeProperty('anchor-name')
  }

  static #handleClick = async (event: Event) => {
    console.debug(`${TabItem.name} ⚡️ click`)

    const tabItem = event.currentTarget as HTMLElement

    tabItem.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest',
    })

    const tag = tabItem.getAttribute('value')
    if (!tag) return // sidebartoggle > tab-item //throw new DOMException(`Attribute "tag" is set but invalid`, 'InvalidStateError')

    const tv = tabItem.closest<TabView>('tab-view')
    if (!tv) throw new Error('Element not found')

    const newTab = tv?.querySelector<HTMLElement>(`#${tag}`)
    // 'more' === tag
    //   ? tv?.querySelector<HTMLElement>(`tab-view>[is=more]`):

    if (!newTab) throw new Error('Element not found')

    tv.selection = newTab
  }
}
