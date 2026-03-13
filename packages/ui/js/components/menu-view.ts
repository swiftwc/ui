import { Snapshot } from '../snapshot'
import { touchGlass, $, onoff } from '../internal/utils'
import { CleanupRegistry } from '../internal/class/cleanup-registry'

export class MenuView extends HTMLElement {
  static observedAttributes = ['open', 'closing', 'label']

  static #template: HTMLTemplateElement

  static get template() {
    if (!this.#template)
      this.#template = Object.assign(document.createElement('template'), {
        innerHTML: `
  <button part="root menu-summary">
    <slot name="label"></slot>
  </button>
  <dialog part="root menu-dialog" autofocus inert>
    <form part="root menu-form" method="dialog" novalidate>
      <div part="root menu-scrollable">
        <slot></slot>
      </div>
    </form>
  </dialog>`,
      })

    return this.#template
  }

  #shadowRoot

  #dialog?: HTMLDialogElement

  constructor() {
    super()

    this.#shadowRoot = this.attachShadow({ mode: 'open' })

    Snapshot.waitReadyFor(this).then((r) => {
      if (!r) return

      this.#shadowRoot.appendChild(document.importNode((this.constructor as typeof MenuView).template.content, true))
    })
  }

  disconnectedCallback() {
    console.debug(`${MenuView.name} ⚡️ disconnect`)

    const dialog = this.#shadowRoot.querySelector('dialog'),
      trigger = this.#shadowRoot.querySelector('button')

    trigger?.removeEventListener('click', this.#handleTriggerClick)

    dialog?.removeEventListener('click', this.#handleDialogClick)
    dialog?.removeEventListener('close', this.#handleDialogClose)
    dialog?.removeEventListener('cancel', this.#handleDialogCancel)

    const summaryPart = this.#shadowRoot.querySelector<HTMLElement>('[part*=menu-summary]'),
      dialogPart = this.#shadowRoot.querySelector<HTMLElement>('[part*=menu-dialog]')

    $.prop('anchor-name', null, summaryPart) //summaryPart?.style.removeProperty('anchor-name')
    $.prop('position-anchor', null, dialogPart) //dialogPart?.style.removeProperty('position-anchor')

    CleanupRegistry.unregister(this)
  }

  connectedCallback() {
    console.debug(`${MenuView.name} ⚡️ connect`)

    Snapshot.waitReadyFor(this).then((r) => {
      if (!r) return

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

      const { on } = onoff(
        touchGlass(
          this,
          (t) => t,
          (event: PointerEvent) => {
            if ((event.target as HTMLElement).matches('menu-view')) return false
            if (!(event.target as HTMLElement).closest('menu-view[open]')) return false

            return true
          }
        ),
        this
      )

      CleanupRegistry.register(this, on())

      const newAnchorName = `--menu-view-${self.crypto.randomUUID()}`

      const summaryPart = this.#shadowRoot.querySelector<HTMLElement>('[part*=menu-summary]'),
        dialogPart = this.#shadowRoot.querySelector<HTMLElement>('[part*=menu-dialog]')

      $.prop('anchor-name', newAnchorName, summaryPart, 'important') //summaryPart?.style.setProperty('anchor-name', newAnchorName, 'important') // override unset:all
      $.prop('position-anchor', newAnchorName, dialogPart) //dialogPart?.style.setProperty('position-anchor', newAnchorName)
    })
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    console.debug(`${MenuView.name} ⚡️ attr-change [${name}] ("${oldValue}" → "${newValue}")`)

    switch (name) {
      case 'open':
        if (!this.#dialog) break

        this.#dialog.inert = null === newValue

        if (null === newValue && this.#dialog.open) {
          console.debug(`${MenuView.name} ⚡️ will-close`)

          this.setAttribute('closing', '')

          Promise.allSettled(this.#dialog.getAnimations().map(({ finished }) => finished)).then(() => {
            if (!this.hasAttribute('closing')) return

            this.#dialog?.close()

            this.removeAttribute('closing')
          })
        }

        if ('' === newValue && !this.#dialog.open) {
          console.debug(`${MenuView.name} ⚡️ will-open`)

          this.removeAttribute('closing')

          const form = this.#shadowRoot.querySelector<HTMLElement>('form')!

          form.scrollTop = 0

          this.#dialog.showModal()
        }

        break
      case 'label':
        let label = this.querySelector(':scope>[slot=label]')
        if (newValue) {
          label ??= this.appendChild($(`<label-view slot="label"></label-view>`))
          label.setAttribute('title', newValue)
        } else label?.remove()

        break
    }
  }

  #handleDialogClick: EventListener = (event: Event) => {
    console.debug(`${MenuView.name} ⚡️ ${event?.type}`)

    if ((event.target as HTMLElement).matches('dialog')) return this.toggleAttribute('open', false) // click outside

    const target = event.target as HTMLElement

    target.scrollIntoView({
      behavior: self.matchMedia('(prefers-reduced-motion: no-preference)').matches ? 'smooth' : 'instant',
      block: 'nearest',
      inline: 'nearest',
    })

    if (!(event.target as HTMLElement).closest('button')) return
    // TODO: Handle btns this.toggleAttribute('open', false)

    this.toggleAttribute('open', false)

    // event.stopPropagation() //NOTE: add this only if not nested, disposes all nicely if ommited
  }

  #handleTriggerClick = (event: Event) => {
    console.debug(`${MenuView.name} ⚡️ ${event?.type}`)

    this.toggleAttribute('open', true)
  }

  #handleDialogCancel: EventListener = (event: Event) => {
    console.debug(`${MenuView.name} ⚡️ ${event?.type}`)

    if (!event.cancelable) return

    event.preventDefault()

    this.toggleAttribute('open', false)
  }

  #handleDialogClose: EventListener = (event: Event) => {
    console.debug(`${MenuView.name} ⚡️ ${event?.type}`)

    this.toggleAttribute('open', this.#shadowRoot.querySelector('dialog')?.open ?? false)
  }
}
