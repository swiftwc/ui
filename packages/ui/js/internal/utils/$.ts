import { renderToString } from '../../morphdom'
import { type TemplateResult } from '../../tpl'

const DEFAULT = '>1' as const

interface MintFn {
  (markup: TemplateResult): DocumentFragment
  <T extends Element = Element>(markup: TemplateResult, selector: typeof DEFAULT): T
  <T extends Element = Element>(markup: TemplateResult, selector: string): T
}

const mint: MintFn = (<T extends Element = Element>(markup: TemplateResult, selector?: string): T | DocumentFragment => {
  const template = Object.assign(document.createElement('template'), { innerHTML: renderToString(markup).toString() })

  if (!selector) return template.content

  if (selector === DEFAULT) return template.content.firstElementChild as T

  return template.content.querySelector<T>('>1' === selector ? ':first-child' : selector) as T
}) as MintFn

export default mint
