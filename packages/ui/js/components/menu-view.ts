import { CleanupRegistry } from '../internal/class/cleanup-registry'
import { $, devFlags, onoff, renderLabel, touchGlass } from '../internal/utils'

/**
 * @summary A control for presenting a menu of actions.
 */
export class MenuView extends HTMLElement {
  static get observedAttributes() {
    return ['open', 'closing', 'label']
  }

  static #template: DocumentFragment

  static get template() {
    return (this.#template ??= $(
      String.raw`
  <button type="button" part="root button menu-summary">
    <slot name="label"></slot>
  </button>
  <dialog part="root menu-dialog" autofocus inert>
    <form part="root menu-form" method="dialog" novalidate>
      <div part="root menu-scrollable">
        <slot></slot>
      </div>
    </form>
  </dialog>`
    ))
  }

  #shadowRoot

  #dialog?: HTMLDialogElement

  constructor() {
    super()

    this.#shadowRoot = this.attachShadow({ mode: 'closed' })

    this.#shadowRoot.appendChild(document.importNode((this.constructor as typeof MenuView).template, true))
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (devFlags.debug) console.debug(`${MenuView.name} ⚡️ attr-change [${name}] ("${oldValue}" → "${newValue}")`)

    switch (name) {
      case 'open':
        if (!this.#dialog) break

        this.#dialog.inert = null === newValue

        if (null === newValue && this.#dialog.open) {
          if (devFlags.debug) console.debug(`${MenuView.name} ⚡️ will-close`)

          this.setAttribute('closing', '')

          Promise.allSettled(this.#dialog.getAnimations().map(({ finished }) => finished)).then(() => {
            if (!this.hasAttribute('closing')) return

            this.#dialog?.close()

            this.removeAttribute('closing')
          })
        }

        if ('' === newValue && !this.#dialog.open) {
          if (devFlags.debug) console.debug(`${MenuView.name} ⚡️ will-open`)

          this.removeAttribute('closing')

          const form = this.#shadowRoot.querySelector<HTMLFormElement>('form')!

          form.scrollTop = 0

          this.#dialog.showModal()
        }

        break
      case 'label':
        renderLabel( ':scope>[slot=label]', `<label-view slot="label"><span></span></label-view>`, this,newValue)

        break
    }
  }

  disconnectedCallback() {
    if (devFlags.debug) console.debug(`${MenuView.name} ⚡️ disconnect`)

    // const dialog = this.#shadowRoot.querySelector('dialog'),
    //   trigger = this.#shadowRoot.querySelector('button')

    // trigger?.removeEventListener('click', this.#handleTriggerClick)

    // dialog?.removeEventListener('click', this.#handleDialogClick)
    // dialog?.removeEventListener('close', this.#handleDialogClose)
    // dialog?.removeEventListener('cancel', this.#handleDialogCancel)

    const summaryPart = this.#shadowRoot.querySelector<HTMLElement>('[part*=menu-summary]'),
      dialogPart = this.#shadowRoot.querySelector<HTMLElement>('[part*=menu-dialog]')

    summaryPart?.style.removeProperty('anchor-name') //$.prop('anchor-name', null, summaryPart)
    dialogPart?.style.removeProperty('position-anchor') //$.prop('position-anchor', null, dialogPart)

    CleanupRegistry.unregister(this)
  }

  connectedCallback() {
    if (devFlags.debug) console.debug(`${MenuView.name} ⚡️ connect`)

    this.#dialog = this.#shadowRoot.querySelector<HTMLDialogElement>('dialog') ?? undefined

    const trigger = this.#shadowRoot.querySelector('button') ?? undefined

    CleanupRegistry.register(this, onoff('click', this.#handleTriggerClick, trigger).on())

    CleanupRegistry.register(
      this,
      onoff(
        [
          { types: 'click', listener: this.#handleDialogClick },
          { types: 'close', listener: this.#handleDialogClose },
          { types: 'cancel', listener: this.#handleDialogCancel },
        ],
        this.#dialog
      ).on()
    )

    CleanupRegistry.register(
      this,
      onoff(
        touchGlass(
          this,
          (t) => t,
          ({ target }: PointerEvent) => {
            if (!(target instanceof HTMLElement)) return true

            if (target.matches('menu-view')) return false
            if (!target.closest('menu-view[open]')) return false

            return true
          }
        ),
        this
      ).on()
    )

    const newAnchorName = `--menu-view-${self.crypto.randomUUID()}`

    const summaryPart = this.#shadowRoot.querySelector<HTMLElement>('[part*=menu-summary]'),
      dialogPart = this.#shadowRoot.querySelector<HTMLElement>('[part*=menu-dialog]')

    summaryPart?.style.setProperty('anchor-name', newAnchorName, 'important') // override unset:all // $.prop('anchor-name', newAnchorName, summaryPart, 'important') //
    dialogPart?.style.setProperty('position-anchor', newAnchorName) // $.prop('position-anchor', newAnchorName, dialogPart) //
  }

  #handleDialogClick: EventListener = ({ type, target }: Event) => {
    if (devFlags.debug) console.debug(`${MenuView.name} ⚡️ ${type}`)

    if (!(target instanceof HTMLElement)) return

    if (target.matches('dialog')) return this.toggleAttribute('open', false) // click outside

    target.scrollIntoView({
      behavior: self.matchMedia('(prefers-reduced-motion: no-preference)').matches ? 'smooth' : 'instant',
      block: 'nearest',
      inline: 'nearest',
    })

    if (!target.closest('button')) return
    // TODO: Handle btns this.toggleAttribute('open', false)

    this.toggleAttribute('open', false)

    // event.stopPropagation() //NOTE: add this only if not nested, disposes all nicely if ommited
  }

  #handleTriggerClick = (evt: Event) => {
    if (devFlags.debug) console.debug(`${MenuView.name} ⚡️ ${evt?.type}`)

    this.toggleAttribute('open', true)
  }

  // intercept to modify open attr
  #handleDialogCancel: EventListener = (evt: Event) => {
    if (devFlags.debug) console.debug(`${MenuView.name} ⚡️ ${evt?.type}`)

    if (!evt.cancelable) return

    evt.preventDefault()

    this.toggleAttribute('open', false)
  }

  #handleDialogClose: EventListener = (evt: Event) => {
    if (devFlags.debug) console.debug(`${MenuView.name} ⚡️ ${evt?.type}`)

    this.toggleAttribute('open', this.#shadowRoot.querySelector('dialog')?.open ?? false)
  }
}
