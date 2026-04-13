import { Snapshot } from '../../snapshot'

export class ResizeObserverSingleton {
  #observers = new WeakMap<Element, (entry: ResizeObserverEntry) => void>()

  public readonly observer: Promise<ResizeObserver>

  constructor() {
    this.observer = Snapshot.waitReady.then(() => {
      return new ResizeObserver((entries) => {
        for (const entry of entries) this.#observers.get(entry.target)?.(entry)
      })
    })
  }

  public async observe(target: Element, callback: (entry: ResizeObserverEntry) => void) {
    this.#observers.set(target, callback)
    ;(await this.observer).observe(target)
  }

  public async unobserve(target: Element) {
    ;(await this.observer).unobserve(target)

    this.#observers.delete(target)
  }
}
