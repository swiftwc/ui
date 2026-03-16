// import { type PageRevealSwapDetail } from '../events'

export const NavigationProvider = new EventTarget()

export { default as closestHost } from './closest-host'
export { default as closestBody } from './closest-body'
export { default as closestViewController } from './closest-view-controller'
export { default as getRootViewController } from './get-root-view-controller'
export { default as queryBody } from './query-body'
export { default as queryBodyAll } from './query-body-all'
export { default as queryHost } from './query-host'
export { default as queryHostAll } from './query-host-all'
export { default as hostSlot } from './host-slot'
export { default as resolveDoc } from './resolve-doc'

// export class NavigationProvider {
// export const NavigationProvider = new EventTarget()

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
