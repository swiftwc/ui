export class CleanupRegistry {
  static #cleanups = new WeakMap<Element, Map<string | symbol, Set<() => void>>>()

  static #DEFAULT = Symbol('__default__')

  static register(target: Element, heldValue: () => void, unregisterToken: string | symbol = this.#DEFAULT) {
    let tokens = this.#cleanups.get(target)

    if (!tokens) this.#cleanups.set(target, (tokens = new Map()))

    let fns = tokens.get(unregisterToken)

    if (!fns) tokens.set(unregisterToken, (fns = new Set()))

    fns.add(heldValue)
  }

  static unregister(target: Element, token?: string | symbol) {
    const tokens = this.#cleanups.get(target)
    if (!tokens) return

    if (undefined !== token) {
      for (const fn of tokens.get(token) ?? []) fn()
      tokens.delete(token)
    } else {
      for (const fns of tokens.values()) for (const fn of fns) fn()
      this.#cleanups.delete(target)
    }
  }
}
