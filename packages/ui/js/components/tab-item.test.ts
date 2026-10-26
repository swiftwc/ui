import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import { TabItem } from './tab-item'

beforeEach(() => document.body.replaceChildren())

describe('prop', () => {
  let el: HTMLElement

  customElements.define('tab-item', TabItem, { extends: TabItem.polyfillExtends })

  beforeEach(() => {
    el = document.createElement('tab-item')
    document.body.appendChild(el)
  })
  afterEach(() => el.remove())

  test('[tabIndex]', () => {
    expect(el.tabIndex).toBe(0)
  })

  test('[ariaSelected]', () => {
    expect(el.ariaSelected).toBe('false')
  })
})
