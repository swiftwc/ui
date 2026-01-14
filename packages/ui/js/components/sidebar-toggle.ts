import { type TabView } from './tab-view'

export class SidebarToggle extends HTMLElement {
  #ro
  // #io

  static get cssVarPaddingName() {
    return '--tabview-padding-inline-start'
  }

  constructor() {
    super()

    this.#ro = new ResizeObserver(this.#autoCloseTabBar)

    // this.#io = new IntersectionObserver((entries) => {
    //   this._checkVisibility2(entries)
    // })
  }

  connectedCallback() {
    console.debug(`${SidebarToggle.name} ⚡️ connect`)

    this.#ro?.observe(this)
    // this.#io.observe(this)

    this.#autoCloseTabBar()
  }

  disconnectedCallback() {
    console.debug(`${SidebarToggle.name} ⚡️ disconnect`)

    this.#ro?.disconnect()
    // this.#io.disconnect()
  }

  // This triggers on show/hide of any of sidebar-toggle elements
  #autoCloseTabBar() {
    console.debug('#autoCloseTabBar')

    const toggles = [
      ...document.querySelectorAll<HTMLElement>('sidebar-toggle'),
    ]

    // set css vars
    for (const tg of toggles) {
      const tv = tg.parentElement

      const width = tg?.offsetWidth ?? 0

      if (0 < width) {
        // const gapProp =
        //     getComputedStyle(tg).getPropertyValue('--toolbar-col-gap') || '0',
        //   gap = parseFloat(gapProp) * 1 //(gapProp.endsWith('rem')? parseFloat(getComputedStyle(document.documentElement).fontSize): 1)

        tv?.style?.setProperty?.(SidebarToggle.cssVarPaddingName, `${width}px`)
      } else {
        tv?.style?.removeProperty?.(SidebarToggle.cssVarPaddingName)
      }
    }

    // auto close
    const tabBar =
      document.querySelector<HTMLDialogElement>('dialog[is=tab-bar]')

    if (!tabBar?.open) return

    // scan all toggles for anyone that is visible, sign that sidebar should stay open
    const isAnyVisible = toggles.some(
      ({ offsetWidth, offsetHeight }) => 0 < offsetWidth && 0 < offsetHeight
    )

    if (isAnyVisible) return

    tabBar?.close?.()
  }

  // _checkVisibility2(entries) {
  //   entries.forEach((entry) => {
  //     console.log('Visible in viewport?', entry.isIntersecting)
  //   })
  // }
}
