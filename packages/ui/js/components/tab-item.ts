import { type TabView } from './tab-view'

export class TabItem extends HTMLElement {
  constructor() {
    super()
  }

  disconnectedCallback() {
    console.debug(`${TabItem.name} ⚡️ disconnect`)

    this.removeEventListener('click', this.#handleClick)
  }

  connectedCallback() {
    console.debug(`${TabItem.name} ⚡️ connect`)

    this.addEventListener('click', this.#handleClick)
  }

  #handleClick = () => {
    console.debug(`${TabItem.name} ⚡️ click`)

    const tag = this.getAttribute('tag')

    if (!tag)
      throw new DOMException(
        `Attribute "tag" is set but invalid`,
        'InvalidStateError'
      )

    const tv = this.closest<TabView>('tab-view')
    if (!tv) throw new Error('Element not found')

    const newTab = tv?.querySelector<HTMLElement>(`#${tag}`)
    // 'more' === tag
    //   ? tv?.querySelector<HTMLElement>(`tab-view>[is=more]`):

    if (!newTab) throw new Error('Element not found')

    tv.selection = newTab
  }
}
