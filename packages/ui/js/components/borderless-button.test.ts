import { beforeEach, describe, expect, test } from 'vitest'
import '../client'
import { BorderlessButton } from './borderless-button'

describe('prop', () => {
  let div: HTMLElement

  beforeEach(() => {
    div = document.createElement('button', { is: 'borderless-button' })
    document.body.appendChild(div)
  })

  test('[tabIndex]', () => {
    expect(div.tabIndex).toBe(0)
  })

  test('[role]', async () => {
    BorderlessButton.polyfillConnectedCallback(div as BorderlessButton)
    div.setAttribute('role', 'cancel')
    BorderlessButton.polyfillAttributeChangedCallback([{ attributeName: 'role', target: div, oldValue: null }])
    await new Promise<void>((r) => queueMicrotask(r))
    expect(div.outerHTML).toBe('<button is="borderless-button" tabindex="0" role="cancel"><label-view slot="placeholder"><span>Cancel</span></label-view></button>')
  })
})
