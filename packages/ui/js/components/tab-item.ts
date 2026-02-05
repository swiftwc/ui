import { type TabView } from './tab-view'
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

  static polyfillConnectedCallback(el: HTMLButtonElement) {
    console.debug(`${TabItem.name} ⚡️ connect`)

    el.addEventListener('click', TabItem.#handleClick)

    const handler = TabItem.#handleTabReveal.bind(null, el),
      tv = el.closest<TabView>('tab-view')

    tv?.addEventListener('tabreveal', handler)

    this.#cleanups.set(el, () => {
      tv?.removeEventListener('tabreveal', handler)
    })

    Snapshot.waitReady.then(() => {
      console.log(999, el.closest<TabView>('tab-view'))
      if (el.closest('tab-view').selection?.id === el.value) el.style.setProperty('anchor-name', '--my-b')
    })
  }

  static #handleTabReveal = async (el: HTMLButtonElement, event: CustomEvent) => {
    await Snapshot.waitReady

    if (event.detail?.tag === el.value) el.style.setProperty('anchor-name', '--my-b')
    else el.style.removeProperty('anchor-name')
  }

  static #handleClick = async (event: Event) => {
    console.debug(`${TabItem.name} ⚡️ click`)

    const tag = (event.currentTarget as HTMLElement).getAttribute('value')

    if (!tag) return // sidebartoggle > tab-item //throw new DOMException(`Attribute "tag" is set but invalid`, 'InvalidStateError')

    const tv = (event.currentTarget as HTMLElement).closest<TabView>('tab-view')
    if (!tv) throw new Error('Element not found')

    const newTab = tv?.querySelector<HTMLElement>(`#${tag}`)
    // 'more' === tag
    //   ? tv?.querySelector<HTMLElement>(`tab-view>[is=more]`):

    if (!newTab) throw new Error('Element not found')

    tv.selection = newTab
  }
}
