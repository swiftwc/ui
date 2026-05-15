import { beforeEach, describe, expect, test } from 'vitest'
import { $ } from '../internal/utils'
import { FormView } from './form-view'
import { SidebarView } from './sidebar-view'
import { TabBar } from './tab-bar'

describe('prop', () => {
  let div: HTMLElement

  customElements.define('sidebar-view', SidebarView, { extends: SidebarView.polyfillExtends })
  customElements.define('tab-bar', TabBar, { extends: TabBar.polyfillExtends })
  customElements.define('form-view', FormView, { extends: FormView.polyfillExtends })

  beforeEach(() => {
    div = document.createElement('div')
    document.body.appendChild(div)
  })

  test('[method]', () => {
    const el = div.appendChild(
        $(
          `<dialog is="sidebar-view">
        <form-view></form-view>
        </dialog>`,
          '>1'
        )
      ),
      headerLabel = el.querySelector<FormView>('form-view')!

    expect(headerLabel.method).toBe('dialog')
  })
})
