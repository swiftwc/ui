import { renderToString } from '../../../morphdom'
import { type TemplateResult } from '../../../tpl'
import ancestors from './ancestors'
import next from './next'
import nextAll from './next-all'
import prev from './prev'
import prevAll from './prev-all'
import prop from './prop'
import siblings from './siblings'

const DEFAULT = '>1' as const

interface CashFn {
  (markup: TemplateResult): DocumentFragment
  <T extends Element = Element>(markup: TemplateResult, selector: typeof DEFAULT): T
  <T extends Element = Element>(markup: TemplateResult, selector: string): T
  prop: typeof prop
  nextAll: typeof nextAll
  prevAll: typeof prevAll
  next: typeof next
  prev: typeof prev
  siblings: typeof siblings
  ancestors: typeof ancestors
}

const cash: CashFn = (<T extends Element = Element>(markup: TemplateResult, selector?: string): T | DocumentFragment => {
  // NOTE: Use also runtime check isTemplateResult()??
  const template = Object.assign(document.createElement('template'), { innerHTML: renderToString(markup).toString() })

  if (!selector) return template.content

  if (selector === DEFAULT) return template.content.firstElementChild as T // OVERKILL

  return template.content.querySelector<T>('>1' === selector ? ':first-child' : selector) as T
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
