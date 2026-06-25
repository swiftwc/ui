import { $, devFlags } from '../internal/utils'
import type { ScrollView } from './scroll-view'

export class NavigationTitle extends HTMLElement {
  static get observedAttributes() {
    return ['value', 'subtitle']
  }

  constructor() {
    super()
  }

  disconnectedCallback() {
    if (devFlags.debug) console.debug(`${NavigationTitle.name} ⚡️ disconnect`)
  }

  connectedCallback() {
    if (devFlags.debug) console.debug(`${NavigationTitle.name} ⚡️ connect`)
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (devFlags.debug) console.debug(`${NavigationTitle.name} ⚡️ attr-change [${name}] ("${oldValue}" → "${newValue}")`)

    const sibling = this.closest<ScrollView>('scroll-view') ?? undefined

    switch (name) {
      case 'value':
        if (null === newValue) sibling?.removeAttribute('navigation-inline-title')
        else sibling?.setAttribute('navigation-inline-title', newValue)

        this.#render(newValue, this.getAttribute('subtitle'))

        break
      case 'subtitle':
        if (null === newValue) sibling?.removeAttribute('navigation-inline-subtitle')
        else sibling?.setAttribute('navigation-inline-subtitle', newValue)

        this.#render(this.getAttribute('value'), newValue)

        break
    }
  }

  #render = (title: string | null, subtitle: string | null) => {
    const titleTemplate = `<label-view line-limit="1" truncation-mode="tail" font="headline"></label-view>`,
      subtitleTemplate = `<label-view line-limit="1" truncation-mode="tail" foreground="secondary" font="callout"></label-view>`,
      vStactTemplate = `<v-stack spacing="0" alignment="fill">${titleTemplate}${subtitleTemplate}</v-stack>`

    const el = this.querySelector(':scope>:not([slot])') ?? this.appendChild($(`<navigation-large-title>${vStactTemplate}</navigation-large-title>`, '>1')),
      vStack = el.querySelector(':scope>v-stack') ?? el.appendChild($(vStactTemplate, '>1'))

    const titleLabel = vStack.querySelector(':scope>label-view:nth-child(1)') ?? vStack.appendChild($(titleTemplate, '>1'))
    if (title) titleLabel.setAttribute('title', title)
    else titleLabel?.removeAttribute('title')

    const subtitleLabel = vStack.querySelector(':scope>label-view:nth-child(2)') ?? vStack.appendChild($(subtitleTemplate, '>1'))
    if (subtitle) subtitleLabel.setAttribute('title', subtitle)
    else subtitleLabel?.removeAttribute('title')
  }
}
