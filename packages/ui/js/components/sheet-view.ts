import { DialogBase } from '../namespace-browser/base'
import { onoff } from '../internal/utils'
import { CleanupRegistry } from '../internal/class/cleanup-registry'
import { Snapshot } from '../snapshot'

export class SheetView extends DialogBase {
  static get observedAttributes() {
    return ['fine-presentation-large-adaptation']
  }

  constructor() {
    super()
  }

  // disconnectedCallback() {
  //   SheetView.polyfillDisconnectedCallback(this)
  // }

  // connectedCallback() {
  //   SheetView.polyfillConnectedCallback(this)
  // }

  // attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
  //   const entry = {
  //     attributeName: name,
  //     oldValue,
  //     target: this,
  //   }

  //   SheetView.polyfillAttributeChangedCallback([entry])
  // }

  static polyfillDisconnectedCallback(el: SheetView) {
    console.debug(`${SheetView.name} ⚡️ disconnect`)

    CleanupRegistry.unregister(el)
  }

  static polyfillConnectedCallback(el: SheetView) {
    console.debug(`${SheetView.name} ⚡️ connect`)

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

  static async polyfillAttributeChangedCallback([{ attributeName, target, oldValue }]: Pick<MutationRecord, 'attributeName' | 'oldValue' | 'target'>[]) {
    console.debug(`${SheetView.name} ⚡️ attr-change [${attributeName}] ("${oldValue}" → "${(target as HTMLElement).getAttribute(attributeName ?? '')}")`)

    await Snapshot.waitReady // NOTE: wait for config

    switch (attributeName) {
      case 'fine-presentation-large-adaptation':
        const node = target as HTMLDialogElement

        CleanupRegistry.unregister(node, 'mediaquery')

        if ('bottom-bar' !== (target as HTMLElement).getAttribute(attributeName ?? '')) break

        const mediaQueryList = self.matchMedia(
          `(pointer: fine) and (min-width: ${Snapshot.config!['ipad-sheet-view-inline-size']}) and (min-height: ${Snapshot.config!['ipad-sheet-view-height']})`
        )

        SheetView.#handleMediaChange(
          node,
          new MediaQueryListEvent(`media-change`, {
            matches: mediaQueryList.matches,
          })
        ) // Initial check

        const handler1 = SheetView.#handleMediaChange.bind(null, node)

        CleanupRegistry.register(node, onoff('change', handler1 as unknown as EventListener, mediaQueryList).on(), 'mediaquery')

        break
    }
  }

  static #handleKeydown = (evt: KeyboardEvent) => {
    console.debug(`${SheetView.name} ⚡️ ${evt?.type} (${evt.key})`)

    if ('Escape' !== evt.key) return

    evt.preventDefault()
    evt.stopImmediatePropagation()
    evt.stopPropagation()
  }

  static #handleCancel = (evt: Event) => {
    console.debug(`${SheetView.name} ⚡️ ${evt?.type} (${evt.cancelable})`)

    if (!evt.cancelable) return

    evt.preventDefault()
  }

  static #handleMediaChange: (el: HTMLElement, evt: MediaQueryListEvent) => void = (el, evt) => {
    console.debug(`${SheetView.name} ⚡️ ${evt?.type}`)

    if (evt.matches)
      for (const item of el.querySelectorAll<HTMLElement>(':scope>tool-bar>[slot^="top-bar-"]')) {
        item.dataset.previousSlot = item.getAttribute('slot') ?? ''

        item.slot = 'bottom-bar-trailing'
      }
    else
      for (const item of el.querySelectorAll<HTMLElement>(':scope>tool-bar>[data-previous-slot]')) {
        item.slot = item.dataset.previousSlot ?? ''

        delete item.dataset.previousSlot
      }
  }
}
