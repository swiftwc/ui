import morphdom from '../internal/vendor/morphdom.ts'
import type { TemplateResult } from '../tpl/index.ts'
import renderToString from './render-to-string.ts'

export default function (markup: TemplateResult, fromEl?: Element, options?: { cb: () => void }): void {
  if (!fromEl) return

  morphdom(fromEl, renderToString(markup).toString(), {
    onBeforeElUpdated: (fromEl: Element, toEl: Element) => !fromEl.isEqualNode(toEl),
    onBeforeElChildrenUpdated: (fromEl: Element, toEl: Element) => !toEl.matches('image-view,navigation-title'), // NOTE: image-view will alter it's contents! This is required to not empty it up again!
  })
}
