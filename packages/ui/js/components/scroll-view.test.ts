import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import { ScrollView } from './scroll-view'

beforeEach(() => document.body.replaceChildren())

describe('prop', () => {
  let el: HTMLElement

  customElements.define('scroll-view', ScrollView)

  beforeEach(() => {
    el = document.createElement('scroll-view')
    document.body.appendChild(el)
  })
  afterEach(() => el.remove())

  test('[navigation-inline-title]', () => {
    el.setAttribute('navigation-inline-title', 'Foo')
    expect(el.innerHTML).toBe(
      '<v-stack spacing="0" alignment="fill" slot="top-bar-principal"><label-view line-limit="1" truncation-mode="tail" font="headline"><span>Foo</span></label-view></v-stack>'
    )
  })

  test('[navigation-inline-subtitle]', () => {
    el.setAttribute('navigation-inline-subtitle', 'Foo')
    expect(el.innerHTML).toBe(
      '<v-stack spacing="0" alignment="fill" slot="top-bar-principal"><label-view line-limit="1" truncation-mode="tail" foreground="secondary" font="callout"><span>Foo</span></label-view></v-stack>'
    )
  })

  test('[navigation-inline-title] w/ dirty', () => {
    el.innerHTML = `<div slot="top-bar-principal">\nBar</div><div slot="icon">Baz</div>\n<whatever-name></whatever-name>\n<whatever-name slot="icon"></whatever-name>`
    el.setAttribute('navigation-inline-title', 'Foo')
    expect(el.innerHTML).toBe(
      `<v-stack slot="top-bar-principal" alignment="fill" spacing="0"><label-view line-limit="1" truncation-mode="tail" font="headline"><span>Foo</span></label-view></v-stack><div slot="icon">Baz</div>\n<whatever-name></whatever-name>\n<whatever-name slot="icon"></whatever-name>`
    )
  })
})
