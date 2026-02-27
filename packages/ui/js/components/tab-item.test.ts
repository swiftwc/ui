import { expect, describe, test, beforeEach } from 'vitest'
import { TabItem } from './tab-item'

describe('prop', () => {
  let div: HTMLElement

  customElements.define('tab-item', TabItem, { extends: TabItem.polyfillExtends })

  beforeEach(() => {
    div = document.createElement('tab-item')
    document.body.appendChild(div)
  })

  test('[tabIndex]', () => {
    expect(div.tabIndex).toBe(0)
  })

  test('[ariaSelected]', () => {
    expect(div.ariaSelected).toBe('false')
  })
})
