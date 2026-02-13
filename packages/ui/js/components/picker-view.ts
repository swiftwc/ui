import { Snapshot } from '../snapshot'

export class PickerView extends HTMLElement {
  static observedAttributes = ['placeholder', 'label', 'picker-style']

  static formAssociated = true

  #currentStyle?: string

  get template(): HTMLTemplateElement {
    const style = this.getAttribute('picker-style')
    const template = document.createElement('template')

    switch (style) {
      case 'inline':
        template.innerHTML = `
          <list-view frame-width="infinity" part="root inline-form">
            <slot></slot>
          </list-view>
        `
        break
      case 'menu':
        template.innerHTML = `
          <menu-view>
            <label-view slot="label" system-image="dots-three"></label-view>
            <button type="button" tabindex="0">
              <label-view system-image="dots-three" label="Scan Documents" />
            </button>
            <button type="button" tabindex="0">
              <label-view system-image="dots-three" label="Connect to Server" />
            </button>
            <button type="button" tabindex="0">
              <label-view label="Edit Sidebar" />
            </button>
          </menu-view>
        `
        break
      case 'compact':
        template.innerHTML = `
          <label part="compact-picker">
            <input type="text" part="compact-input">
          </label>
        `
        break

      case 'fancy':
        template.innerHTML = `
          <div part="fancy-picker">
            <span>Fancy Picker</span>
            <input type="text" part="fancy-input">
          </div>
        `
        break

      default:
        template.innerHTML = `
          <label part="root text-field-stack">
    <div part="root text-field-label-stack">
      <slot name="label"></slot>
    </div>
    <div part="root text-field-input-stack">
      <input type="text" part="root text-field-form-input" list="tickmarks">
      <datalist id="tickmarks">
        <option value="0" label="0%"></option>
        <slot name="datalist"></slot>
      </datalist>
    </div>
  </label>
        `
        break
    }

    return template
  }

  #shadowRoot

  #slot?: HTMLSlotElement
  #labelSlot?: HTMLSlotElement

  #internals?: ElementInternals

  constructor() {
    super()

    this.#shadowRoot = this.attachShadow({ mode: 'open' })

    this.#internals = this.attachInternals()

    Snapshot.waitReady.then(() => {
      this.#render() // initial render

      // const input = this.#shadowRoot.querySelector('input')

      // input!.addEventListener('input', () => {
      //   this.#internals!.setFormValue(input!.value)
      // })
    })
  }

  connectedCallback() {
    console.debug(`${PickerView.name} ⚡️ connect`)
  }

  disconnectedCallback() {
    console.debug(`${PickerView.name} ⚡️ disconnect`)
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    console.debug(`${PickerView.name} ⚡️ attr-change [${name}] ("${oldValue}" → "${newValue}")`)

    // @ts-expect-error
    const escapeHTMLPolicy = self.trustedTypes.createPolicy('myEscapePolicy', {
      createHTML: (string: string) => string.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'),
    })

    Snapshot.waitReady.then(() => {
      switch (name) {
        case 'placeholder':
          this.#updatePlaceholder(newValue)

          break

        case 'label':
          this.#updateLabel(newValue)

          break

        case 'picker-style':
          if (oldValue !== newValue) this.#render()

          break
      }
    })
  }

  #render() {
    const style = this.getAttribute('picker-style')

    if (this.#currentStyle === style) return // skip if already applied

    this.#currentStyle = style

    // clear shadow DOM
    this.#shadowRoot.innerHTML = ''

    // append current template
    this.#shadowRoot.appendChild(document.importNode(this.template.content, true))

    // reattach input listener
    const input = this.#shadowRoot.querySelector('input')
    if (input) {
      input.addEventListener('input', () => {
        this.#internals!.setFormValue(input.value)
      })

      // restore placeholder if set
      const placeholder = this.getAttribute('placeholder')
      if (placeholder) input.setAttribute('placeholder', placeholder)
    }

    // refresh label slot reference
    this.#labelSlot = this.#shadowRoot.querySelector('slot[name=label]') ?? undefined
    this.#slot = this.#shadowRoot.querySelector('slot:not([name])') ?? undefined

    this.#slot?.addEventListener('slotchange', () => console.log(99))

    // restore label if set
    const label = this.getAttribute('label')
    if (label) this.#updateLabel(label)
  }

  #updatePlaceholder(value: string | null) {
    const input = this.#shadowRoot.querySelector('input')
    if (input) {
      if (value) input.setAttribute('placeholder', value)
      else input.removeAttribute('placeholder')
    }
  }

  #updateLabel(value: string | null) {
    const assigned = this.#labelSlot?.assignedElements({ flatten: true }) as HTMLElement[] | undefined
    let el = assigned?.[0]
    if (!el) {
      el = document.createElement('span')
      el.slot = 'label'
      this.append(el)
    }
    el.textContent = value ?? ''
  }

  // Optional: form participation properties
  get form() {
    return this.#internals!.form
  }
  get name() {
    return this.getAttribute('name')
  }
  get type() {
    return 'text'
  }
}
