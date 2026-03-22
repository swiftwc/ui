import { Snapshot } from '../snapshot'
import { onoff } from '../internal/utils'
import { CleanupRegistry } from '../internal/class/cleanup-registry'

export class TextField extends HTMLElement {
  static observedAttributes = ['placeholder', 'label']

  static formAssociated = true

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

  #internals?: ElementInternals

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
    // })
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

    // Snapshot.waitReady.then(() => {
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
    // })
  }

  // Optional: form participation properties
  get form() {
    return this.#internals.form
  }
  get name() {
    return this.getAttribute('name')
  }
  get type() {
    return 'text'
  }
}
