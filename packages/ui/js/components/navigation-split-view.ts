import { NavigationView } from '../internal/class/navigation-view'

/**
 * @summary A view with two or three side-by-side sections, where what you choose in the left section changes what appears in the next section.
 */
export class NavigationSplitView extends NavigationView {
  constructor() {
    super()
  }

  disconnectedCallback() {
    console.debug(`${NavigationSplitView.name} ⚡️ disconnect`)

    super.disconnectedCallback()
  }

  connectedCallback() {
    console.debug(`${NavigationSplitView.name} ⚡️ connect`)

    super.connectedCallback()
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    console.debug(`${NavigationSplitView.name} ⚡️ attr-change [${name}] ("${oldValue}" → "${newValue}")`)

    super.attributeChangedCallback(name, oldValue, newValue)
  }
}
