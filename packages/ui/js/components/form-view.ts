import { CleanupRegistry } from '../internal/class/cleanup-registry'
import { devFlags, listActive, onoff } from '../internal/utils'
import { FormBase } from '../namespace-browser/base'

/**
 * @attr {hidden} navigation-link-indicator-visibility - Hides accessories like right-arrow-chevron on NavigationLink buttons inside.
 */
export class FormView extends FormBase {
  constructor() {
    super()
  }

  static polyfillDisconnectedCallback(el: HTMLFormElement) {
    if (devFlags.debug) console.debug(`${FormView.name} ⚡️ disconnect`)

    // finally

    CleanupRegistry.unregister(el)
  }

  static polyfillConnectedCallback(el: HTMLFormElement) {
    if (devFlags.debug) console.debug(`${FormView.name} ⚡️ connect`)

    if (el.closest('[is=sidebar-view],[is=tab-bar]')) {
      el.method = 'dialog'

      el.noValidate = true
    }

    CleanupRegistry.register(el, onoff(listActive(el), el).on())

    if (el.matches(':empty'))
      el.insertAdjacentHTML(
        'beforeend',
        `<button type="button" tabindex="0"><label-view system-image="smiley" title="Item 1"></label-view></button>
            <button type="button" tabindex="0"><label-view system-image="smiley" title="Item 1"></label-view></button>
            <button type="button" tabindex="0"><label-view system-image="smiley" title="Item 1"></label-view></button>
            <button type="button" tabindex="0"><label-view system-image="smiley" title="Item 1"></label-view></button>
            <details is="disclosure-group">
              <summary><button type="button" tabindex="0"><label-view system-image="smiley" title="Item 1"></label-view></summary>
              <button type="button" tabindex="0"><label-view system-image="smiley" title="Item 1"></label-view></button>
              <button type="button" tabindex="0"><label-view system-image="smiley" title="Item 1"></label-view></button>
              <button type="button" tabindex="0"><label-view system-image="smiley" title="Item 1"></label-view></button>
              <button type="button" tabindex="0"><label-view system-image="smiley" title="Item 1"></label-view></button>
              <button type="button" tabindex="0"><label-view system-image="smiley" title="Item 1"></label-view></button>
              <button type="button" tabindex="0"><label-view system-image="smiley" title="Item 1"></label-view></button>
            </details>
            <button type="button" tabindex="0"><label-view system-image="smiley" title="Item 1"></label-view></button>
            <button type="button" tabindex="0"><label-view system-image="smiley" title="Item 1"></label-view></button>
            <button type="button" tabindex="0"><label-view system-image="smiley" title="Item 1"></label-view></button>
            <details is="disclosure-group">
              <summary><label-view system-image="smiley" title="Item 1"></label-view></summary>
              <button type="button" tabindex="0"><label-view system-image="smiley" title="Item 1"></label-view></button>
              <button type="button" tabindex="0"><label-view system-image="smiley" title="Item 1"></label-view></button>
              <button type="button" tabindex="0"><label-view system-image="smiley" title="Item 1"></label-view></button>
              <button type="button" tabindex="0"><label-view system-image="smiley" title="Item 1"></label-view></button>
              <button type="button" tabindex="0"><label-view system-image="smiley" title="Item 1"></label-view></button>
              <button type="button" tabindex="0"><label-view system-image="smiley" title="Item 1"></label-view></button>
            </details>
            <details is="disclosure-group">
              <summary><label-view system-image="smiley" title="Item 1"></label-view></summary>
              <button type="button" tabindex="0"><label-view system-image="smiley" title="Item 1"></label-view></button>
              <button type="button" tabindex="0"><label-view system-image="smiley" title="Item 1"></label-view></button>
              <button type="button" tabindex="0"><label-view system-image="smiley" title="Item 1"></label-view></button>
              <button type="button" tabindex="0"><label-view system-image="smiley" title="Item 1"></label-view></button>
              <button type="button" tabindex="0"><label-view system-image="smiley" title="Item 1"></label-view></button>
              <button type="button" tabindex="0"><label-view system-image="smiley" title="Item 1"></label-view></button>
            </details>
            <button type="button" tabindex="0"><label-view system-image="smiley" title="Item 1"></label-view></button>
            <button type="button" tabindex="0"><label-view system-image="smiley" title="Item 1"></label-view></button>`
      )
  }
}
