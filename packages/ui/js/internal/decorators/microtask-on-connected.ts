/**
 * Replacement for this
class() { 
#pendingSync = false
  #scheduleSync() {
    if (this.#pendingSync) return
    this.#pendingSync = true
    self.queueMicrotask(() => {
      this.#pendingSync = false
      this.#syncSibling()
    })
  }
  #syncSibling = () => {
    const sibling = this.closest<ScrollView>('scroll-view'),
      value = this.getAttribute('value'),
      subtitle = this.getAttribute('subtitle')

    if (null === value) sibling?.removeAttribute('navigation-inline-title')
    else sibling?.setAttribute('navigation-inline-title', value)

    if (null === subtitle) sibling?.removeAttribute('navigation-inline-subtitle')
    else sibling?.setAttribute('navigation-inline-subtitle', subtitle)
  }
}
  connectedCallback() {
    if (devFlags.debug) console.debug(`${NavigationTitle.name} ⚡️ connect`)

    this.#scheduleSync()
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (devFlags.debug) console.debug(`${NavigationTitle.name} ⚡️ attr-change [${name}] ("${oldValue}" → "${newValue}")`)

    this.#scheduleSync()

    this.#render(this.getAttribute('value'), this.getAttribute('subtitle'))
  }
 */
// const _sync = Symbol('sync')
// @microtaskOnConnected((el) => (el as NavigationTitle)[_sync]())
// attributeChangedCallback fires
//   → originalAttrChanged (your #render) runs synchronously  ✅
//   → schedule() queues microtask
//     → microtask flush: syncToScrollView runs with already-updated attrs ✅
export default function <T extends HTMLElement>(fn: (el: T) => void) {
  return function <C extends CustomElementConstructor>(Base: C, _context?: ClassDecoratorContext<C>): void {
    const originalConnected = Base.prototype.connectedCallback,
      originalAttrChanged = Base.prototype.attributeChangedCallback

    Base.prototype.connectedCallback = function (this: HTMLElement) {
      originalConnected?.call(this)

      schedule(this, fn as (el: HTMLElement) => void)
    }

    Base.prototype.attributeChangedCallback = function (this: HTMLElement, name: string, oldValue: string | null, newValue: string | null) {
      originalAttrChanged?.call(this, name, oldValue, newValue)

      schedule(this, fn as (el: HTMLElement) => void)
    }
  }
}

const pendingMap = new WeakMap<HTMLElement, boolean>()

function schedule(el: HTMLElement, fn: (el: HTMLElement) => void) {
  if (pendingMap.get(el)) return

  pendingMap.set(el, true)

  self.queueMicrotask(() => {
    pendingMap.delete(el)

    fn(el)
  })
}
