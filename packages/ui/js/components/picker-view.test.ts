import { beforeEach, describe, expect, test } from 'vitest'
import { PickerView } from './picker-view'

describe('prop', () => {
  let div: PickerView
  let form: HTMLFormElement

  customElements.define('picker-view', PickerView)

  beforeEach(() => {
    form = document.createElement('form')
    div = document.createElement('picker-view') as PickerView
    div.setAttribute('name', 'foo')
    form.appendChild(div)
    document.body.appendChild(form)
  })

  test('[selection]', () => {
    const data = new FormData(form) //{foo:""}

    expect(data.get('foo')).toBe('')
  })

  test('[selection]', () => {
    div.setAttribute('selection', 'bar')

    const data = new FormData(form) //{foo:"bar"}

    expect(data.get('foo')).toBe('bar')
  })

  test('[selection]', () => {
    div.selection = 'bar'

    const data = new FormData(form) //{foo:"bar"}

    expect(data.get('foo')).toBe('bar')
  })
})
