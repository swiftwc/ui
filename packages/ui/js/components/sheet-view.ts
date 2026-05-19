import { CleanupRegistry } from '../internal/class/cleanup-registry'
import { onoff } from '../internal/utils'
import { DialogBase } from '../namespace-browser/base'
import { Snapshot } from '../snapshot'

export class SheetView extends DialogBase {
  // static get observedAttributes() {
  //   return ['fine-presentation-large-adaptation']
  // }

  constructor() {
    super()
  }

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

    if (!self.matchMedia('(pointer: fine)').matches) return

    const handler1 = this.#handleMediaChange.bind(null, el)

    CleanupRegistry.register(el, onoff('fine_dialog_sheet:change', handler1 as unknown as EventListener, Snapshot.on).on())

    Snapshot.waitReady.then(() => {
      this.#handleMediaChange(
        el,
        new MediaQueryListEvent(`media-change`, {
          matches: Snapshot.breakpoints?.get('fine_dialog_sheet'),
        })
      ) // Initial check
    })
  }

  static polyfillAttributeChangedCallback([{ attributeName, target, oldValue }]: Pick<MutationRecord, 'attributeName' | 'oldValue' | 'target'>[]) {
    console.debug(`${SheetView.name} ⚡️ attr-change [${attributeName}] ("${oldValue}" → "${(target as HTMLElement).getAttribute(attributeName ?? '')}")`)

    // // NOTE: wait for config
    // Snapshot.waitReady.then(() => {
    //   switch (attributeName) {
    //     case 'fine-presentation-large-adaptation':
    //       const node = target instanceof HTMLDialogElement && target
    //       if (!node) break

    //       CleanupRegistry.unregister(node, 'mediaquery')

    //       if ('bottom-bar' !== target.getAttribute(attributeName ?? '')) break

    //       const mediaQueryList = self.matchMedia(`(pointer: fine) and (min-width: ${Snapshot.config!['ipad-sheet-view-inline-size']}) and (min-height: ${Snapshot.config!['ipad-sheet-view-height']})`)

    //       SheetView.#handleMediaChange(
    //         node,
    //         new MediaQueryListEvent(`media-change`, {
    //           matches: mediaQueryList.matches,
    //         })
    //       ) // Initial check

    //       const handler1 = SheetView.#handleMediaChange.bind(null, node)

    //       CleanupRegistry.register(node, onoff('change', handler1 as unknown as EventListener, mediaQueryList).on(), 'mediaquery')

    //       break
    //   }
    // })
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
      for (const item of el.querySelectorAll<HTMLElement>(
        ':scope>tool-bar>[slot^="top-bar-"],:scope>tool-bar>[slot="cancellation-action"],:scope>tool-bar>[slot="primary-action"],:scope>tool-bar>[slot="confirmation-action"],:scope>tool-bar>[slot="destructive-action"]'
      )) {
        const newSlot = item.slot.endsWith('leading') ? 'bottom-bar-leading' : 'bottom-bar-trailing'

        if (item.slot !== newSlot) item.dataset.previousSlot = item.slot

        item.slot = newSlot
      }
    else
      for (const item of el.querySelectorAll<HTMLElement>(':scope>tool-bar>[data-previous-slot]')) {
        item.slot = item.dataset.previousSlot ?? ''

        delete item.dataset.previousSlot
      }
  }
}
