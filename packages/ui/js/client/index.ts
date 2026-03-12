import * as Components from '../components'
import { kebabCase, ancestors, nextAll, prevAll } from '../internal/utils'
import { Snapshot } from '../snapshot'
import { NavigationPath } from '../navigation-path'
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

// SECTION: Safari polyfill
document.addEventListener('touchstart', () => {}, { passive: true })

// SECTION: Transitions
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

    const { toolBarConfig: oldToolbars, slot: oldSLot, page: oldPage } = getComputedView(from) //
    // const oldToolbars = Snapshot.toolbarItems
    // const { toolBarConfig: oldToolbars, host: oldHost } = getComputedView(from)

    const tos = queryBodyAll(oldSLot),
      to = tos.slice(-1)?.pop?.(), //Snapshot.leaf, //
      { host: newHost } = getComputedView(to),
      newToolbars = queryToolbarConfigAll(oldSLot),
      modalViews = [...queryHostAll(oldPage)].filter?.((item) => item?.matches('dialog'))

    // toFrame = Snapshot.leafContainer, //queryHostAll(from).slice(-1)?.pop?.(),
    // toToolbars = Snapshot.leafToolbarItems
    // dialogFrames = [toFrame, ...(Snapshot.leaveFrames ?? [])].filter((item): item is HTMLDialogElement => item instanceof HTMLDialogElement) //[toFrame, ...(Snapshot.leaveFrames ?? [])].filter((item) => item?.matches('dialog'))
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
        ...(to?.getAnimations().map(({ finished }) => finished) ?? []),
      ])

      console.debug(`⚡️ view-transition-end (${type})`)
    }

    if (0 < (newHost?.querySelectorAll(`.${Snapshot.config?.['vt-fwd-class-name']},.bwd`) ?? []).length) return

    cleanup(root)
  } else {
    // Snapshot.getSnapshot(from)

    const root = getRootController(from)

    const { toolBarConfig: oldToolbars, host: oldHost, page: oldPage, slot: oldSlot } = getComputedView(from)

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
    const inbetweenModals = queryHostAll(oldPage).filter?.((item) => item.matches('dialog[open]')) ?? [], // FIXME: TEst this, added oldHost too
      toolbarExclusion =
        0 < inbetweenModals.length
          ? (value: Element, index: number, array: Element[]) => value.parentElement?.matches('tool-bar:not(dialog tool-bar)')
          : (value: Element, index: number, array: Element[]) => value,
      bodyExclusion = 0 < inbetweenModals.length ? (item: HTMLElement) => item?.matches('scroll-view:not(dialog scroll-view)') : (item: HTMLElement) => item

    for (const ti of [...(oldToolbars ?? []), ...(queryToolbarConfigAll(oldSlot)?.filter?.(toolbarExclusion) ?? [])]) ti.classList.add('bwn')

    for (const nn of [from, ...queryBodyAll(oldSlot)?.filter?.(bodyExclusion)]) nn?.classList.add('bwd') //from?.classList.add('bwd')

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

/**
Node
 ├─ Host          (required) → the container of the node
 ├─ Body          (required) → main content of the node
 ├─ Navbar?       (optional) → navigation area
 └─ Slot?         (optional) → placeholder for another branch/subtree
      └─ Child Node(s)
======================================================================
Root Node
 ├─ Host
 │   ├─ Navbar?
 │   ├─ Body
 │   └─ Slot
 │       ├─ Child Node 1
 │       │   ├─ Host
 │       │   ├─ Body
 │       │   └─ Slot
 │       │       └─ Grandchild Node
 │       └─ Child Node 2
 │           ├─ Host
 │           ├─ Body
 │           └─ Slot (empty)
 */
type NavigationController = Components.NavigationStack | Components.NavigationSplitView
type NavigationHost = Components.BodyView | Components.SheetView | Components.NavigationStack | Components.NavigationSplitView
type NavigationToolbarConfiguration = Components.ToolBarItem | Components.ToolBarItemGroup
type NavigationBody = Components.SidebarView | Components.ScrollView // this is a body wrapper!
type NavigationItem = {
  host?: NavigationHost
  page?: NavigationBody // slot of body or sidebar
  body?: Components.ScrollView // this is what actually gets animated
  toolBarConfig?: Array<NavigationToolbarConfiguration>
  slot?: NavigationHost
}

export function resolveDoc(body?: Components.ScrollView): NavigationBody | undefined {
  const possibleBody = body?.parentElement?.matches('[is=sidebar-view]') ? ((body?.parentElement as Components.SidebarView | null) ?? undefined) : body

  return possibleBody?.matches('scroll-view,[is=sidebar-view]') ? possibleBody : undefined
}

export function getComputedView(body?: Components.ScrollView): NavigationItem {
  const sv = body?.matches('scroll-view') ? body : undefined

  const page = resolveDoc(sv), //body?.parentElement?.matches('dialog[is=sidebar-view]') ? (body?.parentElement as Components.SidebarView) : undefined,
    host = closestHost(page) //(page?.parentElement as NavigationHost) ?? body?.parentElement ?? undefined

  return {
    host,
    page,
    body: sv,
    toolBarConfig: queryToolbarConfig(host),
    slot: queryHost(page),
    // [
    //   ...(host?.querySelectorAll<NavigationToolbarConfiguration>(`:scope > tool-bar > tool-bar-item,:scope > tool-bar > tool-bar-item-group`) ?? []),
    // ],
  }
}

/**
 * Gets current host (closest)
 */
export function closestHost(any?: HTMLElement) {
  return any?.closest<NavigationHost>('body-view,[is=sheet-view],navigation-stack,navigation-split-view') ?? undefined
}

/**
 * Gets current body (closest)
 */
export function closestBody(any?: HTMLElement) {
  return closestHost(any)?.querySelector<Components.ScrollView>(`:scope > scroll-view,:scope > [is=sidebar-view] > scroll-view`) ?? undefined
}

/**
 * Gets top-most view (root)
 */
export function getRootController(body?: Components.ScrollView): NavigationController | undefined {
  // console.log(333, ancestors<NavigationController>('navigation-stack,navigation-split-view', body)?.at(-1))
  return ancestors<NavigationController>('navigation-stack,navigation-split-view', body)?.at(-1)
  // let root
  // for (let e: HTMLElement | undefined | null = body; e; e = e.parentElement)
  //   e.matches('navigation-stack,navigation-split-view') && (root = e as NavigationController)
  // return root
}

/**
 * Looks in siblings for possible slot of child views. Slot of child-views(hosts).
 */
function hostSlot(body?: NavigationBody): NavigationHost | undefined {
  //body.querySelector('.item:has(+ .active)')
  let possibleNest = nextAll<NavigationHost>(
    'body-view:not([hidden]),[is=sheet-view]:not([hidden]),navigation-stack:not([hidden]),navigation-split-view:not([hidden])',
    body
  )?.[0] //?.nextElementSibling as NavigationHost | null

  if (
    body?.matches(
      `navigation-split-view > scroll-view,navigation-split-view:has(>[is=sidebar-view]) > [is=sidebar-view] > scroll-view,navigation-split-view:has(>[is=sidebar-view]) > body-view > scroll-view`
    )
  )
    possibleNest = prevAll<NavigationHost>(
      'body-view:not([hidden]),[is=sheet-view]:not([hidden]),navigation-stack:not([hidden]),navigation-split-view:not([hidden])',
      resolveDoc(body as Components.ScrollView)
    )?.[0] //resolveDoc(body)?.previousElementSibling as NavigationHost | null // look for prev sibling instead

  return possibleNest ?? undefined //?.matches('body-view,[is=sheet-view],navigation-stack,navigation-split-view') ? possibleNest : undefined
}

function getRank(el: Element, ranks: [string, number][]) {
  for (const [selector, rank] of ranks) if (el.matches(selector)) return rank

  return 99 // default if no match

  // return el.matches('navigation-split-view:has(>[is=sidebar-view]) > body-view > scroll-view')
  //   ? 1
  //   : el.matches('navigation-split-view > scroll-view, navigation-split-view:has(>[is=sidebar-view]) > [is=sidebar-view] > scroll-view')
  //     ? 2
  //     : 99

  // .sort((el) =>
  //   el.matches(
  //     `navigation-split-view > scroll-view,navigation-split-view:has(>[is=sidebar-view]) > [is=sidebar-view] > scroll-view,navigation-split-view:has(>[is=sidebar-view]) > body-view > scroll-view`
  //   )
  //     ? -1
  //     : 1
  // )
}

/**
 * Looks for child toolbarconfs
 */
export function queryToolbarConfig(any?: HTMLElement) {
  const nodes = [...(any?.querySelectorAll<NavigationToolbarConfiguration>(`:scope > tool-bar > tool-bar-item,:scope > tool-bar > tool-bar-item-group`) ?? [])]

  const ranks: [string, number][] = [
    [
      'navigation-split-view:has(>[is=sidebar-view]) > body-view > tool-bar > tool-bar-item,navigation-split-view:has(>[is=sidebar-view]) > body-view > tool-bar > tool-bar-item-group',
      1,
    ],
    [
      'navigation-split-view > tool-bar > tool-bar-item,navigation-split-view > tool-bar > tool-bar-item-group, navigation-split-view:has(>[is=sidebar-view]) > [is=sidebar-view] > tool-bar > tool-bar-item,navigation-split-view:has(>[is=sidebar-view]) > [is=sidebar-view] > tool-bar > tool-bar-item-group',
      2,
    ],
  ]

  return nodes.sort((a, b) => getRank(a, ranks) - getRank(b, ranks))

  // const possibleNest = hostSlot(body)

  // return (
  //   possibleNest?.querySelector(
  //     'tool-bar:not(navigation-stack[hidden] tool-bar,navigation-split-view[hidden] tool-bar) > tool-bar-item,tool-bar:not(navigation-stack[hidden] tool-bar,navigation-split-view[hidden] tool-bar) > tool-bar-item-group'
  //   ) ?? undefined
  // ) //'navigation-stack:not([hidden]) scroll-view'
}

/**
 * Queries descendant toolbarconfs
 */
export function queryToolbarConfigAll(any?: HTMLElement) {
  // const possibleNest = hostSlot(any)

  const nodes = [
    ...(any?.querySelectorAll<NavigationToolbarConfiguration>(
      'tool-bar:not(navigation-stack[hidden] tool-bar,navigation-split-view[hidden] tool-bar) > tool-bar-item,tool-bar:not(navigation-stack[hidden] tool-bar,navigation-split-view[hidden] tool-bar) > tool-bar-item-group'
    ) ?? []), //'navigation-stack:not([hidden]) scroll-view'
  ]

  const ranks: [string, number][] = [
    [
      'navigation-split-view:has(>[is=sidebar-view]) > body-view > tool-bar > tool-bar-item,navigation-split-view:has(>[is=sidebar-view]) > body-view > tool-bar > tool-bar-item-group',
      1,
    ],
    [
      'navigation-split-view > tool-bar > tool-bar-item,navigation-split-view > tool-bar > tool-bar-item-group, navigation-split-view:has(>[is=sidebar-view]) > [is=sidebar-view] > tool-bar > tool-bar-item,navigation-split-view:has(>[is=sidebar-view]) > [is=sidebar-view] > tool-bar > tool-bar-item-group',
      2,
    ],
  ]

  return nodes.sort((a, b) => getRank(a, ranks) - getRank(b, ranks))
}

/**
 * Queries slot for child-hosts. First is always sibling slot of sv.
 */
export function queryHost(body?: NavigationBody) {
  return queryHostAll(body)?.[0]
  // const possibleNest = hostSlot(body)
  // return possibleNest
  // possibleNest?.querySelector(
  //   'body-view:not(navigation-stack[hidden] body-view,navigation-split-view[hidden] body-view),[is=sheet-view]:not(navigation-stack[hidden] [is=sheet-view],navigation-split-view[hidden] [is=sheet-view])'
  // ) ??
  // undefined
}

/**
 * Queries slot for child-hosts, plus all descendant hosts. Order matters.
 */
export function queryHostAll(body?: NavigationBody) {
  const possibleNest = hostSlot(body)

  return [
    ...(possibleNest ? [possibleNest] : []),
    ...(possibleNest?.querySelectorAll<NavigationHost>(
      'body-view:not(navigation-stack[hidden] body-view,navigation-split-view[hidden] body-view),[is=sheet-view]:not(navigation-stack[hidden] [is=sheet-view],navigation-split-view[hidden] [is=sheet-view])'
    ) ?? []),
  ]
}

/**
 * Looks for child bodies (excluding current body)
 */
export function queryBody(any?: HTMLElement) {
  return queryBodyAll(any)?.[0]
}

/**
 * Queries scroll-views. Order matters. In cases of navsplitviews the 2 first scroll-views returned are the LAST TWO in natural dom tree order.
 */
export function queryBodyAll(any?: HTMLElement) {
  const nodes = [
    ...(any?.querySelectorAll<Components.ScrollView>('scroll-view:not(navigation-stack[hidden] scroll-view,navigation-split-view[hidden] scroll-view)') ?? []), //'navigation-stack:not([hidden]) scroll-view'
  ]

  const ranks: [string, number][] = [
    ['navigation-split-view:has(>[is=sidebar-view]) > body-view > scroll-view', 1],
    ['navigation-split-view > scroll-view, navigation-split-view:has(>[is=sidebar-view]) > [is=sidebar-view] > scroll-view', 2],
  ]

  return nodes.sort((a, b) => getRank(a, ranks) - getRank(b, ranks))
}

/**
 * Looks for child views (excluding current view)
 */
// export function queryView(body?: Components.ScrollView): NavigationItem {
//   const possibleNest = hostSlot(body)

//   return {
//     host:
//       possibleNest?.querySelector<NavigationHost>(
//         'body-view:not(navigation-stack[hidden] body-view,navigation-split-view[hidden] body-view),[is=sheet-view]:not(navigation-stack[hidden] [is=sheet-view],navigation-split-view[hidden] [is=sheet-view])'
//       ) ?? undefined,
//     body:
//       possibleNest?.querySelector<Components.ScrollView>('scroll-view:not(navigation-stack[hidden] scroll-view,navigation-split-view[hidden] scroll-view)') ??
//       undefined,
//     toolBarConfig: [
//       ...(possibleNest?.querySelectorAll<NavigationToolbarConfiguration>(
//         'tool-bar:not(navigation-stack[hidden] tool-bar,navigation-split-view[hidden] tool-bar) > tool-bar-item,tool-bar:not(navigation-stack[hidden] tool-bar,navigation-split-view[hidden] tool-bar) > tool-bar-item-group'
//       ) ?? []), //'navigation-stack:not([hidden]) scroll-view'
//     ],
//   }
// }
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

export { Snapshot, NavigationPath }
