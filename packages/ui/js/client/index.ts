import * as Components from '../components'
import { kebabCase } from '../internal/utils'
import { Snapshot } from '../snapshot'
import { type WebComponentCtor } from '../namespace'

export const polyfills: Map<string, WebComponentCtor> = new Map()

type TransitionType = 'forwards' | 'backwards' | 'reload'

for (const [k, v] of Object.entries(Components)) {
  const is = kebabCase(k)

  if ('polyfillExtends' in v && 'string' === typeof (v as any).polyfillExtends) {
    customElements.define(is, v, { extends: v.polyfillExtends })

    if (!(document.createElement(v.polyfillExtends, { is }) instanceof v)) polyfills.set(is, v)

    continue
  }

  customElements.define(is, v)
}

console.debug(polyfills)

if (0 < polyfills.size) {
  const polyfillTagNamesCache = new Set([...polyfills.values()].map((v) => String(v.polyfillExtends ?? '').toUpperCase()).filter(Boolean)) // ['TAG-NAME1', 'TAG-NAME2', ...]

  const handlers = new WeakMap()
  // @ts-expect-error
  const observe = (el, polyfill) => {
      if (!Array.isArray(polyfill.observedAttributes)) return
      if (0 === polyfill?.observedAttributes.length) return

      handlers.set(
        el,
        new MutationObserver(polyfill.polyfillAttributeChangedCallback).observe(el, {
          attributes: true,
          attributeFilter: polyfill.observedAttributes,
          attributeOldValue: true,
        })
      )
    },
    // @ts-expect-error
    unobserve = (el) => {
      handlers.delete(el)
    },
    polyfillTagNamesCacheSelector = [...polyfillTagNamesCache.values()].map((v) => `${v}`.toLowerCase()).join(','),
    flatten = (node: HTMLElement) => [node, ...(node.querySelectorAll?.(polyfillTagNamesCacheSelector) ?? [])]

  console.debug(polyfillTagNamesCache, polyfillTagNamesCacheSelector)

  for (const [is, polyfill] of polyfills)
    for (const el of document.querySelectorAll<HTMLElement>(`${polyfill.polyfillExtends}[is="${is}"]`)) {
      polyfill.polyfillConnectedCallback(el)

      observe(el, polyfill)
    }

  // observer callback
  const observer = new MutationObserver((mutations) => {
    for (const { addedNodes, removedNodes } of mutations) {
      for (const root of addedNodes) {
        if (!(root instanceof HTMLElement)) continue

        for (const node of flatten(root)) {
          if (!(node instanceof HTMLElement)) continue

          if (!polyfillTagNamesCache.has(node.tagName)) continue

          const is = node?.getAttribute('is') ?? ''

          if (!polyfills.has(is)) continue

          polyfills.get(is)?.polyfillConnectedCallback(node)

          observe(node, polyfills.get(is))
        }
      }

      for (const root of removedNodes) {
        if (!(root instanceof HTMLElement)) continue

        for (const node of flatten(root)) {
          if (!(node instanceof HTMLElement)) continue

          if (!polyfillTagNamesCache.has(node.tagName)) continue

          const is = node?.getAttribute('is') ?? ''

          if (!polyfills.has(is)) continue

          polyfills.get(is)?.polyfillDisconnectedCallback(node)

          unobserve(node)
        }
      }
    }
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  })
}

const cleanup = (lm?: Element, dir?: TransitionType) => {
  let arr: string[] = [Snapshot.config!['vt-fwd-class-name'], 'fwdd', 'fwn', 'fwnn', 'bwd', 'bwdd', 'bwn', 'bwnn']

  if (['backwards', 'forwards'].includes(dir ?? ''))
    for (let i = arr.length - 1; i >= 0; i--) if (arr[i].startsWith('backwards' === dir ? 'fw' : 'bw')) arr.splice(i, 1)

  for (const el of [...(lm?.querySelectorAll(arr.map((v) => `.${v}`).join(',')) ?? [])]) el.classList.remove(...arr)
}

