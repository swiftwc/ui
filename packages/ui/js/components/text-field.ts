import { Snapshot } from '../snapshot'
import { onoff } from '../internal/utils'
import { CleanupRegistry } from '../internal/class/cleanup-registry'

export class TextField extends HTMLElement {
  static get observedAttributes() {
    return ['placeholder', 'label', 'text']
  }

  static get formAssociated() {
    return true
  }

  static #template: HTMLTemplateElement

  static get template() {
    return (this.#template ??= Object.assign(document.createElement('template'), {
      innerHTML: `
    <label part="root text-field-stack">
    <div part="root text-field-label-stack">
      <slot name="label"></slot>
    </div>
    <div part="root text-field-input-stack">
      <input type="text" part="root input text-field-form-input">
    </div>
  </label>`,
    }))
  }

  #shadowRoot

  #labelSlot?: HTMLSlotElement

  #internals: ElementInternals

  constructor() {
    super()

    this.#shadowRoot = this.attachShadow({ mode: 'closed' })

    // Snapshot.waitReady.then(() => {
    this.#shadowRoot.appendChild(document.importNode((this.constructor as typeof TextField).template.content, true))

    this.#labelSlot = this.#shadowRoot.querySelector<HTMLSlotElement>('slot[name=label]') ?? undefined

    this.#internals = this.attachInternals()

    const input = this.#shadowRoot.querySelector('input')

    const { on } = onoff(
      'input',
      () => {
        this.#internals.setFormValue(input!.value)
      },
      input!
    )

    CleanupRegistry.register(this, on())
  }

  connectedCallback() {
    console.debug(`${TextField.name} ⚡️ connect`)
  }

  disconnectedCallback() {
    console.debug(`${TextField.name} ⚡️ disconnect`)

    CleanupRegistry.unregister(this)
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    console.debug(`${TextField.name} ⚡️ attr-change [${name}] ("${oldValue}" → "${newValue}")`)

    switch (name) {
      case 'placeholder':
        if (newValue) this.#shadowRoot.querySelector('input')?.setAttribute(name, newValue)
        else this.#shadowRoot.querySelector('input')?.removeAttribute(name)

        break
      case 'label':
        const assigned2 = this.#labelSlot!.assignedElements({ flatten: true }) as HTMLElement[]

        let el2 = assigned2[0] as HTMLElement | undefined
        if (!el2) {
          el2 = document.createElement('span')
          el2.slot = 'label'
          this.append(el2)
        }

        el2.textContent = newValue //el.replaceChildren(escapeHTMLPolicy.createHTML(newValue))

        break
    }
  }

  get text() {
    return this.#shadowRoot.querySelector('input')!.value
  }

  set text(v) {
    // this.#value = v
    this.#shadowRoot.querySelector('input')!.value = v
  }

  // Optional: form participation properties
  get form() {
    return this.#internals.form
  }
  get name() {
    return this.getAttribute('label')
  }
  get type() {
    return this.localName
  }
  get validity() {
    return this.#internals.validity
  }
  get validationMessage() {
    return this.#internals.validationMessage
  }
  get willValidate() {
    return this.#internals.willValidate
  }

  checkValidity() {
    return this.#internals.checkValidity()
  }
  reportValidity() {
    return this.#internals.reportValidity()
  }
}
