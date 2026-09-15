import { beforeEach, describe, expect, test } from 'vitest'
import '../client'
import { BorderedButton } from './bordered-button'

describe('prop', () => {
  let div: HTMLElement

  beforeEach(() => {
    div = document.createElement('button', { is: 'bordered-button' })
    document.body.appendChild(div)
  })

  test('[tabIndex]', () => {
    expect(div.tabIndex).toBe(0)
  })

  test('[role]', async () => {
    BorderedButton.polyfillConnectedCallback(div as BorderedButton)
    div.setAttribute('role', 'cancel')
    BorderedButton.polyfillAttributeChangedCallback([{ attributeName: 'role', target: div, oldValue: null }])
    await new Promise<void>((r) => queueMicrotask(r))
    expect(div.outerHTML).toBe('<button is="bordered-button" tabindex="0" role="cancel"><label-view slot="placeholder"><span>Cancel</span></label-view></button>')
  })
})
