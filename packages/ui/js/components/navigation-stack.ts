import { NavigationView } from '../internal/class/navigation-view'
import { devFlags } from '../internal/utils'

/**
 * @summary A view that shows a main screen and lets you open other screens on top of it.
 */
export class NavigationStack extends NavigationView {
  constructor() {
    super()
  }

  disconnectedCallback() {
    if (devFlags.debug) console.debug(`${NavigationStack.name} ⚡️ disconnect`)

    super.disconnectedCallback()
  }

  connectedCallback() {
    if (devFlags.debug) console.debug(`${NavigationStack.name} ⚡️ connect`)

    super.connectedCallback()
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (devFlags.debug) console.debug(`${NavigationStack.name} ⚡️ attr-change [${name}] ("${oldValue}" → "${newValue}")`)

    super.attributeChangedCallback(name, oldValue, newValue)

    // Snapshot.waitReady.then(() => {

    switch (name) {
      case 'hidden':
        break
    }
    // })
  }
}
