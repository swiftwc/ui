import { CleanupRegistry } from '../internal/class/cleanup-registry'
import { CSSStyleObserver } from '../internal/class/css-style-observer'
import { shadowRoot, templateBy } from '../internal/decorators'
import { $, debug } from '../internal/utils'
import { queryMorph } from '../morphdom'
import { Snapshot } from '../snapshot'
import { html } from '../tpl'

const progressViewStyles = ['circular', 'linear'] as const

type ProgressViewStyle = (typeof progressViewStyles)[number]

/**
 * @summary A view that shows how far along a task is.
 *
 * @slot — The default slot
 * @slot current-value
 */
export class ProgressView extends HTMLElement {
  static get observedAttributes() {
    return ['label', 'current-value-label', 'value']
  }

  #cssStyleObserver?: CSSStyleObserver

  #progressViewStyle?: ProgressViewStyle

  #lastRenderedStyle?: ProgressViewStyle

  @shadowRoot() readonly #shadowRoot: ShadowRoot = undefined!

  get progressViewStyle() {
    return this.#progressViewStyle ?? 'circular'
  }

  @templateBy((el: ProgressView) => el.progressViewStyle)
  get #template(): DocumentFragment {
    // return ProgressView.#templates.getOrInsertComputed(this.progressViewStyle, () => {
    switch (this.progressViewStyle) {
      case 'linear':
        return $(html`
          <slot></slot>
          <div part="root progress-control progress-line-control"></div>
          <slot name="current-value"></slot>
        `)

      case 'circular':
      default:
        return $(html`
          <div part="root progress-control progress-circular-control">
            <div part="root progress-control progress-circular-blade progress-circular-blade-1"></div>
            <div part="root progress-control progress-circular-blade progress-circular-blade-2"></div>
            <div part="root progress-control progress-circular-blade progress-circular-blade-3"></div>
            <div part="root progress-control progress-circular-blade progress-circular-blade-4"></div>
            <div part="root progress-control progress-circular-blade progress-circular-blade-5"></div>
            <div part="root progress-control progress-circular-blade progress-circular-blade-6"></div>
            <div part="root progress-control progress-circular-blade progress-circular-blade-7"></div>
            <div part="root progress-control progress-circular-blade progress-circular-blade-8"></div>
          </div>
          <slot></slot>
          <slot name="current-value"></slot>
        `)
    }
    // })
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    debug(`${ProgressView.name} ⚡️ attr-change [${name}] ("${oldValue}" → "${newValue}")`)

    switch (name) {
      case 'label': {
        const label = this.querySelector(':scope>label-view:not([slot])') ?? this.appendChild($(html`<label-view foreground="secondary"></label-view>`, '>1'))
        if (newValue) {
          label.setAttribute('title', newValue)
        } else label.removeAttribute('title')

        break
      }
      case 'current-value-label': {
        queryMorph('[slot=current-value]', html`<label-view slot="current-value" font="callout" foreground="secondary">${newValue ? html`<span>${newValue}</span>` : null}</label-view>`, this)

        break
      }
    }
  }

  disconnectedCallback() {
    debug(`${ProgressView.name} ⚡️ disconnect`)

    CleanupRegistry.unregister(this)

    this.#lastRenderedStyle = undefined

    this.#cssStyleObserver?.disconnect()
  }

  connectedCallback() {
    debug(`${ProgressView.name} ⚡️ connect`)

    this.inert = true

    this.#cssStyleObserver = new CSSStyleObserver({
      properties: ['--progress-view-style-index'],
    })

    this.#cssStyleObserver.observe(this, this.#handleStyleChange)

    Snapshot.waitReady.then(() => self.requestAnimationFrame(this.#handleStyleChange))
  }

  #handleStyleChange = () => {
    debug(`${ProgressView.name} ⚡️ style`)

    const raw = self.getComputedStyle(this).getPropertyValue('--progress-view-style-index').trim()

    const newValue = progressViewStyles[Number(raw)] ?? progressViewStyles[0]

    if (newValue === this.#progressViewStyle) return

    this.#progressViewStyle = newValue

    this.#render()
  }

  #render() {
    debug(`${ProgressView.name} ⚡️ #render (${this.#progressViewStyle})`)

    if (this.#lastRenderedStyle === this.#progressViewStyle) return // skip if already applied
    this.#lastRenderedStyle = this.#progressViewStyle

    this.#shadowRoot.replaceChildren(document.importNode(this.#template, true)) // clear shadow DOM

    switch (
      this.#progressViewStyle
      //
    ) {
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'progress-view': ProgressView
  }
}
