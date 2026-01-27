import { Snapshot } from '../snapshot'

export class ILabel extends HTMLElement {
  static observedAttributes = ['system-image', 'title', 'line-limit', 'truncation-mode']

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

  constructor() {
    super()

    this.#shadowRoot = this.attachShadow({ mode: 'open' })

    Snapshot.waitReady.then(() => {
      this.#shadowRoot.appendChild(document.importNode((this.constructor as typeof ILabel).template.content, true))
    })
  }

  disconnectedCallback() {
    console.debug(`${ILabel.name} ⚡️ disconnect`)
  }

  connectedCallback() {
    console.debug(`${ILabel.name} ⚡️ connect`)
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    console.debug(`${ILabel.name} ⚡️ [${name}] change`)

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
        case 'title':
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
}
