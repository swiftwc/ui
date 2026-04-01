import { frame } from '../utils'
import { type TabDetail } from '../../events'
import { LifecycleObserver } from '../../lifecycle-observer'
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
  const handleSlotchange = (evt: Event) => {
      console.debug(`${makeSlotchangeHandler.name} ⚡️ ${evt?.type}`)

      const slot = evt.target as HTMLSlotElement,
        assigned = slot.assignedElements({ flatten: true })

      for (const el of trackedElements.get(t) ?? [])
        if (!assigned.includes(el)) {
          observers.unobserve(el)
          trackedElements.get(t)?.delete(el)
        }

      for (const el of assigned) {
        if (!trackedElements.get(t)?.has(el))
          observers.observe(el, handleTagMutation, {
            attributes: true,
            characterData: true,
            subtree: true,
            childList: true,
            attributeFilter: ['value', 'label'],
          })

        trackedElements.get(t)?.add(el)
      }

      if (0 < assigned.length) handleTagMutation()
    },
    handleTagMutation = (entry?: MutationRecord) => {
      console.debug(`${handleTagMutation.name} ⚡️ mutation`)

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
    console.debug(`${FormAssociatedBase.name} ⚡️ disconnect`)

    CleanupRegistry.unregister(this)

    for (const el of trackedElements.get(this) ?? []) observers.unobserve(el)

    trackedElements.get(this)?.clear() // trackedElements.delete(this)
  }

  connectedCallback() {
    console.debug(`${FormAssociatedBase.name} ⚡️ connect`)
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
