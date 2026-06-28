import type { LabelView } from '../../components'
import $ from './cash'

export default function (label: LabelView, systemImage: string | null) {
  const img = label.querySelector(':scope>[slot=icon]')

  // image ??= this.appendChild($(`<i slot="icon" style="line-height: 1.05"></i>`, '>1'))
  // image.setAttribute('class', `ph ph-${newValue}`)

  if (systemImage) {
    if (!img) {
      const newImg = $(`<i slot="icon" style="line-height: 1.05" class="ph ph-${systemImage}"></i>`, '>1')
      // const newImg = $(`<image-view slot="icon"></image-view>`, '>1')

      // newImg.setAttribute('system-name', systemImage)

      // DOM manipulation last
      label.appendChild(newImg)
    } else if (systemImage !== img.getAttribute('system-name')) img.setAttribute('system-name', systemImage)
  } else img?.remove()
}
