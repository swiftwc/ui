import { lifecycleObserver } from '../buses'
import type { PageShowHideDetail, TabDetail } from '../events'
import { CleanupRegistry } from '../internal/class/cleanup-registry'
import { ResizeObserverSingleton } from '../internal/class/resize-observer-singleton'
import { $, debug, frame, onoff, slowHideShow } from '../internal/utils'
import { type TabView } from './tab-view'

const observers = new ResizeObserverSingleton()

export class ScrollView extends HTMLElement {
  static get observedAttributes() {
    return ['navigation-title', 'navigation-inline-title', 'navigation-inline-subtitle', 'navigation-bar-title-display-mode']
  }

  static #template: DocumentFragment

  static get template() {
    return (this.#template ??= $(
      String.raw`
  <slot></slot>
  <div part="root scroll-view-navbar">
    <div part="root scroll-view-navbar-stack">
      <slot name="top-bar-principal"></slot>
    </div>
  </div>
  <div part="root scroll-view-toolbar">
    <div part="root scroll-view-toolbar-stack">
      <slot name="bottom-bar-principal"></slot>
    </div>
  </div>`
    ))
  }

  #shadowRoot

  #slots?: Map<string, HTMLSlotElement> = new Map()
  // #navbarPrincipalSlot?: HTMLSlotElement

  #isMidScroll?: boolean

  #lastScrollTop: number = 0
  // #stopRecordingScrollTop?: boolean = false

  #beforeTabSwapLastScrolltop?: number

  constructor() {
    super()

    this.#shadowRoot = this.attachShadow({ mode: 'closed' })

    this.#shadowRoot.appendChild(document.importNode((this.constructor as typeof ScrollView).template, true))

    for (const slot of this.#shadowRoot.querySelectorAll<HTMLSlotElement>('slot')) this.#slots?.set(slot.name, slot)
    CleanupRegistry.register(this, () => {
      this.#slots = new Map()
    })
  }

  disconnectedCallback() {
    debug(`${ScrollView.name} ⚡️ disconnect`)

    CleanupRegistry.unregister(this)

    observers.unobserve(this)

    frame().then(() => lifecycleObserver.dispatchEvent(new CustomEvent<PageShowHideDetail>('pagehide', { detail: { page: this }, bubbles: true, composed: true })))
  }

  connectedCallback() {
    debug(`${ScrollView.name} ⚡️ connect`)

    CleanupRegistry.register(
      this,
      onoff(
        [
          // { types: 'tabreveal', listener: this.#handleTabReveal as EventListener },
          { types: 'beforetabswap', listener: this.#handleTabBeforeswap as EventListener },
        ],
        this.closest<TabView>('tab-view') ?? undefined
      ).on()
    )

    CleanupRegistry.register(
      this,
      onoff(
        [
          { types: 'scroll', listener: this.#handleScroll, addOptions: { passive: true } },
          { types: 'scrollend', listener: this.#handleScrollend, addOptions: { passive: true } },
        ],
        this
      ).on()
    )

    frame().then(() => lifecycleObserver.dispatchEvent(new CustomEvent<PageShowHideDetail>('pageshow', { detail: { page: this }, bubbles: true, composed: true })))

    observers.observe(this, this.#handleMeasure.bind(this))

    // frame(this).then((r) => {
    //   if (!r) return

    //   let first = true

    //   observeResizeEnd(this, () => {
    //     if (first) {
    //       first = false
    //       return
    //     }

    //     this.dispatchEvent(new CustomEvent('resizeend', { bubbles: true, composed: true }))
    //   })
    // })
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    debug(`${ScrollView.name} ⚡️ attr-change [${name}] ("${oldValue}" → "${newValue}")`)

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
        if (oldValue === newValue) break

        if (this.closest('[hidden]')) break // iREPAINT ALERT! if (0 === this.offsetHeight + this.offsetWidth) break

        if (!this.#isMidScroll) break

        const title = this.#slots?.get('top-bar-principal')?.assignedElements({ flatten: true })?.at(0) as HTMLElement | undefined

        slowHideShow('largeinline' === `${oldValue}${newValue}` ? 'show' : 'hide', title)

        break
    }
  }

  #handleScroll: EventListener = ({ target, type }: Event) => {
    debug(`${ScrollView.name} ⚡️ ${type}`)

    if (!this.#isMidScroll) this.#isMidScroll = true

    // if (this.#stopRecordingScrollTop) return

    if (!(target instanceof HTMLElement && target)) return

    this.#lastScrollTop = target.scrollTop
  }

  #handleScrollend: EventListener = (evt: Event) => {
    debug(`${ScrollView.name} ⚡️ ${evt?.type}`)

    if (this.#isMidScroll) this.#isMidScroll = false
  }

  #handleMeasure = (entry: ResizeObserverEntry) => {
    debug(`${ScrollView.name} ⚡️ measure`)

    if (0 === entry.contentRect.width + entry.contentRect.height) return

    if (undefined === this.#beforeTabSwapLastScrolltop) return

    if (this.#beforeTabSwapLastScrolltop === this.#lastScrollTop) return

    // this.#stopRecordingScrollTop = true

    entry.target.scrollTop = this.#beforeTabSwapLastScrolltop
    // entry.target.scrollTo({
    //   top: this.#beforeTabSwapLastScrolltop,
    //   behavior: 'smooth',
    // }) //
    // this.#stopRecordingScrollTop = false
    this.#beforeTabSwapLastScrolltop = undefined
  }

  #handleTabReveal = ({ type, target }: CustomEvent<TabDetail>) => {
    debug(`${ScrollView.name} ⚡️ ${type}`)

    if (!(target instanceof HTMLElement && target)) return

    if (!target.contains(this)) return

    if (this.closest('[hidden]')) return

    // console.log(888, this.#beforeTabSwapLastScrolltop, this.#lastScrollTop)

    // this.style.setProperty('clip-path', 'inset(50%)')
    // this.style.setProperty('opacity', '0.001')
    // this.style.opacity = '0.001'
    // console.log(99, this.style.opacity)

    // self.requestAnimationFrame(() => {
    //   if (undefined === this.#beforeTabSwapLastScrolltop) return

    //   if (this.#beforeTabSwapLastScrolltop === this.#lastScrollTop) return

    //   this.#stopRecordingScrollTop = true

    //   // console.log(999, this.#beforeTabSwapLastScrolltop)
    //   // console.log(999, this, this.#beforeTabSwapLastScrolltop, this.#lastScrollTop)

    //   this.scrollTop = this.#beforeTabSwapLastScrolltop
    //   // this.scrollTo({
    //   //   top: this.#beforeTabSwapLastScrolltop,
    //   //   behavior: 'instant',
    //   // }) //
    //   this.#stopRecordingScrollTop = false
    //   this.#beforeTabSwapLastScrolltop = undefined

    //   // self.requestAnimationFrame(() => {
    //   //   // this.style.removeProperty('opacity')
    //   // })
    // })
  }

  #handleTabBeforeswap = ({ type, target }: CustomEvent<TabDetail>) => {
    debug(`${ScrollView.name} ⚡️ ${type}`)

    if (!(target instanceof HTMLElement && target)) return

    if (!target.contains(this)) return

    if (this.closest('[hidden]')) return

    this.#beforeTabSwapLastScrolltop = this.scrollTop //#lastScrollTop
  }

  centerScrollToElement(child: Element) {
    // scrollTop needed to center child
    const parentRect = this.getBoundingClientRect(),
      childRect = child.getBoundingClientRect()

    // current scroll + offset of child relative to parent
    const top = this.scrollTop + childRect.top - parentRect.top - parentRect.height / 2 + childRect.height / 2

    this.scrollTo({
      top,
      behavior: self.matchMedia('(prefers-reduced-motion: no-preference)').matches ? 'smooth' : 'instant', // optional: smooth scroll
    })
  }

  #renderNavTitle = (title: string | null, subtitle: string | null) => {
    const titleTemplate = `<label-view line-limit="1" truncation-mode="tail" font="headline"></label-view>`,
      subtitleTemplate = `<label-view line-limit="1" truncation-mode="tail" foreground="secondary" font="callout"></label-view>`

    const vStack =
      this.querySelector(':scope>[slot=top-bar-principal]') ?? this.appendChild($(`<v-stack spacing="0" alignment="fill" slot="top-bar-principal">${titleTemplate}${subtitleTemplate}</v-stack>`, '>1'))

    const titleLabel = vStack.querySelector(':scope>label-view:nth-child(1)') ?? vStack.appendChild($(titleTemplate, '>1'))
    if (title) titleLabel.setAttribute('title', title)
    else titleLabel?.removeAttribute('title')

    let subtitleLabel = vStack.querySelector(':scope>label-view:nth-child(2)') ?? vStack.appendChild($(subtitleTemplate, '>1'))
    if (subtitle) subtitleLabel.setAttribute('title', subtitle)
    else subtitleLabel?.removeAttribute('title')
  }
}
