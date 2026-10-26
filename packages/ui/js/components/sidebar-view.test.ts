import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import '../client'
import { SidebarView } from './sidebar-view'

beforeEach(() => document.body.replaceChildren())

describe('prop', () => {
  let el: HTMLDialogElement

  beforeEach(() => {
    el = document.createElement('dialog', { is: 'sidebar-view' })
    document.body.appendChild(el)
    SidebarView.polyfillConnectedCallback(el as SidebarView)
  })
  afterEach(() => el.remove())

  test('.autofocus', () => {
    expect(el.autofocus).toBe(true)
  })
})
