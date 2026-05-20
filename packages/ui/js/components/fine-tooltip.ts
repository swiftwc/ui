import { CleanupRegistry } from '../internal/class/cleanup-registry'
import { $, onoff } from '../internal/utils'

export class FineTooltip extends HTMLElement {
  constructor() {
    super()
  }

  #handleMutation = (mutations: MutationRecord[]) => {
    for (const { target, attributeName } of mutations) if (target instanceof HTMLElement && target && attributeName) this.#render(target.getAttribute(attributeName))
  }

  #handleMeasure = ([{ target, borderBoxSize }]: ResizeObserverEntry[]) => {
    console.debug(`${FineTooltip.name} ⚡️ measure`)

    if (target.hasAttribute('closing')) return

    if (!(target instanceof HTMLElement && target)) return

    const { top } = target.getBoundingClientRect()

    const vpHeight = self.visualViewport?.height ?? 0,
      blockSize = borderBoxSize.at(0)?.blockSize ?? 0

    if (top > vpHeight - blockSize - 50) {
      target.style.setProperty('position-area', 'top center')
      target.style.setProperty('transform-origin', 'bottom')
    }
  }

  #observer = new MutationObserver(this.#handleMutation)

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
    console.debug(`${FineTooltip.name} ⚡️ connect`)

    this.removeAttribute('closing')

    this.popover = 'manual'

    this.inert = true

    CleanupRegistry.register(this, onoff('toggle', this.#handleToggle as unknown as EventListener, this).on())

    CleanupRegistry.register(this, onoff('beforetoggle', this.#handleBeforetoggle as unknown as EventListener, this).on())

    this.showPopover()
  }

  disconnectedCallback() {
    console.debug(`${FineTooltip.name} ⚡️ disconnect`)

    this.#resizeObserver.unobserve(this)

    this.#observer?.disconnect()

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

      this.#observer.observe(trigger, {
        attributes: true,
        attributeFilter: ['help'],
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
