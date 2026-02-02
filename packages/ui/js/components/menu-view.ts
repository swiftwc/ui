import { Snapshot } from '../snapshot'

export class MenuView extends HTMLElement {
  static observedAttributes = ['system-image', 'label', 'line-limit', 'truncation-mode']

  static #template: HTMLTemplateElement

  static get template() {
    if (!this.#template)
      this.#template = Object.assign(document.createElement('template'), {
        innerHTML: `<details part="root menu-details">
    <summary part="root menu-summary">
      <slot name="label"></slot>
    </summary>
    <dialog part="root menu-dialog" autofocus>
      <form part="root menu-form" method="dialog" novalidate>
        <slot></slot>
      </form>
    </dialog>
  </details>`,
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
    console.log(999, this.#shadowRoot.querySelector('details'))
    this.#shadowRoot.querySelector('details').addEventListener('toggle', this.#handleClick)
    this.#shadowRoot.querySelector('dialog').addEventListener('close', this.#handleClose)
    this.#shadowRoot.querySelector('dialog').addEventListener('cancel', this.#handleClose)

    this.#shadowRoot.querySelector('dialog').addEventListener('click', this.#handleClickOutside)
    this.#shadowRoot.querySelector('form').addEventListener('click', this.#handleSubmit)
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    console.debug(`${MenuView.name} ⚡️ [${name}] change`)
  }

  #handleClick = (event: Event) => {
    console.debug(`${MenuView.name} ⚡️ ${event?.type}`)

    if (event.target.open) this.#shadowRoot.querySelector('dialog')?.showModal()

    if (!event.target.open) this.#shadowRoot.querySelector('dialog')?.close()
  }

  #handleClose = (event: Event) => {
    console.debug(`${MenuView.name} ⚡️ ${event?.type}`)

    // this.#shadowRoot.querySelector('dialog')!.close()

    this.#shadowRoot.querySelector('details')!.open = false
  }

  #handleClickOutside = (event: Event) => {
    console.debug(`${MenuView.name} ⚡️ ${event?.type}`)

    if (event.target.matches('dialog')) return this.#shadowRoot.querySelector('dialog')?.close()
  }

  #handleSubmit = (event: Event) => {
    console.debug(`${MenuView.name} ⚡️ ${event?.type}`)

    if (event.target.matches('dialog')) return this.#shadowRoot.querySelector('dialog')?.close()

    alert(99)
  }
}
