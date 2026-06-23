import { CleanupRegistry } from '../internal/class/cleanup-registry'
import { CSSStyleObserver } from '../internal/class/css-style-observer'
import { MutationObserverSet } from '../internal/class/mutation-observer-set'
import { $, devFlags, listActive, onoff } from '../internal/utils'
import { Snapshot } from '../snapshot'

/**
 * @summary Display selectable, sortable data arranged in rows and columns.
 */
export class TableView extends HTMLElement {
  #styleObserver?: CSSStyleObserver

  #compactToolbarItem?: Element

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
    </div>`
    ))
  }

  #shadowRoot

  #slots?: Map<string, HTMLSlotElement> = new Map()

  constructor() {
    super()

    this.#shadowRoot = this.attachShadow({ mode: 'closed' })

    this.#shadowRoot.appendChild(document.importNode((this.constructor as typeof TableView).template, true))

    for (const slot of this.#shadowRoot.querySelectorAll<HTMLSlotElement>('slot')) this.#slots?.set(slot.name, slot)
    CleanupRegistry.register(this, () => {
      this.#slots = new Map()
    })

    this.#slots?.get('column')?.addEventListener('slotchange', this.#handleColumnSlotchange)

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
    if (devFlags.debug) console.debug(`${TableView.name} ⚡️ disconnect`)

    CleanupRegistry.unregister(this)

    this.#styleObserver?.disconnect()

    this.#observers.unobserveAll()

    this.#compactToolbarItem = undefined
  }

  connectedCallback() {
    if (devFlags.debug) console.debug(`${TableView.name} ⚡️ connect`)

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

  #handleColumnSlotchange = ({ type, target: slot }: Event) => {
    if (devFlags.debug) console.debug(`${TableView.name} ⚡️ ${type}`)

    if (!(slot instanceof HTMLSlotElement && slot)) return

    const assigned = slot.assignedElements()

    this.#observers.syncObservations(assigned)

    // if (0 < assigned.length)
    this.#renderColumns([])
  }

  #renderColumns = (entries: MutationRecord[]) => {
    if (devFlags.debug) console.debug(`${TableView.name} ⚡️ mutation`)

    if (!this.#compactToolbarItem) {
      this.#compactToolbarItem = $(`<menu-view tabindex="0" slot="header-trailing"></menu-view>`, '>1')

      CleanupRegistry.unregister(this, 'compact_toolbar')
      CleanupRegistry.register(this, onoff('click', this.#handleMenuClick, this.#compactToolbarItem).on(), 'compact_toolbar')
    }

    this.#compactToolbarItem.innerHTML = `<label-view slot="label" system-image="dots-three"></label-view>`

    for (const node of this.#slots?.get('column')?.assignedElements({ flatten: true }) ?? []) {
      if (!node.matches('[is=table-column]')) continue

      const btn = $(
          `<button type="button" tabindex="0">
        <v-stack spacing="0" alignment="leading">
          <label-view></label-view>
          <label-view font="callout" foreground="secondary"></label-view>
        </v-stack>
      </button>`,
          '>1'
        ),
        title = btn.querySelector('label-view:first-child'),
        subTitle = btn.querySelector('label-view:last-child')

      title?.setAttribute('title', node.textContent.trim())
      subTitle?.setAttribute('title', node.ariaSort ?? '')

      this.#compactToolbarItem.appendChild(btn)
    }
  }

  #observers = new MutationObserverSet(this.#renderColumns)

  #handleStyleChange = () => {
    if (devFlags.debug) console.debug(`${TableView.name} ⚡️ style`)

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

  #handleMenuClick = ({ target }: Event) => {
    if (!(target instanceof HTMLElement && target)) return

    const btn = target.closest('button')
    if (!btn) return

    const siblings = [...(btn.parentNode?.querySelectorAll(':scope>button') ?? [])]
    const index = siblings.indexOf(btn)

    this.querySelector<HTMLElement>(`:scope>[slot=column]:nth-of-type(${index + 1})`)?.click()
  }
}
