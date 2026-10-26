import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import '../client'
import { SheetView } from './sheet-view'

beforeEach(() => document.body.replaceChildren())

describe('prop', () => {
  let el: HTMLDialogElement

  beforeEach(() => {
    el = document.createElement('dialog', { is: 'sheet-view' })
    document.body.appendChild(el)
    SheetView.polyfillConnectedCallback(el as SheetView)
  })
  afterEach(() => el.remove())

  test('.autofocus', () => {
    expect(el.autofocus).toBe(true)
  })
})
