import { type NavigationPage, type NavigationHost } from '../internal/privateNamespace'
import { kebabCase, ancestors, nextAll, prevAll, getRank } from '../internal/utils'
import type * as Components from '../components'
import resolveDoc from './resolve-doc'

/**
 * Looks in siblings for possible slot of child views. Slot of child-views(hosts).
 */
export default function (body?: NavigationPage): NavigationHost | undefined {
  //body.querySelector('.item:has(+ .active)')
  let possibleNest = nextAll<NavigationHost>(
    'body-view:not([hidden]),[is=sheet-view]:not([hidden]),navigation-stack:not([hidden]),navigation-split-view:not([hidden])',
    body
  )?.[0] //?.nextElementSibling as NavigationHost | null

  if (
    body?.matches(
      `navigation-split-view > scroll-view,navigation-split-view:has(>[is=sidebar-view]) > [is=sidebar-view],navigation-split-view:has(>[is=sidebar-view]) > body-view > scroll-view`
    )
  )
    possibleNest = prevAll<NavigationHost>(
      'body-view:not([hidden]),[is=sheet-view]:not([hidden]),navigation-stack:not([hidden]),navigation-split-view:not([hidden])',
      resolveDoc(body as Components.ScrollView)
    )?.[0] //resolveDoc(body)?.previousElementSibling as NavigationHost | null // look for prev sibling instead

  return possibleNest ?? undefined //?.matches('body-view,[is=sheet-view],navigation-stack,navigation-split-view') ? possibleNest : undefined
}
