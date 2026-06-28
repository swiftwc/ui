import type { LabelView } from '../../components'
import $ from './cash'

export default function (label: LabelView, title: string | null) {
  const span = label.querySelector(':scope>:not([slot])')

  if (title) {
    if (!span) {
      const newSpan = $(`<span></span>`, '>1')

      newSpan.textContent = title

      // DOM manipulation last
      label.appendChild(newSpan)
    } else if (title !== span.textContent) span.textContent = title
  } else span?.remove()
}
