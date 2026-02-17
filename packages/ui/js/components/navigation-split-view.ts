import { NavigationPath } from '../navigation-path'

export class NavigationSplitView extends HTMLElement {
  static observedAttributes = ['hidden']

  #path = new NavigationPath()

  get path() {
    return this.#path
  }

  constructor() {
    super()
  }

  disconnectedCallback() {
    console.debug(`${NavigationSplitView.name} ⚡️ disconnect`)
  }
}