export const startViewTransition = async (event: Event, type: TransitionType = 'forwards', updateCallback = async () => {}) => {
  await Snapshot.waitReady

  const from = closestBody(event.target as HTMLElement)

  if ('forwards' === type) {
    await updateCallback() // updatetheDOMSomehow

    // Snapshot.getSnapshot(from)

    const root = getRootController(from)

    const { toolBarConfig: oldToolbars } = getComputedView(from) //
    // const oldToolbars = Snapshot.toolbarItems
    // const { toolBarConfig: oldToolbars, host: oldHost } = getComputedView(from)

    const tos = queryBodyAll(from),
      to = tos.slice(-1)?.pop?.(), //Snapshot.leaf, //
      { host: newHost } = getComputedView(to),
      newToolbars = queryToolbarConfigAll(from),
      modalViews = [...queryHostAll(from)].filter?.((item) => item?.matches('dialog'))

    // toFrame = Snapshot.leafContainer, //queryHostAll(from).slice(-1)?.pop?.(),
    // toToolbars = Snapshot.leafToolbarItems
    // dialogFrames = [toFrame, ...(Snapshot.leaveFrames ?? [])].filter((item): item is HTMLDialogElement => item instanceof HTMLDialogElement) //[toFrame, ...(Snapshot.leaveFrames ?? [])].filter((item) => item?.matches('dialog'))
    // console.log(999, to, toFrame)
    // if ('DIALOG' === newHost?.tagName) {
    //   ;(newHost as HTMLDialogElement).showModal()
    //   console.debug(`⚡️ view-transition-start (${type})`)
    //   await Promise.allSettled(newHost.getAnimations().map(({ finished }) => finished))
    //   console.debug(`⚡️ view-transition-end (${type})`)
    //   return
    // }

    // purge
    cleanup(root, 'backwards')

    // prepare old
    from?.classList.add(Snapshot.config!['vt-fwd-class-name'])

    for (const oldToolbar of oldToolbars ?? []) oldToolbar.classList.add('fwn') // prepare navbs

    // prepare new
    const toolbarExclusion =
        0 < modalViews.length
          ? (value: Element, index: number, array: Element[]) => value.parentElement?.matches('tool-bar:not(dialog tool-bar,body-view ~ tool-bar)')
          : (value: Element, index: number, array: Element[]) => value.parentElement?.matches('tool-bar:not(body-view ~ tool-bar)'),
      bodyExclusion =
        0 < modalViews.length
          ? (item: HTMLElement) => item?.matches('scroll-view:not(dialog scroll-view)')
          : (value: Element, index: number, array: Element[]) => value

    for (const bti of newToolbars?.filter?.(toolbarExclusion) ?? []) bti.classList.add('fwnn') // for (const ti of newToolbars ?? []) ti.classList.add('fwnn') //

    for (const bt of tos?.filter?.(bodyExclusion) ?? []) bt?.classList.add('fwdd') //to?.classList.add('fwdd')

    if (0 < modalViews.length) {
      for await (const el of modalViews) (el as HTMLDialogElement).showModal()

      console.debug(`⚡️ view-dialog-transition-start (${type})`)

      await Promise.allSettled(modalViews?.[0].getAnimations().map(({ finished }) => finished))

      console.debug(`⚡️ view-dialog-transition-end (${type})`)
    } else {
      console.debug(`⚡️ view-transition-start (${type})`)

      await Promise.allSettled([
        ...(from?.getAnimations().map(({ finished }) => finished) ?? []),
        // ...(to?.getAnimations().map(({ finished }) => finished) ?? []),
      ])

      console.debug(`⚡️ view-transition-end (${type})`)
    }

    if (0 < (newHost?.querySelectorAll(`.${Snapshot.config?.['vt-fwd-class-name']},.bwd`) ?? []).length) return

    cleanup(root)
  } else {
    // Snapshot.getSnapshot(from)

    const root = getRootController(from)

    const { toolBarConfig: oldToolbars, host: oldHost } = getComputedView(from)

    // if most-top effect is closing a modal, skip everything
    if ('DIALOG' === oldHost?.tagName) {
      ;(oldHost as HTMLDialogElement).close()
      console.debug(`⚡️ view-dialog-transition-start (${type})`)
      await Promise.allSettled(oldHost.getAnimations().map(({ finished }) => finished))
      console.debug(`⚡️ view-dialog-transition-end (${type})`)
      if (oldHost.matches('[open]')) return
      await updateCallback()
      return // just close modal
    }

    const to = closestBody(oldHost?.parentElement ?? undefined),
      { toolBarConfig: newToolbars } = getComputedView(to)

    // purge
    cleanup(root, 'forwards')

    // prepare new
    for (const ti of newToolbars ?? []) ti.classList.add('bwnn')

    to?.classList.add('bwdd')

    // prepare old
    const inbetweenModals = queryHostAll(from).filter?.((item) => item.matches('dialog[open]')) ?? [], // FIXME: TEst this, added oldHost too
      toolbarExclusion =
        0 < inbetweenModals.length
          ? (value: Element, index: number, array: Element[]) => value.parentElement?.matches('tool-bar:not(dialog tool-bar)')
          : (value: Element, index: number, array: Element[]) => value,
      bodyExclusion = 0 < inbetweenModals.length ? (item: HTMLElement) => item?.matches('scroll-view:not(dialog scroll-view)') : (item: HTMLElement) => item

    for (const ti of [...(oldToolbars ?? []), ...(queryToolbarConfigAll(from)?.filter?.(toolbarExclusion) ?? [])]) ti.classList.add('bwn')

    for (const nn of [from, ...queryBodyAll(from)?.filter?.(bodyExclusion)]) nn?.classList.add('bwd') //from?.classList.add('bwd')

    for (const el of inbetweenModals) (el as HTMLDialogElement).close() // close old inbetween modals

    // capture trans
    console.debug(`⚡️ view-transition-start (${type})`)

    await Promise.allSettled([...(from?.getAnimations().map(({ finished }) => finished) ?? []), ...(to?.getAnimations().map(({ finished }) => finished) ?? [])])

    console.debug(`⚡️ view-transition-end (${type})`)

    if (to?.closest(`.bwd,.${Snapshot.config?.['vt-fwd-class-name']}`)) return

    cleanup(root)

    // remove or hide
    await updateCallback()
  }
}

