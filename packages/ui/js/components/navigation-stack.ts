import { Snapshot } from '../snapshot'
import { NavigationView } from '../internal/class/navigation-view'

export class NavigationStack extends NavigationView {
  // #path = new NavigationPath()

  // get path() {
  //   return this.#path
  // }

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

    Snapshot.waitReadyFor(this).then((r) => {
      if (!r) return

      switch (name) {
        case 'hidden':
          break
      }
    })
  }
}
