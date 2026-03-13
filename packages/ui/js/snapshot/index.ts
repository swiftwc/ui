// import type * as Components from '../components'
// import { queryFrameToolbars, navigationRoot, queryParent, queryNest } from '../scene'

export class Snapshot {
  static #config?: Record<string, string>

  static #readyCalled = false

  static readonly waitReady = Promise.all([
    'complete' === document.readyState ? Promise.resolve() : new Promise((r) => self.addEventListener('load', r, { once: true })),
    (async () => {
      if (!this.#readyCalled) await this.setOwnConfig()
    })(), // Lazy config read promise, triggered on first access
  ])

  static async waitReadyFor<T extends HTMLElement>(element: T): Promise<T | null> {
    if (!element.isConnected) return null

    await this.waitReady

    return element.isConnected ? element : null
  }

  static get config() {
    return this.#config
  }

  static async setOwnConfig() {
    if (!this.#readyCalled) this.#readyCalled = true

    if ('complete' !== document.readyState) await new Promise((r) => self.addEventListener('load', r, { once: true }))

    this.#getOwnConfig()
  }

  static #getOwnConfig() {
    const style = getComputedStyle(document.documentElement, '::before'),
      content = style.getPropertyValue('content'),
      unquoted = content.replace(/^"(.*)"$/, '$1') // Remove quotes around the content

    try {
      this.#config = Object.fromEntries(new URLSearchParams(unquoted).entries()) // {"none": ""}
    } catch {
      console.error('could-not-parse-config')
    }

    console.debug(this.#config)
  }
  //////

  // static #parent?: Components.ScrollView
  // static #leaf?: Components.ScrollView
  // static #leaves?: Components.ScrollView[]

  // static #root?: HTMLElement

  // static #parentContainer?: HTMLElement
  // static #container?: HTMLElement
  // static #leafContainer?: HTMLElement

  // static #parentToolbarItems?: NodeListOf<Element>
  // static #toolbarItems?: NodeListOf<Element>
  // static #leafToolbarItems?: NodeListOf<Element>
  // static #leaveFrames?: Element[]
  // static #leaveToolbarCells?: Element[]

  // static get parent() {
  //   return this.#parent
  // }

  // static get root() {
  //   return this.#root
  // }

  // static get leaf() {
  //   return this.#leaf
  // }
  // static get leaves() {
  //   return this.#leaves
  // }
  // static get leaveFrames() {
  //   return this.#leaveFrames
  // }
  // static get leaveToolbarCells() {
  //   return this.#leaveToolbarCells
  // }

  // static get parentContainer() {
  //   return this.#parentContainer
  // }

  // static get leafContainer() {
  //   return this.#leafContainer
  // }

  // static get container() {
  //   return this.#container
  // }

  // static get toolbarItems() {
  //   return this.#toolbarItems
  // }

  // static get parentToolbarItems() {
  //   return this.#parentToolbarItems
  // }

  // static get leafToolbarItems() {
  //   return this.#leafToolbarItems
  // }

  //   static getSnapshot(scrollView?: Components.ScrollView) {
  //     console.debug(`${Snapshot.name} ⚡️ getSnapshot`)

  //     // root
  //     const root = navigationRoot(scrollView)
  //     this.#root = root
  //     // for (let e: HTMLElement | undefined | null = scrollView; e; e = e.parentElement) e.matches('navigation-stack,navigation-split-view') && (this.#root = e)

  //     // current
  //     const { frame, toolbarElements: toolbarItems } = queryFrameToolbars(scrollView)
  //     this.#container = frame
  //     this.#toolbarItems = toolbarItems

  //     // parent
  //     this.#parent = queryParent(this.#container)

  //     const { frame: parentFrame, toolbarElements: parentToolbarItems } = queryFrameToolbars(this.#parent)
  //     this.#parentContainer = parentFrame
  //     this.#parentToolbarItems = parentToolbarItems
  //     // const possibleParent =
  //     //     this.#container?.parentElement?.querySelector<HTMLElement>(
  //     //       `:scope > scroll-view,:scope > [is=sidebar-view] > scroll-view`
  //     //     ) ?? undefined, //const sv2 = pr.parentElement.querySelector(`:scope > scroll-view`) //pr.previousElementSibling
  //     //   {
  //     //     landmark: parentLm,
  //     //     frame: parentFrame,
  //     //     toolbarElements: parentToolbarItems,
  //     //   } = this.#queryScrollViewRels(possibleParent)
  //     // this.#parent = parentLm
  //     // this.#parentContainer = parentFrame
  //     // this.#parentToolbarItems = parentToolbarItems

  //     // detect children
  //     const { toolbarCells, scenes, frames } = queryNest(scrollView)
  //     this.#leaf = scenes.slice(-1)?.pop?.()
  //     this.#leaves = scenes
  //     this.#leaveToolbarCells = toolbarCells
  //     this.#leaveFrames = frames

  //     const { frame: leafFrame, toolbarElements: leafToolbarItems } = queryFrameToolbars(this.#leaf)
  //     this.#leafContainer = leafFrame
  //     this.#leafToolbarItems = leafToolbarItems

  //     // const {
  //     //   landmark: leafLm,
  //     //   frame: leafFrame,
  //     //   toolbarElements: leafToolbarItems,
  //     // } = this.#queryScrollViewRels(
  //     //   [
  //     //     ...(possibleNest?.querySelectorAll<Components.ScrollView>(
  //     //       'scroll-view:not(navigation-stack[hidden] scroll-view,navigation-split-view[hidden] scroll-view)'
  //     //     ) ?? []),
  //     //   ]?.pop?.()
  //     // ) //'navigation-stack:not([hidden]) scroll-view'
  //     // this.#leaf = leafLm
  //     // this.#leafContainer = leafFrame
  //     // this.#leafToolbarItems = leafToolbarItems

  //     console.debug(
  //       `${this.#root?.tagName}
  //       / \\
  //      B   ${this.#parentContainer?.tagName}
  //         / \\
  //        D   ${this.#container?.tagName}
  //           / \\
  //          H   ${this.#leafContainer?.tagName}
  // `
  //     )

  //     // this.#childFrame = ['BODY-VIEW', 'NAVIGATION-STACK'].includes(
  //     //   possibleNest?.tagName ?? ''
  //     // )
  //     //   ? (possibleNest ?? undefined)
  //     //   : undefined

  //     // this.#childToolbarItems = this.#childFrame?.querySelectorAll(
  //     //   `:scope > navigation-bar > tool-bar-item,:scope > bottom-bar > tool-bar-item`
  //     // )
  //   }
}
