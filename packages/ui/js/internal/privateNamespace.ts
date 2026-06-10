import type * as Components from '../components'
import type { PageRevealSwapDetail } from '../events'
import { NavigationPath } from '../internal/class/navigation-path'
import { debug } from '../internal/utils'
import { Snapshot } from '../snapshot'

type TransitionType = 'forwards' | 'backwards' | 'reload'

export type NavigationHost = Components.BodyView | Components.SheetView | Components.NavigationStack | Components.NavigationSplitView

export type NavigationToolbarConfiguration = Components.ToolBarItem | Components.ToolBarItemGroup

export type NavigationPage = Components.SidebarView | Components.ScrollView // this is a body wrapper!

export function queryInsertPosition(frame: NavigationHost) {
  if ('NAVIGATION-SPLIT-VIEW' === frame?.tagName)
    return 'beforebegin' // lookFor = 'previousElementSibling'
  else if ('NAVIGATION-SPLIT-VIEW' === frame?.parentElement?.tagName && frame?.parentElement.querySelector(':scope>[is=sidebar-view]') && 'BODY-VIEW' === frame?.tagName) return 'beforebegin' // lookFor = 'previousElementSibling'

  return 'afterend' // lookFor = 'nextElementSibling'
}

const cleanup = (lm?: Element, type?: TransitionType) => {
  let arr: string[] = [Snapshot.config!['vt-fwd-class-name'], 'fwdd', 'fwn', 'fwnn', 'bwd', 'bwdd', 'bwn', 'bwnn']

  if (['backwards', 'forwards'].includes(type ?? '')) for (let i = arr.length - 1; i >= 0; i--) if (arr[i].startsWith('backwards' === type ? 'fw' : 'bw')) arr.splice(i, 1)

  for (const el of [...(lm?.querySelectorAll(arr.map((v) => `.${v}`).join(',')) ?? [])]) el.classList.remove(...arr)
}

type UpdateCallback = () => void | Promise<void>

type NavigateOptions = {
  updateCallback?: UpdateCallback
  tos?: () => NavigationPath[]
}

