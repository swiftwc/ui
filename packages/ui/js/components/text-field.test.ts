import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import '../client'
import type { TextField } from './text-field'

beforeEach(() => document.body.replaceChildren())

describe('<text-field/>', () => {
  let el: TextField

  beforeEach(() => {
    el = document.createElement('text-field')
    document.body.appendChild(el)
  })
  afterEach(() => el.remove())

  test('[value]', () => {
    expect(el.value).toBe('')
  })

  test('[valueAsNumber]', () => {
    expect(el.valueAsNumber).toBe('')
  })
})
