import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import { page } from 'vitest/browser'
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

  test('.moreTab', async () => {
    for (const [i, id] of ['foo', 'bar', 'baz', 'qux', 'quux', 'corge', 'grault', 'garply', 'waldo', 'fred'].entries())
      el.insertAdjacentHTML('beforeend', `<navigation-stack id="${id}"${i ? ' hidden' : ''}><scroll-view></scroll-view></navigation-stack>`)

    for (const [i, id] of ['plugh', 'xyzzy', 'thud'].entries())
      document.querySelector('#fred')?.insertAdjacentHTML('beforeend', `<navigation-stack id="${id}"${i ? ' hidden' : ''}><scroll-view></scroll-view></navigation-stack>`)

    el.insertAdjacentHTML('beforeend', '<dialog is="tab-bar"></dialog>')
    const tb = el.lastElementChild as HTMLDialogElement

    for (const value of ['foo', 'bar', 'baz', 'qux', 'quux', 'corge', 'grault', 'garply', 'waldo', 'fred'])
      tb.insertAdjacentHTML('beforeend', `<button is="tab-item" value="${value}"><label-view title="${value}"></label-view></button>`)

    await expect.poll(() => el.moreTab?.id).toBe('fred')
  })

  test('(--face)', async () => {
    for (const [i, id] of ['foo', 'bar', 'baz', 'qux', 'quux', 'corge', 'grault', 'garply', 'waldo', 'fred'].entries())
      el.insertAdjacentHTML('beforeend', `<navigation-stack id="${id}"${i ? ' hidden' : ''}><scroll-view></scroll-view></navigation-stack>`)

    for (const [i, id] of ['plugh', 'xyzzy', 'thud'].entries())
      document.querySelector('#fred')?.insertAdjacentHTML('beforeend', `<navigation-stack id="${id}"${i ? ' hidden' : ''}><scroll-view></scroll-view></navigation-stack>`)

    el.insertAdjacentHTML('beforeend', '<dialog is="tab-bar"></dialog>')
    const tb = el.lastElementChild as HTMLDialogElement

    for (const value of ['foo', 'bar', 'baz', 'qux', 'quux', 'corge', 'grault', 'garply', 'waldo', 'fred'])
      tb.insertAdjacentHTML('beforeend', `<button is="tab-item" value="${value}"><label-view title="${value}"></label-view></button>`)

    document.querySelector<HTMLElement>('#baz > scroll-view')?.style.setProperty('--face', 'red')

    await page.getByRole('button', { name: 'baz' }).click({ force: true }) // await userEvent.click(document.querySelector<HTMLElement>('[value="baz"]')!)

    await expect.poll(() => getComputedStyle(document.body).getPropertyValue('--face')).toBe('oklch(1 0 0)')
  })
})
