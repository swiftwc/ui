import { beforeEach, describe, expect, test } from 'vitest'
import '../client'
import { GlassProminentButton } from './glass-prominent-button'

describe('prop', () => {
  let div: HTMLElement

  beforeEach(() => {
    div = document.createElement('button', { is: 'glass-prominent-button' })
    document.body.appendChild(div)
  })

  test('[tabIndex]', () => {
    expect(div.tabIndex).toBe(0)
  })

  test('[role]', async () => {
    GlassProminentButton.polyfillConnectedCallback(div as GlassProminentButton)
    div.setAttribute('role', 'cancel')
    GlassProminentButton.polyfillAttributeChangedCallback([{ attributeName: 'role', target: div, oldValue: null }])
    await new Promise<void>((r) => queueMicrotask(r))
    expect(div.outerHTML).toBe('<button is="glass-prominent-button" tabindex="0" role="cancel"><label-view slot="placeholder"><span>Cancel</span></label-view></button>')
  })
})