export const startViewTransition = async (target: HTMLElement, type: TransitionType = 'forwards', updateCallbackOrOptions: UpdateCallback | NavigateOptions = async () => {}) => {
  debug(`startViewTransition (${type})`, target)

  if (!(target instanceof HTMLElement)) throw new TypeError("Argument 1 ('target') to client.startViewTransition must be an instance of HTMLElement")

  if (!['forwards', 'backwards', 'reload'].includes(type)) throw new TypeError("Argument 2 ('type') to client.startViewTransition must be of TransitionType")

  const options: NavigateOptions =
      typeof updateCallbackOrOptions === 'function'
        ? {
            updateCallback: updateCallbackOrOptions,
          }
        : (updateCallbackOrOptions ?? {}),
    updateCallback: UpdateCallback = options.updateCallback ?? (async () => {})

  await Snapshot.waitReady

  const from = new NavigationPath(target) //const from = closestBody(target) //event.target as HTMLElement)

  if ('forwards' === type) {
    await updateCallback() // updatetheDOMSomehow

    // Snapshot.getSnapshot(from)

    // const root = getRootViewController(from)

    // const oldPath = new NavigationPath(from)

    const root = [from, ...from.parents()]
      .map((item) => item.component)
      .filter(Boolean)
      .at(-1)

    // const { toolBarConfig: oldToolbars } = getComputedView(from) // const { toolBarConfig: oldToolbars, slot: oldSLot, page: oldPage } = getComputedView(from) //
    // console.log(88, oldPage, oldPath.page, oldSLot, oldPath.slot, oldToolbars, oldPath.toolBarConfig)
    // const oldToolbars = Snapshot.toolbarItems
    // const { toolBarConfig: oldToolbars, host: oldHost } = getComputedView(from)

    const tos = options.tos?.() ?? [...from.children()].map((item) => item?.hydrate()), //queryBodyAll(oldSLot), //[...oldPath.children()].map((item) => item.body).filter(Boolean),//
      to = tos.at(-1),
      // to = newPath?.body, //tos.slice(-1)?.pop?.(), //Snapshot.leaf, //
      // newHost = newPath?.component, //{ host: newHost } = getComputedView(to),
      newToolbars = tos.flatMap((item) => item.toolBarConfig ?? []).filter((item): item is NavigationToolbarConfiguration => !!item),
      // .map((item) => item.toolBarConfig)
      // .flat()
      // .filter(Boolean), //queryToolbarConfigAll(oldSLot),
      modalViews = tos.map((item) => item.component).filter((item): item is NavigationHost => !!item && item.matches('dialog')) //[...queryHostAll(oldPage)].filter?.((item) => item?.matches('dialog'))

    // toFrame = Snapshot.leafContainer, //queryHostAll(from).slice(-1)?.pop?.(),
    // toToolbars = Snapshot.leafToolbarItems
    // dialogFrames = [toFrame, ...(Snapshot.leaveFrames ?? [])].filter((item): item is HTMLDialogElement => item instanceof HTMLDialogElement) //[toFrame, ...(Snapshot.leaveFrames ?? [])].filter((item) => item?.matches('dialog'))
    // if ('DIALOG' === newHost?.tagName) {
    //   ;(newHost as HTMLDialogElement).showModal()
    //   debug(`⚡️ view-transition-start (${type})`)
    //   await Promise.allSettled(newHost.getAnimations().map(({ finished }) => finished))
    //   debug(`⚡️ view-transition-end (${type})`)
    //   return
    // }

    // purge
    cleanup(root, 'backwards')

    // prepare old
    from.body?.classList.add(Snapshot.config!['vt-fwd-class-name'])
    from.body?.dispatchEvent(new CustomEvent<PageRevealSwapDetail>('pageswap', { detail: { page: from.body }, bubbles: true, composed: true }))

    for (const oldToolbar of from.toolBarConfig ?? []) oldToolbar.classList.add('fwn') // prepare navbs

    // prepare new
    const toolbarExclusion =
        0 < modalViews.length
          ? (value: NavigationToolbarConfiguration, index: number, array: NavigationToolbarConfiguration[]) => value.parentElement?.matches('tool-bar:not(dialog tool-bar,body-view ~ tool-bar)')
          : (value: NavigationToolbarConfiguration, index: number, array: NavigationToolbarConfiguration[]) => value.parentElement?.matches('tool-bar:not(body-view ~ tool-bar)'),
      bodyExclusion =
        0 < modalViews.length ? (item: NavigationPath) => item.body?.matches('scroll-view:not(dialog scroll-view)') : (value: NavigationPath, index: number, array: NavigationPath[]) => value

    for (const bti of newToolbars?.filter?.(toolbarExclusion) ?? []) bti.classList.add('fwnn') // for (const ti of newToolbars ?? []) ti.classList.add('fwnn') //

    for (const bt of tos?.filter?.(bodyExclusion) ?? []) {
      bt.body?.classList.add('fwdd') //to?.classList.add('fwdd')
      bt.body?.dispatchEvent(new CustomEvent<PageRevealSwapDetail>('pagereveal', { detail: { page: bt.body }, bubbles: true, composed: true }))
    }

    if (0 < modalViews.length) {
      for await (const el of modalViews) (el as HTMLDialogElement).showModal()

      debug(`⚡️ view-dialog-transition-start (${type})`)

      await Promise.allSettled(modalViews?.[0].getAnimations().map(({ finished }) => finished))

      debug(`⚡️ view-dialog-transition-end (${type})`)
    } else {
      debug(`⚡️ view-transition-start (${type})`)

      await Promise.allSettled([...(from.body?.getAnimations().map(({ finished }) => finished) ?? []), ...(to?.body?.getAnimations().map(({ finished }) => finished) ?? [])])

      debug(`⚡️ view-transition-end (${type})`)
    }

    if (0 < (to?.component?.querySelectorAll(`.${Snapshot.config?.['vt-fwd-class-name']},.bwd`) ?? []).length) return

    cleanup(root)
  } else {
    // Snapshot.getSnapshot(from)

    // const oldPath = new NavigationPath(from)

    const root = [from, ...from.parents()]
      .map((item) => item.component)
      .filter(Boolean)
      .at(-1) // const root = getRootViewController(from)

    //const { toolBarConfig: oldToolbars, host: oldHost, page: oldPage, slot: oldSlot } = getComputedView(from)

    const froms = [...from.children()].map((item) => item?.hydrate())

    const oldToolbars = froms.flatMap((item) => item.toolBarConfig ?? []).filter((item): item is NavigationToolbarConfiguration => !!item),
      oldBodies = froms.map((item) => item.body).filter((item) => !!item)
    // console.log(99, queryToolbarConfigAll(oldSlot), oldToolbars)

    // if most-top effect is closing a modal, skip everything
    if ('DIALOG' === from.component?.tagName) {
      from.body?.dispatchEvent(new CustomEvent<PageRevealSwapDetail>('pageswap', { detail: { page: from.body }, bubbles: true, composed: true }))
      ;(from.component as HTMLDialogElement).close()
      debug(`⚡️ view-dialog-transition-start (${type})`)
      await Promise.allSettled(from.component.getAnimations().map(({ finished }) => finished))
      debug(`⚡️ view-dialog-transition-end (${type})`)
      if (from.component.matches('[open]')) return
      await updateCallback()
      return // just close modal
    }

    const to = [...from.parents()].at(0)?.hydrate() //closestBody(oldPath.component?.parentElement ?? undefined)

    if (!to) return debug('Can not go backwards.') // nothing to go back to

    const tv = to.body?.closest<Components.TabView>('tab-view')
    if (tv && to.body?.matches('tab-view>navigation-stack:has(> navigation-stack,> navigation-split-view)>:scope')) if ('bottom-bar' !== tv.tabBarPlacement) return

    // const { toolBarConfig: newToolbars } = getComputedView(to.body)

    // purge
    cleanup(root, 'forwards')

    // prepare new
    for (const ti of to.toolBarConfig ?? []) ti.classList.add('bwnn')

    to.body?.classList.add('bwdd')
    to.body?.dispatchEvent(new CustomEvent<PageRevealSwapDetail>('pagereveal', { detail: { page: to.body }, bubbles: true, composed: true }))

    // prepare old
    const inbetweenModals = froms.map((item) => item.component).filter((item): item is NavigationHost => !!item && item.matches('dialog[open]')), //queryHostAll(oldPage).filter?.((item) => item.matches('dialog[open]')) ?? [], // FIXME: TEst this, added oldHost too
      toolbarExclusion =
        0 < inbetweenModals.length
          ? (value: Element, index: number, array: Element[]) => value.parentElement?.matches('tool-bar:not(dialog tool-bar)')
          : (value: Element, index: number, array: Element[]) => value,
      bodyExclusion = 0 < inbetweenModals.length ? (item: HTMLElement) => item?.matches('scroll-view:not(dialog scroll-view)') : (item: HTMLElement) => item

    for (const ti of [...(from.toolBarConfig ?? []), ...(oldToolbars?.filter?.(toolbarExclusion) ?? [])]) ti.classList.add('bwn')

    for (const nn of [from.body, ...oldBodies?.filter?.(bodyExclusion)]) {
      nn?.classList.add('bwd') //from?.classList.add('bwd')
      nn?.dispatchEvent(new CustomEvent<PageRevealSwapDetail>('pageswap', { detail: { page: nn }, bubbles: true, composed: true }))
    }

    for (const el of inbetweenModals) (el as HTMLDialogElement).close() // close old inbetween modals

    // capture trans
    debug(`⚡️ view-transition-start (${type})`)

    await Promise.allSettled([...(from.body?.getAnimations().map(({ finished }) => finished) ?? []), ...(to.body?.getAnimations().map(({ finished }) => finished) ?? [])])

    debug(`⚡️ view-transition-end (${type})`)

    if (to.body?.closest(`.bwd,.${Snapshot.config?.['vt-fwd-class-name']}`)) return

    cleanup(root)

    // remove or hide
    await updateCallback()
  }
}
