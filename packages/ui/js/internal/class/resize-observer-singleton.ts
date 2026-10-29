import { Snapshot } from '../../snapshot'

export class ResizeObserverSingleton {
  #observers = new WeakMap<Element, (entry: ResizeObserverEntry) => void>()

  public readonly observer: Promise<ResizeObserver>

  constructor() {
    this.observer = Snapshot.waitReady.then(
      () =>
        new ResizeObserver((entries) => {
          for (const entry of entries) this.#observers.get(entry.target)?.(entry)
        })
    )
  }

  public observe(target: Element, callback: (entry: ResizeObserverEntry) => void) {
    this.#observers.set(target, callback)
    
    void this.observer.then((o) => {
      if (this.#observers.get(target) === callback) o.observe(target) // skip if already unobserved/replaced
    })
  }

  public unobserve(target: Element) {
    this.#observers.delete(target)

    void this.observer.then((o) => o.unobserve(target))
  }
}
