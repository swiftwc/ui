import { beforeEach, describe, expect, test } from 'vitest'
import '../client'
import { GlassButton } from './glass-button'

describe('prop', () => {
  let div: HTMLElement

  beforeEach(() => {
    div = document.createElement('button', { is: 'glass-button' })
    document.body.appendChild(div)
  })

  test('[tabIndex]', () => {
    expect(div.tabIndex).toBe(0)
  })

  test('[role]', async () => {
    GlassButton.polyfillConnectedCallback(div as GlassButton)
    div.setAttribute('role', 'cancel')
    GlassButton.polyfillAttributeChangedCallback([{ attributeName: 'role', target: div, oldValue: null }])
    await new Promise<void>((r) => queueMicrotask(r))
    expect(div.outerHTML).toBe('<button is="glass-button" tabindex="0" role="cancel"><label-view slot="placeholder"><span>Cancel</span></label-view></button>')
  })
})
