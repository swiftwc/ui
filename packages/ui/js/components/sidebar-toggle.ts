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

    const navbarToggle = document.querySelector<HTMLElement>(
      'tab-view > sidebar-toggle'
    )

    const width = navbarToggle?.offsetWidth ?? 0

    if (0 < width) {
      const gapProp = navbarToggle
          ? getComputedStyle(navbarToggle).getPropertyValue('--toolbar-col-gap')
          : '0',
        gap =
          parseFloat(gapProp) *
          (gapProp.endsWith('rem')
            ? parseFloat(getComputedStyle(document.documentElement).fontSize)
            : 1)

      navbarToggle
        ?.closest<TabView>('tab-view')
        ?.style?.setProperty?.(
          (this.constructor as typeof SidebarToggle).cssVarPaddingName,
          `${width + gap}px`
        )
    } else {
      navbarToggle
        ?.closest<TabView>('tab-view')
        ?.style?.removeProperty?.(
          (this.constructor as typeof SidebarToggle).cssVarPaddingName
        )
    }

    const tabBar =
      document.querySelector<HTMLDialogElement>('dialog[is=tab-bar]')

    if (!tabBar?.open) return

    // scan all toggles for anyone that is visible, sign that sidebar should stay open
    const isAnyVisible = [
      ...document.querySelectorAll<HTMLElement>('sidebar-toggle'),
    ].some(
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
