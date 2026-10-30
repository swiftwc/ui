import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import '../client'

beforeEach(() => document.body.replaceChildren())

describe('prop', () => {
  let el: HTMLButtonElement

  beforeEach(() => {
    document.body.insertAdjacentHTML('beforeend', '<button is="glass-prominent-button"></button>')
    el = document.body.lastElementChild as HTMLButtonElement
  })
  afterEach(() => el.remove())

  test('[tabIndex]', () => {
    expect(el.tabIndex).toBe(0)
  })

  test('[role]', async () => {
    el.setAttribute('role', 'cancel')

    await expect.poll(() => el.outerHTML).toBe('<button is="glass-prominent-button" tabindex="0" role="cancel"><label-view slot="placeholder"><image-view slot="icon" system-name="x"><i style="line-height: 1" class="ph ph-x"></i></image-view><span>Cancel</span></label-view></button>')
  })
})
