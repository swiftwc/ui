import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import '../client'
import { BorderlessButton } from './borderless-button'

beforeEach(() => document.body.replaceChildren())

describe('prop', () => {
  let el: HTMLElement

  beforeEach(() => {
    el = document.createElement('button', { is: 'borderless-button' })
    document.body.appendChild(el)
  })
  afterEach(() => el.remove())

  test('[tabIndex]', () => {
    expect(el.tabIndex).toBe(0)
  })

  test('[role]', async () => {
    BorderlessButton.polyfillConnectedCallback(el as BorderlessButton)
    el.setAttribute('role', 'cancel')
    BorderlessButton.polyfillAttributeChangedCallback([{ attributeName: 'role', target: el, oldValue: null }])
    await new Promise<void>((r) => queueMicrotask(r))
    expect(el.outerHTML).toBe('<button is="borderless-button" tabindex="0" role="cancel"><label-view slot="placeholder"><span>Cancel</span></label-view></button>')
  })
})
