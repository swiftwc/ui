// import { type PageRevealSwapDetail } from '../events'

export const LifecycleObserver = new EventTarget()

// export { default as closestHost } from './closest-host'
// export { default as closestBody } from './closest-body'

// export class LifecycleObserver {
// export const LifecycleObserver = new EventTarget()

// static #pages = new WeakMap() //#pages = new WeakSet()

// static has(page: HTMLElement) {
//   return this.#pages.has(page)
// }

// static append = (page: HTMLElement) => {
//   const owner = page.closest('navigation-split-view,navigation-stack')

//   this.#pages.set(page, owner)

//   owner.dispatchEvent(new CustomEvent<PageRevealSwapDetail>('pagereveal', { detail: { page: page }, bubbles: true, composed: true }))
// }

// static remove = (page: HTMLElement) => {
//   const owner = this.#pages.get(page)

//   owner.dispatchEvent(new CustomEvent<PageRevealSwapDetail>('pageswap', { detail: { page: page }, bubbles: true, composed: true }))

//   this.#pages.delete(page)
// }
// }
