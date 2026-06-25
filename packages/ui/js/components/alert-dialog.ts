import { alertDialog } from '../buses'
import type { AlertReturnDetail } from '../events'
import { CleanupRegistry } from '../internal/class/cleanup-registry'
import { devFlags, onoff, touchGlass } from '../internal/utils'
import { DialogBase } from '../namespace-browser/base'

export class AlertDialog extends DialogBase {
  constructor() {
    super()
  }

  static polyfillDisconnectedCallback(el: AlertDialog) {
    if (devFlags.debug) console.debug(`${AlertDialog.name} ⚡️ disconnect`)

    CleanupRegistry.unregister(el)

    alertDialog.dispatchEvent(
      new CustomEvent<AlertReturnDetail>('alert:return', {
        detail: { returnValue: el.returnValue },
        bubbles: true,
        composed: true,
      })
    )
  }

  static polyfillConnectedCallback(el: AlertDialog) {
    if (devFlags.debug) console.debug(`${AlertDialog.name} ⚡️ connect`)

    CleanupRegistry.register(
      el,
      onoff(
        [
          { types: 'click', listener: this.#handleDialogClick as EventListener },
          { types: 'close', listener: this.#handleDialogClose },
          { types: 'cancel', listener: this.#handleDialogCancel },
        ],
        el
      ).on()
    )

    CleanupRegistry.register(
      el,
      onoff(
        touchGlass(
          el,
          (t) => t,
          ({ target }: PointerEvent) => {
            if (!(target instanceof HTMLElement)) return true

            if (target.matches('[is=alert-dialog]')) return false

            return true
          }
        ),
        el
      ).on()
    )

    if (devFlags.debug) console.debug(`${AlertDialog.name} ⚡️ will-open`)

    el.removeAttribute('closing')

    el.scrollTop = 0

    el.returnValue = ''

    el.autofocus = true

    el.showModal()
  }

  static polyfillAttributeChangedCallback([{ attributeName, target, oldValue }]: Pick<MutationRecord, 'attributeName' | 'oldValue' | 'target'>[]) {
    if (devFlags.debug) console.debug(`${AlertDialog.name} ⚡️ attr-change [${attributeName}] ("${oldValue}" → "${(target as HTMLElement).getAttribute(attributeName ?? '')}")`)

    switch (attributeName) {
      case 'label':
        //

        break
    }
  }

  static #handleDialogClick = (evt: PointerEvent) => {
    if (devFlags.debug) console.debug(`${AlertDialog.name} ⚡️ ${evt?.type}`)

    const { target, currentTarget: dialog } = evt

    if (!(dialog instanceof HTMLDialogElement)) return

    if (!(target instanceof HTMLElement)) return

    const button = target.closest<HTMLButtonElement>('button')
    if (!button) return

    button.scrollIntoView({
      behavior: self.matchMedia('(prefers-reduced-motion: no-preference)').matches ? 'smooth' : 'instant',
      block: 'nearest',
      inline: 'nearest',
    })

    dialog.returnValue = button.value

    dialog.requestClose(button.value)

    evt.stopPropagation()
    evt.stopImmediatePropagation()
  }

  static #handleDialogCancel: EventListener = (evt: Event) => {
    if (devFlags.debug) console.debug(`${AlertDialog.name} ⚡️ ${evt?.type}`)

    if (!evt.cancelable) return

    const { target } = evt

    if (!(target instanceof HTMLDialogElement)) return

    evt.preventDefault()

    target.inert = true

    if (devFlags.debug) console.debug(`${AlertDialog.name} ⚡️ will-close`)

    target.setAttribute('closing', '')

    Promise.allSettled(target.getAnimations().map(({ finished }) => finished)).then(() => {
      if (!target.hasAttribute('closing')) return

      target?.close(target?.returnValue)

      target.removeAttribute('closing')
    })
  }

  static #handleDialogClose: EventListener = ({ type, target }: Event) => {
    if (devFlags.debug) console.debug(`${AlertDialog.name} ⚡️ ${type}`)

    if (!(target instanceof HTMLDialogElement)) return

    target.remove()
  }
}
