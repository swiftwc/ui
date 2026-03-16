import { type NavigationPage, type NavigationHost } from '../internal/privateNamespace'
import type * as Components from '../components'

export default function (body?: Components.ScrollView): NavigationPage | undefined {
  const possibleBody = body?.parentElement?.matches('[is=sidebar-view]') ? ((body?.parentElement as Components.SidebarView | null) ?? undefined) : body

  return possibleBody?.matches('scroll-view,[is=sidebar-view]') ? possibleBody : undefined
}
