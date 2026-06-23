import { CleanupRegistry } from '../internal/class/cleanup-registry'
import { devFlags, listActive, onoff } from '../internal/utils'

/**
 * @attr {hidden} navigation-link-indicator-visibility - Hides accessories like right-arrow-chevron on NavigationLink buttons inside.
 */
export class ListView extends HTMLElement {
  // static #template: DocumentFragment

  // static get template() {
  //   return (this.#template ??= $(
  //     String.raw`
  //   <slot name="searchable"></slot>
  //   <slot></slot>
  //   `
  //   ))
  // }

  // #shadowRoot

  constructor() {
    super()

    // this.#shadowRoot = this.attachShadow({ mode: 'closed' })

    // this.#shadowRoot.appendChild(document.importNode((this.constructor as typeof ListView).template, true))
  }

  disconnectedCallback() {
    if (devFlags.debug) console.debug(`${ListView.name} ⚡️ disconnect`)

    CleanupRegistry.unregister(this)
  }

  connectedCallback() {
    if (devFlags.debug) console.debug(`${ListView.name} ⚡️ connect`)

    CleanupRegistry.register(this, onoff(listActive(this), this).on())
  }

  // #onClick = (e: Event) => {
  //   const option = e.target.closest('[option]')
  //   if (!option) return
  //   this.#toggleOption(option)
  // }

  // #onKeyDown = (e) => {
  //   switch (e.key) {
  //     case 'ArrowDown':
  //       e.preventDefault()
  //       this.#focusNext()
  //       break
  //     case 'ArrowUp':
  //       e.preventDefault()
  //       this.#focusPrev()
  //       break
  //     case ' ':
  //     case 'Enter':
  //       e.preventDefault()
  //       this.#toggleOption(this.#options[this.#focusedIndex])
  //       break
  //     case 'Home':
  //       e.preventDefault()
  //       this.#focusedIndex = 0
  //       this.#updateOptionAttributes()
  //       break
  //     case 'End':
  //       e.preventDefault()
  //       this.#focusedIndex = this.#options.length - 1
  //       this.#updateOptionAttributes()
  //       break
  //   }
  // }

  // #toggleOption(option) {
  //   const value = option.value
  //   if (this.#selected.has(value)) {
  //     this.#selected.delete(value)
  //     option.removeAttribute('aria-selected')
  //   } else {
  //     this.#selected.add(value)
  //     option.setAttribute('aria-selected', 'true')
  //   }
  //   this.#updateFormValue()
  // }

  // #updateFormValue() {
  //   const name = this.getAttribute('name')
  //   const formData = new FormData()
  //   for (const val of this.#selected) {
  //     formData.append(name, val)
  //   }
  //   this.#internals.setFormValue(formData)
  // }

  // #focusNext() {
  //   this.#focusedIndex = (this.#focusedIndex + 1) % this.#options.length
  //   this.#updateOptionAttributes()
  // }

  // #focusPrev() {
  //   this.#focusedIndex = (this.#focusedIndex - 1 + this.#options.length) % this.#options.length
  //   this.#updateOptionAttributes()
  // }

  // #updateOptionAttributes() {
  //   this.#options.forEach((opt, i) => {
  //     opt.tabIndex = i === this.#focusedIndex ? 0 : -1
  //     opt.setAttribute('aria-selected', this.#selected.has(opt.value) ? 'true' : 'false')
  //     if (i === this.#focusedIndex) opt.scrollIntoView({ block: 'nearest' })
  //   })
  // }
}
