import { ResizeObserverSingleton } from '../internal/class/resize-observer-singleton'
import { $, debug } from '../internal/utils'

const observers = new ResizeObserverSingleton()

/**
 * @slot cancellation-action - The item represents a cancellation action for a modal interface. Places the item in the leading edge of the top bar and on the trailing edge of the bottom bar when fine modal
 * @slot primary-action - The item represents a primary action. Places the item in the trailing edge of the top bar and on the trailing edge of the bottom bar when fine modal
 * @slot confirmation-action - The item represents a confirmation action for a modal interface. Places the item in the trailing edge of the top bar and on the trailing edge of the bottom bar when fine modal
 * @slot destructive-action - The item represents a destructive action for a modal interface. Places the item in the leading edge of the top bar and on the leading edge of the bottom bar when fine modal
 * @slot top-bar-leading - Places the item in the leading edge of the top bar
 * @slot top-bar-principal - Places the item in the middle of the top bar
 * @slot top-bar-trailing - Places the item in the trailing edge of the top bar
 * @slot bottom-bar-leading - Places the item in the leading edge of the bottom bar
 * @slot bottom-bar-principal - Places the item in the middle of the bottom bar
 * @slot bottom-bar-trailing - Places the item in the trailing edge of the bottom bar
 */
export class ToolBar extends HTMLElement {
  static #template: DocumentFragment

  static get template() {
    // <!--exportparts="toolbar-leading-stack,toolbar-principal-stack,toolbar-trailing-stack"-->
    return (this.#template ??= $(
      String.raw`
    <div part="root top-bar">
    <div part="root toolbar-leading-stack">
      <slot name="cancellation-action"></slot>
      <slot name="destructive-action"></slot>
      <slot name="top-bar-leading"></slot>
    </div>
    <div part="root toolbar-principal-stack">
      <slot name="top-bar-principal"></slot>
    </div>
    <div part="root toolbar-trailing-stack">
      <slot name="top-bar-trailing"></slot>
      <slot name="primary-action"></slot>
      <slot name="confirmation-action"></slot>
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
  </div>`
    ))
  }

  #shadowRoot

  get #scrollView() {
    return this.parentElement?.querySelector<HTMLElement>(':scope>scroll-view') ?? undefined //this.previousElementSibling ?? undefined
  }

  constructor() {
    super()

    this.#shadowRoot = this.attachShadow({ mode: 'closed' })

    this.#shadowRoot.appendChild(document.importNode((this.constructor as typeof ToolBar).template, true))
  }

  connectedCallback() {
    debug(`${ToolBar.name} ⚡️ connect`)

    // NOTE: wait for config
    // Snapshot.waitReady.then(() => {
    for (const el of this.#shadowRoot.querySelectorAll(`[part*="toolbar-leading-stack"],[part*="toolbar-trailing-stack"]`)) observers.observe(el, this.#measureStacks.bind(this))
    // })
  }

  disconnectedCallback() {
    debug(`${ToolBar.name} ⚡️ disconnect`)

    observers.unobserve(this)
  }

  #measureStacks(entry: ResizeObserverEntry) {
    debug(`${ToolBar.name} ⚡️ measure`)

    if (this.closest('[hidden]')) return

    const leading = 'toolbar-leading-stack',
      trailing = 'toolbar-trailing-stack'

    const parentMap = {
      'top-bar': 'navbar',
      'bottom-bar': 'toolbar', //'bottombar',
    } as const

    const {
      contentRect: { width },
      target,
    } = entry

    const parentPart = target.parentElement?.part.contains('top-bar') ? 'top-bar' : target.parentElement?.part.contains('bottom-bar') ? 'bottom-bar' : null
    if (!parentPart) return

    const side = target.part.contains(leading) ? 'inline-start' : target.part.contains(trailing) ? 'inline-end' : null
    if (!side) return

    const prop = `--${parentMap[parentPart]}-padding-${side}`

    this.#scrollView?.style?.setProperty(prop, `${Math.round(width)}px`) // $.prop(prop, `${Math.round(width)}px`, this.#scrollView) //
  }
}
