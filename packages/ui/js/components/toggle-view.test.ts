import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import '../client'
import type { ToggleView } from './toggle-view'

beforeEach(() => document.body.replaceChildren())

describe('prop', () => {
  let el: ToggleView
  let form: HTMLFormElement

  beforeEach(() => {
    document.body.insertAdjacentHTML('beforeend', '<form><toggle-view name="foo"></toggle-view></form>')
    form = document.body.lastElementChild as HTMLFormElement
    el = form.firstElementChild as ToggleView
  })
  afterEach(() => el.remove())

  test('[value]', () => {
    el.setAttribute('value', 'bar')

    const data = new FormData(form) //{}

    expect(data.has('foo')).toBe(false)
  })

  test('[is-on][value]', () => {
    el.setAttribute('is-on', '')
    el.setAttribute('value', 'bar')

    const data = new FormData(form) //{foo:"bar"}

    expect(data.get('foo')).toBe('bar')
  })

  test('[is-on][value]', () => {
    el.setAttribute('is-on', '')

    const data = new FormData(form) //{foo:"on"}

    expect(data.get('foo')).toBe('on')
  })

  test('[value] multiple', () => {
    form.insertAdjacentHTML('beforeend', '<toggle-view name="foo"></toggle-view>')
    const el2 = form.lastElementChild as ToggleView

    form.insertAdjacentHTML('beforeend', '<toggle-view name="foo"></toggle-view>')
    const el3 = form.lastElementChild as ToggleView

    for (const [k, v] of Object.entries({ foo: el, bar: el2, baz: el3 })) v.setAttribute('value', k)

    for (const div of [el, el2, el3]) div.setAttribute('is-on', '')

    const data = new FormData(form) //{foo:"foo"}

    expect(data.get('foo')).toBe('foo')
    expect(data.getAll('foo')).toStrictEqual(['foo', 'bar', 'baz'])
  })
})
