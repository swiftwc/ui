import { frame } from '../utils'
import { type TabDetail } from '../../events'
import { LifecycleObserver } from '../../lifecycle-observer'
import { CleanupRegistry } from './cleanup-registry'

// const internals = new WeakMap<HTMLElement, ElementInternals>()

export class FormAssociatedBase extends HTMLElement {
  static get formAssociated() {
    return true
  }

  // #trackedElements = new Set<Element>()

  constructor() {
    super()

    // internals.set(this, this.attachInternals())

    // this.tabIndex = 0
  }

  disconnectedCallback() {
    console.debug(`${FormAssociatedBase.name} ⚡️ disconnect`)

    CleanupRegistry.unregister(this)

    // this.#trackedElements.clear()
  }

  connectedCallback() {
    console.debug(`${FormAssociatedBase.name} ⚡️ connect`)
  }

  get type() {
    return this.localName
  }
}
