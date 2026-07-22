import { microtaskOnConnected } from '../internal/decorators'
import { devFlags } from '../internal/utils'
import { html, queryMorph } from '../morphdom'
import type { ScrollView } from './scroll-view'

@microtaskOnConnected<NavigationTitle>((el) => {
  const sibling = el.closest<ScrollView>('scroll-view'),
    value = el.getAttribute('value'),
    subtitle = el.getAttribute('subtitle')

  if (null === value) sibling?.removeAttribute('navigation-inline-title')
  else sibling?.setAttribute('navigation-inline-title', value)

  if (null === subtitle) sibling?.removeAttribute('navigation-inline-subtitle')
  else sibling?.setAttribute('navigation-inline-subtitle', subtitle)
})
export class NavigationTitle extends HTMLElement {
  static get observedAttributes() {
    return ['value', 'subtitle', 'system-image', 'system-image-weight']
  }

  constructor() {
    super()
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (devFlags.debug) console.debug(`${NavigationTitle.name} ⚡️ attr-change [${name}] ("${oldValue}" → "${newValue}")`)

    this.#render(this.getAttribute('value'), this.getAttribute('subtitle'), this.getAttribute('system-image'), this.getAttribute('system-image-weight'))
  }

  disconnectedCallback() {
    if (devFlags.debug) console.debug(`${NavigationTitle.name} ⚡️ disconnect`)
  }

  connectedCallback() {
    if (devFlags.debug) console.debug(`${NavigationTitle.name} ⚡️ connect`)
  }

  #render = (title: string | null, subtitle: string | null, systemImage: string | null, systemImageWeight: string | null) => {
    // const container = this.querySelector(':scope>:not([slot])') ?? this.appendChild(document.createElement('navigation-large-title'))

    // render(template, container)

    queryMorph(
      ':not([slot])',
      html`
        <navigation-large-title>
          <v-stack alignment="fill">
            ${systemImage ? html`<image-view system-name="${systemImage}" system-weight="${systemImageWeight}" foreground="blue"></image-view>` : null}
            <v-stack spacing="0" alignment="fill">
              ${title
                ? html`<label-view line-limit="1" truncation-mode="tail" font="headline">
                    <span>${title}</span>
                  </label-view>`
                : null}
              ${subtitle
                ? html`<label-view line-limit="1" truncation-mode="tail" foreground="secondary" font="callout">
                    <span>${subtitle}</span>
                  </label-view>`
                : null}
            </v-stack>
          </v-stack>
        </navigation-large-title>
      `,
      this
    )

    // const titleTemplate = `<label-view line-limit="1" truncation-mode="tail" font="headline"><span></span></label-view>`,
    //   subtitleTemplate = `<label-view line-limit="1" truncation-mode="tail" foreground="secondary" font="callout"><span></span></label-view>`,
    //   vStactTemplate = `<v-stack spacing="0" alignment="fill">${titleTemplate}${subtitleTemplate}</v-stack>`
    // const el = this.querySelector(':scope>:not([slot])') ?? this.appendChild($(`<navigation-large-title>${vStactTemplate}</navigation-large-title>`, '>1')),
    //   vStack = el.querySelector(':scope>v-stack') ?? el.appendChild($(vStactTemplate, '>1'))
    // renderLabel(':scope>label-view:nth-child(1)', titleTemplate, vStack, title)
    // renderLabel(':scope>label-view:nth-child(2)', subtitleTemplate, vStack, subtitle)
  }
}
