import { $, devFlags } from '../internal/utils'
import { html, queryMorph } from '../morphdom'

// curency:el-GR-u-cu-eur-cf-account
interface ParsedFormat {
  type: string
  locale: string
  options: Record<string, string>
}

export class LabeledContent extends HTMLElement {
  static get observedAttributes() {
    return ['value', 'label', 'header', 'footer', 'labeled-content-style', 'format']
  }

  static #template: DocumentFragment

  static get template() {
    return (this.#template ??= $(
      String.raw`
    <div part="root labeled-content-container">
      <slot name="header"></slot>
      <div part="root labeled-content-stack">
        <div part="root labeled-content-label-stack">
          <slot name="label"></slot>
        </div>
        <div part="root labeled-content-value-stack">
          <slot></slot>
        </div>
      </div>
      <slot name="footer"></slot>
    </div>
    `
    ))
  }

  #shadowRoot

  constructor() {
    super()

    this.#shadowRoot = this.attachShadow({ mode: 'closed' })

    this.#shadowRoot.appendChild(document.importNode((this.constructor as typeof LabeledContent).template, true))
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (devFlags.debug) console.debug(`${LabeledContent.name} ⚡️ attr-change [${name}] ("${oldValue}" → "${newValue}")`)

    if (oldValue === newValue) return

    switch (name) {
      case 'header':
        // if (!newValue) {
        //   this.querySelector(':scope>[slot=header]')?.remove()
        //   break
        // }

        // const header = this.querySelector(':scope>[slot=header]') ?? this.appendChild(Object.assign(document.createElement('header'), { slot: 'header' }))

        queryMorph(
          '[slot=header]',
          html`<header slot="header">
            <label-view font="callout">
              <span>${newValue}</span>
            </label-view>
          </header>`,
          this,
          { removeIf: !newValue }
        )
        // render(
        //   html`<label-view font="callout">
        //     <span>${newValue}</span>
        //   </label-view>`,
        //   header
        // )

        break
      case 'footer':
        // if (!newValue) {
        //   this.querySelector(':scope>[slot=footer]')?.remove()
        //   break
        // }

        // const footer = this.querySelector(':scope>[slot=footer]') ?? this.appendChild(Object.assign(document.createElement('footer'), { slot: 'footer' }))

        queryMorph(
          '[slot=footer]',
          html`<footer slot="footer">
            <label-view font="callout">
              <span>${newValue}</span>
            </label-view>
          </footer>`,
          this,
          { removeIf: !newValue }
        )
        // render(
        //   html`<label-view font="callout">
        //     <span>${newValue}</span>
        //   </label-view>`,
        //   footer
        // )

        break
      case 'value': {
        const val = this.#fmt(newValue, this.getAttribute('format'))

        queryMorph('label-view:not([slot])', html`<label-view>${val ? html`<span>${val}</span>` : null}</label-view>`, this) //renderLabel(':scope>label-view:not([slot])', `<label-view><span></span></label-view>`, this, this.#fmt(newValue, this.getAttribute('format')))

        break
      }
      case 'format': {
        const val = this.#fmt(this.getAttribute('value'), newValue)

        queryMorph('label-view:not([slot])', html`<label-view>${val ? html`<span>${val}</span>` : null}</label-view>`, this) //renderLabel(':scope>label-view:not([slot])', `<label-view><span></span></label-view>`, this, this.#fmt(this.getAttribute('value'), newValue))

        break
      }
      case 'label':
        queryMorph('[slot=label]', html`<label-view slot="label">${newValue ? html`<span>${newValue}</span>` : null}</label-view>`, this) //renderLabel(':scope>label-view[slot=label]', `<label-view slot="label"><span></span></label-view>`, this, newValue)

        break
    }
  }

  disconnectedCallback() {
    if (devFlags.debug) console.debug(`${LabeledContent.name} ⚡️ disconnect`)
  }

  connectedCallback() {
    if (devFlags.debug) console.debug(`${LabeledContent.name} ⚡️ connect`)
  }

  // <type>:<locale>;<option>=<value>;<option>=<value>
  #fmt = (value: string | null, format?: string | null) => {
    const parseFormat = (format?: string | null): ParsedFormat => {
      if (!format)
        return {
          type: 'text',
          locale: navigator.language,
          options: {},
        }

      const [type, locale = navigator.language, opts = {}] = format.split(':', 3),
        loc = new Intl.Locale(locale),
        options: Record<string, string> = Object.fromEntries(new URLSearchParams(opts))

      return {
        type,
        locale: loc.toString(),
        options,
      }
    }

    const { type, locale, options } = parseFormat(format)

    switch (type) {
      case 'currency':
        return new Intl.NumberFormat(locale, { style: 'currency', ...options }).format(Number(value)) // currency:en-US;currency=USD "$1,234.50"
      case 'percent':
        return new Intl.NumberFormat(locale, { style: 'percent' }).format(Number(value)) // percent:en-US "42%"
      case 'unit':
        return new Intl.NumberFormat(locale, { style: 'unit', ...options }).format(Number(value)) // percent:en-US:unit=kilometer-per-hour "50 km/h"
      case 'number':
        return new Intl.NumberFormat(locale, options).format(Number(value)) // number:en-US:notation=compact "1.2M"
      case 'date':
        return new Intl.DateTimeFormat(locale, options).format(new Date(value ?? '2000')) // { dateStyle: 'full', timeStyle: 'short' } "Saturday, July 4, 2026 at 2:30 PM"
      case 'relative-time': {
        const [number = 0, unit = 'day'] = value?.split('~') ?? []

        return new Intl.RelativeTimeFormat(locale, options).format(Number(number), unit as Intl.RelativeTimeFormatUnit) // -1~day { numeric: 'auto' } "yesterday"
      }
      case 'list':
        return new Intl.ListFormat(locale, options).format(value?.split('~') ?? []) // '' { style: 'long', type: 'conjunction' } "Foo, Bar, and Baz"
      case 'region':
        return value ? new Intl.DisplayNames(locale, { type: 'region' }).of(value) : '' // "Greece"
      // "Foo, Bar, and Baz"

      default:
        return value
    }
  }
}
