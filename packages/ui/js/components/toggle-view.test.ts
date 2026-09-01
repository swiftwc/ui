import { beforeEach, describe, expect, test } from 'vitest'
import { ToggleView } from './toggle-view'

describe('prop', () => {
  let div: ToggleView
  let form: HTMLFormElement

  customElements.define('toggle-view', ToggleView)

  beforeEach(() => {
    form = document.createElement('form')
    div = document.createElement('toggle-view') as ToggleView
    div.setAttribute('name', 'foo')
    form.appendChild(div)
    document.body.appendChild(form)
  })

  test('[value]', () => {
    div.setAttribute('value', 'bar')

    const data = new FormData(form) //{}

    expect(data.has('foo')).toBe(false)
  })

  test('[value]', () => {
    div.setAttribute('is-on', '')
    div.setAttribute('value', 'bar')

    const data = new FormData(form) //{foo:"bar"}

    expect(data.get('foo')).toBe('bar')
  })

  test('[value]', () => {
    div.setAttribute('is-on', '')

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

    div.setAttribute('value', 'foo')
    div2.setAttribute('value', 'bar')
    div3.setAttribute('value', 'baz')

    div.setAttribute('is-on', '')
    div2.setAttribute('is-on', '')
    div3.setAttribute('is-on', '')

    const data = new FormData(form) //{foo:"foo"}

    expect(data.get('foo')).toBe('foo')
    expect(data.getAll('foo')).toStrictEqual(['foo', 'bar', 'baz'])
  })
})
