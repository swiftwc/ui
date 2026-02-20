import { Snapshot } from '../snapshot'

export class ScrollView extends HTMLElement {
  static observedAttributes = ['navigation-inline-title', 'navigation-inline-subtitle', 'navigation-bar-title-display-mode']

  static #template: HTMLTemplateElement

  static get template() {
    if (!this.#template)
      this.#template = Object.assign(document.createElement('template'), {
        innerHTML: `
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
      })

    return this.#template
  }

  #shadowRoot

  #navbarPrincipalSlot?: HTMLSlotElement

  constructor() {
    super()

    this.#shadowRoot = this.attachShadow({ mode: 'open' })

    Snapshot.waitReady.then(() => {
      this.#shadowRoot.appendChild(document.importNode((this.constructor as typeof ScrollView).template.content, true))

      this.#navbarPrincipalSlot = this.#shadowRoot.querySelector<HTMLSlotElement>('slot[name=navigation-bar-principal]') ?? undefined

      this.#navbarPrincipalSlot?.addEventListener('slotchange', this.#handleNavbarPrincipalSlotchange)
    })

    // this.addEventListener(
    //   'scrollend',
    //   () => {
    //     this.dataset.scrolltop = this.scrollTop
    //   },
    //   { passive: true }
    // )
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    console.debug(`${ScrollView.name} ⚡️ attr-change [${name}] ("${oldValue}" → "${newValue}")`)

    //// @ts-expect-error
    // const escapeHTMLPolicy = self.trustedTypes.createPolicy('myEscapePolicy', {
    //   createHTML: (string: string) => string.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'),
    // })

    Snapshot.waitReady.then(() => {
      switch (name) {
        case 'navigation-inline-title':
          const el =
            (this.#shadowRoot.querySelector<HTMLSlotElement>('slot[name=navigation-bar-principal]')?.assignedElements({ flatten: true })[0] as HTMLElement) ??
            (() => {
              const tpl = document.createElement('template')
              tpl.innerHTML = `<v-stack slot="navigation-bar-principal"><label-view line-limit="1" truncation-mode="tail"></label-view><label-view line-limit="1" truncation-mode="tail" label="subtitle" font="callout"></label-view></v-stack>`
              return this.appendChild(tpl.content.firstElementChild!).querySelector('label-view')
            })()

          if (newValue)
            el.setAttribute('label', newValue) //el.replaceChildren(escapeHTMLPolicy.createHTML(newValue))
          else el.removeAttribute('value')

          // const el =
          //   assigned?.[0] ??
          //   (() => {
          //     // el = document.createElement('label-view')
          //     // el.slot = 'navigation-bar-principal'
          //     return this.insertAdjacentElement('beforeend', (document.createElement('label-view').slot = 'navigation-bar-principal'))
          //   })()
          // if (!el) {
          //   el = document.createElement('label-view')
          //   el.slot = 'navigation-bar-principal'
          //   this.insertAdjacentElement('beforeend', el)
          // }

          // el.replaceChildren(escapeHTMLPolicy.createHTML(newValue))
          // if (
          //   0 ===
          //   this.#shadowRoot
          //     .querySelector<HTMLSlotElement>(
          //       'slot[name=navigation-bar-principal]'
          //     )!
          //     .assignedNodes({ flatten: true }).length
          // )
          //   this.insertAdjacentHTML(
          //     'beforeend',
          //     `<span slot="navigation-bar-principal">${escapeHTMLPolicy.createHTML(newValue)}</span>`
          //   )
          break

        case 'navigation-bar-title-display-mode':
          // const el2 = this.#shadowRoot.querySelector<HTMLSlotElement>('slot[name=navigation-bar-principal]')?.assignedElements({ flatten: true })?.[0]

          // if (null === oldValue) el2?.removeAttribute('slow-fade')
          if (oldValue !== newValue)
            this.#addBehindStickyClass(
              newValue,
              this.#shadowRoot.querySelector<HTMLSlotElement>('slot[name=navigation-bar-principal]')?.assignedElements({ flatten: true })?.[0]
            )

          break
      }
    })
  }

  disconnectedCallback() {
    console.debug(`${ScrollView.name} ⚡️ disconnect`)

    this.#navbarPrincipalSlot?.removeEventListener('slotchange', this.#handleNavbarPrincipalSlotchange)
  }

  connectedCallback() {
    console.debug(`${ScrollView.name} ⚡️ connect`)

    // requestAnimationFrame(() => {
    // this.scrollTop = 500
    // })
  }

  scrollToElement(el: Element) {
    // document.querySelector("#kb").innerHTML = self.visualViewport.height;
    // document.querySelector("#console4").innerHTML = `${self.scrollY} / ${
    //   document.querySelector("scroll-view").scrollTop
    // }`;
    // const parent = el.closest('scroll-view')
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

  #handleNavbarPrincipalSlotchange = (event: Event) => {
    console.debug(`${ScrollView.name} ⚡️ ${event?.type}`)

    const el = (event.target as HTMLSlotElement)?.assignedElements({ flatten: true })?.[0] as HTMLElement
    if (!el) return

    this.#addBehindStickyClass(this.getAttribute('navigation-bar-title-display-mode'), el)
    // if ('large' !== this.getAttribute('navigation-bar-title-display-mode')) return

    // switch (this.getAttribute('navigation-bar-title-display-mode')) {
    //   case 'large':
    //     el?.setAttribute('slow-fade', `${false}`)
    //     break
    //   case 'inline':
    //     el?.setAttribute('slow-fade', `${false}`)
    //     break
    //   default:
    //     el?.removeAttribute('slow-fade')
    //     break
    // }

    el.style.setProperty('transition-duration', '0ms')

    // self.requestAnimationFrame(() => {
    setTimeout(() => {
      el.style.removeProperty('transition-duration')
    }, 100)
  }

  #addBehindStickyClass = (newValue: string | null, el?: Element) => {
    self.requestAnimationFrame(() => {
      switch (newValue) {
        case 'large':
          el?.setAttribute('slow-fade', `${true}`)
          break
        case 'inline':
          el?.setAttribute('slow-fade', `${false}`)
          break
        default:
          el?.removeAttribute('slow-fade')
          break
      }
    })

    // if (null === newValue) return el2?.removeAttribute('slow-fade')

    // const didHaveSlowShow = el2?.hasAttribute('slow-fade')

    // if (!didHaveSlowShow) el2?.setAttribute('slow-fade', '')

    // if ('large' === newValue) {
    //   if (!didHaveSlowShow) {
    //     self.requestAnimationFrame(() => {
    //       el2?.setAttribute('slow-fade', `${true}`)
    //     })
    //   } else {
    //     el2?.setAttribute('slow-fade', `${true}`)
    //   }
    // }
    // if ('inline' === newValue) {
    //   if (!didHaveSlowShow) {
    //     self.requestAnimationFrame(() => {
    //       el2?.setAttribute('slow-fade', `${false}`)
    //     })
    //   } else {
    //     el2?.setAttribute('slow-fade', `${false}`)
    //   }
    // }
    //   const slot = this.#shadowRoot.querySelector<HTMLSlotElement>('slot[name=navigation-bar-principal]') ?? undefined
    //   const el2 = slot?.assignedElements({ flatten: true })?.[0]

    //   // this.#addBehindStickyClass(newValue, el2)
    //   console.log(999, newValue, el2)
    //   el2.hidden = 'inline' !== newValue
  }
}
