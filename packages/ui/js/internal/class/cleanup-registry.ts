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

    if (undefined === token) {
      for (const fns of tokens.values()) for (const fn of fns) fn()
      this.#cleanups.delete(target)
    } else if ('string' === typeof token && token.endsWith('*')) {
      const prefix = token.slice(0, -1)
      for (const [key, fns] of tokens)
        if ('string' === typeof key && key.startsWith(prefix)) {
          for (const fn of fns) fn()
          tokens.delete(key)
        }
    } else {
      for (const fn of tokens.get(token) ?? []) fn()
      tokens.delete(token)
    }
  }
}
