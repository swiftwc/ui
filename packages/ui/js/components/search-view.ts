import { CleanupRegistry } from '../internal/class/cleanup-registry'
import { devFlags, onoff, touchGlass } from '../internal/utils'
import { InputBase } from '../namespace-browser/base'

export class SearchView extends InputBase {
  static get observedAttributes() {
    return ['role', 'title-key']
  }

  constructor() {
    super()
  }

  static polyfillDisconnectedCallback(el: InputBase) {
    if (devFlags.debug) console.debug(`${SearchView.name} ⚡️ disconnect`)

    CleanupRegistry.unregister(el)
  }

  static polyfillConnectedCallback(el: InputBase) {
    if (devFlags.debug) console.debug(`${SearchView.name} ⚡️ connect`)

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

  static polyfillAttributeChangedCallback([{ attributeName, target, oldValue }]: Pick<MutationRecord, 'attributeName' | 'oldValue' | 'target'>[]) {
    if (devFlags.debug) console.debug(`${SearchView.name} ⚡️ attr-change [${attributeName}] ("${oldValue}" → "${(target as HTMLElement).getAttribute(attributeName ?? '')}")`)

    const node = target instanceof HTMLInputElement && target
    if (!node) return

    //
  }
}
