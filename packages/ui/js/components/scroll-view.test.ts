import { beforeEach, describe, expect, test } from 'vitest'
import { ScrollView } from './scroll-view'

describe('prop', () => {
  let div: HTMLElement

  customElements.define('scroll-view', ScrollView)

  beforeEach(() => {
    div = document.createElement('scroll-view')
    document.body.appendChild(div)
  })

  test('[navigation-inline-title]', () => {
    div.setAttribute('navigation-inline-title', 'Foo')
    expect(div.innerHTML).toBe(
      '<v-stack spacing="0" alignment="fill" slot="top-bar-principal"><label-view line-limit="1" truncation-mode="tail" font="headline"><span>Foo</span></label-view></v-stack>'
    )
  })

  test('[navigation-inline-subtitle]', () => {
    div.setAttribute('navigation-inline-subtitle', 'Foo')
    expect(div.innerHTML).toBe(
      '<v-stack spacing="0" alignment="fill" slot="top-bar-principal"><label-view line-limit="1" truncation-mode="tail" foreground="secondary" font="callout"><span>Foo</span></label-view></v-stack>'
    )
  })

  test('[navigation-inline-title] w/ dirty', () => {
    div.innerHTML = `<div slot="top-bar-principal">\nBar</div><div slot="icon">Baz</div>\n<whatever-name></whatever-name>\n<whatever-name slot="icon"></whatever-name>`
    div.setAttribute('navigation-inline-title', 'Foo')
    expect(div.innerHTML).toBe(
      `<v-stack slot="top-bar-principal" alignment="fill" spacing="0"><label-view line-limit="1" truncation-mode="tail" font="headline"><span>Foo</span></label-view></v-stack><div slot="icon">Baz</div>\n<whatever-name></whatever-name>\n<whatever-name slot="icon"></whatever-name>`
    )
  })
})
