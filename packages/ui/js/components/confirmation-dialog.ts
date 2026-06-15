import { confirmationDialog } from '../buses'
import { type ConfirmationReturnDetail } from '../events'
import { CleanupRegistry } from '../internal/class/cleanup-registry'
import { devFlags, isInside, onoff, touchGlass } from '../internal/utils'
import { DialogBase } from '../namespace-browser/base'

export class ConfirmationDialog extends DialogBase {
  static get observedAttributes() {
    return ['anchor']
  }

  constructor() {
    super()
  }

  static polyfillDisconnectedCallback(el: ConfirmationDialog) {
    if (devFlags.debug) console.debug(`${ConfirmationDialog.name} ⚡️ disconnect`)

    const positionAnchor = el.style.getPropertyValue('position-anchor')

    document.querySelector<HTMLElement>(`[style*="${positionAnchor}"]`)?.style.removeProperty('anchor-name') //$.prop('anchor-name', null, document.querySelector<HTMLElement>(`[style*="${positionAnchor}"]`))
    el.style.removeProperty('position-anchor') //$.prop('position-anchor', null, el)

    CleanupRegistry.unregister(el)

    confirmationDialog.dispatchEvent(
      new CustomEvent<ConfirmationReturnDetail>('confirmation:return', {
        detail: { returnValue: el.returnValue, positionAnchor },
        bubbles: true,
        composed: true,
      })
    )
  }

  static polyfillConnectedCallback(el: ConfirmationDialog) {
    if (devFlags.debug) console.debug(`${ConfirmationDialog.name} ⚡️ connect`)

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
            if (!(target instanceof HTMLElement && target)) return true

            if (target.matches('[is=confirmation-dialog]')) return false
            // if (!(event.target as HTMLElement).closest('menu-view[open]')) return false

            return true
          }
        ),
        el
      ).on()
    )

    if (devFlags.debug) console.debug(`${ConfirmationDialog.name} ⚡️ will-open`)

    el.removeAttribute('closing')

    el.scrollTop = 0

    el.returnValue = ''

    el.autofocus = true

    el.showModal()
  }

  static polyfillAttributeChangedCallback([{ attributeName, target, oldValue }]: Pick<MutationRecord, 'attributeName' | 'oldValue' | 'target'>[]) {
    if (devFlags.debug) console.debug(`${ConfirmationDialog.name} ⚡️ attr-change [${attributeName}] ("${oldValue}" → "${(target as HTMLElement).getAttribute(attributeName ?? '')}")`)

    // const newValue = (target as HTMLElement).getAttribute(attributeName ?? '')

    switch (attributeName) {
      case 'label':
        // let label = this.querySelector(':scope>[slot=label]')
        // if (newValue) {
        //   label ??= this.appendChild($(`<label-view slot="label"></label-view>`))
        //   label.setAttribute('title', newValue)
        // } else label?.remove()

        break
    }
  }

  static #handleDialogClick = (evt: PointerEvent) => {
    if (devFlags.debug) console.debug(`${ConfirmationDialog.name} ⚡️ ${evt?.type}`)

    const { target, currentTarget: dialog } = evt

    if (!(dialog instanceof HTMLDialogElement && dialog)) return

    if (!(target instanceof HTMLElement && target)) return

    if (target.matches('dialog') && !isInside(evt.clientX, evt.clientY, dialog.getBoundingClientRect())) return dialog.requestClose() // click outside

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
    if (devFlags.debug) console.debug(`${ConfirmationDialog.name} ⚡️ ${evt?.type}`)

    if (!evt.cancelable) return

    const { target } = evt
    if (!(target instanceof HTMLDialogElement && target)) return

    evt.preventDefault()

    target.inert = true

    if (devFlags.debug) console.debug(`${ConfirmationDialog.name} ⚡️ will-close`)

    target.setAttribute('closing', '')

    Promise.allSettled(target.getAnimations().map(({ finished }) => finished)).then(() => {
      if (!target.hasAttribute('closing')) return

      target?.close(target?.returnValue)

      target.removeAttribute('closing')
    })
  }

  static #handleDialogClose: EventListener = ({ type, target }: Event) => {
    if (devFlags.debug) console.debug(`${ConfirmationDialog.name} ⚡️ ${type}`)

    if (!(target instanceof HTMLDialogElement && target)) return

    target.remove()
  }
}
