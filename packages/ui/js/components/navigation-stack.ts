import { DEBUG } from '../internal/flags.json' with { type: 'json' }
import { NavigationView } from '../internal/class/navigation-view'

/**
 * @summary A container view that shows a main screen and lets the user open other screens on top of it.
 */
export class NavigationStack extends NavigationView {
  constructor() {
    super()
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    DEBUG && console.debug(`${NavigationStack.name} ⚡️ attr-change [${name}] ("${oldValue}" → "${newValue}")`)

    super.attributeChangedCallback(name, oldValue, newValue)

    switch (name) {
      case 'hidden':
        break
    }
  }

  disconnectedCallback() {
    DEBUG && console.debug(`${NavigationStack.name} ⚡️ disconnect`)

    super.disconnectedCallback()
  }

  connectedCallback() {
    DEBUG && console.debug(`${NavigationStack.name} ⚡️ connect`)

    super.connectedCallback()
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'navigation-stack': NavigationStack
  }
}
