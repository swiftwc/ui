import { I18n } from '../i18n'
import { CleanupRegistry } from '../internal/class/cleanup-registry'
import { $, devFlags, onoff } from '../internal/utils'

/**
 * @summary A message with a title and extra information that you show when part of your app can’t be used.
 *
 * @example <content-unavailable-view search></content-unavailable-view>
 *
 * @example <content-unavailable-view search="foo"></content-unavailable-view>
 *
 * @example <content-unavailable-view padding><label-view title="No Mail"><i class="ph ph-tray" slot="image" foreground="secondary"></i></label-view><label-view title="New mails you receive will appear here." foreground="secondary" slot="description"></label-view><button is="borderless-button" type="button" tabindex="0" slot="actions"><label-view title="Switch Account"></label-view></button></content-unavailable-view>
 *
 * @example <content-unavailable-view padding><label-view title="No Mail"><svg slot="image" foreground="secondary" ...>...</svg></label-view><label-view title="New mails you receive will appear here." foreground="secondary" slot="description"></label-view><button is="borderless-button" type="button" tabindex="0" slot="actions"><label-view title="Switch Account"></label-view></button></content-unavailable-view>
 *
 * @slot description
 * @slot actions
 *
 */
export class ContentUnavailableView extends HTMLElement {
  static get observedAttributes() {
    return ['search']
  }

  static #template: DocumentFragment

  static get template() {
    return (this.#template ??= $(
      String.raw`
      <div part="root content-unavailable-title-stack">
        <slot></slot>
      </div>
      <div part="root content-unavailable-description-stack">
        <slot name="description"></slot>
      </div>
      <div part="root content-unavailable-actions-stack">
        <slot name="actions"></slot>
      </div>`
    ))
  }

  #shadowRoot

  #slots

  constructor() {
    super()

    this.#shadowRoot = this.attachShadow({ mode: 'closed' })

    this.#shadowRoot.appendChild(document.importNode((this.constructor as typeof ContentUnavailableView).template, true))

    this.#slots = {
      '': this.#shadowRoot.querySelector('slot:not([name])') ?? undefined,
      description: this.#shadowRoot.querySelector('slot[name="description"]') ?? undefined,
      actions: this.#shadowRoot.querySelector('slot[name="actions"]') ?? undefined,
    } as const
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (devFlags.debug) console.debug(`${ContentUnavailableView.name} ⚡️ attr-change [${name}] ("${oldValue}" → "${newValue}")`)

    switch (name) {
      case 'search':
        if (oldValue === newValue) break

        this.#renderSearch(newValue)

        CleanupRegistry.unregister(this, 'i18n')

        CleanupRegistry.register(
          this,
          onoff(
            'localechange',
            () => {
              this.#renderSearch(this.getAttribute('search'))
            },
            I18n.on
          ).on(),
          'i18n'
        )

        break
    }
  }

  disconnectedCallback() {
    if (devFlags.debug) console.debug(`${ContentUnavailableView.name} ⚡️ disconnect`)
  }

  connectedCallback() {
    if (devFlags.debug) console.debug(`${ContentUnavailableView.name} ⚡️ connect`)
  }

  #renderSearch = (search: string | null) => {
    const titleLabel = this.querySelector(':scope>:not([slot])') ?? this.appendChild($(`<label-view><i class="ph ph-magnifying-glass" slot="image" foreground="secondary"></i></label-view>`, '>1')),
      descText = this.querySelector(':scope>[slot=description]') ?? this.appendChild($(`<label-view foreground="secondary" slot="description"></label-view>`, '>1'))

    if (search) {
      const interpolate = (text: string, vars: Record<string, string>) => text.replaceAll(/\{(\w+)\}/g, (_, key: string) => vars[key] ?? '')

      titleLabel.setAttribute('title', interpolate(I18n.t('SearchUnavailableContent').Label, { search }))
    } else titleLabel?.setAttribute('title', I18n.t('SearchUnavailableContent').NoLabel)

    descText.setAttribute('title', I18n.t('SearchUnavailableContent').Description)
  }
}
