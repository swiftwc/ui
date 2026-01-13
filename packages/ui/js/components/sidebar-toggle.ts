export class SidebarToggle extends HTMLElement {
  #ro
  // #io

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

    const tabBar =
      document.querySelector<HTMLDialogElement>('dialog[is=tab-bar]')

    if (!tabBar?.open) return

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
