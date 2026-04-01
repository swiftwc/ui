import { Snapshot } from '../../snapshot'
import { kebabCase, $, onoff } from '../../internal/utils'

export class CSSStyleObserver {
  #cleanups?: () => void

  constructor(target: HTMLElement) {}

  public async observe(target: Node, callback: (entry: MutationRecord) => void, options?: MutationObserverInit) {
    this.#cleanups = onoff('transitionrun', this.#handleTransitionrun as EventListener, target).on()
    // console.log(111, target)
  }

  public async unobserve(target: Node) {
    this.#cleanups?.()
  }

  #handleTransitionrun = (evt: TransitionEvent) => {
    // if (evt.propertyName !== 'perspective-origin') return

    console.log(123, evt)

    // const currentColor = self.getComputedStyle(event.target as Element).perspectiveOrigin

    // this.hasElementScrolledOverBottomEdge = !String(currentColor ?? '').endsWith(' 0px')
  }
}
