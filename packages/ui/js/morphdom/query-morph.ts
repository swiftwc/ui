import { $ } from '../internal/utils'
import type { TrustedMarkup } from './html'
import morph from './morph'

export default function (scopedSelector: string, template: TrustedMarkup, container?: Element, options?: { cb?: () => boolean; removeIf?: boolean }): void {
  if (false === options?.cb?.()) return

  if ('boolean' === typeof options?.removeIf && options?.removeIf) return container?.querySelector(`:scope>${scopedSelector}`)?.remove()

  const fromEl = container?.querySelector(`:scope>${scopedSelector}`) ?? container?.appendChild($(template.toString(), '>1'))
  if (!fromEl) return

  morph(template, fromEl)
}
