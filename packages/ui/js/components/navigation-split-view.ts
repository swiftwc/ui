import { NavigationView } from '../internal/class/navigation-view'
import { debug } from '../internal/utils'

/**
 * @summary A container view with two or three side-by-side screens, where what the user chooses in the left screen changes what appears in the next screen.
 *
 * @slot — The default slot
 */
export class NavigationSplitView extends NavigationView {
  constructor() {
    super()
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    debug(`${NavigationSplitView.name} ⚡️ attr-change [${name}] ("${oldValue}" → "${newValue}")`)

    super.attributeChangedCallback(name, oldValue, newValue)
  }

  override disconnectedCallback() {
    debug(`${NavigationSplitView.name} ⚡️ disconnect`)

    super.disconnectedCallback()
  }

  override  connectedCallback() {
    debug(`${NavigationSplitView.name} ⚡️ connect`)

    super.connectedCallback()
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'navigation-split-view': NavigationSplitView
  }
}
