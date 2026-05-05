import type * as Components from '../../components'
import { type NavigationHost, type NavigationPage, type NavigationToolbarConfiguration } from '../privateNamespace'

/**
 * Gets current host (closest)
 */
function closestHost(any?: HTMLElement) {
  return any?.closest<NavigationHost>('body-view,[is=sheet-view],navigation-stack,navigation-split-view') ?? undefined
}

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
    if (undefined === this.#body) this.#queryBody()

    return this.#body
  }

  get page() {
    if (undefined === this.#page) this.#queryPage()

    return this.#page
  }

  get toolBarConfig() {
    if (undefined === this.#toolBarConfig) this.#queryToolBarConfig()

    return this.#toolBarConfig
  }

  get slot() {
    if (undefined === this.#slot) this.#querySlot()

    return this.#slot
  }

  constructor(any?: HTMLElement) {
    this.#component = closestHost(any)
  }

  #queryBody() {
    this.#body = closestHost(this.#component)?.querySelector<Components.ScrollView>(`:scope>scroll-view,:scope>[is=sidebar-view]>scroll-view`) ?? null
  }

  #queryPage() {
    this.#page = this.#component?.querySelector<NavigationPage>(':scope>scroll-view,:scope>[is=sidebar-view]') ?? null
  }

  #queryToolBarConfig() {
    this.#toolBarConfig = [
      ...(this.#component?.querySelectorAll<NavigationToolbarConfiguration>(
        `:scope>tool-bar>tool-bar-item,:scope>tool-bar>tool-bar-item-group,:scope>[is=sidebar-view]>tool-bar>tool-bar-item,:scope>[is=sidebar-view]>tool-bar>tool-bar-item-group`
      ) ?? []),
    ]
  }

  #querySlot() {
    this.#slot =
      this.#component?.querySelector<NavigationHost>(
        ':scope>body-view:not([hidden]),:scope>[is=sheet-view]:not([hidden]),:scope>navigation-stack:not([hidden]),:scope>navigation-split-view:not([hidden])'
      ) ?? null
  }

  hydrate() {
    this.#queryBody()

    this.#queryPage()

    this.#queryToolBarConfig()

    this.#querySlot()

    return this
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
