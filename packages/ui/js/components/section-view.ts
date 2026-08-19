import { $, devFlags } from '../internal/utils'
import { html, queryMorph } from '../morphdom'

/**
 * @summary A container view that groups related content together.
 *
 * @slot — The default slot.
 * @slot header
 * @slot footer
 */
export class SectionView extends HTMLElement {
  static get observedAttributes() {
    return ['header', 'footer']
  }

  static #template: DocumentFragment

  static get template() {
    return (this.#template ??= $(
      String.raw`
  <div part="root section-main-stack">
    <slot></slot>
  </div>
  <div part="root section-header-stack">
    <slot name="header"></slot>
  </div>
  <div part="root section-footer-stack">
    <slot name="footer"></slot>
  </div>`
    ))
    // <div class="sticky-sentinel" style="grid-area:sentinel;inline-size:100%;block-size:0.1px;pointer-events:none;"></div>
  }

  #shadowRoot

  constructor() {
    super()

    this.#shadowRoot = this.attachShadow({ mode: 'closed' })

    this.#shadowRoot.appendChild(document.importNode((this.constructor as typeof SectionView).template, true))
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (devFlags.debug) console.debug(`${SectionView.name} ⚡️ attr-change [${name}] ("${oldValue}" → "${newValue}")`)

    switch (name) {
      case 'header':
        queryMorph(
          '[slot=header]',
          html`<header slot="header">
            <label-view line-limit="1" truncation-mode="tail" font="callout">
              <span>${newValue}</span>
            </label-view>
          </header>`,
          this,
          { removeIf: !newValue }
        )

        break
      case 'footer':
        queryMorph(
          '[slot=footer]',
          html`<footer slot="footer">
            <label-view line-limit="1" truncation-mode="tail" font="callout">
              <span>${newValue}</span>
            </label-view>
          </footer>`,
          this,
          { removeIf: !newValue }
        )

        break
    }
  }

  disconnectedCallback() {
    if (devFlags.debug) console.debug(`${SectionView.name} ⚡️ disconnect`)

    //
  }

  connectedCallback() {
    if (devFlags.debug) console.debug(`${SectionView.name} ⚡️ connect`)

    //
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'section-view': SectionView
  }
}
