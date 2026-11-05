import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import '../client/index.ts'
import type { TextField } from './text-field.ts'

beforeEach(() => document.body.replaceChildren())

describe('<text-field/>', () => {
  let el: TextField

  beforeEach(() => {
    document.body.insertAdjacentHTML('beforeend', '<text-field></text-field>')
    el = document.body.lastElementChild as TextField
  })
  afterEach(() => el.remove())

  test('[value]', () => {
    expect(el.value).toBe('')
  })

  test('[valueAsNumber]', () => {
    expect(el.valueAsNumber).toBe('')
  })
})
