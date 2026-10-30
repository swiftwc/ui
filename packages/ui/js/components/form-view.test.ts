import { beforeEach, describe, expect, test } from 'vitest'
import '../client'
import type { FormView } from './form-view'

beforeEach(() => document.body.replaceChildren())

describe('prop', () => {
  let el: HTMLElement

  beforeEach(() => {
    // document.body.insertAdjacentHTML('beforeend', '<div></div>')
    // el = document.body.lastElementChild as HTMLElement
  })
  // afterEach(() => el.remove())

  test('[method]', () => {
    document.body.insertAdjacentHTML('beforeend', '<dialog is="sidebar-view"><form is="form-view"></form></dialog>')

    const form = document.body.querySelector<FormView>('form')

    expect(form?.method).toBe('dialog')
  })
})
