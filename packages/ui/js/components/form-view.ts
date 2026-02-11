import { FormBase } from '../client/privateNamespace'

export class FormView extends FormBase {
  static #cleanups = new WeakMap()

  constructor() {
    super()
  }

  disconnectedCallback() {
    FormView.polyfillDisconnectedCallback(this)
  }

  connectedCallback() {
    FormView.polyfillConnectedCallback(this)
  }

  static polyfillDisconnectedCallback(el: HTMLFormElement) {
    console.debug(`${FormView.name} ⚡️ disconnect`)

    // finally

    this.#cleanups.get(el)?.()

    this.#cleanups.delete(el)
  }

  static polyfillConnectedCallback(el: HTMLFormElement) {
    console.debug(`${FormView.name} ⚡️ connect`)

    if (el.closest('[is=sidebar-view],[is=tab-bar]')) {
      el.method = 'dialog'

      el.noValidate = true
    }

    if (el.matches(':empty'))
      el.insertAdjacentHTML(
        'beforeend',
        `<button type="button" tabindex="0"><label-view system-image="smiley" label="Item 1"></label-view></button>
            <button type="button" tabindex="0"><label-view system-image="smiley" label="Item 1"></label-view></button>
            <button type="button" tabindex="0"><label-view system-image="smiley" label="Item 1"></label-view></button>
            <button type="button" tabindex="0"><label-view system-image="smiley" label="Item 1"></label-view></button>
            <details is="disclosure-group">
              <summary><button type="button" tabindex="0"><label-view system-image="smiley" label="Item 1"></label-view></summary>
              <button type="button" tabindex="0"><label-view system-image="smiley" label="Item 1"></label-view></button>
              <button type="button" tabindex="0"><label-view system-image="smiley" label="Item 1"></label-view></button>
              <button type="button" tabindex="0"><label-view system-image="smiley" label="Item 1"></label-view></button>
              <button type="button" tabindex="0"><label-view system-image="smiley" label="Item 1"></label-view></button>
              <button type="button" tabindex="0"><label-view system-image="smiley" label="Item 1"></label-view></button>
              <button type="button" tabindex="0"><label-view system-image="smiley" label="Item 1"></label-view></button>
            </details>
            <button type="button" tabindex="0"><label-view system-image="smiley" label="Item 1"></label-view></button>
            <button type="button" tabindex="0"><label-view system-image="smiley" label="Item 1"></label-view></button>
            <button type="button" tabindex="0"><label-view system-image="smiley" label="Item 1"></label-view></button>
            <details is="disclosure-group">
              <summary><label-view system-image="smiley" label="Item 1"></label-view></summary>
              <button type="button" tabindex="0"><label-view system-image="smiley" label="Item 1"></label-view></button>
              <button type="button" tabindex="0"><label-view system-image="smiley" label="Item 1"></label-view></button>
              <button type="button" tabindex="0"><label-view system-image="smiley" label="Item 1"></label-view></button>
              <button type="button" tabindex="0"><label-view system-image="smiley" label="Item 1"></label-view></button>
              <button type="button" tabindex="0"><label-view system-image="smiley" label="Item 1"></label-view></button>
              <button type="button" tabindex="0"><label-view system-image="smiley" label="Item 1"></label-view></button>
            </details>
            <details is="disclosure-group">
              <summary><label-view system-image="smiley" label="Item 1"></label-view></summary>
              <button type="button" tabindex="0"><label-view system-image="smiley" label="Item 1"></label-view></button>
              <button type="button" tabindex="0"><label-view system-image="smiley" label="Item 1"></label-view></button>
              <button type="button" tabindex="0"><label-view system-image="smiley" label="Item 1"></label-view></button>
              <button type="button" tabindex="0"><label-view system-image="smiley" label="Item 1"></label-view></button>
              <button type="button" tabindex="0"><label-view system-image="smiley" label="Item 1"></label-view></button>
              <button type="button" tabindex="0"><label-view system-image="smiley" label="Item 1"></label-view></button>
            </details>
            <button type="button" tabindex="0"><label-view system-image="smiley" label="Item 1"></label-view></button>
            <button type="button" tabindex="0"><label-view system-image="smiley" label="Item 1"></label-view></button>`
      )
  }
}
