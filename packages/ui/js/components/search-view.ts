import { CleanupRegistry } from '../internal/class/cleanup-registry.ts'
import { debug, onoff, touchGlass } from '../internal/utils/index.ts'
import { InputBase } from '../namespace-browser/base.ts'

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
