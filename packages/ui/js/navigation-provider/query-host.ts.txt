import queryHostAll from './query-host-all'
import { type NavigationPage } from '../internal/privateNamespace'

/**
 * Queries slot for child-hosts. First is always sibling slot of sv.
 */
export default function (body?: NavigationPage) {
  return queryHostAll(body)?.[0]
  // const possibleNest = hostSlot(body)
  // return possibleNest
  // possibleNest?.querySelector(
  //   'body-view:not(navigation-stack[hidden] body-view,navigation-split-view[hidden] body-view),[is=sheet-view]:not(navigation-stack[hidden] [is=sheet-view],navigation-split-view[hidden] [is=sheet-view])'
  // ) ??
  // undefined
}
