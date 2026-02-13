import { Snapshot } from '../snapshot'

export class SectionView extends HTMLElement {
  static observedAttributes = ['header', 'footer']

  static #template: HTMLTemplateElement

  static get template() {
    if (!this.#template)
      this.#template = Object.assign(document.createElement('template'), {
        innerHTML: `<div part="root section-header-stack">
    <slot name="header"></slot>
  </div>
  <div part="root section-main-stack">
    <slot></slot>
  </div>
  <div part="root section-footer-stack">
    <slot name="footer"></slot>
  </div>`,
      })

    return this.#template
  }

  #shadowRoot

  #headerSlot?: HTMLSlotElement
  #footerSlot?: HTMLSlotElement
  #slot?: HTMLSlotElement

  constructor() {
    super()

    this.#shadowRoot = this.attachShadow({ mode: 'open' })

    Snapshot.waitReady.then(() => {
      this.#shadowRoot.appendChild(document.importNode((this.constructor as typeof SectionView).template.content, true))

      this.#headerSlot = this.#shadowRoot.querySelector<HTMLSlotElement>('slot[name=header]') ?? undefined
      this.#footerSlot = this.#shadowRoot.querySelector<HTMLSlotElement>('slot[name=footer]') ?? undefined
      this.#slot = this.#shadowRoot.querySelector<HTMLSlotElement>('slot:not([name])') ?? undefined

      this.#slot?.addEventListener('slotchange', this.#handleSlotchange)
      this.#headerSlot?.addEventListener('slotchange', this.#handleSlotchange)
      this.#footerSlot?.addEventListener('slotchange', this.#handleSlotchange)

      this.#handleSlotchange(new CustomEvent('slotchange'))
    })
  }

  disconnectedCallback() {
    console.debug(`${SectionView.name} ⚡️ disconnect`)
  }

  connectedCallback() {
    console.debug(`${SectionView.name} ⚡️ connect`)
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    console.debug(`${SectionView.name} ⚡️ attr-change [${name}] ("${oldValue}" → "${newValue}")`)

    // @ts-expect-error
    const escapeHTMLPolicy = self.trustedTypes.createPolicy('myEscapePolicy', {
      createHTML: (string: string) => string.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'),
    })

    Snapshot.waitReady.then(() => {
      switch (name) {
        case 'header':
          const assigned2 = this.#headerSlot!.assignedElements({ flatten: true }) as HTMLElement[]

          let el2 = assigned2[0] as HTMLElement | undefined
          if (!el2) {
            el2 = document.createElement('span')
            this.append(el2)
          }

          el2.replaceChildren(escapeHTMLPolicy.createHTML(newValue))

          break
        case 'footer':
          const assigned3 = this.#footerSlot!.assignedElements({ flatten: true }) as HTMLElement[]

          let el3 = assigned3[0] as HTMLElement | undefined
          if (!el3) {
            el3 = document.createElement('span')
            this.append(el3)
          }

          el3.replaceChildren(escapeHTMLPolicy.createHTML(newValue))

          break
      }
    })
  }

  #handleSlotchange = (event: Event) => {
    console.debug(`${SectionView.name} ⚡️ ${event?.type}`)

    this.setAttribute(
      'header-hint',
      (this.#headerSlot?.assignedNodes({ flatten: true }) ?? []).filter((node) => (node.nodeType === Node.TEXT_NODE ? node.textContent?.trim() !== '' : true))
        .length > 0
        ? 'yes'
        : 'no'
    )
    this.setAttribute(
      'footer-hint',
      (this.#footerSlot?.assignedNodes({ flatten: true }) ?? []).filter((node) => (node.nodeType === Node.TEXT_NODE ? node.textContent?.trim() !== '' : true))
        .length > 0
        ? 'yes'
        : 'no'
    )
    this.setAttribute('main-hint', (this.#slot?.assignedNodes({ flatten: true }) ?? []).length > 0 ? 'yes' : 'no')
  }
}
