import { $, devFlags } from '../internal/utils'
import { queryMorph } from '../morphdom'
import { html } from '../tpl'

// curency:el-GR-u-cu-eur-cf-account
interface ParsedFormat {
  type: string
  locale: string
  options: Record<string, string>
}

/**
 * @summary A container view that pairs a label with a value.
 *
 * @example <labeled-content label="Label" value="Content"></labeled-content> — Creates a standard labeled element, with a view that conveys the value of the element and a label
 *
 * @example <labeled-content label="Height" value="6" format="unit::unit=foot"></labeled-content> — Creates a labeled element from a formatted value
 *
 * @example <labeled-content value="Content"><label-view slot="label" title="Custom Value"></label-view><label-view slot="label" title="Custom Subtitle Value"></label-view></labeled-content> — Creates a labeled element that displays a custom label and a custom subtitle to the label
 *
 * @slot — The default slot.
 * @slot label — Use the `slot="label"` attribute to place childen in the label block.
 * @slot header
 * @slot footer
 *
 * @csspart labeled-content-container
 * @csspart labeled-content-stack
 * @csspart labeled-content-label-stack
 * @csspart labeled-content-value-stack
 */
export class LabeledContent extends HTMLElement {
  static get observedAttributes() {
    return [
      'value',
      'label',
      'header',
      'footer',
      /**
       * @type {vertical|horizontal}
       */
      'labeled-content-style',
      /**
       * Use this to format the text inside the value attribute. For example `format="currency::currency=USD" value="1234.5"` produces a value of `$1,234.50`.
       *
       * @type {"<format-type>:<locale?>:<format-options?>"}
       */
      'format',
    ]
  }

  static #template: DocumentFragment

  static get template() {
    return (this.#template ??= $(html`
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
    `))
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

        break
      case 'footer':
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

        break
      case 'value': {
        const val = this.#fmt(newValue, this.getAttribute('format'))

        queryMorph('label-view:not([slot])', html`<label-view>${val ? html`<span>${val}</span>` : null}</label-view>`, this)

        break
      }
      case 'format': {
        const val = this.#fmt(this.getAttribute('value'), newValue)

        queryMorph('label-view:not([slot])', html`<label-view>${val ? html`<span>${val}</span>` : null}</label-view>`, this)

        break
      }
      case 'label':
        queryMorph('[slot=label]', html`<label-view slot="label">${newValue ? html`<span>${newValue}</span>` : null}</label-view>`, this)

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

      const [type, locale, opts = {}] = format.split(':', 3),
        loc = new Intl.Locale(locale || navigator.language),
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
      case 'byte-count': {
        const bytes = Number(value)

        if (!Number.isFinite(bytes)) return value

        const units = ['byte', 'kilobyte', 'megabyte', 'gigabyte', 'terabyte', 'petabyte', 'exabyte']
        const index = Math.min(Math.floor(Math.log(Math.abs(bytes)) / Math.log(1024)), units.length - 1)

        return new Intl.NumberFormat(locale, {
          style: 'unit',
          unit: units[Math.max(0, index)],
          unitDisplay: 'short',
          ...options,
        }).format(bytes / 1024 ** Math.max(0, index))
      }
      default:
        return value
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'labeled-content': LabeledContent
  }
}
