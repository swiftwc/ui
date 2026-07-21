import { beforeEach, describe, expect, test } from 'vitest'
import { ImageView } from './image-view'

describe('prop', () => {
  let div: HTMLElement

  customElements.define('image-view', ImageView)

  beforeEach(() => {
    div = document.createElement('image-view')
    document.body.appendChild(div)
  })

  test('[system-name]', () => {
    div.setAttribute('system-name', 'smiley')
    expect(div.innerHTML).toBe('<i style="line-height: 1" class="ph ph-smiley"></i>')
  })

  test('[system-weight]', () => {
    div.setAttribute('system-weight', 'bold')
    expect(div.innerHTML).toBe('')
  })

  test('[system-name][system-weight]', () => {
    div.setAttribute('system-name', 'smiley')
    div.setAttribute('system-weight', 'bold')
    expect(div.innerHTML).toBe('<i style="line-height: 1" class="ph-bold ph-smiley"></i>')
  })

  test('[system-name][system-weight] w/ dirty', () => {
    div.innerHTML = `<div class="ban">\nBar\n\n</div><div slot="icon">\n\nBaz</div><whatever-name></whatever-name>\n\n<whatever-name slot="icon"></whatever-name>`
    div.setAttribute('system-name', 'smiley')
    div.setAttribute('system-weight', 'bold')
    expect(div.innerHTML).toBe(`<i class="ph-bold ph-smiley" style="line-height: 1"></i><div slot="icon">\n\nBaz</div><whatever-name></whatever-name>\n\n<whatever-name slot="icon"></whatever-name>`)
  })
})
