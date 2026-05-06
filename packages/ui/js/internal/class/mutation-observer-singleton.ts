import { Snapshot } from '../../snapshot'

export class MutationObserverSingleton {
  #observers = new WeakMap<Node, (entry: MutationRecord) => void>()

  public readonly observer: Promise<MutationObserver>

  constructor() {
    this.observer = Snapshot.waitReady.then(() => {
      return new MutationObserver((entries) => {
        for (const entry of entries) this.#observers.get(entry.target)?.(entry)
      })
    })
  }

  public async observe(target: Node, callback: (entry: MutationRecord) => void, options: MutationObserverInit) {
    this.#observers.set(target, callback)
    ;(await this.observer).observe(target, options)
  }

  public async unobserve(target: Node) {
    ;(await this.observer).disconnect()

    this.#observers.delete(target)
  }

  /** Observes automatically all elements using a Set provided by outside. Calls renderCallback on EVERY change. */
  public async syncObservations(set: Set<Element>, nodes: Element[], renderCallback: () => void, attributeFilter?: string[]) {
    for (const el of set)
      if (!nodes.includes(el)) {
        this.unobserve(el)
        set.delete(el)
      }

    for (const el of nodes) {
      if (!set.has(el))
        this.observe(el, renderCallback, {
          attributes: true,
          characterData: true,
          subtree: true,
          childList: true,
          ...(attributeFilter && { attributeFilter }),
        })

      set.add(el)
    }
  }

  public async clearObservationsSet(set: Set<Element>) {
    for (const el of set) this.unobserve(el)

    set.clear()
  }
}
