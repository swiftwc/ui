import { DialogBase } from '../client/privateNamespace'
import { touchGlass } from '../internal/utils'

export class TabBar extends DialogBase {
  static #cleanups = new WeakMap()

  constructor() {
    super()
  }

  disconnectedCallback() {
    TabBar.polyfillDisconnectedCallback(this)
  }

  connectedCallback() {
    TabBar.polyfillConnectedCallback(this)
  }

  static polyfillDisconnectedCallback(el: HTMLDialogElement) {
    console.debug(`${TabBar.name} ⚡️ disconnect`)

    el.removeEventListener('click', TabBar.#handleClick)

    this.#cleanups.get(el)?.()

    this.#cleanups.delete(el)
  }

  static polyfillConnectedCallback(el: HTMLDialogElement) {
    console.debug(`${TabBar.name} ⚡️ connect`)

    el.addEventListener('click', TabBar.#handleClick)

    // console.log(99, el)
    // el.querySelector(':scope > scroll-view').addEventListener('scroll', (event) => {
    //   // console.log(999)
    //   event.currentTarget.classList.add('js-scrolling')
    //   // if (!['left', 'top'].includes(event.propertyName)) return
    //   // if ('::after' !== event.pseudoElement) return

    //   event.currentTarget.addEventListener('transitionend', (event) => {
    //     console.log(999)
    //   })

    //   // event.target.closest('scroll-view').classList.add('js-touched')
    // })
    // el.addEventListener('transitionend', (event) => {
    //   if (!['left', 'top'].includes(event.propertyName)) return
    //   if ('::after' !== event.pseudoElement) return

    //   event.target.closest('scroll-view').classList.remove('js-touched')

    //   console.log(999, event.propertyName, event.pseudoElement)
    // })

    const { on } = touchGlass(
      el,
      (t) => t,
      (event: PointerEvent) => {
        if ((event.target as HTMLElement).matches('[is=tab-bar]')) return false
        if ((event.target as HTMLElement).closest('tool-bar-item')) return false

        return true
      }
    )

    this.#cleanups.set(el, on())

    el.autofocus = true
  }

  static #handleClick = async (event: Event) => {
    if ('DIALOG' === (event.target as HTMLElement).tagName && 'tab-bar' === (event.target as HTMLElement).getAttribute('is'))
      (event?.target as HTMLDialogElement)?.close?.()
  }
}
