import { Snapshot } from '../snapshot'
import { type TabDetail } from '../events'
import { type TabView } from './tab-view'
import { $, slowHideShow, onoff, frame } from '../internal/utils'
import { type PageShowHideDetail, type PageRevealSwapDetail } from '../events'
import { LifecycleObserver } from '../lifecycle-observer'
import { CleanupRegistry } from '../internal/class/cleanup-registry'

export class ScrollView extends HTMLElement {
  static get observedAttributes() {
    return ['navigation-title', 'navigation-inline-title', 'navigation-inline-subtitle', 'navigation-bar-title-display-mode']
  }

  static #template: HTMLTemplateElement

  static get template() {
    return (this.#template ??= Object.assign(document.createElement('template'), {
      innerHTML: String.raw`
  <slot></slot>
  <div part="root scroll-view-navbar">
    <div part="root scroll-view-navbar-stack">
      <slot name="navigation-bar-principal"></slot>
    </div>
  </div>
  <div part="root scroll-view-toolbar">
    <div part="root scroll-view-toolbar-stack">
      <slot name="bottom-bar-principal"></slot>
    </div>
  </div>`,
    }))
  }

  #shadowRoot

  #navbarPrincipalSlot?: HTMLSlotElement

  constructor() {
    super()

    this.#shadowRoot = this.attachShadow({ mode: 'closed' })

    this.#shadowRoot.appendChild(document.importNode((this.constructor as typeof ScrollView).template.content, true))

    this.#navbarPrincipalSlot = this.#shadowRoot.querySelector<HTMLSlotElement>('slot[name=navigation-bar-principal]') ?? undefined
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    console.debug(`${ScrollView.name} ⚡️ attr-change [${name}] ("${oldValue}" → "${newValue}")`)

    switch (name) {
      case 'navigation-inline-title':
        this.#renderNavTitle(newValue, this.getAttribute('navigation-inline-subtitle'))

        break
      case 'navigation-inline-subtitle':
        this.#renderNavTitle(this.getAttribute('navigation-inline-title'), newValue)

        break
      case 'navigation-title':
        //

        break
      case 'navigation-bar-title-display-mode':
        const title = this.#navbarPrincipalSlot?.assignedElements({ flatten: true })?.[0] as HTMLElement | undefined

        if (oldValue === newValue) break

        if (this.closest('[hidden]')) return // iREPAINT ALERT! if (0 === this.offsetHeight + this.offsetWidth) break

        slowHideShow('largeinline' === `${oldValue}${newValue}` ? 'show' : 'hide', title)

        break
    }
  }

  disconnectedCallback() {
    console.debug(`${ScrollView.name} ⚡️ disconnect`)

    CleanupRegistry.unregister(this)

    frame().then(() =>
      LifecycleObserver.dispatchEvent(new CustomEvent<PageShowHideDetail>('pagehide', { detail: { page: this }, bubbles: true, composed: true }))
    )
  }

  connectedCallback() {
    console.debug(`${ScrollView.name} ⚡️ connect`)

    CleanupRegistry.register(
      this,
      onoff(
        [
          { types: 'tabreveal', listener: this.#handleTabReveal as EventListener },
          { types: 'beforetabswap', listener: this.#handleTabBeforeswap as EventListener },
        ],
        this.closest<TabView>('tab-view') ?? undefined
      ).on()
    )

    frame().then(() =>
      LifecycleObserver.dispatchEvent(new CustomEvent<PageShowHideDetail>('pageshow', { detail: { page: this }, bubbles: true, composed: true }))
    )
  }

  #beforeTabSwapLastScrolltop?: number

  #handleTabReveal = (evt: CustomEvent<TabDetail>) => {
    console.debug(`${ScrollView.name} ⚡️ ${evt?.type}`)

    if (!(evt.target as HTMLElement)?.contains(this)) return

    if (this.closest('[hidden]')) return

    if (undefined === this.#beforeTabSwapLastScrolltop) return
    if (this.#beforeTabSwapLastScrolltop === this.scrollTop) return

    this.scrollTop = this.#beforeTabSwapLastScrolltop

    this.#beforeTabSwapLastScrolltop = undefined
  }

  #handleTabBeforeswap = (evt: CustomEvent<TabDetail>) => {
    console.debug(`${ScrollView.name} ⚡️ ${evt?.type}`)

    if (!(evt.target as HTMLElement)?.contains(this)) return

    if (this.closest('[hidden]')) return

    this.#beforeTabSwapLastScrolltop = this.scrollTop
  }

  scrollToElement(el: Element) {
    const child = el

    // scrollTop needed to center child
    const parentRect = this.getBoundingClientRect()
    const childRect = child.getBoundingClientRect()

    // current scroll + offset of child relative to parent
    const scrollTop = this.scrollTop + childRect.top - parentRect.top - parentRect.height / 2 + childRect.height / 2

    this.scrollTo({
      top: scrollTop,
      behavior: self.matchMedia('(prefers-reduced-motion: no-preference)').matches ? 'smooth' : 'instant', // optional: smooth scroll
    })
  }

  #renderNavTitle = (title: string | null, subtitle: string | null) => {
    const vStack =
      this.querySelector(':scope>[slot=navigation-bar-principal]') ??
      this.appendChild(
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
  }
}
