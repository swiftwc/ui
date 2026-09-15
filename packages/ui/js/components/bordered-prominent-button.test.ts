import { beforeEach, describe, expect, test } from 'vitest'
import '../client'
import { BorderedProminentButton } from './bordered-prominent-button'

describe('prop', () => {
  let div: HTMLElement

  beforeEach(() => {
    div = document.createElement('button', { is: 'bordered-prominent-button' })
    document.body.appendChild(div)
  })

  test('[tabIndex]', () => {
    expect(div.tabIndex).toBe(0)
  })

  test('[role]', async () => {
    BorderedProminentButton.polyfillConnectedCallback(div as BorderedProminentButton)
    div.setAttribute('role', 'cancel')
    BorderedProminentButton.polyfillAttributeChangedCallback([{ attributeName: 'role', target: div, oldValue: null }])
    await new Promise<void>((r) => queueMicrotask(r))
    expect(div.outerHTML).toBe('<button is="bordered-prominent-button" tabindex="0" role="cancel"><label-view slot="placeholder"><span>Cancel</span></label-view></button>')
  })
})
