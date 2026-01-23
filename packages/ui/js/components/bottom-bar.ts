import { Snapshot } from '../snapshot'

export class BottomBar extends HTMLElement {
  static #template: HTMLTemplateElement

  static get leadingPartName() {
    return Snapshot.config!['toolbar-leading-stack-part-name']
  }

  static get principalPartName() {
    return Snapshot.config!['toolbar-principal-stack-part-name']
  }

  static get trailingPartName() {
    return Snapshot.config!['toolbar-trailing-stack-part-name']
  }

  static get template() {
    if (!this.#template)
      this.#template = Object.assign(document.createElement('template'), {
        innerHTML: `<div part="${this.leadingPartName}">
    <slot name="leading"></slot>
  </div>
  <div part="${this.principalPartName}">
    <slot></slot>
  </div>
  <div part="${this.trailingPartName}">
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
      '--bottombar-padding-inline-start',
      `${nv}px`
    )
  }

  set #ep(nv: number) {
    ;(this.#sibling as HTMLElement)?.style?.setProperty?.(
      '--bottombar-padding-inline-end',
      `${nv}px`
    )
  }

  constructor() {
    super()

    this.#shadowRoot = this.attachShadow({ mode: 'open' })

    Snapshot.waitReady.then(() => {
      this.#shadowRoot.appendChild(
        document.importNode(
          (this.constructor as typeof BottomBar).template.content,
          true
        )
      )

      this.#ro = new ResizeObserver(this.#measureStacks.bind(this))
    })
  }

  #measureStacks(entries: ResizeObserverEntry[] = []) {
    console.debug(`${BottomBar.name} ⚡️ measure ${this.#measureStacks.name}`)

    for (const { contentRect, target } of entries)
      if (
        target.part.contains(
          (this.constructor as typeof BottomBar).leadingPartName
        )
      )
        this.#sp = Math.round(contentRect.width)
      else if (
        target.part.contains(
          (this.constructor as typeof BottomBar).trailingPartName
        )
      )
        this.#ep = Math.round(contentRect.width)
  }

  connectedCallback() {
    console.debug(`${BottomBar.name} ⚡️ connect`)

    Snapshot.waitReady.then(() => {
      this.#ro?.observe(
        this.#shadowRoot.querySelector(
          `[part="${(this.constructor as typeof BottomBar).leadingPartName}"]`
        )!
      )

      this.#ro?.observe(
        this.#shadowRoot.querySelector(
          `[part="${(this.constructor as typeof BottomBar).trailingPartName}"]`
        )!
      )
    })
  }

  disconnectedCallback() {
    console.debug(`${BottomBar.name} ⚡️ disconnect`)

    this.#ro?.disconnect?.()
  }
}
