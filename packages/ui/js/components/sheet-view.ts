import { CleanupRegistry } from '../internal/class/cleanup-registry'
import { devFlags, onoff } from '../internal/utils'
import { DialogBase } from '../namespace-browser/base'

export class SheetView extends DialogBase {
  constructor() {
    super()
  }

  static polyfillDisconnectedCallback(el: SheetView) {
    if (devFlags.debug) console.debug(`${SheetView.name} ⚡️ disconnect`)

    CleanupRegistry.unregister(el)
  }

  static polyfillConnectedCallback(el: SheetView) {
    if (devFlags.debug) console.debug(`${SheetView.name} ⚡️ connect`)

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
    if (devFlags.debug) console.debug(`${SheetView.name} ⚡️ attr-change [${attributeName}] ("${oldValue}" → "${(target as HTMLElement).getAttribute(attributeName ?? '')}")`)

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
    if (devFlags.debug) console.debug(`${SheetView.name} ⚡️ ${evt?.type} (${evt.key})`)

    if ('Escape' !== evt.key) return

    evt.preventDefault()
    evt.stopImmediatePropagation()
    evt.stopPropagation()
  }

  static #handleCancel = (evt: Event) => {
    if (devFlags.debug) console.debug(`${SheetView.name} ⚡️ ${evt?.type} (${evt.cancelable})`)

    if (!evt.cancelable) return

    evt.preventDefault()
  }
}
