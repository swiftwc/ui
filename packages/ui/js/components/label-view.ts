import { Snapshot } from '../snapshot'

export class LabelView extends HTMLElement {
  static observedAttributes = ['system-image', 'label', 'line-limit', 'truncation-mode']

  static #template: HTMLTemplateElement

  static get template() {
    if (!this.#template)
      this.#template = Object.assign(document.createElement('template'), {
        innerHTML: `
  <div part="root label-image-stack">
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

      this.#slot?.addEventListener('slotchange', this.#handleSlotchange)
      // this.#imgSlot?.addEventListener('slotchange', this.#handleSlotchange)

      // this.#handleSlotchange(new CustomEvent('slotchange'))
    })
  }

  disconnectedCallback() {
    console.debug(`${LabelView.name} ⚡️ disconnect`)

    this.#slot?.removeEventListener('slotchange', this.#handleSlotchange)
  }

  connectedCallback() {
    console.debug(`${LabelView.name} ⚡️ connect`)
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    console.debug(`${LabelView.name} ⚡️ attr-change [${name}] ("${oldValue}" → "${newValue}")`)

    Snapshot.waitReady.then(() => {
      switch (name) {
        case 'system-image':
          // const imgSlot = this.#shadowRoot.querySelector<HTMLSlotElement>('slot[name=image]')
          // if (!imgSlot) break

          const assigned = this.#imgSlot!.assignedElements({ flatten: true }) as HTMLElement[]

          let el = assigned[0] as HTMLElement | undefined
          if (!el) {
            el = document.createElement('i')
            el.slot = 'image'
            this.append(el)
          }

          el.setAttribute('class', `ph ph-${newValue}`)

          break
        case 'label':
          // const titleSlot = this.#shadowRoot.querySelector<HTMLSlotElement>('slot:not([name])')
          // if (!titleSlot) break

          const assigned2 = this.#slot!.assignedElements({ flatten: true }) as HTMLElement[]

          let el2 = assigned2[0] as HTMLElement | undefined
          if (!el2) {
            el2 = document.createElement('span')
            this.append(el2)
          }

          el2.textContent = newValue //el2.replaceChildren(escapeHTMLPolicy.createHTML(newValue))

          break
      }
    })
  }

  #handleSlotchange = (event: Event) => {
    console.debug(`${LabelView.name} ⚡️ ${event?.type}`)

    for (const node of this.#slot?.assignedNodes({ flatten: true }) ?? []) {
      if (node.nodeType !== Node.TEXT_NODE) continue

      console.error(
        `${LabelView.name} must contain HTML nodes. Are you sure it is not written like <label-view>“${this.textContent.trim().substring(0, 10)}…”</label-view>?`
      )

      const text = node.textContent?.trim()

      if (text)
        if (!(node.parentElement instanceof HTMLSpanElement)) {
          // avoid wrapping twice
          const span = document.createElement('span')
          span.textContent = text
          ;(node as HTMLElement).replaceWith(span)
        }
    }

    //   this.setAttribute(
    //     'title-hint',
    //     (this.#slot?.assignedNodes({ flatten: true }) ?? []).filter((node) => (node.nodeType === Node.TEXT_NODE ? node.textContent?.trim() !== '' : true))
    //       .length > 0
    //       ? 'yes'
    //       : 'no'
    //   )

    //   this.setAttribute('image-hint', (this.#imgSlot?.assignedNodes({ flatten: true }) ?? []).length > 0 ? 'yes' : 'no')
  }
}
