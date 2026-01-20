import { DetailsBase } from '../internal/class'

export class DisclosureGroup extends DetailsBase {
  static observedAttributes = ['open']

  constructor() {
    super()
  }

  attributeChangedCallback(name: string, oldValue: boolean, newValue: boolean) {
    console.log(`Attribute ${name} has changed.`)
    alert(99)
  }

  disconnectedCallback() {
    console.debug(`${DisclosureGroup.name} ⚡️ disconnect`)
  }

  connectedCallback() {
    console.debug(`${DisclosureGroup.name} ⚡️ connect`)
    
  }

  static polyfillDisconnectedCallback(el: DisclosureGroup) {
   
  }
  static polyfillConnectedCallback(el: DisclosureGroup) {
    
  }
}
