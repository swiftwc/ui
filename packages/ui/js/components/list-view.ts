import { CleanupRegistry } from '../internal/class/cleanup-registry'
import { listActive, onoff } from '../internal/utils'

export class ListView extends HTMLElement {
  // static formAssociated = true

  // #internals

  // #options

  // #focusedIndex = 0

  // #selected = new Set()

  constructor() {
    super()

    // this.#internals = this.attachInternals()

    // this.tabIndex = 0
  }

  disconnectedCallback() {
    console.debug(`${ListView.name} ⚡️ disconnect`)

    CleanupRegistry.unregister(this)
  }

  connectedCallback() {
    console.debug(`${ListView.name} ⚡️ connect`)

    CleanupRegistry.register(this, onoff(listActive(this), this).on())
    // this.setAttribute('role', 'listbox')
    // this.setAttribute('aria-multiselectable', 'true')
    // this.#options = Array.from(this.querySelectorAll('[option]'))

    // this.addEventListener('pointerleave', this.#onCancel)
    // this.addEventListener('click', this.#onClick)
    // this.addEventListener('keydown', this.#onKeyDown)
    // this.#updateOptionAttributes()
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
