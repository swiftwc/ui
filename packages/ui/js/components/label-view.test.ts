import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import '../client'
import type { LabelView } from './label-view'

beforeEach(() => document.body.replaceChildren())

describe('prop', () => {
  let el: LabelView

  beforeEach(() => {
    document.body.insertAdjacentHTML('beforeend', '<label-view></label-view>')
    el = document.body.lastElementChild as LabelView
  })
  afterEach(() => el.remove())

  test('[title]', () => {
    el.setAttribute('title', 'Foo')
    expect(el.innerHTML).toBe('<span>Foo</span>')
  })

  test('[system-image]', () => {
    el.setAttribute('system-image', 'smiley')
    expect(el.innerHTML).toBe('<image-view slot="icon" system-name="smiley"><i style="line-height: 1" class="ph ph-smiley"></i></image-view>')
  })

  test('[title][system-image]', () => {
    el.setAttribute('title', 'Foo')
    el.setAttribute('system-image', 'smiley')
    expect(el.innerHTML).toBe('<span>Foo</span><image-view slot="icon" system-name="smiley"><i style="line-height: 1" class="ph ph-smiley"></i></image-view>')
  })

  test('[title] w/ dirty', () => {
    el.innerHTML = '<div>Bar</div><div slot="icon">Baz</div><whatever-name></whatever-name><whatever-name slot="icon"></whatever-name>'
    el.setAttribute('title', 'Foo')
    expect(el.innerHTML).toBe('<span>Foo</span><div slot="icon">Baz</div><whatever-name></whatever-name><whatever-name slot="icon"></whatever-name>')
  })

  test('[system-image] w/ dirty', () => {
    el.innerHTML = '<div>Bar</div><div slot="icon">Baz</div><whatever-name></whatever-name><whatever-name slot="icon"></whatever-name>'
    el.setAttribute('system-image', 'smiley')
    expect(el.innerHTML).toBe(
      '<div>Bar</div><image-view system-name="smiley" slot="icon">Baz<i style="line-height: 1" class="ph ph-smiley"></i></image-view><whatever-name></whatever-name><whatever-name slot="icon"></whatever-name>'
    )
  })
})
