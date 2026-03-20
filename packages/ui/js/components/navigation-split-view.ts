import { NavigationView } from '../internal/class/navigation-view'

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
