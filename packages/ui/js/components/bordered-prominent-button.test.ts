import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import '../client'
import { BorderedProminentButton } from './bordered-prominent-button'

beforeEach(() => document.body.replaceChildren())

describe('prop', () => {
  let el: HTMLElement

  beforeEach(() => {
    el = document.createElement('button', { is: 'bordered-prominent-button' })
    document.body.appendChild(el)
  })
  afterEach(() => el.remove())

  test('[tabIndex]', () => {
    expect(el.tabIndex).toBe(0)
  })

  test('[role]', async () => {
    BorderedProminentButton.polyfillConnectedCallback(el as BorderedProminentButton)
    el.setAttribute('role', 'cancel')
    BorderedProminentButton.polyfillAttributeChangedCallback([{ attributeName: 'role', target: el, oldValue: null }])
    await new Promise<void>((r) => queueMicrotask(r))
    expect(el.outerHTML).toBe('<button is="bordered-prominent-button" tabindex="0" role="cancel"><label-view slot="placeholder"><span>Cancel</span></label-view></button>')
  })
})
