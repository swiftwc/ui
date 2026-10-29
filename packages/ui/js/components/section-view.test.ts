import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import '../client'
import type { SectionView } from './section-view'

beforeEach(() => document.body.replaceChildren())

describe('prop', () => {
  let el: SectionView

  beforeEach(() => {
    document.body.insertAdjacentHTML('beforeend', '<section-view></section-view>')
    el = document.body.lastElementChild as SectionView
  })
  afterEach(() => el.remove())

  test('[header]', () => {
    el.setAttribute('header', 'Foo')
    expect(el.innerHTML).toBe(`<header slot="header"><label-view line-limit="1" truncation-mode="tail" font="callout"><span>Foo</span></label-view></header>`)
  })

  test('[footer]', () => {
    el.setAttribute('footer', 'Foo')
    expect(el.innerHTML).toBe(`<footer slot="footer"><label-view line-limit="1" truncation-mode="tail" font="callout"><span>Foo</span></label-view></footer>`)
  })
})
