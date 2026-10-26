import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import '../client'
import { TabView } from './tab-view'

beforeEach(() => document.body.replaceChildren())

describe('prop', () => {
  let el: TabView

  beforeEach(() => {
    el = document.createElement('tab-view')
    document.body.appendChild(el)
  })
  afterEach(() => el.remove())

  test('moreTab', async () => {
    for (const [i, id] of ['home', 'search', 'more'].entries()) el.appendChild(Object.assign(document.createElement('navigation-stack'), { id, innerHTML: '<scroll-view></scroll-view>', hidden: i }))

    for (const [i, id] of ['a', 'b', 'c'].entries())
      document.querySelector('#more')?.appendChild(Object.assign(document.createElement('navigation-stack'), { id, innerHTML: '<scroll-view></scroll-view>', hidden: i }))

    const tb = document.createElement('dialog', { is: 'tab-bar' })

    el.appendChild(tb)

    for (const value of ['home', 'search', 'a', 'b', 'c'])
      tb.appendChild(Object.assign(document.createElement('button', { is: 'tab-item' }), { value, innerHTML: `<label-view title="${value}"></label-view>` }))

    await new Promise<void>((r) => queueMicrotask(r))

    // document.querySelector<HTMLButtonElement>('#a > scroll-view')?.style.setProperty('--face', 'red')
    // const btn = document.querySelector<HTMLButtonElement>('[value="a"]')
    // TabItem.polyfillConnectedCallback(btn as TabItem)
    // document.querySelector<HTMLButtonElement>('[value="a"]')?.click()

    // await new Promise<void>((r) => queueMicrotask(r))

    expect(el.moreTab?.id).toBe('more')
  })
})
