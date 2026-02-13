import { Snapshot } from '../snapshot'

export class MutationObserverSingleton {
  #observers = new WeakMap<Node, (entry: MutationRecord) => void>()

  public readonly observer: Promise<MutationObserver>

  constructor() {
    this.observer = Snapshot.waitReady.then(() => {
      return new MutationObserver((entries) => {
        self.requestAnimationFrame(() => {
          for (const entry of entries) this.#observers.get(entry.target)?.(entry)
        })
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
}
