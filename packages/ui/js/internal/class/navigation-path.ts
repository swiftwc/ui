import { type NavigationHost, type NavigationPage, type NavigationToolbarConfiguration } from '../privateNamespace'
import { closestHost, closestBody } from '../../navigation-provider'
import type * as Components from '../../components'

export class NavigationPath {
  #component?: NavigationHost

  #slot?: NavigationHost | null

  #body?: Components.ScrollView | null

  #page?: NavigationPage | null

  #toolBarConfig?: NavigationToolbarConfiguration[]

  get component() {
    return this.#component
  }

  get body() {
    if (undefined === this.#body) this.#body = closestBody(this.#component) ?? null

    return this.#body
  }

  get page() {
    if (undefined === this.#page) this.#refreshPage()

    return this.#page
  }

  get toolBarConfig() {
    if (undefined === this.#toolBarConfig) this.#refreshToolBarConfig()

    return this.#toolBarConfig
  }

  get slot() {
    if (undefined === this.#slot) this.#refreshSlot()

    return this.#slot
  }

  constructor(any?: HTMLElement) {
    this.#component = closestHost(any)
  }

  #refreshPage() {
    this.#page = this.#component?.querySelector<NavigationPage>(':scope>scroll-view,:scope>[is=sidebar-view]') ?? null
  }

  #refreshToolBarConfig() {
    this.#toolBarConfig = [
      ...(this.#component?.querySelectorAll<NavigationToolbarConfiguration>(`:scope > tool-bar > tool-bar-item,:scope > tool-bar > tool-bar-item-group`) ?? []),
    ]
  }

  #refreshSlot() {
    this.#slot =
      this.#component?.querySelector<NavigationHost>(
        ':scope>body-view:not([hidden]),:scope>[is=sheet-view]:not([hidden]),:scope>navigation-stack:not([hidden]),:scope>navigation-split-view:not([hidden])'
      ) ?? null
  }

  hydrate() {
    this.#body = closestBody(this.#component) ?? null

    this.#refreshPage()

    this.#refreshToolBarConfig()

    this.#refreshSlot()
  }

  *children(): Generator<NavigationPath> {
    if (!this.slot) return

    const child = new NavigationPath(this.slot)

    yield child
    yield* child.children()
  }

  *parents(): Generator<NavigationPath> {
    if (!this.#component) return

    let el = this.#component.parentElement

    while (el) {
      const host = closestHost(el)
      if (!host) break

      yield new NavigationPath(host)

      el = host.parentElement
    }
  }

  *[Symbol.iterator](): Generator<NavigationPath> {
    yield this

    yield* this.children()
  }
}
