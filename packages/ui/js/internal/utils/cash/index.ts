// export { default as prop } from './prop'

import prop from './prop'

const DEFAULT = ':scope>:first-child' as const

interface CashFn {
  (innerHTML: string, selector?: typeof DEFAULT): Element
  (innerHTML: string, selector: string): HTMLTemplateElement
  prop: typeof prop
}
//':scope>:first-child'
const cash: CashFn = ((innerHTML: string, selector: string = DEFAULT) => {
  const template = Object.assign(document.createElement('template'), { innerHTML })

  if (selector === DEFAULT) return template.content.firstElementChild!

  return template
}) as CashFn

cash.prop = prop

export default cash

export { prop }
