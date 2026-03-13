import { DetailsBase } from '../internal/privateNamespace'
import { cssTime, timeout } from '../internal/utils'
import { Snapshot } from '../snapshot'
import { onoff } from '../internal/utils'
import { CleanupRegistry } from '../internal/class/cleanup-registry'
// import { ResizeObserverSingleton } from '../internal/class/resize-observer-singleton'

const toggleTimers = new WeakMap<HTMLDetailsElement, ReturnType<typeof timeout>>() //const toggleTimeouts = new WeakMap()
// const observers = new ResizeObserverSingleton()

export class DisclosureGroup extends DetailsBase {
  static observedAttributes = ['open']

  constructor() {
    super()
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    console.debug(`${DisclosureGroup.name} ⚡️ attr-change [${name}]`)

    // if (CSS.supports('interpolate-size', 'allow-keywords')) return

    // const entry = {
    //   attributeName: name,
    //   oldValue: oldValue,
    //   target: this,
    // }

    // Snapshot.waitReady.then(() => {
    //if (!this.isConnected) return
    //   // @ts-expect-error
    //   DisclosureGroup.polyfillAttributeChangedCallback([entry])
    // })
  }

  disconnectedCallback() {
    DisclosureGroup.polyfillDisconnectedCallback(this)
  }

  connectedCallback() {
    DisclosureGroup.polyfillConnectedCallback(this)
  }

  static polyfillDisconnectedCallback(el: DisclosureGroup) {
    console.debug(`${DisclosureGroup.name} ⚡️ disconnect`)

    // el.removeEventListener('click', DisclosureGroup.#handleClick)
    CleanupRegistry.unregister(el)

    // finally

    // toggleTimers.get(el)?.cancel()
    // toggleTimers.delete(el)
    // if (toggleTimeouts.has(el)) {
    //   if (toggleTimeouts.get(el)) self.clearTimeout(toggleTimeouts.get(el))

    //   toggleTimeouts.delete(el)
    // }

    // if (CSS.supports('interpolate-size', 'allow-keywords')) return

    // observers.unobserve(el)
  }

  static polyfillConnectedCallback(el: DisclosureGroup) {
    console.debug(`${DisclosureGroup.name} ⚡️ connect`)

    const newValue = el.open ? 'open' : 'closed'

    if (newValue !== el.dataset.state) el.dataset.state = newValue

    Snapshot.waitReadyFor(el).then((r) => {
      if (!r) return

      // el.addEventListener('click', DisclosureGroup.#handleClick)
      const { on } = onoff('toggle', DisclosureGroup.#handleToggle, el)

      CleanupRegistry.register(el, on())

      CleanupRegistry.register(el, () => {
        toggleTimers.get(el)?.cancel()
        toggleTimers.delete(el)
      })
    })

    // if (CSS.supports('interpolate-size', 'allow-keywords')) return
  }

  static #handleToggle = async (event: Event) => {
    console.debug(`${DisclosureGroup.name} ⚡️ ${event?.type}`)

    const details = event.currentTarget as HTMLDetailsElement,
      newValue = details.open ? 'opening' : 'closing'

    if (newValue !== details.dataset.state) details.dataset.state = newValue

    if (!toggleTimers.has(details)) toggleTimers.set(details, timeout()) //if (!toggleTimeouts.has(details)) toggleTimeouts.set(details, null)

    // Cancel previous timeout for this instance
    //if (toggleTimeouts.has(details) && toggleTimeouts.get(details)) self.clearTimeout(toggleTimeouts.get(details))

    // Schedule a new hook
    toggleTimers.get(details)!.next(
      () => {
        details.dataset.state = details.open ? 'open' : 'closed'
      },
      cssTime(`${details.computedStyleMap().get('--disclosure-group-animation-duration')}`)
    )

    // toggleTimers.get(details)!.next(
    //   details,
    //   self.setTimeout(
    //     () => {
    //       details.dataset.state = details.open ? 'open' : 'closed'

    //       if (toggleTimeouts.has(details)) toggleTimeouts.set(details, null) // clean up
    //     },
    //     cssTime(`${details.computedStyleMap().get('--disclosure-group-animation-duration')}`)
    //   )
    // )
  }

  // static #handleClick = async (event: Event) => {
  //   console.debug(`${DisclosureGroup.name} ⚡️ ${event?.type}`)

  //   const summary = (event.target as HTMLElement).closest('summary')
  //   if (!summary) return

  //   if (!summary.querySelector('button')) return // skip logic if no button inside summary

  //   const details = (event.target as HTMLElement).closest<HTMLDetailsElement>('details')
  //   if (!details) return

  //   const btn = (event.target as HTMLElement).closest('button')

  //   if (btn) details.toggleAttribute('open')

  //   event.preventDefault()

  //   //     if (summary) {
  //   //       event.preventDefault()

  //   //       if (btn) {
  //   //         summary.closest('details').toggleAttribute('open')
  //   //       } else {
  //   //         summary.setAttribute('aria-selected', `${`true` !== summary.getAttribute('aria-selected')}`)
  //   //       }
  //   //     } else if (btn) {
  //   //       btn.setAttribute('aria-selected', `${`true` !== btn.getAttribute('aria-selected')}`)
  //   //     }

  //   //   const wasOpen = el.open // will close after this event

  //   //   el.inert = true

  //   //   if (wasOpen) {
  //   //     el.classList.add(Snapshot.config!['disclosure-group-animation-close-class'])

  //   //     event.preventDefault()
  //   //     event.stopPropagation()
  //   //     event.stopImmediatePropagation()
  //   //   }

  //   //   await new Promise((r) => setTimeout(r, cssTime(`${el.computedStyleMap().get(Snapshot.config!['disclosure-group-animation-duration-css-prop'])}`)))

  //   //   el.inert = false

  //   //   if (wasOpen) el.open = false
  // }

  // static async polyfillAttributeChangedCallback([{ attributeName, target, oldValue }]: MutationRecord[]) {
  //   console.debug(`${DisclosureGroup.name} ⚡️ attr-change [${attributeName}] ("${oldValue}" → "${(target as HTMLElement).getAttribute(attributeName ?? '')}")`)

  //   switch (attributeName) {
  //     case 'open':
  //       const node = target as HTMLDetailsElement

  //       for (const el of node.querySelectorAll<HTMLElement>(':scope > *:not(summary)')) el.inert = !node.open
  //       //       const node = target as HTMLDetailsElement

  //       //       node.classList.remove(Snapshot.config!['disclosure-group-animation-close-class'])

  //       //       if (node.open) {
  //       //         // console.log(999, node.querySelector('summary')!.offsetHeight, node.getBoundingClientRect().height)
  //       //         observers.observe(node, DisclosureGroup.#handleMeasure)
  //       //       } else {
  //       //         observers.unobserve(node)

  //       //         node?.style?.removeProperty?.(Snapshot.config!['disclosure-group-contents-height-css-prop'])
  //       //       }

  //       break
  //   }
  // }

  // static #handleMeasure({ contentRect, target }: ResizeObserverEntry) {
  //   console.debug(`${DisclosureGroup.name} ⚡️ measure`)

  //   const { height } = contentRect

  //   ;(target as HTMLElement)?.style?.setProperty?.(Snapshot.config!['disclosure-group-contents-height-css-prop'], `${height}px`)
  // }
}
