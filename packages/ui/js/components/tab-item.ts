import { type TabView } from './tab-view'
import { ButtonBase } from '../client/privateNamespace'

export class TabItem extends ButtonBase {
  constructor() {
    super()
  }

  disconnectedCallback() {
    console.debug(`${TabItem.name} ⚡️ disconnect`)

    TabItem.polyfillDisconnectedCallback(this)
  }

  connectedCallback() {
    console.debug(`${TabItem.name} ⚡️ connect`)

    TabItem.polyfillConnectedCallback(this)
  }

  static polyfillDisconnectedCallback(el: HTMLButtonElement) {
    console.debug(`${TabItem.name} ⚡️ disconnect`)

    el.removeEventListener('click', TabItem.#handleClick)
  }

  static polyfillConnectedCallback(el: HTMLButtonElement) {
    console.debug(`${TabItem.name} ⚡️ connect`)

    el.addEventListener('click', TabItem.#handleClick)
  }

  static #handleClick = async (event: Event) => {
    console.debug(`${TabItem.name} ⚡️ click`)

    const tag = (event.currentTarget as HTMLElement).getAttribute('value')

    if (!tag) throw new DOMException(`Attribute "tag" is set but invalid`, 'InvalidStateError')

    const tv = (event.currentTarget as HTMLElement).closest<TabView>('tab-view')
    if (!tv) throw new Error('Element not found')

    const newTab = tv?.querySelector<HTMLElement>(`#${tag}`)
    // 'more' === tag
    //   ? tv?.querySelector<HTMLElement>(`tab-view>[is=more]`):

    if (!newTab) throw new Error('Element not found')

    tv.selection = newTab
  }
}
