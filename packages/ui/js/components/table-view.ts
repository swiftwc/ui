import { listActive, onoff, $ } from '../internal/utils'
import { CleanupRegistry } from '../internal/class/cleanup-registry'
import { CSSStyleObserver } from '../internal/class/css-style-observer'
import { Snapshot } from '../snapshot'
import { MutationObserverSingleton } from '../internal/class/mutation-observer-singleton'

const observers = new MutationObserverSingleton()

export class TableView extends HTMLElement {
  #styleObserver?: CSSStyleObserver

  #compactToolbarItem?: Element

  #trackedElements = new Set<Element>()

  static #template: DocumentFragment

  static get template() {
    return (this.#template ??= $(
      String.raw`
    <div part="root table-container">
      <div part="root table-header-stack">
        <div part="root table-header-leading-stack">
          <slot name="header-leading"></slot>
        </div>
        <div part="root table-header-principal-stack">
          <slot name="header-principal"></slot>
        </div>
        <div part="root table-header-trailing-stack">
          <slot name="header-trailing"></slot>
        </div>
      </div>
      <div part="root table-column-stack">
        <slot name="column"></slot>
      </div>
      <slot><p>empty</p></slot>
      <div part="root table-footer-stack">
        <div part="root table-footer-leading-stack">
          <slot name="footer-leading"></slot>
        </div>
        <div part="root table-footer-principal-stack">
          <slot name="footer-principal"></slot>
        </div>
        <div part="root table-footer-trailing-stack">
          <slot name="footer-trailing"></slot>
        </div>
      </div>
    </div>`,
      ''
    ))
  }

  #shadowRoot

  #colSlot?: HTMLSlotElement
  // #slot?: HTMLSlotElement

  constructor() {
    super()

    this.#shadowRoot = this.attachShadow({ mode: 'closed' })

    this.#shadowRoot.appendChild(document.importNode((this.constructor as typeof TableView).template, true))

    this.#colSlot = this.#shadowRoot.querySelector<HTMLSlotElement>('slot[name=column]') ?? undefined
    // this.#slot = this.#shadowRoot.querySelector<HTMLSlotElement>('slot:not([name])') ?? undefined

    this.#colSlot?.addEventListener('slotchange', this.#handleSlotchange)

    // this.append(
    //   document.createRange().createContextualFragment(`<menu-view slot="header-trailing">
    //               <label-view slot="label" title="Delete"></label-view>
    //               <button type="button" tabindex="0">
    //                 <label-view system-image="dots-three" title="Scan Documents"></label-view>
    //               </button>
    //               <button type="button" tabindex="0">
    //                 <label-view system-image="dots-three" title="Connect to Server"></label-view>
    //               </button>
    //               <button type="button" tabindex="0">
    //                 <label-view title="Edit Sidebar"></label-view>
    //               </button>
    //             </menu-view>
    //             `)
    // $(`<menu-view slot="header-trailing">
    //             <label-view slot="label" title="Delete"></label-view>
    //             <button type="button" tabindex="0">
    //               <label-view system-image="dots-three" title="Scan Documents"></label-view>
    //             </button>
    //             <button type="button" tabindex="0">
    //               <label-view system-image="dots-three" title="Connect to Server"></label-view>
    //             </button>
    //             <button type="button" tabindex="0">
    //               <label-view title="Edit Sidebar"></label-view>
    //             </button>
    //           </menu-view>
    //           <div slot="footer-leading">22</div>
    //           <div slot="footer-trailing"><button>&lt;</button> <button>&gt;</button></div>`)
    // )
  }

  disconnectedCallback() {
    console.debug(`${TableView.name} ⚡️ disconnect`)

    CleanupRegistry.unregister(this)

    this.#styleObserver?.disconnect()

    observers.clearObservationsSet(this.#trackedElements)

    this.#compactToolbarItem = undefined
  }

  connectedCallback() {
    console.debug(`${TableView.name} ⚡️ connect`)

    CleanupRegistry.register(this, onoff(listActive(this), this).on())

    // console.log(999, this.#shadowRoot.querySelector('[part*=table-column-stack]'))
    this.#styleObserver = new CSSStyleObserver({
      properties: ['--adaptable-table-style-index'],
    })
    const target = this.#shadowRoot.querySelector('[part*=table-container]') ?? undefined
    if (!target) return
    this.#styleObserver.observe(target, this.#handleStyleChange)

    Snapshot.waitReady.then(() => self.requestAnimationFrame(this.#handleStyleChange))
  }

  #handleSlotchange = (evt: Event) => {
    console.debug(`${TableView.name} ⚡️ ${evt?.type}`)

    const slot = evt.target as HTMLSlotElement,
      assigned = slot.assignedElements({ flatten: true })

    observers.syncObservations(this.#trackedElements, assigned, this.#handleTagMutation)

    if (0 < assigned.length) this.#handleTagMutation()
  }

  #handleTagMutation = (entry?: MutationRecord) => {
    console.debug(`${TableView.name} ⚡️ mutation`)

    // const sourceSlot = 0 < (this.#colSlot?.assignedElements({ flatten: true }) ?? []).length ? this.#colSlot : this.#colSlot

    // const menu = this.querySelector(':scope>menu-view:not([slot])') ?? this.appendChild($(`<menu-view></menu-view>`))

    // menu.innerHTML = `<label-view slot="label" system-image="dots-three" title="rtyty"></label-view>`

    // for (const el of sourceSlot?.assignedElements({ flatten: true }) ?? []) menu.insertAdjacentElement('beforeend', TableView.wrapTag(el, sourceSlot?.name))
    //

    if (!this.#compactToolbarItem) {
      this.#compactToolbarItem = $(`<menu-view tabindex="0" slot="header-trailing"></menu-view>`)

      CleanupRegistry.unregister(this, 'compact_toolbar')
      CleanupRegistry.register(this, onoff('click', this.#handleMenuClick, this.#compactToolbarItem).on(), 'compact_toolbar')
    }

    this.#compactToolbarItem.innerHTML = `<label-view slot="label" system-image="dots-three"></label-view>`

    for (const node of this.#colSlot?.assignedElements({ flatten: true }) ?? []) {
      if (!node.matches('[is=table-column]')) continue

      this.#compactToolbarItem.appendChild(
        $(`<button type="button" tabindex="0">
          <label-view title="Edit Sidebar/${node.ariaSelected}"></label-view>
        </button>`)
      )
    }

    // const wasConnected = this.#compactToolbarItem?.isConnected
    // this.#compactToolbarItem?.removeEventListener('click', this.#handleMenuClick)
    // this.#compactToolbarItem?.remove()
    // this.#compactToolbarItem = menu
    // this.#compactToolbarItem?.addEventListener('click', this.#handleMenuClick)
    // if (wasConnected) this.insertAdjacentElement('beforeend', this.#compactToolbarItem)
  }

  #handleStyleChange = () => {
    console.debug(`${TableView.name} ⚡️ style`)

    const target = this.#shadowRoot.querySelector('[part*=table-container]') ?? undefined
    if (!target) return

    const style = self.getComputedStyle(target)

    const adaptableTableStyle = style.getPropertyValue('--adaptable-table-style') || 'compact'

    switch (adaptableTableStyle) {
      case 'expanded':
        if (!this.#compactToolbarItem?.isConnected) break

        this.#compactToolbarItem?.remove()

        break
      default:
        if (!this.#compactToolbarItem) break

        if (this.#compactToolbarItem?.isConnected) break

        this.insertAdjacentElement('beforeend', this.#compactToolbarItem)

        break
    }
  }

  #handleMenuClick = (evt: Event) => {
    const btn = (evt.target as HTMLElement).closest('button')
    if (!btn) return

    const siblings = [...(btn.parentNode?.querySelectorAll(':scope>button') ?? [])]
    const index = siblings.indexOf(btn)

    this.querySelector<HTMLElement>(`:scope>[slot=column]:nth-of-type(${index + 1})`)?.click()
  }
}
