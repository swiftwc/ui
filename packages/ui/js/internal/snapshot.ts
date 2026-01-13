import type * as Components from '../components'

export class Snapshot {
  static #config?: Record<string, string>

  static get config() {
    return this.#config
  }

  static async setOwnConfig() {
    if ('complete' === document.readyState) return Snapshot.#getOwnConfig() // Page already loaded

    await new Promise((resolve) => self.addEventListener('load', resolve)) // Wait for window load

    return Snapshot.#getOwnConfig()
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

  static #parent?: Components.ScrollView
  // static #leafLandmark?: Components.ScrollView
  static #leaf?: Components.ScrollView

  static #rootLandmark?: HTMLElement
  static #parentContainer?: HTMLElement
  static #container?: HTMLElement
  static #leafContainer?: HTMLElement
  static #toolbarItems?: NodeListOf<Element>
  static #parentToolbarItems?: NodeListOf<Element>
  static #leafToolbarItems?: NodeListOf<Element>

  static get parent() {
    return this.#parent
  }

  // static get leafLandmark() {
  //   return this.#leafLandmark
  // }

  static get rootLandmark() {
    return this.#rootLandmark
  }

  static get leaf() {
    return this.#leaf
  }

  static get parentContainer() {
    return this.#parentContainer
  }

  static get leafContainer() {
    return this.#leafContainer
  }

  static get container() {
    return this.#container
  }

  static get toolbarItems() {
    return this.#toolbarItems
  }

  static get parentToolbarItems() {
    return this.#parentToolbarItems
  }

  static get leafToolbarItems() {
    return this.#leafToolbarItems
  }

  // constructor() {
  //   console.debug(`${Router.name} ⚡️ constructor`)

  //   this.#update()
  // }

  static #queryScrollViewRels = (sv?: Components.ScrollView) => {
    return {
      frame: sv?.parentElement ?? undefined,
      toolbarItems: sv?.parentElement?.querySelectorAll(
        `:scope > navigation-bar > tool-bar-item,:scope > bottom-bar > tool-bar-item`
      ),
    }
  }

  static getSnapshot(scrollView?: Components.ScrollView) {
    console.debug(`${Snapshot.name} ⚡️ #update`)

    // this.#leafLandmark = scrollView

    // this.#leafLandmark = [
    //   ...document.querySelectorAll<Components.ScrollView>(
    //     'scroll-view:not(navigation-stack[hidden] scroll-view,dialog scroll-view)'
    //   ),
    // ]?.pop?.() //'navigation-stack:not([hidden]) scroll-view'

    // const closestTopMost = (el, sel) => {
    //   let top = null
    //   for (let e = el; e; e = e.parentElement) e.matches(sel) && (top = e)
    //   return top
    // }
    // this.#rootLandmark = closestTopMost(scrollView, 'navigation-stack')
    // @ts-expect-error
    for (let e = scrollView; e; e = e.parentElement)
      e.matches('navigation-stack') && (this.#rootLandmark = e)

    // console.log(999, this.#rootLandmark)

    // this.#rootLandmark =
    //   scrollView?.closest(
    //     'navigation-stack:not(:has(navigation-stack,navigation-split-view)),navigation-split-view'
    //   ) ?? undefined

    const { frame, toolbarItems } = this.#queryScrollViewRels(scrollView)
    this.#container = frame
    this.#toolbarItems = toolbarItems

    const possibleParent = this.#container?.parentElement as HTMLElement | null

    this.#parent =
      possibleParent?.querySelector<Components.ScrollView>(
        `:scope > scroll-view`
      ) ?? undefined //const sv2 = pr.parentElement.querySelector(`:scope > scroll-view`) //pr.previousElementSibling

    const { frame: parentFrame, toolbarItems: parentToolbarItems } =
      this.#queryScrollViewRels(this.#parent)
    this.#parentContainer = parentFrame
    this.#parentToolbarItems = parentToolbarItems

    const possibleNest = scrollView?.nextElementSibling as HTMLElement | null

    this.#leaf = [
      ...(possibleNest?.querySelectorAll<Components.ScrollView>(
        'scroll-view:not(navigation-stack[hidden] scroll-view)'
      ) ?? []),
    ]?.pop?.() //'navigation-stack:not([hidden]) scroll-view'

    const { frame: leafFrame, toolbarItems: leafToolbarItems } =
      this.#queryScrollViewRels(this.#leaf)
    this.#leafContainer = leafFrame
    this.#leafToolbarItems = leafToolbarItems

    console.debug(
      `
      ${this.#rootLandmark?.tagName}
      / \\
     B   ${this.#parentContainer?.tagName}
        / \\
       D   ${this.#container?.tagName}
          / \\
         H   ${this.#leafContainer?.tagName}
`
    )

    // this.#childFrame = ['BODY-VIEW', 'NAVIGATION-STACK'].includes(
    //   possibleNest?.tagName ?? ''
    // )
    //   ? (possibleNest ?? undefined)
    //   : undefined

    // this.#childToolbarItems = this.#childFrame?.querySelectorAll(
    //   `:scope > navigation-bar > tool-bar-item,:scope > bottom-bar > tool-bar-item`
    // )
  }
}
