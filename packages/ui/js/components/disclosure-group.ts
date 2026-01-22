import { DetailsBase } from '../internal/class'
import { cssTime } from '../internal/utils'
import { Snapshot } from '../snapshot'

const observers = new WeakMap()

export class DisclosureGroup extends DetailsBase {
  static observedAttributes = ['open']

  constructor() {
    super()
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    console.debug(`${DisclosureGroup.name} ⚡️ [${name}] change`)

    if (CSS.supports('interpolate-size', 'allow-keywords')) return

    const entry = {
      attributeName: name,
      oldValue: oldValue,
      target: this,
    }

    Snapshot.waitReady.then(() => {
      // @ts-expect-error
      DisclosureGroup.polyfillAttributeChangedCallback([entry])
    })
  }

  disconnectedCallback() {
    console.debug(`${DisclosureGroup.name} ⚡️ disconnect`)
  }

  connectedCallback() {
    console.debug(`${DisclosureGroup.name} ⚡️ connect`)
  }

  static polyfillDisconnectedCallback(el: DisclosureGroup) {
    if (CSS.supports('interpolate-size', 'allow-keywords')) return

    el.removeEventListener('click', DisclosureGroup.handleClick)

    observers?.get(el)?.unobserve?.(el)
  }

  static polyfillConnectedCallback(el: DisclosureGroup) {
    if (CSS.supports('interpolate-size', 'allow-keywords')) return

    Snapshot.waitReady.then(() =>
      el.addEventListener('click', DisclosureGroup.handleClick)
    )
  }

  static handleClick = async (event: Event) => {
    if (!(event.target as HTMLElement).closest('summary')) return

    const el = (event.target as HTMLElement).closest<HTMLDetailsElement>(
      'details'
    )
    if (!el) return

    const wasOpen = el.open // will close after this event

    el.inert = true

    if (wasOpen) {
      el.classList.add(
        Snapshot.config!['disclosure-group-animation-close-class']
      )

      event.preventDefault()
      event.stopPropagation()
      event.stopImmediatePropagation()
    }

    await new Promise((r) =>
      setTimeout(
        r,
        cssTime(
          `${el.computedStyleMap().get(Snapshot.config!['disclosure-group-animation-duration-css-prop'])}`
        )
      )
    )

    el.inert = false

    if (wasOpen) el.open = false
  }

  static async polyfillAttributeChangedCallback([entry]: MutationRecord[]) {
    const node = entry.target as HTMLDetailsElement

    node.classList.remove(
      Snapshot.config!['disclosure-group-animation-close-class']
    )

    if (node.open) {
      observers.set(
        node,
        new ResizeObserver(([entry]) => {
          const { height } = entry.contentRect

          node?.style?.setProperty?.(
            Snapshot.config!['disclosure-group-contents-height-css-prop'],
            `${height}px`
          )
        })
      )

      observers.get(node).observe(node)
    } else {
      observers.get(node)?.unobserve?.(node)
      observers.delete(node)

      node?.style?.removeProperty?.(
        Snapshot.config!['disclosure-group-contents-height-css-prop']
      )
    }
  }
}
