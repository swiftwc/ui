// const roots = new WeakMap<HTMLElement, ShadowRoot>()

export default function ({ mode = 'closed', template = false }: { mode?: ShadowRootMode; template?: boolean } = {}) {
  return function <T extends HTMLElement>(_value: undefined, context: ClassFieldDecoratorContext<T, ShadowRoot>) {
    if (context.static) throw new TypeError(`@shadowRoot cannot decorate static field "${String(context.name)}"`)

    return function (this: T): ShadowRoot {
      const root = this.attachShadow({ mode })

      //   roots.set(this, root)

      if (template) {
        const tpl = (this.constructor as unknown as { template?: DocumentFragment }).template

        if (!tpl) throw new TypeError(`${this.constructor.name}: @shadowRoot({ template: true }) needs a static template getter`)

        root.append(document.importNode(tpl, true))
      }

      return root
    }
  }
}
