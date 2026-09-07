import { DEBUG } from '../internal/flags.json' with { type: 'json' }
import { CleanupRegistry } from '../internal/class/cleanup-registry'
import { onoff } from '../internal/utils'
import { DialogBase } from '../namespace-browser/base'

/**
 * @summary A dialog that slides up over the current screen.
 */
export class SheetView extends DialogBase {
  constructor() {
    super()
  }

  static polyfillDisconnectedCallback(el: SheetView) {
    DEBUG && console.debug(`${SheetView.name} ⚡️ disconnect`)

    CleanupRegistry.unregister(el)
  }

  static polyfillConnectedCallback(el: SheetView) {
    DEBUG && console.debug(`${SheetView.name} ⚡️ connect`)

    CleanupRegistry.register(
      el,
      onoff(
        [
          { types: 'cancel', listener: this.#handleCancel },
          { types: 'keydown', listener: SheetView.#handleKeydown as EventListener },
        ],
        el
      ).on()
    )

    el.autofocus = true
  }

  static polyfillAttributeChangedCallback([{ attributeName, target, oldValue }]: Pick<MutationRecord, 'attributeName' | 'oldValue' | 'target'>[]) {
    DEBUG && console.debug(`${SheetView.name} ⚡️ attr-change [${attributeName}] ("${oldValue}" → "${(target as HTMLElement).getAttribute(attributeName ?? '')}")`)
  }

  static #handleKeydown = (evt: KeyboardEvent) => {
    DEBUG && console.debug(`${SheetView.name} ⚡️ ${evt?.type} (${evt.key})`)

    if ('Escape' !== evt.key) return

    evt.preventDefault()
    evt.stopImmediatePropagation()
    evt.stopPropagation()
  }

  static #handleCancel = (evt: Event) => {
    DEBUG && console.debug(`${SheetView.name} ⚡️ ${evt?.type} (${evt.cancelable})`)

    if (!evt.cancelable) return

    evt.preventDefault()
  }
}
