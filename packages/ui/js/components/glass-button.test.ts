import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import '../client'
import { GlassButton } from './glass-button'

beforeEach(() => document.body.replaceChildren())

describe('prop', () => {
  let el: HTMLButtonElement

  beforeEach(() => {
    document.body.insertAdjacentHTML('beforeend', '<button is="glass-button"></button>')
    el = document.body.lastElementChild as HTMLButtonElement
    GlassButton.polyfillConnectedCallback(el as GlassButton)
  })
  afterEach(() => el.remove())

  test('[tabIndex]', () => {
    expect(el.tabIndex).toBe(0)
  })

  test('[role]', async () => {
    el.setAttribute('role', 'cancel')

    await expect.poll(() => el.outerHTML).toBe('<button is="glass-button" tabindex="0" role="cancel"><label-view slot="placeholder"><span>Cancel</span></label-view></button>')
  })
})
