import { $, devFlags } from '../internal/utils'
import { queryMorph } from '../morphdom'
import { html } from '../tpl'

/**
 * @summary A view that labels items with an icon and a title.
 *
 * @example <label-view><span>Hello world!</span></label-view> — Creating a label using a `span` element
 * @example <label-view title="Hello world!"></label-view> — Creating a label using the `title` attribute
 * @example <label-view system-image="hand-waving"><span>Hello world!</span></label-view> — Creating a label with an icon and a title using the `system-image` attribute
 * @example <label-view><i slot="icon" class="ph ph-duotone ph-hand-waving"></i><span>Hello world!</span></label-view> — Creating a label with an icon and a title using the `icon` slot
 *
 * @attr {@Font} font — Sets the default font for text in this view.
 *
 * @slot — Any children without a `slot` attribute are placed in the title block.
 * @slot icon — Use the `slot="icon"` attribute to place childen in the icon block.
 *
 * @cssprop --label-gap — The gap between the icon and the title.
 * @cssprop --label-image-size — The size of the icon.
 * @cssprop --label-padding-inline — The padding inline of the label.
 *
 */
export class LabelView extends HTMLElement {
  static get observedAttributes() {
    return [
      'system-image',
      'title',
      'line-limit',
      /**
       * @type {"tail"}
       */
      'truncation-mode',
    ]
  }

  static #template: DocumentFragment

  static get template() {
    return (this.#template ??= $(html`
      <slot name="icon"></slot>
      <slot></slot>
    `))
    //     String.raw`
    // <div part="root label-image-stack">
    //   <slot name="image"></slot>
    // </div>
    // <div part="root label-title-stack">
    //   <slot></slot>
    // </div>`
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
      // case 'system-image':
      // case 'title':
      //   render(
      //     html`${this.getAttribute('title') ? html`<span>${this.getAttribute('title')}</span>` : null}${this.getAttribute('system-image')
      //       ? html`<image-view slot="icon" system-name="${this.getAttribute('system-image')}"></image-view>`
      //       : null}`,
      //     this
      //   )

      //   break
      case 'system-image':
        queryMorph('[slot=icon]', html`<image-view slot="icon" system-name="${newValue}"></image-view>`, this, { removeIf: !newValue })

        break
      case 'title':
        queryMorph(':not([slot])', html`<span>${newValue}</span>`, this, { removeIf: !newValue })

        break
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
