import type * as Components from '../components'
import { getRank } from '../internal/utils'

/**
 * Queries scroll-views. Order matters. In cases of navsplitviews the 2 first scroll-views returned are the LAST TWO in natural dom tree order.
 */
export default function (any?: HTMLElement) {
  const nodes = [
    ...(any?.querySelectorAll<Components.ScrollView>('scroll-view:not(navigation-stack[hidden] scroll-view,navigation-split-view[hidden] scroll-view)') ?? []), //'navigation-stack:not([hidden]) scroll-view'
  ]

  const ranks: [string, number][] = [
    ['navigation-stack:has(>navigation-stack,>navigation-split-view) > scroll-view', 1],
    ['navigation-split-view:has(>[is=sidebar-view]) > body-view > scroll-view', 2],
    ['navigation-split-view > scroll-view, navigation-split-view:has(>[is=sidebar-view]) > [is=sidebar-view] > scroll-view', 3],
  ]

  return nodes.sort((a, b) => getRank(a, ranks) - getRank(b, ranks))
}
