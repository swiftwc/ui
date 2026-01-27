import { Snapshot } from '../snapshot'
import { ResizeObserverSingleton } from '../internal/resize-observer'

const observers = new ResizeObserverSingleton()

export class ToolBar extends HTMLElement {
  static #template: HTMLTemplateElement

  static get template() {
    if (!this.#template)
      this.#template = Object.assign(document.createElement('template'), {
        // <!--exportparts="toolbar-leading-stack,toolbar-principal-stack,toolbar-trailing-stack"-->
        innerHTML: `<div part="root navigation-bar">
    <div part="root ${Snapshot.config!['toolbar-leading-stack-part-name']}">
      <slot name="navigation-bar-leading"></slot>
    </div>
    <div part="root ${Snapshot.config!['toolbar-principal-stack-part-name']}">
      <slot name="navigation-bar-principal"></slot>
    </div>
    <div part="root ${Snapshot.config!['toolbar-trailing-stack-part-name']}">
      <slot name="navigation-bar-trailing"></slot>
    </div>
  </div>
  <div part="root bottom-bar">
    <div part="root ${Snapshot.config!['toolbar-leading-stack-part-name']}">
      <slot name="bottom-bar-leading"></slot>
    </div>
    <div part="root ${Snapshot.config!['toolbar-principal-stack-part-name']}">
      <slot name="bottom-bar-principal"></slot>
    </div>
    <div part="root ${Snapshot.config!['toolbar-trailing-stack-part-name']}">
      <slot name="bottom-bar-trailing"></slot>
    </div>
  </div>`,
      })

    return this.#template
  }

  #shadowRoot

  get #sibling() {
    return this.parentElement?.querySelector(':scope > scroll-view') ?? undefined //this.previousElementSibling ?? undefined
  }

  constructor() {
    super()

    this.#shadowRoot = this.attachShadow({ mode: 'open' })

    Snapshot.waitReady.then(() => {
      this.#shadowRoot.appendChild(document.importNode((this.constructor as typeof ToolBar).template.content, true))
    })
  }

  connectedCallback() {
    console.debug(`${ToolBar.name} ⚡️ connect`)

    Snapshot.waitReady.then(() => {
      for (const el of this.#shadowRoot.querySelectorAll(
        `[part*="${Snapshot.config!['toolbar-leading-stack-part-name']}"],[part*="${Snapshot.config!['toolbar-trailing-stack-part-name']}"]`
      ))
        observers.observe(el, this.#measureStacks.bind(this))
    })
  }

  disconnectedCallback() {
    console.debug(`${ToolBar.name} ⚡️ disconnect`)

    observers.unobserve(this)
  }

  #measureStacks(entry: ResizeObserverEntry) {
    console.debug(`${ToolBar.name} ⚡️ measure`)

    const leading = Snapshot.config!['toolbar-leading-stack-part-name'],
      trailing = Snapshot.config!['toolbar-trailing-stack-part-name']

    const parentMap = {
      'navigation-bar': 'navbar',
      'bottom-bar': 'bottombar',
    } as const

    const { contentRect, target } = entry

    const parentPart = target.parentElement?.part.contains('navigation-bar')
      ? 'navigation-bar'
      : target.parentElement?.part.contains('bottom-bar')
        ? 'bottom-bar'
        : null
    if (!parentPart) return

    const side = target.part.contains(leading) ? 'inline-start' : target.part.contains(trailing) ? 'inline-end' : null
    if (!side) return

    const prop = `--${parentMap[parentPart]}-padding-${side}`

    ;(this.#sibling as HTMLElement)?.style?.setProperty(prop, `${Math.round(contentRect.width)}px`)
  }
}
