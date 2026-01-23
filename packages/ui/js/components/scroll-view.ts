export class ScrollView extends HTMLElement {
  static #template: HTMLTemplateElement

  static get template() {
    if (!this.#template)
      this.#template = Object.assign(document.createElement('template'), {
        innerHTML: `<slot></slot>
  <slot name="navigation-bar"></slot>
  <slot name="bottom-bar"></slot>`,
      })

    return this.#template
  }

  #shadowRoot

  constructor() {
    super()

    this.#shadowRoot = this.attachShadow({ mode: 'open' })

    this.#shadowRoot.appendChild(
      document.importNode(
        (this.constructor as typeof ScrollView).template.content,
        true
      )
    )

    // this.addEventListener(
    //   'scrollend',
    //   () => {
    //     this.dataset.scrolltop = this.scrollTop
    //   },
    //   { passive: true }
    // )
  }

  disconnectedCallback() {
    console.debug(`${ScrollView.name} ⚡️ disconnect`)
  }

  connectedCallback() {
    console.debug(`${ScrollView.name} ⚡️ connect`)

    // const nSlot = this.shadowRoot.querySelector('slot[name=navigation-bar]')!

    if (
      0 ===
      this.#shadowRoot
        .querySelector<HTMLSlotElement>('slot[name=navigation-bar]')!
        .assignedNodes({ flatten: true }).length
    )
      this.insertAdjacentHTML(
        'beforeend',
        `<tool-bar slot="navigation-bar">ghjh</tool-bar>`
      )

    if (
      0 ===
      this.#shadowRoot
        .querySelector<HTMLSlotElement>('slot[name=bottom-bar]')!
        .assignedNodes({ flatten: true }).length
    )
      this.insertAdjacentHTML(
        'beforeend',
        `<tool-bar slot="bottom-bar">ghj</tool-bar>`
      )
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
    const scrollTop =
      this.scrollTop +
      childRect.top -
      parentRect.top -
      parentRect.height / 2 +
      childRect.height / 2

    this.scrollTo({
      top: scrollTop,
      behavior: 'smooth', // optional: smooth scroll
    })
  }
}