void Snapshot.waitReady // void Snapshot.setOwnConfig()

type NavController = Components.NavigationStack | Components.NavigationSplitView
type NavHost = Components.BodyView | Components.SheetView | Components.NavigationStack | Components.NavigationSplitView
type NavToolbarConfiguration = Components.ToolBarItem | Components.ToolBarItemGroup
type NavPage = Components.SidebarView | Components.ScrollView // this is a body wrapper!
type NavView = {
  host?: NavHost
  page?: NavPage // slot of body or sidebar
  body?: Components.ScrollView // this is what actually gets animated
  toolBarConfig?: Array<NavToolbarConfiguration>
}

export function resolveDoc(body?: Components.ScrollView): NavPage | undefined {
  const possibleBody = body?.parentElement?.matches('dialog[is=sidebar-view]') ? ((body?.parentElement as Components.SidebarView | null) ?? undefined) : body

  return possibleBody?.matches('scroll-view,[is=sidebar-view]') ? possibleBody : undefined
}

export function getComputedView(body?: Components.ScrollView): NavView {
  const page = resolveDoc(body), //body?.parentElement?.matches('dialog[is=sidebar-view]') ? (body?.parentElement as Components.SidebarView) : undefined,
    host = (page?.parentElement as NavHost) ?? body?.parentElement ?? undefined

  return {
    host,
    page,
    body,
    toolBarConfig: [...(host?.querySelectorAll<NavToolbarConfiguration>(`:scope > tool-bar > tool-bar-item,:scope > tool-bar > tool-bar-item-group`) ?? [])],
  }
}

/**
 * Gets closest host (current)
 */
export function closestHost(any?: HTMLElement) {
  return any?.closest<NavHost>('body-view,[is=sheet-view],navigation-stack,navigation-split-view')
}

/**
 * Gets closest body
 */
export function closestBody(any?: HTMLElement) {
  return closestHost(any)?.querySelector<Components.ScrollView>(`:scope > scroll-view,:scope > [is=sidebar-view] > scroll-view`) ?? undefined
}

export function getRootController(body?: Components.ScrollView): NavController | undefined {
  let root

  for (let e: HTMLElement | undefined | null = body; e; e = e.parentElement) e.matches('navigation-stack,navigation-split-view') && (root = e as NavController)

  return root
}

/**
 * Gets sub-host (of nested views) for current view, if exists (base for quering)
 */
function hostSlot(body?: Components.ScrollView): NavHost | undefined {
  let possibleNest = body?.nextElementSibling as NavHost | null

  if (
    body?.matches(
      `navigation-split-view > scroll-view,navigation-split-view:has(>[is=sidebar-view]) > [is=sidebar-view] > scroll-view,navigation-split-view:has(>[is=sidebar-view]) > body-view > scroll-view`
    )
  )
    possibleNest = resolveDoc(body)?.previousElementSibling as NavHost | null // look for prev sibling instead

  return possibleNest?.matches('body-view,[is=sheet-view],navigation-stack,navigation-split-view') ? possibleNest : undefined
}

/**
 * Looks for child toolbarconfs (excluding current toolbarconf)
 */
export function queryToolbarConfig(body?: Components.ScrollView) {
  const possibleNest = hostSlot(body)

  return (
    possibleNest?.querySelector(
      'tool-bar:not(navigation-stack[hidden] tool-bar,navigation-split-view[hidden] tool-bar) > tool-bar-item,tool-bar:not(navigation-stack[hidden] tool-bar,navigation-split-view[hidden] tool-bar) > tool-bar-item-group'
    ) ?? undefined
  ) //'navigation-stack:not([hidden]) scroll-view'
}
export function queryToolbarConfigAll(body?: Components.ScrollView) {
  const possibleNest = hostSlot(body)

  return [
    ...(possibleNest?.querySelectorAll(
      'tool-bar:not(navigation-stack[hidden] tool-bar,navigation-split-view[hidden] tool-bar) > tool-bar-item,tool-bar:not(navigation-stack[hidden] tool-bar,navigation-split-view[hidden] tool-bar) > tool-bar-item-group'
    ) ?? []), //'navigation-stack:not([hidden]) scroll-view'
  ]
}

