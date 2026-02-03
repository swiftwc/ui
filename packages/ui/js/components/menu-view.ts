import { Snapshot } from '../snapshot'
import { touchGlass } from '../internal/utils'

export class MenuView extends HTMLElement {
  static observedAttributes = ['open', 'closing']

  static #template: HTMLTemplateElement

  static get template() {
    if (!this.#template)
      this.#template = Object.assign(document.createElement('template'), {
        innerHTML: `<button part="root menu-summary">
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

  #cleanup?: () => void

  constructor() {
    super()

    this.#shadowRoot = this.attachShadow({ mode: 'open' })

    Snapshot.waitReady.then(() => {
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

    summaryPart?.style.removeProperty('anchor-name')
    dialogPart?.style.removeProperty('position-anchor')

    this.#cleanup?.()
  }

  connectedCallback() {
    console.debug(`${MenuView.name} ⚡️ connect`)

    Snapshot.waitReady.then(() => {
      this.#dialog = this.#shadowRoot.querySelector<HTMLDialogElement>('dialog') ?? undefined

      const trigger = this.#shadowRoot.querySelector('button')

      trigger?.addEventListener('click', this.#handleTriggerClick)

      this.#dialog?.addEventListener('click', this.#handleDialogClick)
      this.#dialog?.addEventListener('close', this.#handleDialogClose)
      this.#dialog?.addEventListener('cancel', this.#handleDialogCancel)

      const { on } = touchGlass(
        this,
        (t) => t,
        (event: PointerEvent) => {
          if ((event.target as HTMLElement).matches('menu-view')) return false
          if (!(event.target as HTMLElement).closest('menu-view[open]')) return false

          return true
        }
      )

      this.#cleanup = on()

      const anchorName = `--menu-view-${self.crypto.randomUUID()}`

      const summaryPart = this.#shadowRoot.querySelector<HTMLElement>('[part*=menu-summary]'),
        dialogPart = this.#shadowRoot.querySelector<HTMLElement>('[part*=menu-dialog]')

      summaryPart?.style.setProperty('anchor-name', anchorName, 'important') // override unset:all
      dialogPart?.style.setProperty('position-anchor', anchorName)
    })
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    console.debug(`${MenuView.name} ⚡️ [${name}] change ("${oldValue}" → "${newValue}")`)

    if (!this.#dialog) return

    const form = this.#shadowRoot.querySelector<HTMLElement>('form')!

    switch (name) {
      case 'open':
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

          form.scrollTop = 0

          this.#dialog.showModal()
        }

        break
    }
  }

  #handleDialogClick = (event: Event) => {
    console.debug(`${MenuView.name} ⚡️ ${event?.type}`)

    if ((event.target as HTMLElement).matches('dialog')) return this.toggleAttribute('open', false) // click outside

    // if ((event.target as HTMLElement).closest('button')) alert(9)
    // TODO: Handle btns this.toggleAttribute('open', false)
  }

  #handleTriggerClick = (event: Event) => {
    console.debug(`${MenuView.name} ⚡️ ${event?.type}`)

    this.toggleAttribute('open', true)
  }

  #handleDialogCancel = (event: Event) => {
    console.debug(`${MenuView.name} ⚡️ ${event?.type}`)

    if (!event.cancelable) return

    event.preventDefault()

    this.toggleAttribute('open', false)
  }

  #handleDialogClose = (event: Event) => {
    console.debug(`${MenuView.name} ⚡️ ${event?.type}`)

    this.toggleAttribute('open', this.#shadowRoot.querySelector('dialog')?.open ?? false)
  }
}
