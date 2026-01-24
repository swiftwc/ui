import { Snapshot } from '../snapshot'

export class BottomBar extends HTMLElement {
  static #template: HTMLTemplateElement

  static get template() {
    if (!this.#template)
      this.#template = Object.assign(document.createElement('template'), {
        innerHTML: `<div part="root ${Snapshot.config!['toolbar-leading-stack-part-name']}">
    <slot name="leading"></slot>
  </div>
  <div part="root ${Snapshot.config!['toolbar-principal-stack-part-name']}">
    <slot></slot>
  </div>
  <div part="root ${Snapshot.config!['toolbar-trailing-stack-part-name']}">
    <slot name="trailing"></slot>
  </div>`,
      })

    return this.#template
  }

  #shadowRoot

  #ro?: ResizeObserver

  get #rootHost() {
    const root = this.getRootNode()

    if (root instanceof ShadowRoot) return root.host
  }

  get #sibling() {
    return (
      this.#rootHost?.parentElement?.querySelector(':scope > scroll-view') ??
      undefined
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
    console.debug(`${BottomBar.name} ⚡️ measure`)

    for (const { contentRect, target } of entries)
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

  connectedCallback() {
    console.debug(`${BottomBar.name} ⚡️ connect`)

    Snapshot.waitReady.then(() => {
      this.#ro?.observe(
        this.#shadowRoot.querySelector(
          `[part*="${Snapshot.config!['toolbar-leading-stack-part-name']}"]`
        )!
      )

      this.#ro?.observe(
        this.#shadowRoot.querySelector(
          `[part*="${Snapshot.config!['toolbar-trailing-stack-part-name']}"]`
        )!
      )
    })
  }

  disconnectedCallback() {
    console.debug(`${BottomBar.name} ⚡️ disconnect`)

    this.#ro?.disconnect?.()
  }
}
