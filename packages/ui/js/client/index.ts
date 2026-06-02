import { alertDialog, confirmationDialog as confirmationDialogBus, lifecycleObserver } from '../buses'
import * as Components from '../components'
import { type PageRevealSwapDetail } from '../events'
import { I18n } from '../i18n'
import { NavigationPath } from '../internal/class/navigation-path'
import { type NavigationHost, NavigationToolbarConfiguration } from '../internal/privateNamespace'
import { $, kebabCase, onoff } from '../internal/utils'
import { type WebComponentCtor } from '../namespace-browser'
import { Snapshot } from '../snapshot'

//#region polyfills
export const polyfills: Map<string, WebComponentCtor> = new Map()

type TransitionType = 'forwards' | 'backwards' | 'reload'

for (const [k, Ctor] of Object.entries(Components)) {
  const is = kebabCase(k)

  if ('polyfillExtends' in Ctor && 'string' === typeof (Ctor as any).polyfillExtends) {
    if (customElements.get(is)) continue

    customElements.define(is, Ctor, { extends: Ctor.polyfillExtends })

    if (!(document.createElement(Ctor.polyfillExtends, { is }) instanceof Ctor)) polyfills.set(is, Ctor)

    // const testEl = document.createElement('template')
    // testEl.innerHTML = `<${Ctor.polyfillExtends} is="${is}"></${Ctor.polyfillExtends}>`
    // const testNode = testEl.content.firstElementChild,
    if (!($(`<${Ctor.polyfillExtends} is="${is}"></${Ctor.polyfillExtends}>`, '>1') instanceof Ctor)) polyfills.set(is, Ctor)

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

          polyfill.polyfillAttributeChangedCallback([entry])
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
//#endregion

// SECTION

const handleHelp = ({ target, relatedTarget }: PointerEvent) => {
    if (!(target instanceof HTMLElement && target)) return

    const trigger = target.closest<HTMLElement>('[help]')
    if (!trigger) return

    if (relatedTarget instanceof HTMLElement && relatedTarget && trigger.contains(relatedTarget)) return

    const newAnchorName = `--help-${self.crypto.randomUUID()}`

    const tooltip = $<HTMLElement>(`<fine-tooltip></fine-tooltip>`, '>1')

    trigger.style.setProperty('anchor-name', newAnchorName)

    tooltip.style.setProperty('position-anchor', newAnchorName)

    document.body.appendChild(tooltip)

    // setInterval(() => {
    //   trigger.setAttribute('help', trigger.getAttribute('help') + 'h')
    // }, 2000)
    // console.log(999, trigger)
  },
  handleDone = ({ target, relatedTarget }: PointerEvent) => {
    if (!(target instanceof HTMLElement && target)) return

    const trigger = target.closest<HTMLElement>('[help]')
    if (!trigger) return

    if (relatedTarget instanceof HTMLElement && relatedTarget && trigger.contains(relatedTarget)) return

    const anchorName = (
      trigger.style as CSSStyleDeclaration & {
        anchorName: string
      }
    ).anchorName
    if (!anchorName.startsWith('--help-')) return
    // for (const el of document.querySelectorAll<HTMLElement>(`[style*="--help-${CSS.escape(anchorName)}"][help]`)) el.style.removeProperty('anchor-name') //trigger.style.removeProperty('anchor-name')
    // for (const el of document.querySelectorAll(`[style*="${CSS.escape(anchorName)}"]:not([help])`)) el.remove()
    //   return
    // }

    const tooltip = document.querySelector<HTMLElement>(`[style*="${CSS.escape(anchorName)}"]:not([help])`)
    if (!tooltip) return
    // for (const el of document.querySelectorAll<HTMLElement>(`[style*="--help-${CSS.escape(anchorName)}"][help]`)) el.style.removeProperty('anchor-name') //trigger.style.removeProperty('anchor-name')
    // for (const el of document.querySelectorAll(`[style*="${CSS.escape(anchorName)}"]:not([help])`)) el.remove()
    //   return
    // }
    // trigger.style.removeProperty('anchor-name')

    tooltip.hidePopover() // tooltip.remove?.()
  }

const mediaQueryList = self.matchMedia(`(pointer: fine)`)

mediaQueryList.addEventListener('change', ({ matches }) => {
  for (const [k, v] of [
    ['pointerover', handleHelp],
    ['pointerout', handleDone],
  ] as Array<[keyof DocumentEventMap, (e: any) => void]>)
    document.removeEventListener(k, v)

  if (matches)
    for (const [k, v] of [
      ['pointerover', handleHelp],
      ['pointerout', handleDone],
    ] as Array<[keyof DocumentEventMap, (e: any) => void]>)
      document.addEventListener(k, v, { passive: true })
})

if (mediaQueryList.matches)
  for (const [k, v] of [
    ['pointerover', handleHelp],
    ['pointerout', handleDone],
  ] as Array<[keyof DocumentEventMap, (e: any) => void]>)
    document.addEventListener(k, v, { passive: true })

//#region Transitions
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

      console.debug(`⚡️ view-dialog-transition-start (${type})`)

      await Promise.allSettled(modalViews?.[0].getAnimations().map(({ finished }) => finished))

      console.debug(`⚡️ view-dialog-transition-end (${type})`)
    } else {
      console.debug(`⚡️ view-transition-start (${type})`)

      await Promise.allSettled([...(from.body?.getAnimations().map(({ finished }) => finished) ?? []), ...(to?.body?.getAnimations().map(({ finished }) => finished) ?? [])])

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
      from.body?.dispatchEvent(new CustomEvent<PageRevealSwapDetail>('pageswap', { detail: { page: from.body }, bubbles: true, composed: true }))
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
    console.debug(`⚡️ view-transition-start (${type})`)

    await Promise.allSettled([...(from.body?.getAnimations().map(({ finished }) => finished) ?? []), ...(to.body?.getAnimations().map(({ finished }) => finished) ?? [])])

    console.debug(`⚡️ view-transition-end (${type})`)

    if (to.body?.closest(`.bwd,.${Snapshot.config?.['vt-fwd-class-name']}`)) return

    cleanup(root)

    // remove or hide
    await updateCallback()
  }
}
//#endregion

