/** One cached fragment per class. For `static get template()`. */
export default function () {
  return function <T extends object>(getter: (this: T) => DocumentFragment, _ctx: ClassGetterDecoratorContext<T, DocumentFragment>) {
    const cache = new WeakMap<T, DocumentFragment>() // one cache per decorated getter; key = the class

    return function (this: T): DocumentFragment {
      return cache.getOrInsertComputed(this, () => getter.call(this))
    }
  }
}
