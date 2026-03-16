import { type NavigationViewController } from '../internal/privateNamespace'

/**
 * Gets current controller (closest)
 */
export default function (any?: HTMLElement) {
  return any?.closest<NavigationViewController>(`navigation-stack,navigation-split-view`) ?? undefined
}
