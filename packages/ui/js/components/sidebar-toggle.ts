import { type TabBar } from './tab-bar'
import { type SidebarView } from './sidebar-view'
import { debounce } from '../internal/utils'
import { Snapshot } from '../snapshot'

export class SidebarToggle extends HTMLElement {
  #ro
  // #io

  constructor() {
    super()

    this.#ro = new ResizeObserver(
      debounce(this.#handleMeasure.bind(this), 100, true)
    )

    // this.#io = new IntersectionObserver((entries) => {
    //   this._checkVisibility2(entries)
    // })
  }

  connectedCallback() {
    console.debug(`${SidebarToggle.name} ⚡️ connect`)

    this.addEventListener('click', this.#handleClick)

    const entry = {
      target: this,
    }

    Snapshot.waitReady.then(() => {
      this.#ro?.observe(this)
      // this.#io.observe(this)

      // @ts-expect-error
      this.#handleMeasure([entry])
    })
  }

  disconnectedCallback() {
    console.debug(`${SidebarToggle.name} ⚡️ disconnect`)

    this.#ro?.disconnect()
    // this.#io.disconnect()

    this.removeEventListener('click', this.#handleClick)
  }

  // This triggers on show/hide of any of sidebar-toggle elements
  #handleMeasure(entries: ResizeObserverEntry[] = []) {
    console.debug(`${SidebarToggle.name} ⚡️ measure (${entries.length})`)

    // set/remove css var/prop to parent based on shown/hidden
    for (const { target } of entries) {
      const tv = target.parentElement,
        width = (target as HTMLElement)?.offsetWidth ?? 0

      // const gapProp =
      //     getComputedStyle(tg).getPropertyValue('--toolbar-col-gap') || '0',
      //   gap = parseFloat(gapProp) * 1 //(gapProp.endsWith('rem')? parseFloat(getComputedStyle(document.documentElement).fontSize): 1)
      if (0 < width)
        tv?.style?.setProperty?.(
          Snapshot.config!['sidebar-toggle-padding-inline-start-css-prop'],
          `${width}px`
        )
      else
        tv?.style?.removeProperty?.(
          Snapshot.config!['sidebar-toggle-padding-inline-start-css-prop']
        )
    }

    // auto close IF open
    for (const { target } of entries) {
      const lm = target.closest('navigation-split-view,tab-view')

      switch (lm?.tagName) {
        case 'NAVIGATION-SPLIT-VIEW':
          const sideBar =
            target.parentElement?.querySelector<HTMLDialogElement>(
              ':scope > dialog[is=sidebar-view]'
            )

          if (!sideBar?.open) continue

          if (
            0 < (target as HTMLElement).offsetWidth &&
            0 < (target as HTMLElement).offsetHeight
          )
            continue

          sideBar?.close?.()

          break
        case 'TAB-VIEW':
          const tabBar = lm.querySelector<HTMLDialogElement>(
            ':scope > dialog[is=tab-bar]'
          )

          if (!tabBar?.open) continue

          // scan all toggles for anyone that is visible, sign that sidebar should stay open
          if (
            [
              ...lm.querySelectorAll<HTMLElement>(
                ':scope > sidebar-toggle,:scope > dialog[is=tab-bar] > sidebar-toggle'
              ),
            ].some(
              ({ offsetWidth, offsetHeight }) =>
                0 < offsetWidth && 0 < offsetHeight
            )
          )
            continue

          tabBar?.close?.()

          break
      }
    }
  }

  // _checkVisibility2(entries) {
  //   entries.forEach((entry) => {
  //     console.log('Visible in viewport?', entry.isIntersecting)
  //   })
  // }

  #handleClick(event: Event) {
    const target = event.target as HTMLElement

    if (!target?.closest('button')) return

    const lm = target?.closest('tab-view,navigation-split-view')

    const dialog =
      'TAB-VIEW' === lm?.tagName
        ? lm.querySelector<TabBar>('dialog[is="tab-bar"]')
        : lm?.querySelector<SidebarView>('dialog[is="sidebar-view"]')

    if (!dialog?.open) dialog?.showModal()
    else dialog.close()
  }
}
