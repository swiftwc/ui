import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import '../client'
import { GlassButton } from './glass-button'

beforeEach(() => document.body.replaceChildren())

describe('prop', () => {
  let el: HTMLElement

  beforeEach(() => {
    el = document.createElement('button', { is: 'glass-button' })
    document.body.appendChild(el)
  })
  afterEach(() => el.remove())

  test('[tabIndex]', () => {
    expect(el.tabIndex).toBe(0)
  })

  test('[role]', async () => {
    GlassButton.polyfillConnectedCallback(el as GlassButton)
    el.setAttribute('role', 'cancel')
    GlassButton.polyfillAttributeChangedCallback([{ attributeName: 'role', target: el, oldValue: null }])
    await new Promise<void>((r) => queueMicrotask(r))
    expect(el.outerHTML).toBe('<button is="glass-button" tabindex="0" role="cancel"><label-view slot="placeholder"><span>Cancel</span></label-view></button>')
  })
})
