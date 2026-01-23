import { Snapshot } from '../snapshot'

export class NavigationBar extends HTMLElement {
  static #template: HTMLTemplateElement

  static get template() {
    if (!this.#template)
      this.#template = Object.assign(document.createElement('template'), {
        innerHTML: `<div part="${Snapshot.config!['toolbar-leading-stack-part-name']}">
    <slot name="leading"></slot>
  </div>
  <div part="${Snapshot.config!['toolbar-principal-stack-part-name']}">
    <slot></slot>
  </div>
  <div part="${Snapshot.config!['toolbar-trailing-stack-part-name']}">
    <slot name="trailing"></slot>
  </div>`,
      })

    return this.#template
  }

  #shadowRoot

  #ro?: ResizeObserver

  get #sibling() {
    return (
      this.parentElement?.querySelector(':scope > scroll-view') ?? undefined
    ) //this.previousElementSibling ?? undefined
  }

  set #sp(nv: number) {
    ;(this.#sibling as HTMLElement)?.style?.setProperty?.(
      '--navbar-padding-inline-start',
      `${nv}px`
    )
  }

  set #ep(nv: number) {
    ;(this.#sibling as HTMLElement)?.style?.setProperty?.(
      '--navbar-padding-inline-end',
      `${nv}px`
    )
  }

  constructor() {
    super()

    this.#shadowRoot = this.attachShadow({ mode: 'open' })

    Snapshot.waitReady.then(() => {
      this.#shadowRoot.appendChild(
        document.importNode(
          (this.constructor as typeof NavigationBar).template.content,
          true
        )
      )

      // this.#sp = this.#shadowRoot.querySelector<HTMLElement>(
      //   '[part="tool-bat-navigation-bar-leading-stack"]'
      // )!.offsetWidth
      // this.#ep = this.#shadowRoot.querySelector<HTMLElement>(
      //   '[part="tool-bat-navigation-bar-trailing-stack"]'
      // )!.offsetWidth

      this.#ro = new ResizeObserver(this.#measureStacks.bind(this))
    })
  }

  #measureStacks(entries: ResizeObserverEntry[] = []) {
    console.debug(
      `${NavigationBar.name} ⚡️ measure ${this.#measureStacks.name}`
    )

    for (const { contentRect, target } of entries) {
      if (
        target.part.contains(
          Snapshot.config!['toolbar-leading-stack-part-name']
        )
      )
        this.#sp = Math.round(contentRect.width)
      else if (
        target.part.contains(
          Snapshot.config!['toolbar-trailing-stack-part-name']
        )
      )
        this.#ep = Math.round(contentRect.width)
    }
  }

  connectedCallback() {
    console.debug(`${NavigationBar.name} ⚡️ connect`)

    Snapshot.waitReady.then(() => {
      this.#ro?.observe(
        this.#shadowRoot.querySelector(
          `[part="${Snapshot.config!['toolbar-leading-stack-part-name']}"]`
        )!
      )

      this.#ro?.observe(
        this.#shadowRoot.querySelector(
          `[part="${Snapshot.config!['toolbar-trailing-stack-part-name']}"]`
        )!
      )
    })
  }

  disconnectedCallback() {
    console.debug(`${NavigationBar.name} ⚡️ disconnect`)

    this.#ro?.disconnect?.()
  }
}
