import { Snapshot } from '../snapshot'

export class LabelView extends HTMLElement {
  static observedAttributes = ['system-image', 'label', 'line-limit', 'truncation-mode']

  static #template: HTMLTemplateElement

  static get template() {
    if (!this.#template)
      this.#template = Object.assign(document.createElement('template'), {
        innerHTML: `<div part="root label-image-stack">
    <slot name="image"></slot>
  </div>
  <div part="root label-title-stack">
    <slot></slot>
  </div>`,
      })

    return this.#template
  }

  #shadowRoot

  #imgSlot?: HTMLSlotElement
  #slot?: HTMLSlotElement

  constructor() {
    super()

    this.#shadowRoot = this.attachShadow({ mode: 'open' })

    Snapshot.waitReady.then(() => {
      this.#shadowRoot.appendChild(document.importNode((this.constructor as typeof LabelView).template.content, true))

      this.#imgSlot = this.#shadowRoot.querySelector<HTMLSlotElement>('slot[name=image]') ?? undefined
      this.#slot = this.#shadowRoot.querySelector<HTMLSlotElement>('slot:not([name])') ?? undefined

      this.#slot?.addEventListener('slotchange', this.#handleSlotChange)
      this.#imgSlot?.addEventListener('slotchange', this.#handleSlotChange)

      this.#handleSlotChange()
    })
  }

  disconnectedCallback() {
    console.debug(`${LabelView.name} ⚡️ disconnect`)
  }

  connectedCallback() {
    console.debug(`${LabelView.name} ⚡️ connect`)
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    console.debug(`${LabelView.name} ⚡️ [${name}] change ("${oldValue}" → "${newValue}")`)

    // @ts-expect-error
    const escapeHTMLPolicy = self.trustedTypes.createPolicy('myEscapePolicy', {
      createHTML: (string: string) => string.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'),
    })

    Snapshot.waitReady.then(() => {
      switch (name) {
        case 'system-image':
          const imgSlot = this.#shadowRoot.querySelector<HTMLSlotElement>('slot[name=image]')
          if (!imgSlot) break

          const assigned = imgSlot.assignedElements({ flatten: true }) as HTMLElement[]

          let el = assigned[0] as HTMLElement | undefined
          if (!el) {
            el = document.createElement('i')
            el.slot = 'image'
            this.append(el)
          }

          el.setAttribute('class', `ph ph-${newValue}`)

          break
        case 'label':
          const titleSlot = this.#shadowRoot.querySelector<HTMLSlotElement>('slot:not([name])')
          if (!titleSlot) break

          const assigned2 = titleSlot.assignedElements({ flatten: true }) as HTMLElement[]

          let el2 = assigned2[0] as HTMLElement | undefined
          if (!el2) {
            el2 = document.createElement('span')
            this.append(el2)
          }

          el2.replaceChildren(escapeHTMLPolicy.createHTML(newValue))

          break
      }
    })
  }

  #handleSlotChange = () => {
    console.debug(`${LabelView.name} ⚡️ disconnect`)

    this.toggleAttribute('has-title', (this.#slot?.assignedNodes({ flatten: true }) ?? []).length > 0)
    this.toggleAttribute('has-image', (this.#imgSlot?.assignedNodes({ flatten: true }) ?? []).length > 0)
  }
}
