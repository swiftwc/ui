import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import '../client'

beforeEach(() => document.body.replaceChildren())

describe('prop', () => {
  let el: HTMLButtonElement

  beforeEach(() => {
    document.body.insertAdjacentHTML('beforeend', '<button is="borderless-button"></button>')
    el = document.body.lastElementChild as HTMLButtonElement
  })
  afterEach(() => el.remove())

  test('[tabIndex]', () => {
    expect(el.tabIndex).toBe(0)
  })

  test('[role]', async () => {
    el.setAttribute('role', 'cancel')

    await expect.poll(() => el.outerHTML).toBe('<button is="borderless-button" tabindex="0" role="cancel"><label-view slot="placeholder"><span>Cancel</span></label-view></button>')
  })
})
