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

    expect(form?.getAttribute('method')).toBe('dialog')
  })

  test('[novalidate]', () => {
    document.body.insertAdjacentHTML('beforeend', '<dialog is="sidebar-view"><form is="form-view"></form></dialog>')

    const form = document.body.querySelector<FormView>('form')

    expect(form?.hasAttribute('novalidate')).toBe(true)
  })

  test('.method', () => {
    document.body.insertAdjacentHTML('beforeend', '<dialog is="sidebar-view"><form is="form-view"></form></dialog>')

    const form = document.body.querySelector<FormView>('form')

    expect(form?.method).toBe('dialog')
  })

  test('.noValidate', () => {
    document.body.insertAdjacentHTML('beforeend', '<dialog is="sidebar-view"><form is="form-view"></form></dialog>')

    const form = document.body.querySelector<FormView>('form')

    expect(form?.noValidate).toBe(true)
  })
})
