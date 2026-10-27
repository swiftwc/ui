import { CleanupRegistry } from '../internal/class/cleanup-registry'
import { debug, onoff, touchGlass } from '../internal/utils'
import { InputBase } from '../namespace-browser/base'

export class SearchView extends InputBase {
  constructor() {
    super()
  }

  static override polyfillDisconnectedCallback(el: InputBase) {
    debug(`${SearchView.name} ⚡️ disconnect`)

    CleanupRegistry.unregister(el)
  }

  static override polyfillConnectedCallback(el: InputBase) {
    debug(`${SearchView.name} ⚡️ connect`)

    CleanupRegistry.register(
      el,
      onoff(
        touchGlass(
          el,
          (t) => t,
          () => true
        ),
        el
      ).on()
    )

    el.type = 'search'
  }

  static override polyfillAttributeChangedCallback([{ attributeName, target, oldValue }]: Pick<MutationRecord, 'attributeName' | 'oldValue' | 'target'>[]) {
    debug(`${SearchView.name} ⚡️ attr-change [${attributeName}] ("${oldValue}" → "${(target as HTMLElement).getAttribute(attributeName ?? '')}")`)

    const node = target instanceof HTMLInputElement
    if (!node) return

    //
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'search-view': SearchView
  }
}
