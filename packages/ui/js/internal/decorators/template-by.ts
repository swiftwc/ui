/** One cached fragment per key (e.g. pickerStyle). For instance getters. */
export default function <T extends object>(key: (self: T) => string) {
  return function (getter: (this: T) => DocumentFragment, _ctx: ClassGetterDecoratorContext<T, DocumentFragment>) {
    const cache = new Map<string, DocumentFragment>() // shared by all instances of this class

    return function (this: T): DocumentFragment {
      return cache.getOrInsertComputed(key(this), () => getter.call(this))
    }
  }
}
