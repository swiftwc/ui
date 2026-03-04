// export { default as prop } from './prop'

import prop from './prop'

interface CashFn {
  (selector: string): Element
  prop: typeof prop
}

const cash: CashFn = ((innerHTML: string) => {
  return Object.assign(document.createElement('template'), {
    innerHTML,
  }).content.firstElementChild!
}) as CashFn

cash.prop = prop

export default cash

export { prop }
