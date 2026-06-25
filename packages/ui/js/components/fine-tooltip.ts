import { CleanupRegistry } from '../internal/class/cleanup-registry'
import { $, devFlags, onoff } from '../internal/utils'

export class FineTooltip extends HTMLElement {
  constructor() {
    super()
  }

  #handleTriggerRemovalMutation = (mutations: MutationRecord[]) => {
    if (this.#queryTrigger?.isConnected) return

    this?.remove()
  }

  #handleTriggerAttrMutation = (mutations: MutationRecord[]) => {
    for (const { target, attributeName } of mutations) if (target instanceof HTMLElement && attributeName) this.#render(target.getAttribute(attributeName))
  }

  #handleMeasure = ([{ target, borderBoxSize }]: ResizeObserverEntry[]) => {
    if (devFlags.debug) console.debug(`${FineTooltip.name} ⚡️ measure`)

    if (target.hasAttribute('closing')) return

    if (!(target instanceof HTMLElement)) return

    const { top } = target.getBoundingClientRect()

    const vpHeight = self.visualViewport?.height ?? 0,
      blockSize = borderBoxSize.at(0)?.blockSize ?? 0

    if (top > vpHeight - blockSize - 50) {
      target.style.setProperty('position-area', 'top center')
      target.style.setProperty('transform-origin', 'bottom')
    }
  }

  #mutationObserver = new MutationObserver(this.#handleTriggerAttrMutation)
  #mutationObserver2 = new MutationObserver(this.#handleTriggerRemovalMutation)

  #resizeObserver = new ResizeObserver(this.#handleMeasure)

  get #queryTrigger() {
    const positionAnchor = (
      this.style as CSSStyleDeclaration & {
        positionAnchor: string
      }
    ).positionAnchor

    if (!positionAnchor.startsWith('--help-')) return

    const trigger = document.querySelector<HTMLElement>(`[style*="${CSS.escape(positionAnchor)}"][help]`)

    return trigger ?? undefined
  }

  #render = (str: string | null) => {
    const label = this.querySelector(':scope>label-view') ?? this.appendChild($(`<label-view></label-view>`, '>1'))

    if (str) label.setAttribute('title', str)
    else label.removeAttribute('title')
  }

  connectedCallback() {
    if (devFlags.debug) console.debug(`${FineTooltip.name} ⚡️ connect`)

    this.removeAttribute('closing')

    this.popover = 'manual'

    this.inert = true

    CleanupRegistry.register(this, onoff('toggle', this.#handleToggle as unknown as EventListener, this).on())

    CleanupRegistry.register(this, onoff('beforetoggle', this.#handleBeforetoggle as unknown as EventListener, this).on())

    this.showPopover()
  }

  disconnectedCallback() {
    if (devFlags.debug) console.debug(`${FineTooltip.name} ⚡️ disconnect`)

    this.#resizeObserver.unobserve(this)

    this.#mutationObserver?.disconnect()
    this.#mutationObserver2?.disconnect()

    this.#queryTrigger?.style.removeProperty('anchor-name')

    CleanupRegistry.unregister(this)
  }

  #handleToggle = ({ newState }: ToggleEvent) => {
    if ('closed' !== newState) return

    this.remove()
  }

  #handleBeforetoggle = (evt: ToggleEvent) => {
    if ('open' !== evt.newState) return

    const trigger = this.#queryTrigger

    if (!trigger) {
      evt.preventDefault()

      this.remove()

      return
    } else {
      this.#render(trigger.getAttribute('help'))

      this.#mutationObserver.observe(trigger, {
        attributes: true,
        attributeFilter: ['help'],
      })
      this.#mutationObserver2.observe(document.body, {
        childList: true,
        subtree: true,
      })

      this.#resizeObserver.observe(this)
    }

    this.toggleAttribute('open', 'open' === evt.newState)
  }

  hidePopover(): void {
    if (this.hasAttribute('closing')) return

    this.setAttribute('closing', '')

    Promise.allSettled(this.getAnimations().map(({ finished }) => finished)).then(() => {
      if (!this.hasAttribute('closing')) return

      this?.remove()
    })
  }
}
