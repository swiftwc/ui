import { Snapshot } from '../../snapshot'

export class MutationObserverSet {
  #observers = new Map<Element, MutationObserver>()

  constructor(private callback: MutationCallback) {}

  async observe(target: Element, attributeFilter?: string[]) {
    await Snapshot.waitReady

    if (this.#observers.has(target)) return

    const observer = new MutationObserver(this.callback)

    observer.observe(target, {
      attributes: true,
      characterData: true,
      subtree: true,
      childList: true,
      ...(attributeFilter && { attributeFilter }),
    })

    this.#observers.set(target, observer)
  }

  async unobserve(target: Element) {
    await Snapshot.waitReady

    this.#observers.get(target)?.disconnect()

    this.#observers.delete(target)
  }

  async syncObservations(source: Element[], attributeFilter?: string[]) {
    await Snapshot.waitReady

    const sourceSet = new Set(source)

    for (const el of [...this.#observers.keys()]) if (!sourceSet.has(el)) this.unobserve(el)

    for (const el of source) this.observe(el, attributeFilter)
  }

  async unobserveAll() {
    await Snapshot.waitReady

    for (const obs of this.#observers.values()) obs.disconnect()

    this.#observers.clear()
  }
}
