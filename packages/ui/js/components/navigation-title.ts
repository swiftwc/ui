import { type ScrollView } from './scroll-view'
import { Snapshot } from '../snapshot'
import { $ } from '../internal/utils'

export class NavigationTitle extends HTMLElement {
  static observedAttributes = ['value', 'subtitle']

  #sibling?: ScrollView

  constructor() {
    super()
  }

  disconnectedCallback() {
    console.debug(`${NavigationTitle.name} ⚡️ disconnect`)
  }

  connectedCallback() {
    console.debug(`${NavigationTitle.name} ⚡️ connect`)

    this.#sibling = this.closest<ScrollView>('scroll-view') ?? undefined
    // if (!this.#sibling) return

    // if (!this.#sibling?.hasAttribute('navigation-bar-title-display-mode')) this.#sibling?.setAttribute('navigation-bar-title-display-mode', 'large')

    // Snapshot.waitReady.then(() => {
    //if (!this.isConnected) return
    //   // this.#render()
    // })
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    console.debug(`${NavigationTitle.name} ⚡️ attr-change [${name}] ("${oldValue}" → "${newValue}")`)

    Snapshot.waitReady.then(() => {
      switch (name) {
        case 'value':
          if (null !== newValue) this.#sibling?.setAttribute('navigation-inline-title', newValue)
          else this.#sibling?.removeAttribute('navigation-inline-title')

          this.#render(newValue, this.getAttribute('subtitle'))

          break
        case 'subtitle':
          if (null !== newValue) this.#sibling?.setAttribute('navigation-inline-subtitle', newValue)
          else this.#sibling?.removeAttribute('navigation-inline-subtitle')

          this.#render(this.getAttribute('value'), newValue)

          break
      }
    })
  }

  #render = (title: string | null, subtitle: string | null) => {
    const el =
        this.querySelector(':scope>:not([slot])') ??
        this.appendChild(
          $(
            `<navigation-large-title><v-stack spacing="0" alignment="fill" slot="navigation-bar-principal"><label-view line-limit="1" truncation-mode="tail" font="headline"></label-view><label-view line-limit="1" truncation-mode="tail" font="callout"></label-view></v-stack></navigation-large-title>`
          )
        ),
      vStack =
        el.querySelector(':scope>v-stack') ??
        el.appendChild(
          $(
            `<v-stack spacing="0" alignment="fill" slot="navigation-bar-principal"><label-view line-limit="1" truncation-mode="tail" font="headline"></label-view><label-view line-limit="1" truncation-mode="tail" font="callout"></label-view></v-stack>`
          )
        )

    let titleLabel = vStack.querySelector(':scope>label-view:nth-child(1)')
    if (title) {
      titleLabel ??= vStack.appendChild($(`<label-view line-limit="1" truncation-mode="tail" font="headline"></label-view>`))
      titleLabel.setAttribute('title', title)
    } else titleLabel?.remove()

    let subtitleLabel = vStack.querySelector(':scope>label-view:nth-child(2)')
    if (subtitle) {
      subtitleLabel ??= vStack.appendChild($(`<label-view line-limit="1" truncation-mode="tail" font="callout"></label-view>`))
      subtitleLabel.setAttribute('title', subtitle)
    } else subtitleLabel?.remove()

    // for (const el of this.querySelectorAll(':scope>*')) el.remove()

    // const el = this.appendChild(
    //     Object.assign(document.createElement('template'), {
    //       innerHTML: `<navigation-large-title><v-stack spacing="0" alignment="fill" slot="navigation-bar-principal"><label-view line-limit="1" truncation-mode="tail" font="headline"></label-view><label-view line-limit="1" truncation-mode="tail" font="callout"></label-view></v-stack></navigation-large-title>`,
    //     }).content.firstElementChild!
    //   ),
    //   titleLabel = el.querySelector('label-view:nth-child(1)'),
    //   subtitleLabel = el.querySelector('label-view:nth-child(2)')

    // if (title) titleLabel?.setAttribute('label', title)
    // else titleLabel?.remove()

    // if (subtitle) subtitleLabel?.setAttribute('label', subtitle)
    // else subtitleLabel?.remove()
  }
}
