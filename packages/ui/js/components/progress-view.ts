import { CleanupRegistry } from '../internal/class/cleanup-registry'
import { CSSStyleObserver } from '../internal/class/css-style-observer'
import { $, debug } from '../internal/utils'
import { Snapshot } from '../snapshot'

const progressViewStyles = ['circular', 'linear'] as const

type ProgressViewStyle = (typeof progressViewStyles)[number]

/**
 *
 */
export class ProgressView extends HTMLElement {
  static get observedAttributes() {
    return ['label', 'current-value-label', 'value']
  }

  static #templates: Map<string, DocumentFragment> = new Map()

  #cssStyleObserver?: CSSStyleObserver

  #progressViewStyle?: ProgressViewStyle

  #lastRenderedStyle?: ProgressViewStyle

  #shadowRoot

  #slots?: Map<string, HTMLSlotElement> = new Map()

  get progressViewStyle() {
    return this.#progressViewStyle ?? 'circular'
  }

  get template(): DocumentFragment {
    if (!ProgressView.#templates.has(this.progressViewStyle))
      switch (this.progressViewStyle) {
        case 'linear':
          ProgressView.#templates.set(
            this.progressViewStyle,
            $(
              String.raw`
            <slot></slot>
            <div part="root progress-control progress-line-control"></div>
            <slot name="current-value"></slot>
            `
            )
          )

          break
        case 'circular':
        default:
          ProgressView.#templates.set(
            this.progressViewStyle,
            $(
              String.raw`
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
            `
            )
          )

          break
      }

    return ProgressView.#templates.get(this.progressViewStyle)!
  }

  constructor() {
    super()

    this.#shadowRoot = this.attachShadow({ mode: 'closed' })
  }

  disconnectedCallback() {
    debug(`${ProgressView.name} ⚡️ disconnect`)

    CleanupRegistry.unregister(this)
  }

  connectedCallback() {
    debug(`${ProgressView.name} ⚡️ connect`)

    this.#cssStyleObserver = new CSSStyleObserver({
      properties: ['--progress-view-style-index'],
    })

    this.#cssStyleObserver.observe(this, this.#handleStyleChange)

    Snapshot.waitReady.then(() => self.requestAnimationFrame(this.#handleStyleChange))
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    debug(`${ProgressView.name} ⚡️ attr-change [${name}] ("${oldValue}" → "${newValue}")`)

    switch (name) {
      case 'label': {
        const label = this.querySelector(':scope>label-view:not([slot])') ?? this.appendChild($(`<label-view foreground="secondary"></label-view>`, '>1'))
        if (newValue) {
          label.setAttribute('title', newValue)
        } else label.removeAttribute('title')

        break
      }
      case 'current-value-label': {
        let label = this.querySelector(':scope>[slot=current-value]')
        if (newValue) {
          label ??= this.appendChild($(`<label-view slot="current-value" font="callout" foreground="secondary"></label-view>`, '>1'))
          label.setAttribute('title', newValue)
        } else label?.remove()

        break
      }
    }
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
    debug(`${ProgressView.name} ⚡️ render (${this.#progressViewStyle})`)

    if (this.#lastRenderedStyle === this.#progressViewStyle) return // skip if already applied
    this.#lastRenderedStyle = this.#progressViewStyle

    this.#shadowRoot.replaceChildren(document.importNode(this.template, true)) // clear shadow DOM

    CleanupRegistry.unregister(this, 'slots')
    for (const slot of this.#shadowRoot.querySelectorAll<HTMLSlotElement>('slot')) this.#slots?.set(slot.name, slot)
    CleanupRegistry.register(
      this,
      () => {
        this.#slots = new Map()
      },
      'slots'
    )

    switch (
      this.#progressViewStyle
      //
    ) {
    }
  }
}
