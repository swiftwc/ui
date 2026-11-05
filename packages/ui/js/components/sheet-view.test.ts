import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import '../client/index.ts'
import type { SheetView } from './sheet-view.ts'

beforeEach(() => document.body.replaceChildren())

describe('prop', () => {
  let el: SheetView

  beforeEach(() => {
    document.body.insertAdjacentHTML('beforeend', '<dialog is="sheet-view"></dialog>')
    el = document.body.lastElementChild as SheetView
  })
  afterEach(() => el.remove())

  test('.autofocus', () => {
    expect(el.autofocus).toBe(true)
  })
})
