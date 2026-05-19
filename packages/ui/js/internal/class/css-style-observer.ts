import { onoff } from '../../internal/utils'

export class CSSStyleObserver {
  #cleanups?: () => void

  #options?: { properties: string[] }

  constructor(
    options: { properties: string[] } = {
      properties: ['perspective-origin'], // --other-number-@property
    }
  ) {
    this.#options = options
  }

  public async observe(target: Node, callback: (evt: TransitionEvent) => void) {
    const listener = this.#handleTransitionrun.bind(this, callback) as EventListener

    this.#cleanups = onoff('transitionrun', listener, target).on()
  }

  public async disconnect() {
    this.#cleanups?.()
  }

  #handleTransitionrun = (callback: (evt: TransitionEvent) => void, evt: TransitionEvent) => {
    console.debug(`${CSSStyleObserver.name} ⚡️ ${evt?.type} (${evt.propertyName})`)

    if (!this.#options?.properties.some((prop) => evt.propertyName.startsWith(prop))) return

    callback?.(evt)
  }
}
