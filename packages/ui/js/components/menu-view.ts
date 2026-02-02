import { Snapshot } from '../snapshot'

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
      <slot></slot>
    </form>
  </dialog>`,
      })

    return this.#template
  }

  #shadowRoot

  constructor() {
    super()

    this.#shadowRoot = this.attachShadow({ mode: 'open' })

    // Snapshot.waitReady.then(() => {
    this.#shadowRoot.appendChild(document.importNode((this.constructor as typeof MenuView).template.content, true))
    // })
  }

  disconnectedCallback() {
    console.debug(`${MenuView.name} ⚡️ disconnect`)
  }

  connectedCallback() {
    console.debug(`${MenuView.name} ⚡️ connect`)

    this.#shadowRoot.querySelector('button')!.addEventListener('click', this.#handleTriggerClick)
    this.#shadowRoot.querySelector('dialog')!.addEventListener('click', this.#handleDialogClick)
    this.#shadowRoot.querySelector('dialog')!.addEventListener('close', this.#handleDialogClose)
    // this.#shadowRoot.querySelector('dialog').addEventListener('closing', this.#handleClosing)
    this.#shadowRoot.querySelector('dialog')!.addEventListener('cancel', this.#handleDialogCancel)

    // this.#shadowRoot.querySelector('dialog').addEventListener('click', this.#handleClickOutside)
    // this.#shadowRoot.querySelector('form').addEventListener('click', this.#handleSubmit)

    const anchorName = `--menu-view-${self.crypto.randomUUID()}`

    this.#shadowRoot.querySelector<HTMLElement>('[part*=menu-summary]')!.style.anchorName = anchorName
    this.#shadowRoot.querySelector<HTMLElement>('[part*=menu-dialog]')!.style.positionAnchor = anchorName
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    console.debug(`${MenuView.name} ⚡️ [${name}] change`)

    const dialog = this.#shadowRoot.querySelector('dialog')!

    switch (name) {
      case 'open':
        dialog.inert = null === newValue

        if (null === newValue && dialog.open) {
          console.debug('close dialog')

          this.setAttribute('closing', '')

          Promise.allSettled(dialog.getAnimations().map(({ finished }) => finished)).then(() => {
            if (this.hasAttribute('closing')) dialog.close()

            this.removeAttribute('closing')
          })
        }

        if ('' === newValue && !dialog.open) {
          console.debug('open dialog')

          this.removeAttribute('closing')

          dialog.showModal()
        }

        break
    }
  }

  #handleDialogClick = (event: Event) => {
    this.toggleAttribute('open', false)
  }

  #handleTriggerClick = (event: Event) => {
    console.debug(`${MenuView.name} ⚡️ ${event?.type}`)

    const dialog = this.#shadowRoot.querySelector('dialog')!

    this.toggleAttribute('open', true)
  }

  // #handleClosing = (event: Event) => {
  //   console.debug(`${MenuView.name} ⚡️ ${event?.type}`)

  //   alert(9)
  // }

  #handleDialogCancel = (event: Event) => {
    this.toggleAttribute('open', false)
  }

  #handleDialogClose = (event: Event) => {
    console.debug(`${MenuView.name} ⚡️ ${event?.type}`)

    const dialog = this.#shadowRoot.querySelector('dialog')!
    this.toggleAttribute('open', dialog.open)

    // // dialog.style.position = 'fixed'
    // // dialog.style.display = 'grid'
    // // // optional: lock top/left to current position to prevent jumps
    // const rect = dialog.getBoundingClientRect()

    // console.log(999, dialog.style.top)

    // this.toggleAttribute('open', false)
    // self.requestAnimationFrame(() => {
    //   // dialog.style.display = 'grid'
    //   // dialog.style.position = 'fixed'
    //   // dialog.style.insetInlineStart = '200px'
    //   // dialog.style.top = 100 + 'px'
    //   // dialog.style.left = 100 + 'px'
    // })

    // this.#shadowRoot.querySelector('dialog')!.close()

    // this.#shadowRoot.querySelector('details')!.open = false
  }

  // #handleClickOutside = (event: Event) => {
  //   console.debug(`${MenuView.name} ⚡️ ${event?.type}`)

  //   // if (event.target.matches('dialog')) return this.#shadowRoot.querySelector('dialog')?.close()
  // }

  // #handleSubmit = (event: Event) => {
  //   console.debug(`${MenuView.name} ⚡️ ${event?.type}`)

  //   // this.#shadowRoot.querySelector('dialog')?.close()

  //   // alert(99)
  // }
}
