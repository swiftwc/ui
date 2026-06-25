import { CleanupRegistry } from '../internal/class/cleanup-registry'
import { cssTime, devFlags, onoff, timeout } from '../internal/utils'
import { DetailsBase } from '../namespace-browser/base'

const toggleTimers = new WeakMap<HTMLDetailsElement, ReturnType<typeof timeout>>()

/**
 * @summary A view that shows or hides another content view, based on the state of a disclosure control.
 *
 * @example <details is="disclosure-group"><summary><label-view title="Items"></label-view></summary><label-view title="Item 1"></label-view><label-view title="Item 2"></label-view><details is="disclosure-group"><summary><label-view title="Sub-items"></label-view></summary><label-view title="Sub-item 1"></label-view></details></details>
 */
export class DisclosureGroup extends DetailsBase {
  static get observedAttributes() {
    return [
      /**
       * The status of this element
       */
      'open',
    ]
  }

  constructor() {
    super()
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (devFlags.debug) console.debug(`${DisclosureGroup.name} ⚡️ attr-change [${name}]`)

    // if (CSS.supports('interpolate-size', 'allow-keywords')) return
  }

  static polyfillDisconnectedCallback(el: DisclosureGroup) {
    if (devFlags.debug) console.debug(`${DisclosureGroup.name} ⚡️ disconnect`)

    CleanupRegistry.unregister(el)
  }

  static polyfillConnectedCallback(el: DisclosureGroup) {
    if (devFlags.debug) console.debug(`${DisclosureGroup.name} ⚡️ connect`)

    const newValue = el.open ? 'open' : 'closed'

    if (newValue !== el.dataset.state) el.dataset.state = newValue

    CleanupRegistry.register(el, onoff('toggle', DisclosureGroup.#handleToggle, el).on())

    CleanupRegistry.register(el, () => {
      toggleTimers.get(el)?.cancel()
      toggleTimers.delete(el)
    })
  }

  static #handleToggle = async ({ type, currentTarget: details }: Event) => {
    if (devFlags.debug) console.debug(`${DisclosureGroup.name} ⚡️ ${type}`)

    if (!(details instanceof HTMLDetailsElement)) return

    const newValue = details.open ? 'opening' : 'closing'

    if (newValue !== details.dataset.state) details.dataset.state = newValue

    if (!toggleTimers.has(details)) toggleTimers.set(details, timeout()) //if (!toggleTimeouts.has(details)) toggleTimeouts.set(details, null)

    // Cancel previous timeout for this instance
    //if (toggleTimeouts.has(details) && toggleTimeouts.get(details)) self.clearTimeout(toggleTimeouts.get(details))

    // Schedule a new hook
    toggleTimers.get(details)!.next(
      () => {
        details.dataset.state = details.open ? 'open' : 'closed'

        details?.dispatchEvent(new CustomEvent(`is-${details.open ? 'expanded' : 'collapsed'}`, { bubbles: true, composed: true }))
      },
      cssTime(`${details.computedStyleMap().get('--disclosure-group-animation-duration')}`)
    )
  }
}