//#region fns
export const alert = async (
  title?: string,
  message?: string,
  actions?: {
    label?: string
    image?: string
    role?: string
    // action?: () => void | Promise<void>
  }[],
  options?: { titleVisibility?: boolean }
) => {
  await navigator.locks.request('alert:', async () => {
    const dialog = $<HTMLDialogElement>(`<dialog is="alert-dialog"></dialog>`, '>1'),
      vStack = dialog.querySelector(':scope>v-stack') ?? dialog.appendChild($(`<v-stack spacing="1" alignment="fill"></v-stack>`, '>1'))

    if (title) {
      const label = $(`<label-view font="headline"></label-view>`, '>1')
      label.setAttribute('title', title)
      vStack.insertAdjacentElement('beforeend', label)
    }

    if (message) {
      const label = $(`<label-view foreground="secondary" font="callout"></label-view>`, '>1')
      label.setAttribute('title', message)
      vStack.insertAdjacentElement('beforeend', label)
    }

    for (const [index, action] of (
      actions ?? [
        {
          role: 'close',
        },
      ]
    ).entries()) {
      const btn = $(`<button type="button" tabindex="0" is="bordered-button"></button>`, '>1')

      btn.setAttribute('value', `${index}`)
      if (action?.role) btn.setAttribute('role', action.role)

      if (action.label || action.image) {
        const label = $(`<label-view></label-view>`, '>1')
        if (action.label) label.setAttribute('title', action.label)
        if (action.image) label.setAttribute('system-image', action.image)
        btn.appendChild(label)
      }

      dialog.insertAdjacentElement('beforeend', btn)
    }

    document.body.insertAdjacentElement('beforeend', dialog)

    dialog.showModal()

    const { promise, resolve } = Promise.withResolvers<string>(),
      off = onoff(
        'alert:return',
        (evt: any) => {
          off()
          resolve(evt.detail.returnValue)
        },
        alertDialog,
        { once: true }
      ).on()

    return promise
  })
}

export const confirmationDialog = async (
  trigger: HTMLElement,
  title: string,
  message?: string,
  actions?: {
    label?: string
    image?: string
    role?: string
    // action?: () => void | Promise<void>
  }[],
  options?: { controller?: AbortController; titleVisibility?: boolean }
) => {
  const newAnchorName = `--confirmation-dialog-${self.crypto.randomUUID()}`

  const dialog = $<HTMLDialogElement>(`<dialog is="confirmation-dialog"></dialog>`, '>1'),
    vStack = dialog.querySelector(':scope>v-stack') ?? dialog.appendChild($(`<v-stack spacing="1" alignment="fill"></v-stack>`, '>1'))

  trigger.style.setProperty('anchor-name', newAnchorName, 'important') //$.prop('anchor-name', newAnchorName, trigger, 'important')
  dialog.style.setProperty('position-anchor', newAnchorName) //$.prop('position-anchor', newAnchorName, dialog)

  if (title && false !== options?.titleVisibility) {
    const label = $(`<label-view font="headline"></label-view>`, '>1')
    label.setAttribute('title', title)
    vStack.insertAdjacentElement('beforeend', label)
  }

  if (message && false !== options?.titleVisibility) {
    const label = $(`<label-view foreground="secondary" font="callout"></label-view>`, '>1')
    label.setAttribute('title', message)
    vStack.insertAdjacentElement('beforeend', label)
  }

  for (const [index, action] of (actions ?? []).entries()) {
    const btn = $(`<button type="button" tabindex="0" is="bordered-button"></button>`, '>1')

    btn.setAttribute('value', `${index}`)
    if (action?.role) btn.setAttribute('role', action.role)

    if (action.label || action.image) {
      const label = $(`<label-view></label-view>`, '>1')
      if (action.label) label.setAttribute('title', action.label)
      if (action.image) label.setAttribute('system-image', action.image)
      btn.appendChild(label)
    }

    dialog.insertAdjacentElement('beforeend', btn)
  }

  trigger.closest('body-view,dialog')?.insertAdjacentElement('beforeend', dialog) // dialog.showModal()

  const { promise, resolve } = Promise.withResolvers<string>(),
    off = onoff(
      'confirmation:return',
      (evt: any) => {
        off()
        resolve(evt.detail.returnValue)
      },
      confirmationDialogBus,
      { once: true }
    ).on()

  return promise

  // return await new Promise((resolve, reject) => {
  //   const onClose = (evt: any) => {
  //       off()
  //       resolve(evt.detail.returnValue)
  //     },
  //     off = onoff('return', onClose, ConfirmationDialog, { once: true }).on()

  //   // const onAbort = () => {
  //   //   cleanup()
  //   //   reject(new DOMException('aborted', 'AbortError'))
  //   // }

  //   // const cleanup = () => {
  //   //   ConfirmationDialog.removeEventListener('close', onClose)
  //   //   // controller.signal.removeEventListener('abort', onAbort)
  //   // }

  //   // ConfirmationDialog.addEventListener('close', onClose, { once: true })
  //   // controller.signal.addEventListener('abort', onAbort, { once: true })
  // })
}
//#endregion

void Snapshot.waitReady // void Snapshot.setOwnConfig()

//#region exports

export { I18n, lifecycleObserver, NavigationPath, Snapshot }

export { type NavigationHost }

//#endregion
