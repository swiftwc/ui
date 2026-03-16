import type * as Components from '../components'
import { getRank } from '../internal/utils'
import { type NavigationPage, type NavigationHost } from '../internal/privateNamespace'
import hostSlot from './host-slot'

/**
 * Queries slot for child-hosts, plus all descendant hosts. Order matters.
 */
export default function (body?: NavigationPage) {
  const possibleNest = hostSlot(body)

  return [
    ...(possibleNest ? [possibleNest] : []),
    ...(possibleNest?.querySelectorAll<NavigationHost>(
      `body-view:not(navigation-stack[hidden] body-view,navigation-split-view[hidden] body-view),[is=sheet-view]:not(navigation-stack[hidden] [is=sheet-view],navigation-split-view[hidden] [is=sheet-view]),navigation-stack:not(navigation-stack[hidden] navigation-stack,navigation-split-view[hidden] navigation-stack),navigation-split-view:not(navigation-stack[hidden] navigation-split-view,navigation-split-view[hidden] navigation-split-view)`
    ) ?? []),
  ]
}
