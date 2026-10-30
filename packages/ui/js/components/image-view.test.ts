import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import '../client'
import type { ImageView } from './image-view'

beforeEach(() => document.body.replaceChildren())

describe('prop', () => {
  let el: ImageView

  beforeEach(() => {
    document.body.insertAdjacentHTML('beforeend', '<image-view></image-view>')
    el = document.body.lastElementChild as ImageView
  })
  afterEach(() => el.remove())

  test('[system-name]', () => {
    el.setAttribute('system-name', 'smiley')
    expect(el.innerHTML).toBe('<i style="line-height: 1" class="ph ph-smiley"></i>')
  })

  test('[system-weight]', () => {
    el.setAttribute('system-weight', 'bold')
    expect(el.innerHTML).toBe('')
  })

  test('[system-name][system-weight]', () => {
    el.setAttribute('system-name', 'smiley')
    el.setAttribute('system-weight', 'bold')
    expect(el.innerHTML).toBe('<i style="line-height: 1" class="ph-bold ph-smiley"></i>')
  })

  test('[system-name][system-weight] w/ dirty', () => {
    el.innerHTML = `<div class="ban">\nBar\n\n</div><div slot="icon">\n\nBaz</div><whatever-name></whatever-name>\n\n<whatever-name slot="icon"></whatever-name>`
    el.setAttribute('system-name', 'smiley')
    el.setAttribute('system-weight', 'bold')
    expect(el.innerHTML).toBe(`<i class="ph-bold ph-smiley" style="line-height: 1"></i><div slot="icon">\n\nBaz</div><whatever-name></whatever-name>\n\n<whatever-name slot="icon"></whatever-name>`)
  })
})
