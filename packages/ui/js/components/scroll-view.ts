import { Snapshot } from '../snapshot'

export class ScrollView extends HTMLElement {
  static observedAttributes = ['navigation-title']

  static #template: HTMLTemplateElement

  static get template() {
    if (!this.#template)
      this.#template = Object.assign(document.createElement('template'), {
        innerHTML: `
        <slot></slot>
  <div part="root ${Snapshot.config!['scroll-view-navbar-part-name']}">
    <div part="root ${Snapshot.config!['scroll-view-navbar-stack-part-name']}">
      <slot name="navigation-bar-principal"></slot>
    </div>
  </div>
  <div part="root ${Snapshot.config!['scroll-view-toolbar-part-name']}">
    <div part="root ${Snapshot.config!['scroll-view-toolbar-stack-part-name']}">
      <slot name="bottom-bar-principal"></slot>
    </div>
  </div>`,
      })

    return this.#template
  }

  #shadowRoot

  constructor() {
    super()

    this.#shadowRoot = this.attachShadow({ mode: 'open' })

    Snapshot.waitReady.then(() => {
      this.#shadowRoot.appendChild(document.importNode((this.constructor as typeof ScrollView).template.content, true))
    })

    // this.addEventListener(
    //   'scrollend',
    //   () => {
    //     this.dataset.scrolltop = this.scrollTop
    //   },
    //   { passive: true }
    // )
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    console.debug(`${ScrollView.name} ⚡️ [${name}] change`)

    // @ts-expect-error
    const escapeHTMLPolicy = self.trustedTypes.createPolicy('myEscapePolicy', {
      createHTML: (string: string) => string.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'),
    })

    Snapshot.waitReady.then(() => {
      const slot = this.#shadowRoot.querySelector<HTMLSlotElement>('slot[name=navigation-bar-principal]')
      if (!slot) return

      const assigned = slot.assignedElements({ flatten: true }) as HTMLElement[]

      let el = assigned[0] as HTMLElement | undefined
      if (!el) {
        el = document.createElement('label-view')
        el.slot = 'navigation-bar-principal'
        this.append(el)
      }

     el.replaceChildren(escapeHTMLPolicy.createHTML(newValue))
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
    })
  }

  disconnectedCallback() {
    console.debug(`${ScrollView.name} ⚡️ disconnect`)
  }

  connectedCallback() {
    console.debug(`${ScrollView.name} ⚡️ connect`)

    // const nSlot = this.shadowRoot.querySelector('slot[name=navigation-bar]')!

    // Snapshot.waitReady.then(() => {
    // if (
    //   0 ===
    //   this.#shadowRoot
    //     .querySelector<HTMLSlotElement>('slot[name=navigation-bar]')!
    //     .assignedNodes({ flatten: true }).length
    // )
    //   this.insertAdjacentHTML(
    //     'beforeend',
    //     `<tool-bar slot="navigation-bar">ghjh</tool-bar>`
    //   )
    // if (
    //   0 ===
    //   this.#shadowRoot
    //     .querySelector<HTMLSlotElement>('slot[name=bottom-bar]')!
    //     .assignedNodes({ flatten: true }).length
    // )
    //   this.insertAdjacentHTML(
    //     'beforeend',
    //     `<tool-bar slot="bottom-bar">ghj</tool-bar>`
    //   )
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
      behavior: 'smooth', // optional: smooth scroll
    })
  }
}
