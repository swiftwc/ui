export class ToolBarItemGroup extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    console.debug(`${ToolBarItemGroup.name} ⚡️ connect`)
  }

  disconnectedCallback() {
    console.debug(`${ToolBarItemGroup.name} ⚡️ disconnect`)
  }
}
