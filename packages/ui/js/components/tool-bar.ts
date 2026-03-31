import { Snapshot } from '../snapshot'
import { ResizeObserverSingleton } from '../internal/class/resize-observer-singleton'
import { $ } from '../internal/utils'

const observers = new ResizeObserverSingleton()

export class ToolBar extends HTMLElement {
  static #template: HTMLTemplateElement

  static get template() {
    return (this.#template ??= Object.assign(document.createElement('template'), {
      // <!--exportparts="toolbar-leading-stack,toolbar-principal-stack,toolbar-trailing-stack"-->
      innerHTML: String.raw`
    <div part="root navigation-bar">
    <div part="root toolbar-leading-stack">
      <slot name="navigation-bar-leading"></slot>
    </div>
    <div part="root toolbar-principal-stack">
      <slot name="navigation-bar-principal"></slot>
    </div>
    <div part="root toolbar-trailing-stack">
      <slot name="navigation-bar-trailing"></slot>
    </div>
  </div>
  <div part="root bottom-bar">
    <div part="root toolbar-leading-stack">
      <slot name="bottom-bar-leading"></slot>
    </div>
    <div part="root toolbar-principal-stack">
      <slot name="bottom-bar-principal"></slot>
    </div>
    <div part="root toolbar-trailing-stack">
      <slot name="bottom-bar-trailing"></slot>
    </div>
  </div>`,
    }))
  }

  #shadowRoot

  get #scrollView() {
    return this.parentElement?.querySelector(':scope > scroll-view') ?? undefined //this.previousElementSibling ?? undefined
  }

  constructor() {
    super()

    this.#shadowRoot = this.attachShadow({ mode: 'closed' })

    // NOTE: wait for config
    // Snapshot.waitReady.then(() => {
    this.#shadowRoot.appendChild(document.importNode((this.constructor as typeof ToolBar).template.content, true))
    // })
  }

  connectedCallback() {
    console.debug(`${ToolBar.name} ⚡️ connect`)

    // NOTE: wait for config
    // Snapshot.waitReady.then(() => {
    for (const el of this.#shadowRoot.querySelectorAll(`[part*="toolbar-leading-stack"],[part*="toolbar-trailing-stack"]`))
      observers.observe(el, this.#measureStacks.bind(this))
    // })
  }

  disconnectedCallback() {
    console.debug(`${ToolBar.name} ⚡️ disconnect`)

    observers.unobserve(this)
  }

  #measureStacks(entry: ResizeObserverEntry) {
    console.debug(`${ToolBar.name} ⚡️ measure`)

    if (this.closest('[hidden]')) return

    const leading = 'toolbar-leading-stack', //Snapshot.config!['toolbar-leading-stack-part-name'],
      trailing = 'toolbar-trailing-stack' //Snapshot.config!['toolbar-trailing-stack-part-name']

    const parentMap = {
      'navigation-bar': 'navbar',
      'bottom-bar': 'toolbar', //'bottombar',
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

    $.prop(prop, `${Math.round(contentRect.width)}px`, this.#scrollView as HTMLElement) //;(this.#scrollView as HTMLElement)?.style?.setProperty(prop, `${Math.round(contentRect.width)}px`)
  }
}
