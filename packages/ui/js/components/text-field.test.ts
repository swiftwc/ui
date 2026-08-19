import { beforeEach, describe, expect, test } from 'vitest'
import { TextField } from './text-field'

describe('prop', () => {
  let div: TextField

  customElements.define('text-field', TextField)

  beforeEach(() => {
    div = document.createElement('text-field')
    document.body.appendChild(div)
  })

  test('[value]', () => {
    expect(div.value).toBe('')
  })

  test('[valueAsNumber]', () => {
    expect(div.valueAsNumber).toBe('')
  })
})
