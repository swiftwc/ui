import { debug } from '../utils'
import { CleanupRegistry } from './cleanup-registry'
import { MutationObserverSingleton } from './mutation-observer-singleton'

const internals = new WeakMap<FormAssociatedBase, ElementInternals>()

const trackedElements = new WeakMap<FormAssociatedBase, Set<Element>>()

const observers = new MutationObserverSingleton()

export function getInternals(instance: FormAssociatedBase): ElementInternals {
  const i = internals.get(instance)
  if (!i) throw new Error('Not a FormAssociatedBase instance')
  return i
}

export function makeSlotchangeHandler(t: FormAssociatedBase) {
  const handleSlotchange = ({ type, target: slot }: Event) => {
      debug(`${makeSlotchangeHandler.name} ⚡️ ${type}`)

      if (!(slot instanceof HTMLSlotElement && slot)) return

      const assigned = slot.assignedElements({ flatten: true })

      observers.syncObservations(trackedElements.get(t) ?? new Set(), assigned, handleTagMutation, ['value', 'label'])

      if (0 < assigned.length) handleTagMutation()
    },
    handleTagMutation = (entry?: MutationRecord) => {
      debug(`${handleTagMutation.name} ⚡️ mutation`)

      t.setValidity(t.validity, t.validationMessage)
    }

  return [{ types: 'slotchange', listener: handleSlotchange }]
}

export abstract class FormAssociatedBase extends HTMLElement {
  abstract setValidity(flags?: ValidityStateFlags, message?: string, anchor?: HTMLElement): void

  static get formAssociated() {
    return true
  }

  constructor() {
    super()

    internals.set(this, this.attachInternals())

    trackedElements.set(this, new Set<Element>())
  }

  disconnectedCallback() {
    debug(`${FormAssociatedBase.name} ⚡️ disconnect`)

    CleanupRegistry.unregister(this)

    observers.clearObservationsSet(trackedElements.get(this) ?? new Set())
    // for (const el of trackedElements.get(this) ?? []) observers.unobserve(el)
    // trackedElements.get(this)?.clear() // trackedElements.delete(this)
  }

  connectedCallback() {
    debug(`${FormAssociatedBase.name} ⚡️ connect`)
  }

  get type() {
    return this.localName
  }
  get form() {
    return getInternals(this).form
  }

  get validity() {
    return getInternals(this).validity
  }
  get validationMessage() {
    return getInternals(this).validationMessage
  }
  get willValidate() {
    return getInternals(this).willValidate
  }

  checkValidity = () => {
    return getInternals(this).checkValidity()
  }
  reportValidity = () => {
    return getInternals(this).reportValidity()
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
