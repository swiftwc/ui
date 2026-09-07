import { NavigationView } from '../internal/class/navigation-view'
import { debug } from '../internal/utils'

/**
 * @summary A container view that shows a main screen and lets the user open other screens on top of it.
 */
export class NavigationStack extends NavigationView {
  constructor() {
    super()
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    debug(`${NavigationStack.name} ⚡️ attr-change [${name}] ("${oldValue}" → "${newValue}")`)

    super.attributeChangedCallback(name, oldValue, newValue)

    switch (name) {
      case 'hidden':
        break
    }
  }

  disconnectedCallback() {
    debug(`${NavigationStack.name} ⚡️ disconnect`)

    super.disconnectedCallback()
  }

  connectedCallback() {
    debug(`${NavigationStack.name} ⚡️ connect`)

    super.connectedCallback()
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'navigation-stack': NavigationStack
  }
}
