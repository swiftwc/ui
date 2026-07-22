import morphdom from '../internal/vendor/morphdom'
import type { TrustedMarkup } from './html'

export default function (template: TrustedMarkup, fromEl?: Element, options?: { cb: () => void }): void {
  if (!fromEl) return

  morphdom(fromEl, template.toString(), {
    onBeforeElUpdated: (fromEl: Element, toEl: Element) => !fromEl.isEqualNode(toEl),
    onBeforeElChildrenUpdated: (fromEl: Element, toEl: Element) => !toEl.matches('image-view,navigation-title'), // NOTE: image-view will alter it's contents! This is required to not empty it up again!
  })
}
