import type { LabelView } from '../../components'
import $ from './cash'

export default function (label: LabelView, textContent: string | null) {
  const span = label.querySelector(':scope>:not([slot])')

  if (textContent) {
    if (!span) {
      // const newSpan = $(`<span></span>`, '>1')

      // newSpan.textContent = title

      // DOM manipulation last
      label.appendChild(Object.assign($(`<span></span>`, '>1'), { textContent }))
    } else if (textContent !== span.textContent) span.textContent = textContent
  } else span?.remove()
}
