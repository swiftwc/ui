import { beforeEach, describe, expect, test } from 'vitest'
import { LabelView } from './label-view'

describe('prop', () => {
  let div: HTMLElement

  customElements.define('label-view', LabelView)

  beforeEach(() => {
    div = document.createElement('label-view')
    document.body.appendChild(div)
  })

  test('[title]', () => {
    div.setAttribute('title', 'Foo')
    expect(div.innerHTML).toBe('<span>Foo</span>')
  })

  test('[system-image]', () => {
    div.setAttribute('system-image', 'smiley')
    expect(div.innerHTML).toBe('<image-view slot="icon" system-name="smiley"></image-view>')
  })

  test('[title][system-image]', () => {
    div.setAttribute('title', 'Foo')
    div.setAttribute('system-image', 'smiley')
    expect(div.innerHTML).toBe('<span>Foo</span><image-view slot="icon" system-name="smiley"></image-view>')
  })

  test('[title] w/ dirty', () => {
    div.innerHTML = '<div>Bar</div><div slot="icon">Baz</div><whatever-name></whatever-name><whatever-name slot="icon"></whatever-name>'
    div.setAttribute('title', 'Foo')
    expect(div.innerHTML).toBe('<span>Foo</span><div slot="icon">Baz</div><whatever-name></whatever-name><whatever-name slot="icon"></whatever-name>')
  })

  test('[system-image] w/ dirty', () => {
    div.innerHTML = '<div>Bar</div><div slot="icon">Baz</div><whatever-name></whatever-name><whatever-name slot="icon"></whatever-name>'
    div.setAttribute('system-image', 'smiley')
    expect(div.innerHTML).toBe('<div>Bar</div><image-view system-name="smiley" slot="icon"></image-view><whatever-name></whatever-name><whatever-name slot="icon"></whatever-name>')
  })
})
