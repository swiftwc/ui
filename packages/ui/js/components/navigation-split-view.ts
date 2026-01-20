export class NavigationSplitView extends HTMLElement {
  static observedAttributes = ['hidden']

  constructor() {
    super()
  }

  disconnectedCallback() {
    console.debug(`${NavigationSplitView.name} ⚡️ disconnect`)
  }
}
