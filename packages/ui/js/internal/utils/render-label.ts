import type { LabelView } from '../../components'
import $ from './cash'
import renderLabelIcon from './render-label-icon'
import renderLabelTitle from './render-label-title'

export default function (selector: string, template: string, container?: Element, title?: string | null, systemImage?: string | null) {
  const existing = container?.querySelector<LabelView>(selector)

  if (existing) {
    for (const { name, value } of $<LabelView>(template, '>1').attributes) if (!existing.hasAttribute(name)) existing.setAttribute(name, value)

    renderLabelIcon(existing, systemImage ?? null)
    renderLabelTitle(existing, title ?? null)
  } else {
    const newLabel = $<LabelView>(template, '>1')

    renderLabelIcon(newLabel, systemImage ?? null)
    renderLabelTitle(newLabel, title ?? null)

    container?.appendChild(newLabel)
  }
}
