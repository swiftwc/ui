import type * as Components from '../components'
import closestHost from './closest-host'

/**
 * Gets current body (closest)
 */
export default function (any?: HTMLElement) {
  return closestHost(any)?.querySelector<Components.ScrollView>(`:scope > scroll-view,:scope > [is=sidebar-view] > scroll-view`) ?? undefined
}
