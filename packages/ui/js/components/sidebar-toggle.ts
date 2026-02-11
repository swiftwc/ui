import { type TabBar } from './tab-bar'
import { type SidebarView } from './sidebar-view'
import { debounce } from '../internal/utils'
import { Snapshot } from '../snapshot'
import { ResizeObserverSingleton } from '../internal/resize-observer'

const observers = new ResizeObserverSingleton()

export class SidebarToggle extends HTMLElement {
  // #ro
  // #io

  constructor() {
    super()

    // this.#ro = new ResizeObserver(
    //   debounce(this.#handleMeasure.bind(this), 100, true)
    // )

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
      observers.observe(this, debounce(SidebarToggle.#handleMeasure, 100, true)) //this.#ro?.observe(this)
      // this.#io.observe(this)

      // @ts-expect-error
      SidebarToggle.#handleMeasure([entry])
    })
  }

  disconnectedCallback() {
    console.debug(`${SidebarToggle.name} ⚡️ disconnect`)

    observers.unobserve(this) //this.#ro?.disconnect()
    // this.#io.disconnect()

    this.removeEventListener('click', this.#handleClick)
  }

  private static query(target?: HTMLElement) {
    const container = target?.closest('navigation-split-view,tab-view'),
      sideBar = container?.querySelector<HTMLDialogElement>(':scope > dialog[is=sidebar-view]')

    return { container, sideBar }
  }

  // This triggers on show/hide of any of sidebar-toggle elements
  static #handleMeasure(entry?: ResizeObserverEntry) {
    console.debug(`${SidebarToggle.name} ⚡️ measure`)

    const target = entry?.target

    // set/remove css var/prop to parent based on shown/hidden
    // for (const { target } of entries) {

    const tv = target?.parentElement,
      width = (target as HTMLElement)?.offsetWidth ?? 0

    // const gapProp =
    //     getComputedStyle(tg).getPropertyValue('--toolbar-col-gap') || '0',
    //   gap = parseFloat(gapProp) * 1 //(gapProp.endsWith('rem')? parseFloat(getComputedStyle(document.documentElement).fontSize): 1)
    if (0 < width) tv?.style?.setProperty?.(Snapshot.config!['sidebar-toggle-padding-inline-start-css-prop'], `${width}px`)
    else tv?.style?.removeProperty?.(Snapshot.config!['sidebar-toggle-padding-inline-start-css-prop'])
    // }

    // auto close IF open
    // for (const { target } of entries) {
    const { container, sideBar } = SidebarToggle.query(target as HTMLElement) //target?.closest('navigation-split-view,tab-view')

    // const sideBar = container?.querySelector<HTMLDialogElement>(':scope > dialog[is=sidebar-view]')

    if (!sideBar?.open) return

    switch (container?.tagName) {
      case 'NAVIGATION-SPLIT-VIEW':
        // const sideBar = target?.parentElement?.querySelector<HTMLDialogElement>(':scope > dialog[is=sidebar-view]')

        // if (!sideBar?.open) return

        if (0 < (target as HTMLElement).offsetWidth && 0 < (target as HTMLElement).offsetHeight) return

        // sideBar?.close?.()

        break
      case 'TAB-VIEW':
        // const tabBar = container.querySelector<HTMLDialogElement>(':scope > dialog[is=tab-bar]')

        // if (!tabBar?.open) return

        // scan all toggles for anyone that is visible, sign that sidebar should stay open
        if (
          [...container.querySelectorAll<HTMLElement>(':scope > sidebar-toggle,:scope > dialog[is=tab-bar] > sidebar-toggle')].some(
            ({ offsetWidth, offsetHeight }) => 0 < offsetWidth && 0 < offsetHeight
          )
        )
          return

        //tabBar?.close?.()

        break
    }

    sideBar?.close?.()
    // }
  }

  // _checkVisibility2(entries) {
  //   entries.forEach((entry) => {
  //     console.log('Visible in viewport?', entry.isIntersecting)
  //   })
  // }

  #handleClick(event: Event) {
    const target = event.target as HTMLElement

    if (!target?.closest('button')) return

    const { sideBar } = SidebarToggle.query(target as HTMLElement)

    // const container = target?.closest('tab-view,navigation-split-view')

    // const dialog =
    //   'TAB-VIEW' === container?.tagName
    //     ? container.querySelector<TabBar>('dialog[is="tab-bar"]')
    //     : container?.querySelector<SidebarView>('dialog[is="sidebar-view"]')

    if (!sideBar?.open) sideBar?.showModal()
    else sideBar.close()
  }
}
