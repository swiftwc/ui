export class BottomBar extends HTMLElement {
  static #template: HTMLTemplateElement

  static get leadingPartName() {
    return 'toolbar-leading-stack'
  }

  static get principalPartName() {
    return 'toolbar-principal-stack'
  }

  static get trailingPartName() {
    return 'toolbar-trailing-stack'
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

  #ro

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

    this.#shadowRoot.appendChild(
      document.importNode(
        (this.constructor as typeof BottomBar).template.content,
        true
      )
    )

    this.#ro = new ResizeObserver(this.#measureStacks.bind(this))
  }

  #measureStacks(entries: ResizeObserverEntry[] = []) {
    console.debug(
      `${BottomBar.name} ⚡️ resize observer callback: ${this.#measureStacks.name}`
    )

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
  }

  disconnectedCallback() {
    console.debug(`${BottomBar.name} ⚡️ disconnect`)

    this.#ro.disconnect()
  }
}
