import ancestors from './ancestors'
import next from './next'
import nextAll from './next-all'
import prev from './prev'
import prevAll from './prev-all'
import prop from './prop'
import siblings from './siblings'

const DEFAULT = ':scope>:first-child' as const

interface CashFn {
  (innerHTML: string, selector?: typeof DEFAULT): Element
  (innerHTML: string, selector: string): DocumentFragment
  prop: typeof prop
  nextAll: typeof nextAll
  prevAll: typeof prevAll
  next: typeof next
  prev: typeof prev
  siblings: typeof siblings
  ancestors: typeof ancestors
}

const cash: CashFn = ((innerHTML: string, selector: string = DEFAULT) => {
  const template = Object.assign(document.createElement('template'), { innerHTML })

  if (selector === DEFAULT) return template.content.firstElementChild!

  return template.content
}) as CashFn

cash.prop = prop
cash.nextAll = nextAll
cash.prevAll = prevAll
cash.next = next
cash.prev = prev
cash.siblings = siblings
cash.ancestors = ancestors

export default cash

export { ancestors, next, nextAll, prev, prevAll, prop, siblings }
