import { $ } from '../internal/utils'
import morph from './morph'
import type { TemplateResult } from '../tpl'

export default function (scopedSelector: string, template: TemplateResult, container?: Element, options?: { cb?: () => boolean; removeIf?: boolean }): void {
  if (false === options?.cb?.()) return

  if ('boolean' === typeof options?.removeIf && options?.removeIf) return container?.querySelector(`:scope>${scopedSelector}`)?.remove()

  const fromEl = container?.querySelector(`:scope>${scopedSelector}`) ?? container?.appendChild($(template, '>1'))
  if (!fromEl) return

  morph(template, fromEl)
}