/**
 * Looks for child hosts (excluding current body-host)
 */
export function queryHost(body?: Components.ScrollView) {
  const possibleNest = hostSlot(body)

  return possibleNest
  // possibleNest?.querySelector(
  //   'body-view:not(navigation-stack[hidden] body-view,navigation-split-view[hidden] body-view),[is=sheet-view]:not(navigation-stack[hidden] [is=sheet-view],navigation-split-view[hidden] [is=sheet-view])'
  // ) ??
  // undefined
}
export function queryHostAll(body?: Components.ScrollView) {
  const possibleNest = hostSlot(body)

  return [
    ...(possibleNest ? [possibleNest] : []),
    ...(possibleNest?.querySelectorAll(
      'body-view:not(navigation-stack[hidden] body-view,navigation-split-view[hidden] body-view),[is=sheet-view]:not(navigation-stack[hidden] [is=sheet-view],navigation-split-view[hidden] [is=sheet-view])'
    ) ?? []),
  ]
}

/**
 * Looks for child bodies (excluding current body)
 */
export function queryBody(body?: Components.ScrollView) {
  const possibleNest = hostSlot(body)

  return (
    possibleNest?.querySelectorAll<Components.ScrollView>(
      'scroll-view:not(navigation-stack[hidden] scroll-view,navigation-split-view[hidden] scroll-view)'
    ) ?? undefined
  )
}
export function queryBodyAll(body?: Components.ScrollView) {
  const possibleNest = hostSlot(body)

  return [
    ...(possibleNest?.querySelectorAll<Components.ScrollView>(
      'scroll-view:not(navigation-stack[hidden] scroll-view,navigation-split-view[hidden] scroll-view)'
    ) ?? []), //'navigation-stack:not([hidden]) scroll-view'
  ]
}

/**
 * Looks for child views (excluding current view)
 */
export function queryView(body?: Components.ScrollView): NavView {
  const possibleNest = hostSlot(body)

  return {
    host:
      possibleNest?.querySelector<NavHost>(
        'body-view:not(navigation-stack[hidden] body-view,navigation-split-view[hidden] body-view),[is=sheet-view]:not(navigation-stack[hidden] [is=sheet-view],navigation-split-view[hidden] [is=sheet-view])'
      ) ?? undefined,
    body:
      possibleNest?.querySelector<Components.ScrollView>(
        'scroll-view:not(navigation-stack[hidden] scroll-view,navigation-split-view[hidden] scroll-view)'
      ) ?? undefined,
    toolBarConfig: [
      ...(possibleNest?.querySelectorAll<NavToolbarConfiguration>(
        'tool-bar:not(navigation-stack[hidden] tool-bar,navigation-split-view[hidden] tool-bar) > tool-bar-item,tool-bar:not(navigation-stack[hidden] tool-bar,navigation-split-view[hidden] tool-bar) > tool-bar-item-group'
      ) ?? []), //'navigation-stack:not([hidden]) scroll-view'
    ],
  }
}
// export function queryViewAll(body?: Components.ScrollView) {
//   const possibleNest = getNestedHost(body)

//   return {
//     scenes: [
//       ...(possibleNest?.querySelectorAll<Components.ScrollView>(
//         'scroll-view:not(navigation-stack[hidden] scroll-view,navigation-split-view[hidden] scroll-view)'
//       ) ?? []), //'navigation-stack:not([hidden]) scroll-view'
//     ],
//     frames: [
//       ...(possibleNest?.querySelectorAll(
//         'body-view:not(navigation-stack[hidden] body-view,navigation-split-view[hidden] body-view),[is=sheet-view]:not(navigation-stack[hidden] [is=sheet-view],navigation-split-view[hidden] [is=sheet-view])'
//       ) ?? []),
//     ],
//     toolbarCells: [
//       ...(possibleNest?.querySelectorAll(
//         'tool-bar:not(navigation-stack[hidden] tool-bar,navigation-split-view[hidden] tool-bar) > tool-bar-item,tool-bar:not(navigation-stack[hidden] tool-bar,navigation-split-view[hidden] tool-bar) > tool-bar-item-group'
//       ) ?? []), //'navigation-stack:not([hidden]) scroll-view'
//     ],
//   }
// }

export { Snapshot }
