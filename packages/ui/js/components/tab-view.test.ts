import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import '../client'
import type { TabView } from './tab-view'

beforeEach(() => document.body.replaceChildren())

describe('prop', () => {
  let el: TabView

  beforeEach(() => {
    document.body.insertAdjacentHTML('beforeend', '<tab-view></tab-view>')
    el = document.body.lastElementChild as TabView
  })
  afterEach(() => el.remove())

  test('moreTab', async () => {
    for (const [i, id] of ['home', 'search', 'more'].entries())
      el.insertAdjacentElement('beforeend', Object.assign(document.createElement('navigation-stack'), { id, innerHTML: '<scroll-view></scroll-view>', hidden: i }))

    for (const [i, id] of ['a', 'b', 'c'].entries())
      document.querySelector('#more')?.insertAdjacentElement('beforeend', Object.assign(document.createElement('navigation-stack'), { id, innerHTML: '<scroll-view></scroll-view>', hidden: i }))

    el.insertAdjacentHTML('beforeend', '<dialog is="tab-bar"></dialog>')
    const tb = el.firstElementChild as HTMLDialogElement

    for (const value of ['home', 'search', 'a', 'b', 'c'])
      tb.insertAdjacentElement('beforeend', Object.assign(document.createElement('button', { is: 'tab-item' }), { value, innerHTML: `<label-view title="${value}"></label-view>` }))

    // await new Promise<void>((r) => queueMicrotask(r))

    // document.querySelector<HTMLButtonElement>('#a > scroll-view')?.style.setProperty('--face', 'red')
    // const btn = document.querySelector<HTMLButtonElement>('[value="a"]')
    // TabItem.polyfillConnectedCallback(btn as TabItem)
    // document.querySelector<HTMLButtonElement>('[value="a"]')?.click()

    // await new Promise<void>((r) => queueMicrotask(r))

    await expect.poll(() => el.moreTab?.id).toBe('more')
  })
})
