import { alertDialog, confirmationDialog as confirmationDialogBus, lifecycleObserver } from '../buses'
import * as Components from '../components'
import type { AlertReturnDetail, ConfirmationReturnDetail } from '../events'
import { I18n } from '../i18n'
import { NavigationPath } from '../internal/class/navigation-path'
import { type NavigationHost, queryInsertPosition, startViewTransition } from '../internal/privateNamespace'
import { $, devFlags, kebabCase, onoff } from '../internal/utils'
import { type WebComponentCtor } from '../namespace-browser'
import { Snapshot } from '../snapshot'
import { html, render } from '../tpl'

//#region polyfills
export const polyfills: Map<string, WebComponentCtor> = new Map()

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

if (devFlags.debug) console.debug(polyfills)

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

  if (devFlags.debug) console.debug(polyfillTagNamesCache, polyfillTagNamesCacheSelector)

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
    if (!(target instanceof HTMLElement)) return

    const trigger = target.closest<HTMLElement>('[help]')
    if (!trigger) return
    if (['PICKER-VIEW'].includes(trigger.tagName)) return

    if (relatedTarget instanceof HTMLElement && trigger.contains(relatedTarget)) return

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
    if (!(target instanceof HTMLElement)) return

    const trigger = target.closest<HTMLElement>('[help]')
    if (!trigger) return
    if (['PICKER-VIEW'].includes(trigger.tagName)) return

    if (relatedTarget instanceof HTMLElement && trigger.contains(relatedTarget)) return

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

//#region fns
// const a = alert('Saving…', 'Please wait')
// // later, e.g. save completed early
// a.dismiss()          // silently resolves undefined, closes+removes dialog
// // or
// a.dismiss(new Error('cancelled')) // rejects instead
// const result = await a // still works normally if not dismissed
// const ac = new AbortController()
// const a = alert('Uploading…', 'Please wait', undefined, { signal: ac.signal })
// // elsewhere, e.g. upload finished before the user dismissed
// ac.abort() // dialog closes silently, a rejects with AbortError
// // or still works standalone
// a.dismiss() // same effect, no signal needed
/**
 * Presents an alert with a message using the given data to produce the alert’s content and a string variable as a title.
 */
export const alert = (
  title?: string,
  message?: string,
  actions?: {
    label?: string
    image?: string
    role?: string
  }[],
  options?: { titleVisibility?: boolean; signal?: AbortSignal }
) => {
  const { promise, resolve, reject } = Promise.withResolvers<string | undefined>()

  let dialog: HTMLDialogElement | undefined
  let off: (() => void) | undefined

  const dismiss = (reason?: unknown) => {
    off?.()
    dialog?.close()
    // dialog?.remove()
    reason === undefined ? resolve(undefined) : reject(reason instanceof Error ? reason : new DOMException('Alert dismissed', 'AbortError'))
  }

  if (options?.signal)
    if (options.signal.aborted)
      dismiss(options.signal.reason) // already aborted before we even started — settle immediately, skip showing anything
    else options.signal.addEventListener('abort', () => dismiss(options.signal!.reason), { once: true })

  navigator.locks
    .request('alert:', async () => {
      if (options?.signal?.aborted) return // in case it was aborted while queued behind another lock holder

      const mount = document.createElement('div')
      render(
        html`<dialog is="alert-dialog">
          <v-stack spacing="1" alignment="fill">
            ${title ? html`<label-view font="headline" title="${title}"></label-view>` : null}
            ${message ? html`<label-view foreground="secondary" font="callout" title="${message}"></label-view>` : null}
          </v-stack>
          ${(actions ?? [{ role: 'close' }]).map(
            (action, index) => html`
              <button type="button" tabindex="0" is="bordered-button" value="${index}" role="${action.role ?? null}">
                ${action.label || action.image ? html`<label-view title="${action.label ?? null}" system-image="${action.image ?? null}"></label-view>` : null}
              </button>
            `
          )}
        </dialog>`,
        mount
      )

      dialog = mount.firstElementChild as HTMLDialogElement

      document.body.insertAdjacentElement('beforeend', dialog)
      dialog.showModal()

      off = onoff(
        'alert:return',
        (evt: any) => {
          const { detail } = evt as CustomEvent<AlertReturnDetail>
          off?.()
          resolve(detail.returnValue)
        },
        alertDialog,
        { once: true }
      ).on()

      return promise
    })
    .catch(() => {})

  return Object.assign(promise, { dismiss })
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
        const { detail } = evt as CustomEvent<ConfirmationReturnDetail>

        off()
        resolve(detail.returnValue)
      },
      confirmationDialogBus,
      { once: true }
    ).on()

  return promise
}
//#endregion

void Snapshot.waitReady

//#region exports
export { I18n, lifecycleObserver, NavigationPath, queryInsertPosition, Snapshot, startViewTransition }

export { type NavigationHost }
//#endregion
