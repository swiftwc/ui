export class NavigationSplitView extends HTMLElement {
  static observedAttributes = ['hidden']

  constructor() {
    super()
  }

  attributeChangedCallback(name: string, oldValue: boolean, newValue: boolean) {
    console.log(`Attribute ${name} has changed.`)
  }

  disconnectedCallback() {
    console.debug(`${NavigationSplitView.name} ⚡️ disconnect`)
  }
}
