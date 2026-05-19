import { CleanupRegistry } from '../internal/class/cleanup-registry'
import { ResizeObserverSingleton } from '../internal/class/resize-observer-singleton'
import { debounce, onoff } from '../internal/utils'

const observers = new ResizeObserverSingleton()

export class SidebarToggle extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    console.debug(`${SidebarToggle.name} ⚡️ connect`)

    CleanupRegistry.register(this, onoff('click', this.#handleClick, this).on())

    const entry = {
      target: this,
    }

    observers.observe(this, debounce(SidebarToggle.#handleMeasure, 100, true)) //this.#ro?.observe(this)

    // @ts-expect-error
    SidebarToggle.#handleMeasure([entry])
  }

  disconnectedCallback() {
    console.debug(`${SidebarToggle.name} ⚡️ disconnect`)

    observers.unobserve(this)

    CleanupRegistry.unregister(this)
  }

  private static query(target?: HTMLElement) {
    const container = target?.closest('navigation-split-view,tab-view'),
      sideBar = container?.querySelector<HTMLDialogElement>(':scope>[is=sidebar-view]')

    return { container, sideBar }
  }

  // This triggers on show/hide of any of sidebar-toggle elements
  static #handleMeasure(entry?: ResizeObserverEntry) {
    console.debug(`${SidebarToggle.name} ⚡️ measure`)

    const target = entry?.target instanceof HTMLElement && entry.target
    if (!target) return

    // set/remove css var/prop to parent based on shown/hidden
    const tv = target.parentElement
    // inlineSize = entry.borderBoxSize?.at(0)?.inlineSize ?? entry.contentRect?.width ?? 0,
    // blockSize = entry.borderBoxSize?.at(0)?.blockSize ?? entry.contentRect?.height ?? 0

    self.requestAnimationFrame(() => {
      const inlineSize = target.offsetWidth ?? 0

      if (0 < inlineSize)
        tv?.style?.setProperty?.('--sidebar-toggle-padding-inline-start', `${inlineSize}px`) //$.prop('--sidebar-toggle-padding-inline-start', `${inlineSize}px`, tv) //
      else tv?.style?.removeProperty?.('--sidebar-toggle-padding-inline-start') //$.prop('--sidebar-toggle-padding-inline-start', null, tv) //
    })

    // auto close IF open
    const { container, sideBar } = SidebarToggle.query(target) //target?.closest('navigation-split-view,tab-view')

    if (!sideBar?.open) return

    self.requestAnimationFrame(() => {
      switch (container?.tagName) {
        case 'NAVIGATION-SPLIT-VIEW':
          if (0 < target.offsetWidth && 0 < target.offsetHeight) return

          break
        case 'TAB-VIEW':
          // scan all toggles for anyone that is visible, sign that sidebar should stay open
          if (
            [
              ...container.querySelectorAll<HTMLElement>(
                ':scope > sidebar-toggle,:scope > [is=tab-bar] > sidebar-toggle' //,:scope > [is='sidebar-view'] > tool-bar > sidebar-toggle" ?? FIXME: removed this bc/ inside sidebar!
              ),
            ].some(({ offsetWidth, offsetHeight }) => 0 < offsetWidth && 0 < offsetHeight)
          )
            return

          break
      }

      sideBar?.close?.()
    })
  }

  #handleClick(evt: Event) {
    console.debug(`${SidebarToggle.name} ⚡️ ${evt?.type}`)

    const target = evt?.target instanceof HTMLElement && evt.target
    if (!target) return

    if (!target?.closest('button')) return

    const { sideBar } = SidebarToggle.query(target)

    if (!sideBar?.open) sideBar?.showModal()
    else sideBar.close()
  }
}
