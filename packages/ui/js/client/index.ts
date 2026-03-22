import * as Components from '../components'
import { kebabCase, onoff } from '../internal/utils'
import { Snapshot } from '../snapshot'
import { NavigationProvider } from '../navigation-provider'
import { type WebComponentCtor } from '../namespace-browser'
import { type NavigationHost, NavigationToolbarConfiguration } from '../internal/privateNamespace'
import { NavigationPath } from '../internal/class/navigation-path'

export const polyfills: Map<string, WebComponentCtor> = new Map()

type TransitionType = 'forwards' | 'backwards' | 'reload'

for (const [k, Ctor] of Object.entries(Components)) {
  const is = kebabCase(k)

  if ('polyfillExtends' in Ctor && 'string' === typeof (Ctor as any).polyfillExtends) {
    if (customElements.get(is)) continue

    customElements.define(is, Ctor, { extends: Ctor.polyfillExtends })

    if (!(document.createElement(Ctor.polyfillExtends, { is }) instanceof Ctor)) polyfills.set(is, Ctor)

    continue
  }

  if (!customElements.get(is)) customElements.define(is, Ctor)
}

console.debug(polyfills)

if (0 < polyfills.size) {
  const polyfillTagNamesCache = new Set([...polyfills.values()].map((v) => String(v.polyfillExtends ?? '').toUpperCase()).filter(Boolean)) // ['TAG-NAME1', 'TAG-NAME2', ...]

  const handlers = new WeakMap<HTMLElement, MutationObserver>()

  const observe = (el: HTMLElement, polyfill: WebComponentCtor) => {
      if (!Array.isArray(polyfill.observedAttributes)) return
      if (0 === polyfill?.observedAttributes.length) return
      if (!polyfill.polyfillAttributeChangedCallback) return

      const observer = new MutationObserver(polyfill.polyfillAttributeChangedCallback)

      observer.observe(el, {
        attributes: true,
        attributeFilter: polyfill.observedAttributes,
        attributeOldValue: true,
      })

      handlers.set(el, observer)

      for (const attributeName of polyfill.observedAttributes)
        if (el.hasAttribute(attributeName)) {
          const entry = {
            attributeName,
            oldValue: null,
            target: el,
          }

          void polyfill.polyfillAttributeChangedCallback([entry])
        }
    },
    unobserve = (el: HTMLElement) => {
      handlers.delete(el)
    },
    polyfillTagNamesCacheSelector = [...polyfillTagNamesCache.values()].map((v) => `${v}`.toLowerCase()).join(','),
    flatten = (node: HTMLElement) => [node, ...(node.querySelectorAll?.(polyfillTagNamesCacheSelector) ?? [])]

  console.debug(polyfillTagNamesCache, polyfillTagNamesCacheSelector)

  for (const [is, polyfill] of polyfills)
    for (const el of document.querySelectorAll<HTMLElement>(`${polyfill.polyfillExtends}[is="${CSS.escape(is)}"]`)) {
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

          observe(node, polyfills.get(is)!)
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
const cleanup = (lm?: Element, type?: TransitionType) => {
  let arr: string[] = [Snapshot.config!['vt-fwd-class-name'], 'fwdd', 'fwn', 'fwnn', 'bwd', 'bwdd', 'bwn', 'bwnn']

  if (['backwards', 'forwards'].includes(type ?? ''))
    for (let i = arr.length - 1; i >= 0; i--) if (arr[i].startsWith('backwards' === type ? 'fw' : 'bw')) arr.splice(i, 1)

  for (const el of [...(lm?.querySelectorAll(arr.map((v) => `.${v}`).join(',')) ?? [])]) el.classList.remove(...arr)
}

type UpdateCallback = () => void | Promise<void>

type NavigateOptions = {
  updateCallback?: UpdateCallback
  tos?: () => NavigationPath[]
}

export const startViewTransition = async (
  target: HTMLElement,
  type: TransitionType = 'forwards',
  updateCallbackOrOptions: UpdateCallback | NavigateOptions = async () => {}
) => {
  console.debug(`startViewTransition (${type})`, target)

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
    //   console.debug(`⚡️ view-transition-start (${type})`)
    //   await Promise.allSettled(newHost.getAnimations().map(({ finished }) => finished))
    //   console.debug(`⚡️ view-transition-end (${type})`)
    //   return
    // }

    // purge
    cleanup(root, 'backwards')

    // prepare old
    from.body?.classList.add(Snapshot.config!['vt-fwd-class-name'])

    for (const oldToolbar of from.toolBarConfig ?? []) oldToolbar.classList.add('fwn') // prepare navbs

    // prepare new
    const toolbarExclusion =
        0 < modalViews.length
          ? (value: NavigationToolbarConfiguration, index: number, array: NavigationToolbarConfiguration[]) =>
              value.parentElement?.matches('tool-bar:not(dialog tool-bar,body-view ~ tool-bar)')
          : (value: NavigationToolbarConfiguration, index: number, array: NavigationToolbarConfiguration[]) =>
              value.parentElement?.matches('tool-bar:not(body-view ~ tool-bar)'),
      bodyExclusion =
        0 < modalViews.length
          ? (item: NavigationPath) => item.body?.matches('scroll-view:not(dialog scroll-view)')
          : (value: NavigationPath, index: number, array: NavigationPath[]) => value

    for (const bti of newToolbars?.filter?.(toolbarExclusion) ?? []) bti.classList.add('fwnn') // for (const ti of newToolbars ?? []) ti.classList.add('fwnn') //

    for (const bt of tos?.filter?.(bodyExclusion) ?? []) bt.body?.classList.add('fwdd') //to?.classList.add('fwdd')

    if (0 < modalViews.length) {
      for await (const el of modalViews) (el as HTMLDialogElement).showModal()

      console.debug(`⚡️ view-dialog-transition-start (${type})`)

      await Promise.allSettled(modalViews?.[0].getAnimations().map(({ finished }) => finished))

      console.debug(`⚡️ view-dialog-transition-end (${type})`)
    } else {
      console.debug(`⚡️ view-transition-start (${type})`)

      await Promise.allSettled([
        ...(from.body?.getAnimations().map(({ finished }) => finished) ?? []),
        ...(to?.body?.getAnimations().map(({ finished }) => finished) ?? []),
      ])

      console.debug(`⚡️ view-transition-end (${type})`)
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
      ;(from.component as HTMLDialogElement).close()
      console.debug(`⚡️ view-dialog-transition-start (${type})`)
      await Promise.allSettled(from.component.getAnimations().map(({ finished }) => finished))
      console.debug(`⚡️ view-dialog-transition-end (${type})`)
      if (from.component.matches('[open]')) return
      await updateCallback()
      return // just close modal
    }

    const to = [...from.parents()].at(0)?.hydrate() //closestBody(oldPath.component?.parentElement ?? undefined)
    // console.log(99, to)

    if (!to) return console.debug('Can not go backwards.') // nothing to go back to

    const tv = to.body?.closest<Components.TabView>('tab-view')
    if (tv && to.body?.matches('tab-view>navigation-stack:has(> navigation-stack,> navigation-split-view)>:scope')) if (!tv.moreTabAllowed) return

    // const { toolBarConfig: newToolbars } = getComputedView(to.body)

    // purge
    cleanup(root, 'forwards')

    // prepare new
    for (const ti of to.toolBarConfig ?? []) ti.classList.add('bwnn')

    to.body?.classList.add('bwdd')

    // prepare old
    const inbetweenModals = froms.map((item) => item.component).filter((item): item is NavigationHost => !!item && item.matches('dialog[open]')), //queryHostAll(oldPage).filter?.((item) => item.matches('dialog[open]')) ?? [], // FIXME: TEst this, added oldHost too
      toolbarExclusion =
        0 < inbetweenModals.length
          ? (value: Element, index: number, array: Element[]) => value.parentElement?.matches('tool-bar:not(dialog tool-bar)')
          : (value: Element, index: number, array: Element[]) => value,
      bodyExclusion = 0 < inbetweenModals.length ? (item: HTMLElement) => item?.matches('scroll-view:not(dialog scroll-view)') : (item: HTMLElement) => item

    for (const ti of [...(from.toolBarConfig ?? []), ...(oldToolbars?.filter?.(toolbarExclusion) ?? [])]) ti.classList.add('bwn')

    for (const nn of [from.body, ...oldBodies?.filter?.(bodyExclusion)]) nn?.classList.add('bwd') //from?.classList.add('bwd')

    for (const el of inbetweenModals) (el as HTMLDialogElement).close() // close old inbetween modals

    // capture trans
    console.debug(`⚡️ view-transition-start (${type})`)

    await Promise.allSettled([
      ...(from.body?.getAnimations().map(({ finished }) => finished) ?? []),
      ...(to.body?.getAnimations().map(({ finished }) => finished) ?? []),
    ])

    console.debug(`⚡️ view-transition-end (${type})`)

    if (to.body?.closest(`.bwd,.${Snapshot.config?.['vt-fwd-class-name']}`)) return

    cleanup(root)

    // remove or hide
    await updateCallback()
  }
}

void Snapshot.waitReady // void Snapshot.setOwnConfig()

// SECTION: Utils
// onoff(
//   'transitionend transitionstart transitioncancel',
//   (evt: TransitionEvent) => {
//     if ('--state' !== evt.propertyName || '::before' !== evt.pseudoElement) return

//     const state = getComputedStyle(evt.target, 'before').getPropertyValue('--state')

//     evt?.target.closest('[navsticky]').toggleAttribute('stuck', '1' === state)
//   },
//   document
// ).on()

// export function getComputedView(body?: Components.ScrollView): NavigationItem {
//   const sv = body?.matches('scroll-view') ? body : undefined

//   const page = resolveDoc(sv), //body?.parentElement?.matches('dialog[is=sidebar-view]') ? (body?.parentElement as Components.SidebarView) : undefined,
//     host = closestHost(page) //(page?.parentElement as NavigationHost) ?? body?.parentElement ?? undefined

//   return {
//     host,
//     page,
//     body: sv,
//     toolBarConfig: queryToolbarConfig(host),
//     slot: queryHost(page),
//     // [
//     //   ...(host?.querySelectorAll<NavigationToolbarConfiguration>(`:scope > tool-bar > tool-bar-item,:scope > tool-bar > tool-bar-item-group`) ?? []),
//     // ],
//   }
// }

/**
 * Looks for child toolbarconfs
 */
// export function queryToolbarConfig(any?: HTMLElement) {
//   const nodes = [...(any?.querySelectorAll<NavigationToolbarConfiguration>(`:scope > tool-bar > tool-bar-item,:scope > tool-bar > tool-bar-item-group`) ?? [])]

//   const ranks: [string, number][] = [
//     [
//       'navigation-stack:has(>navigation-stack,>navigation-split-view) > tool-bar > tool-bar-item,navigation-stack:has(>navigation-stack,>navigation-split-view) > tool-bar > tool-bar-item-group',
//       1,
//     ],
//     [
//       'navigation-split-view:has(>[is=sidebar-view]) > body-view > tool-bar > tool-bar-item,navigation-split-view:has(>[is=sidebar-view]) > body-view > tool-bar > tool-bar-item-group',
//       2,
//     ],
//     [
//       'navigation-split-view > tool-bar > tool-bar-item,navigation-split-view > tool-bar > tool-bar-item-group, navigation-split-view:has(>[is=sidebar-view]) > [is=sidebar-view] > tool-bar > tool-bar-item,navigation-split-view:has(>[is=sidebar-view]) > [is=sidebar-view] > tool-bar > tool-bar-item-group',
//       3,
//     ],
//   ]

//   return nodes.sort((a, b) => getRank(a, ranks) - getRank(b, ranks))

//   // const possibleNest = hostSlot(body)

//   // return (
//   //   possibleNest?.querySelector(
//   //     'tool-bar:not(navigation-stack[hidden] tool-bar,navigation-split-view[hidden] tool-bar) > tool-bar-item,tool-bar:not(navigation-stack[hidden] tool-bar,navigation-split-view[hidden] tool-bar) > tool-bar-item-group'
//   //   ) ?? undefined
//   // ) //'navigation-stack:not([hidden]) scroll-view'
// }

/**
 * Queries descendant toolbarconfs
 */
// export function queryToolbarConfigAll(any?: HTMLElement) {
//   // const possibleNest = hostSlot(any)

//   const nodes = [
//     ...(any?.querySelectorAll<NavigationToolbarConfiguration>(
//       'tool-bar:not(navigation-stack[hidden] tool-bar,navigation-split-view[hidden] tool-bar) > tool-bar-item,tool-bar:not(navigation-stack[hidden] tool-bar,navigation-split-view[hidden] tool-bar) > tool-bar-item-group'
//     ) ?? []), //'navigation-stack:not([hidden]) scroll-view'
//   ]

//   const ranks: [string, number][] = [
//     [
//       'navigation-split-view:has(>[is=sidebar-view]) > body-view > tool-bar > tool-bar-item,navigation-split-view:has(>[is=sidebar-view]) > body-view > tool-bar > tool-bar-item-group',
//       1,
//     ],
//     [
//       'navigation-split-view > tool-bar > tool-bar-item,navigation-split-view > tool-bar > tool-bar-item-group, navigation-split-view:has(>[is=sidebar-view]) > [is=sidebar-view] > tool-bar > tool-bar-item,navigation-split-view:has(>[is=sidebar-view]) > [is=sidebar-view] > tool-bar > tool-bar-item-group',
//       2,
//     ],
//   ]

//   return nodes.sort((a, b) => getRank(a, ranks) - getRank(b, ranks))
// }

// export function buildTree(host, isCurrent) {
//   let current = null

//   function build(item, parent = null) {
//     const node = new NavigationPath(item, parent)

//     if (isCurrent(item)) current = node

//     if (item.children) {
//       node.children = item.children.map((child) => build(child, node))
//     }

//     return node
//   }

//   const root = build(host)

//   return { root, current }
// }

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

export { Snapshot, NavigationProvider, NavigationPath }
