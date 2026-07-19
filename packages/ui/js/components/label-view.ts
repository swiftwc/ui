import { $, devFlags } from '../internal/utils'
import { html, render } from '../tpl'

/**
 *
 * @attr {@fontSet} font - Sets the default font for text in this view.
 *
 */
export class LabelView extends HTMLElement {
  static get observedAttributes() {
    return ['system-image', 'title', 'line-limit', 'truncation-mode']
  }

  static #template: DocumentFragment

  static get template() {
    return (this.#template ??= $(
      String.raw`
    <slot name="icon"></slot>
    <slot></slot>
    `
      //     String.raw`
      // <div part="root label-image-stack">
      //   <slot name="image"></slot>
      // </div>
      // <div part="root label-title-stack">
      //   <slot></slot>
      // </div>`
    ))
  }

  #shadowRoot

  // #reflectScheduled = false

  constructor() {
    super()

    this.#shadowRoot = this.attachShadow({ mode: 'closed' })

    this.#shadowRoot.appendChild(document.importNode((this.constructor as typeof LabelView).template, true))
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (devFlags.debug) console.debug(`${LabelView.name} ⚡️ attr-change [${name}] ("${oldValue}" → "${newValue}")`)

    if (oldValue === newValue) return

    // this.#scheduleReflect()

    switch (name) {
      case 'system-image':
      case 'title':
        render(
          html`${this.getAttribute('title') ? html`<span>${this.getAttribute('title')}</span>` : null}${this.getAttribute('system-image')
            ? html`<image-view slot="icon" system-name="${this.getAttribute('system-image')}"></image-view>`
            : null}`,
          this
        )

        break
      // case 'system-image':
      //   renderLabelIcon(this, newValue)

      //   break
      // case 'title':
      //   renderLabelTitle(this, newValue)

      //   break
    }
  }

  disconnectedCallback() {
    if (devFlags.debug) console.debug(`${LabelView.name} ⚡️ disconnect`)
  }

  connectedCallback() {
    if (devFlags.debug) console.debug(`${LabelView.name} ⚡️ connect`)
  }

  // #scheduleReflect = () => {
  //   if (this.#reflectScheduled) return
  //   this.#reflectScheduled = true

  //   self.queueMicrotask(() => {
  //     this.#reflectScheduled = false
  //     this.#reflectAll()
  //   })
  // }

  // #reflectAll = () => {
  //   renderLabelIcon(this, this.getAttribute('title'))
  //   renderLabelTitle(this, this.getAttribute('system-image'))
  // }
}
