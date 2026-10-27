// const roots = new WeakMap<HTMLElement, ShadowRoot>()

// export function shadowRoot(mode: ShadowRootMode = 'closed') {
//   return function <T extends HTMLElement>(_value: undefined, context: ClassFieldDecoratorContext<T, ShadowRoot>) {
//     if (context.static) throw new TypeError(`@shadowRoot cannot decorate static field "${String(context.name)}"`)

//     return function (this: T): ShadowRoot {
//       const root = this.attachShadow({ mode })

//       // roots.set(this, root)

//       return root
//     }
//   }
// }

// export interface SlotLookup {
//   get(name: string): HTMLSlotElement | undefined
// }

// export function slots() {
//   return function <T extends HTMLElement>(_value: undefined, context: ClassFieldDecoratorContext<T, SlotLookup>) {
//     if (context.static) throw new TypeError(`@slots cannot decorate static field "${String(context.name)}"`)

//     return function (this: T): SlotLookup {
//       return {
//         get: (name) => {
//           const root = roots.get(this)

//           if (!root) throw new TypeError('@slots requires @shadowRoot on the same class')

//           return root.querySelector<HTMLSlotElement>(name ? `slot[name="${CSS.escape(name)}"]` : 'slot:not([name])') ?? undefined
//         },
//       }
//     }
//   }
// }

// https://www.typescriptlang.org/docs/handbook/decorators.html
// export default function <T extends { new (...args: any[]): {} }>(constructor: T) {
// Standard class decorator: (value, context)
export default function <T extends abstract new (...args: any[]) => HTMLElement>(value: T, _context: ClassDecoratorContext<T>) {
  // Return nothing to keep the original class as-is.
  // Return a subclass only if you actually need to add behavior:
  // return class extends constructor {
  // reportingURL = 'http://www...'
  // }
}
