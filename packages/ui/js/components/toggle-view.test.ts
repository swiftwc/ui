import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import { ToggleView } from './toggle-view'

beforeEach(() => document.body.replaceChildren())

describe('prop', () => {
  let el: ToggleView
  let form: HTMLFormElement

  customElements.define('toggle-view', ToggleView)

  beforeEach(() => {
    form = document.createElement('form')
    el = document.createElement('toggle-view') as ToggleView
    el.setAttribute('name', 'foo')
    form.appendChild(el)
    document.body.appendChild(form)
  })
  afterEach(() => el.remove())

  test('[value]', () => {
    el.setAttribute('value', 'bar')

    const data = new FormData(form) //{}

    expect(data.has('foo')).toBe(false)
  })

  test('[value]', () => {
    el.setAttribute('is-on', '')
    el.setAttribute('value', 'bar')

    const data = new FormData(form) //{foo:"bar"}

    expect(data.get('foo')).toBe('bar')
  })

  test('[value]', () => {
    el.setAttribute('is-on', '')

    const data = new FormData(form) //{foo:"on"}

    expect(data.get('foo')).toBe('on')
  })

  test('[value]', () => {
    let div2 = document.createElement('toggle-view') as ToggleView,
      div3 = document.createElement('toggle-view') as ToggleView
    div2.setAttribute('name', 'foo')
    div3.setAttribute('name', 'foo')

    form.appendChild(div2)
    form.appendChild(div3)

    el.setAttribute('value', 'foo')
    div2.setAttribute('value', 'bar')
    div3.setAttribute('value', 'baz')

    el.setAttribute('is-on', '')
    div2.setAttribute('is-on', '')
    div3.setAttribute('is-on', '')

    const data = new FormData(form) //{foo:"foo"}

    expect(data.get('foo')).toBe('foo')
    expect(data.getAll('foo')).toStrictEqual(['foo', 'bar', 'baz'])
  })
})
