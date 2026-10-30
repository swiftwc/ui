import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import '../client'
import type { TabItem } from './tab-item'

beforeEach(() => document.body.replaceChildren())

describe('prop', () => {
  let el: HTMLButtonElement

  beforeEach(() => {
    document.body.insertAdjacentHTML('beforeend', '<button is="tab-item"></button>')
    el = document.body.lastElementChild as TabItem
  })
  afterEach(() => el.remove())

  test('[tabIndex]', () => {
    expect(el.tabIndex).toBe(0)
  })

  test('[ariaSelected]', () => {
    expect(el.ariaSelected).toBe('false')
  })
})
