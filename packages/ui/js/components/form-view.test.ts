import { expect, describe, test, beforeEach } from 'vitest'
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
        Object.assign(document.createElement('template'), {
          innerHTML: `<dialog is="sidebar-view">
        <form-view></form-view>
        </dialog>`,
        }).content.firstElementChild!
      ),
      headerLabel = el.querySelector<FormView>('form-view')!

    expect(headerLabel.method).toBe('dialog')
  })
})
