import { NavigationView } from '../internal/class/navigation-view'

export class NavigationStack extends NavigationView {
  constructor() {
    super()
  }

  disconnectedCallback() {
    console.debug(`${NavigationStack.name} ⚡️ disconnect`)

    super.disconnectedCallback()
  }

  connectedCallback() {
    console.debug(`${NavigationStack.name} ⚡️ connect`)

    super.connectedCallback()
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    console.debug(`${NavigationStack.name} ⚡️ attr-change [${name}] ("${oldValue}" → "${newValue}")`)

    super.attributeChangedCallback(name, oldValue, newValue)

    // Snapshot.waitReady.then(() => {

    switch (name) {
      case 'hidden':
        break
    }
    // })
  }
}
