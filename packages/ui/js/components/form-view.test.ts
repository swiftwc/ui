import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import { $ } from '../internal/utils'
import { html } from '../tpl'
import { FormView } from './form-view'
import { SidebarView } from './sidebar-view'
import { TabBar } from './tab-bar'

beforeEach(() => document.body.replaceChildren())

describe('prop', () => {
  let el: HTMLElement

  customElements.define('sidebar-view', SidebarView, { extends: SidebarView.polyfillExtends })
  customElements.define('tab-bar', TabBar, { extends: TabBar.polyfillExtends })
  customElements.define('form-view', FormView, { extends: FormView.polyfillExtends })

  beforeEach(() => {
    el = document.createElement('div')
    document.body.appendChild(el)
  })
  afterEach(() => el.remove())

  test('[method]', () => {
    const el2 = el.appendChild(
        $(
          html`<dialog is="sidebar-view">
            <form-view></form-view>
          </dialog>`,
          '>1'
        )
      ),
      headerLabel = el2.querySelector<FormView>('form-view')!

    expect(headerLabel.method).toBe('dialog')
  })
})
