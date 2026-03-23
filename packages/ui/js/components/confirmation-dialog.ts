import { DialogBase } from '../namespace-browser/base'
import { touchGlass, $, onoff } from '../internal/utils'
import { CleanupRegistry } from '../internal/class/cleanup-registry'
import { ConfirmationDialog as EvtBus } from '../confirmation-dialog'

export class ConfirmationDialog extends DialogBase {
  static observedAttributes = ['anchor']

  constructor() {
    super()
  }

  static polyfillDisconnectedCallback(el: ConfirmationDialog) {
    console.debug(`${ConfirmationDialog.name} ⚡️ disconnect`)

    $.prop('anchor-name', null, document.querySelector(`[style*="${el.style.positionAnchor}"]`))
    $.prop('position-anchor', null, el)

    CleanupRegistry.unregister(el)

    EvtBus.dispatchEvent(
      new CustomEvent<PageRevealSwapDetail>('close', {
        detail: { returnValue: el.returnValue, value: el.style.positionAnchor ?? `--confirmation-dialog` },
        bubbles: true,
        composed: true,
      })
    )
  }

  static polyfillConnectedCallback(el: ConfirmationDialog) {
    console.debug(`${ConfirmationDialog.name} ⚡️ connect`)

    // console.log(99, el.style.positionAnchor)

    // this.#dialog = this.#shadowRoot.querySelector<HTMLDialogElement>('dialog') ?? undefined

    // const trigger = this.#shadowRoot.querySelector('button') ?? undefined

    // CleanupRegistry.register(this, onoff('click', this.#handleTriggerClick, trigger).on())

    CleanupRegistry.register(
      el,
      onoff(
        [
          { types: 'click', listener: this.#handleDialogClick },
          { types: 'close', listener: this.#handleDialogClose },
          { types: 'cancel', listener: this.#handleDialogCancel },
        ],
        el
      ).on()
    )

    const { on } = onoff(
      touchGlass(
        el,
        (t) => t,
        (event: PointerEvent) => {
          if ((event.target as HTMLElement).matches('[is=confirmation-dialog]')) return false
          // if (!(event.target as HTMLElement).closest('menu-view[open]')) return false

          return true
        }
      ),
      el
    )

    CleanupRegistry.register(el, on())

    // const newAnchorName = `--menu-view-${self.crypto.randomUUID()}`

    // const summaryPart = this.#shadowRoot.querySelector<HTMLElement>('[part*=menu-summary]'),
    //   dialogPart = this.#shadowRoot.querySelector<HTMLElement>('[part*=menu-dialog]')

    // $.prop('anchor-name', newAnchorName, summaryPart, 'important')
    // $.prop('position-anchor', newAnchorName, dialogPart)

    console.debug(`${ConfirmationDialog.name} ⚡️ will-open`)

    el.removeAttribute('closing')

    el.scrollTop = 0

    el.returnValue = ''

    el.showModal()

    // EvtBus.dispatchEvent(
    //   new CustomEvent<PageRevealSwapDetail>('confirmation-dialog:open', {
    //     detail: { dialog: el, value: el.style.positionAnchor ?? `--confirmation-dialog` },
    //     bubbles: true,
    //     composed: true,
    //   })
    // )
  }

  static async polyfillAttributeChangedCallback([{ attributeName, target, oldValue }]: Pick<MutationRecord, 'attributeName' | 'oldValue' | 'target'>[]) {
    console.debug(
      `${ConfirmationDialog.name} ⚡️ attr-change [${attributeName}] ("${oldValue}" → "${(target as HTMLElement).getAttribute(attributeName ?? '')}")`
    )

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

  static #handleDialogClick: EventListener = (evt: Event) => {
    console.debug(`${ConfirmationDialog.name} ⚡️ ${evt?.type}`)

    const dialog = evt.currentTarget as HTMLDialogElement | null
    if (!dialog) return

    const target = evt.target as HTMLElement | null

    if (target?.matches('dialog')) return dialog?.requestClose() // click outside

    const button = target?.closest<HTMLButtonElement>('button')
    if (!button) return

    button.scrollIntoView({
      behavior: self.matchMedia('(prefers-reduced-motion: no-preference)').matches ? 'smooth' : 'instant',
      block: 'nearest',
      inline: 'nearest',
    })

    dialog.returnValue = button.value

    dialog?.requestClose(button.value)

    evt?.stopPropagation()
    evt?.stopImmediatePropagation()
  }

  static #handleDialogCancel: EventListener = (evt: Event) => {
    console.debug(`${ConfirmationDialog.name} ⚡️ ${evt?.type}`)

    if (!evt.cancelable) return

    const target = evt.target as HTMLDialogElement | null
    if (!target) return

    evt.preventDefault()

    target.inert = true

    console.debug(`${ConfirmationDialog.name} ⚡️ will-close`)

    target.setAttribute('closing', '')

    Promise.allSettled(target.getAnimations().map(({ finished }) => finished)).then(() => {
      if (!target.hasAttribute('closing')) return

      target?.close(target?.returnValue)

      target.removeAttribute('closing')
    })
  }

  static #handleDialogClose: EventListener = (evt: Event) => {
    console.debug(`${ConfirmationDialog.name} ⚡️ ${evt?.type}`)

    const target = evt.target as HTMLDialogElement | null

    target?.remove()
  }
}
