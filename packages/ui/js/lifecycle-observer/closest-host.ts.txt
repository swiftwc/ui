import { type NavigationHost } from '../internal/privateNamespace'

/**
 * Gets current host (closest)
 */
export default function (any?: HTMLElement) {
  return any?.closest<NavigationHost>('body-view,[is=sheet-view],navigation-stack,navigation-split-view') ?? undefined
}
