import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import { NavigationTitle } from './navigation-title'

beforeEach(() => document.body.replaceChildren())

describe('prop', () => {
  let el: HTMLElement

  customElements.define('navigation-title', NavigationTitle)

  beforeEach(() => {
    el = document.createElement('navigation-title')
    document.body.appendChild(el)
  })
  afterEach(() => el.remove())

  test('[value]', () => {
    el.setAttribute('value', 'Foo')
    expect(el.innerHTML).toBe(
      `<navigation-large-title><v-stack alignment="fill"><v-stack spacing="0" alignment="fill"><label-view line-limit="1" truncation-mode="tail" font="headline"><span>Foo</span></label-view></v-stack></v-stack></navigation-large-title>`
    )
  })

  // test('[navigation-inline-subtitle]', () => {
  //   div.setAttribute('navigation-inline-subtitle', 'Foo')
  //   expect(div.innerHTML).toBe(
  //     '<v-stack spacing="0" alignment="fill" slot="top-bar-principal"><label-view line-limit="1" truncation-mode="tail" foreground="secondary" font="callout"><span>Foo</span></label-view></v-stack>'
  //   )
  // })

  test('[value] w/ dirty', () => {
    el.innerHTML = `<div>\nBar</div><div slot="icon">Baz</div>\n<whatever-name></whatever-name>\n<whatever-name slot="icon"></whatever-name>`
    el.setAttribute('value', 'Foo')
    expect(el.innerHTML).toBe(
      `<navigation-large-title><v-stack alignment="fill"><v-stack spacing="0" alignment="fill"><label-view line-limit="1" truncation-mode="tail" font="headline"><span>Foo</span></label-view></v-stack></v-stack></navigation-large-title><div slot="icon">Baz</div>\n<whatever-name></whatever-name>\n<whatever-name slot="icon"></whatever-name>`
    )
  })
})
