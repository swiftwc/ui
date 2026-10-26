import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import { TabItem } from './tab-item'

beforeEach(() => document.body.replaceChildren())

describe('prop', () => {
  let el: HTMLButtonElement

  customElements.define('tab-item', TabItem, { extends: TabItem.polyfillExtends })

  beforeEach(() => {
    el = document.createElement('button', { is: 'tab-item' })
    document.body.appendChild(el)
    TabItem.polyfillConnectedCallback(el as TabItem)
  })
  afterEach(() => el.remove())

  test('[tabIndex]', () => {
    expect(el.tabIndex).toBe(0)
  })

  test('[ariaSelected]', () => {
    expect(el.ariaSelected).toBe('false')
  })
})
