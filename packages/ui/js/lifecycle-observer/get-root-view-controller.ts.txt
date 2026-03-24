import { type NavigationViewController } from '../internal/privateNamespace'
import type * as Components from '../components'
import { ancestors } from '../internal/utils'

/**
 * Gets top-most view (root)
 */
export default function (body?: Components.ScrollView): NavigationViewController | undefined {
  return ancestors<NavigationViewController>('navigation-stack,navigation-split-view', body)?.at(-1)
  // let root
  // for (let e: HTMLElement | undefined | null = body; e; e = e.parentElement)
  //   e.matches('navigation-stack,navigation-split-view') && (root = e as NavigationController)
  // return root
}
