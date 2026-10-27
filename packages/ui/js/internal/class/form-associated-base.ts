import { debug } from '../../internal/utils'
import { internals } from '../decorators'
import { CleanupRegistry } from './cleanup-registry'

// const internals = new WeakMap<FormAssociatedBase, ElementInternals>()
// export function getInternals(instance: FormAssociatedBase): ElementInternals {
//   const i = internals.get(instance)
//   if (!i) throw new Error('Not a FormAssociatedBase instance')
//   return i
// }

// export function makeSlotchangeHandler(t: FormAssociatedBase) {
//   const handleSlotchange = ({ type, target: slot }: Event) => {
//       debug(`${makeSlotchangeHandler.name} ⚡️ ${type}`)

//       if (!(slot instanceof HTMLSlotElement && slot)) return

//       const assigned = slot.assignedElements({ flatten: true })

//       observers.syncObservations(trackedElements.get(t) ?? new Set(), assigned, handleTagMutation, ['value', 'label'])

//       if (0 < assigned.length) handleTagMutation()
//     },
//     handleTagMutation = (entry?: MutationRecord) => {
//       debug(`${handleTagMutation.name} ⚡️ mutation`)

//       t.setValidity(t.validity, t.validationMessage)
//     }

//   return [{ types: 'slotchange', listener: handleSlotchange }]
// }

export abstract class FormAssociatedBase extends HTMLElement {
  abstract setValidity(flags?: ValidityStateFlags, message?: string, anchor?: HTMLElement): void

  static get formAssociated() {
    return true
  }

  @internals() readonly #internals: ElementInternals = undefined!
  // constructor() {
  //   super()
  //   internals.set(this, this.attachInternals()) //internals.set(this, this.attachInternals?.())
  //   // trackedElements.set(this, new Set<Element>())
  // }

  disconnectedCallback() {
    debug(`${FormAssociatedBase.name} ⚡️ disconnect`)

    CleanupRegistry.unregister(this)

    // observers.clearObservationsSet(trackedElements.get(this) ?? new Set())
  }

  connectedCallback() {
    debug(`${FormAssociatedBase.name} ⚡️ connect`)
  }

  get type() {
    return this.localName
  }
  get form() {
    return this.#internals.form
  }

  get validity() {
    return this.#internals.validity
  }
  get validationMessage() {
    return this.#internals.validationMessage
  }
  get willValidate() {
    return this.#internals.willValidate
  }

  checkValidity = () => {
    return this.#internals.checkValidity()
  }
  reportValidity = () => {
    return this.#internals.reportValidity()
  }

  shake = async (times = 3, distance = 8, duration = 400) => {
    const frames = [{ transform: 'translateX(0)' }]

    for (let i = 0; i < times; i++) frames.push({ transform: `translateX(-${distance}px)` }, { transform: `translateX(${distance}px)` })

    frames.push({ transform: 'translateX(0)' })

    try {
      await this.animate(frames, { duration, easing: 'ease-in-out' }).finished
    } catch {
      //
    }
  }
}
