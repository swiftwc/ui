import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import '../client'
import type { SidebarView } from './sidebar-view'

beforeEach(() => document.body.replaceChildren())

describe('prop', () => {
  let el: SidebarView

  beforeEach(() => {
    document.body.insertAdjacentHTML('beforeend', '<dialog is="sidebar-view"></dialog>')
    el = document.body.lastElementChild as SidebarView
  })
  afterEach(() => el.remove())

  test('.autofocus', () => {
    expect(el.autofocus).toBe(true)
  })
})
