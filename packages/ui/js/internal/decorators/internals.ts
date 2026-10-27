const internalsMap = new WeakMap<HTMLElement, ElementInternals>() // module-private

export default function () {
  return function <T extends HTMLElement>(_: undefined, _ctx: ClassFieldDecoratorContext<T, ElementInternals>) {
    return function (this: T): ElementInternals {
      return internalsMap.getOrInsertComputed(this, () => this.attachInternals())
    }
  }
}
