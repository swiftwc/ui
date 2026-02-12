import { cssTime } from '../internal/utils'

export type TabRevealDetail = {
  tag: string
}

declare global {
  interface HTMLElementEventMap {
    tabreveal: CustomEvent<TabRevealDetail>
  }
}

export class TabView extends HTMLElement {
  constructor() {
    super()
  }

  disconnectedCallback() {
    console.debug(`${TabView.name} ⚡️ disconnect`)
  }

  connectedCallback() {
    console.debug(`${TabView.name} ⚡️ connect`)

    this.addEventListener('tabreveal', this.#handleTabReveal)
  }

  get selection() {
    const selectedTab = this.querySelector<HTMLElement>(':scope > navigation-stack:not([hidden]),:scope > navigation-split-view:not([hidden])')

    return selectedTab
  }

  set selection(nv) {
    if (!['NAVIGATION-STACK', 'NAVIGATION-SPLIT-VIEW'].includes(nv?.tagName ?? '')) throw new Error('Element not found')

    if (nv === this.selection) return

    for (const ns of this.querySelectorAll<HTMLElement>(':scope > navigation-stack,:scope > navigation-split-view')) {
      if (nv === ns) continue

      if (ns.hidden) continue

      ns.hidden = true

      this.dispatchEvent(new CustomEvent('tabswap', { detail: { x: 42 } }))
    }

    nv!.hidden = false

    this.dispatchEvent(new CustomEvent('tabreveal', { detail: { x: 42, tag: nv?.id } }))
  }

  #afterTabRevealTimer?: number

  #handleTabReveal = (event: Event) => {
    this.setAttribute('js-aftertabreveal', '')

    if (this.#afterTabRevealTimer) clearTimeout(this.#afterTabRevealTimer)

    this.#afterTabRevealTimer = setTimeout(
      () => {
        this.removeAttribute('js-aftertabreveal')
        this.#afterTabRevealTimer = undefined
      },
      cssTime(`${this.computedStyleMap().get(`--tabbar-after-tabreveal-duration`)}`)
    )
  }
}
