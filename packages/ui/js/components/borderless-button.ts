import { CleanupRegistry } from '../internal/class/cleanup-registry.ts'
import { debug, ensurePlaceholder, onoff } from '../internal/utils/index.ts'
import { ButtonBase } from '../namespace-browser/base.ts'
import { Snapshot } from '../snapshot/index.ts'

/**
 * @summary A control that starts an action. Styled without any borders.
 *
 * @example <button is="borderless-button"><label-view system-image="hand-tap" title="Tap Me"></label-view></button> — Use the `is` attribute to style a `button` as a borderless button
 *
 * @attr {@ControlSize} control-size — Sets the size for this control.
 *
 * @slot overlay
 *
 */
export class BorderlessButton extends ButtonBase {
  static get observedAttributes() {
    return [
      /**
       * A value that describes the purpose of a button
       * @type {destructive|confirm}
       */
      'role',
      'title-key',
    ]
  }

  constructor() {
    super()
  }

  static override polyfillDisconnectedCallback(el: BorderlessButton) {
    debug(`${BorderlessButton.name} ⚡️ disconnect`)

    CleanupRegistry.unregister(el)
  }

  static override polyfillConnectedCallback(el: BorderlessButton) {
    debug(`${BorderlessButton.name} ⚡️ connect`)

    el.tabIndex = 0

    CleanupRegistry.register(el, onoff('click', BorderlessButton.#handleClick, el).on())
  }

  static override polyfillAttributeChangedCallback([{ attributeName, target, oldValue }]: Pick<MutationRecord, 'attributeName' | 'oldValue' | 'target'>[]) {
    debug(`${BorderlessButton.name} ⚡️ attr-change [${attributeName}] ("${oldValue}" → "${(target as HTMLElement).getAttribute(attributeName ?? '')}")`)

    const node = target instanceof HTMLButtonElement
    if (!node) return

    switch (attributeName) {
      case 'title-key':
      case 'role':
        Snapshot.waitReady.then(() => {
          ensurePlaceholder(target, target.getAttribute('role'), target.getAttribute('title-key'), Snapshot.config)
        })

        break
    }
  }

  static #handleClick = async (evt: Event) => {
    // alert(99)
  }
}
