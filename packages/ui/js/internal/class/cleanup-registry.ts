export class CleanupRegistry {
  static #cleanups = new WeakMap<Element, Map<string | symbol, Set<() => void>>>()

  static register(target: Element, heldValue: () => void, unregisterToken: string | symbol = '__default__') {
    if (!this.#cleanups.has(target)) this.#cleanups.set(target, new Map())

    const keys = this.#cleanups.get(target)!
    if (!keys.has(unregisterToken)) keys.set(unregisterToken, new Set())

    keys.get(unregisterToken)!.add(heldValue)
  }

  static unregister(target: Element, token?: string | symbol) {
    const keys = this.#cleanups.get(target)
    if (!keys) return

    if (token) {
      for (const fn of keys.get(token) ?? []) fn()
      keys.delete(token)
    } else {
      for (const fns of keys.values()) for (const fn of fns) fn()
      this.#cleanups.delete(target)
    }
  }
}
