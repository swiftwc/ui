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
  static #leaf?: Components.ScrollView

  static #root?: HTMLElement

  static #parentContainer?: HTMLElement
  static #container?: HTMLElement
  static #leafContainer?: HTMLElement

  static #parentToolbarItems?: NodeListOf<Element>
  static #toolbarItems?: NodeListOf<Element>
  static #leafToolbarItems?: NodeListOf<Element>

  static get parent() {
    return this.#parent
  }

  static get root() {
    return this.#root
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

  static #queryScrollViewRels = (sv?: Components.ScrollView) => {
    const isSidebarWrapped = sv?.parentElement?.matches('dialog[is=sidebar-view]')
    return {
      frame: (isSidebarWrapped ? sv?.parentElement : sv)?.parentElement ?? undefined,
      toolbarElements: sv?.parentElement?.querySelectorAll(
        `:scope > navigation-bar > tool-bar-item,:scope > bottom-bar > tool-bar-item,:scope > navigation-bar > tool-bar-item-group,:scope > bottom-bar > tool-bar-item-group`
      ),
    }
  }

  static getSnapshot(scrollView?: Components.ScrollView) {
    console.debug(`${Snapshot.name} ⚡️ getSnapshot`)

    // root
    for (
      let e: HTMLElement | undefined | null = scrollView;
      e;
      e = e.parentElement
    )
      e.matches('navigation-stack,navigation-split-view') && (this.#root = e)

    // current
    const {
      frame,
      toolbarElements: toolbarItems,
    } = this.#queryScrollViewRels(scrollView)
    this.#container = frame
    this.#toolbarItems = toolbarItems

    // parent
    const possibleParent = this.#container?.parentElement as HTMLElement | null

    this.#parent =
      possibleParent?.querySelector<Components.ScrollView>(
        `:scope > scroll-view,:scope > [is=sidebar-view] > scroll-view`
      ) ?? undefined //const sv2 = pr.parentElement.querySelector(`:scope > scroll-view`) //pr.previousElementSibling

    const { frame: parentFrame, toolbarElements: parentToolbarItems } =
      this.#queryScrollViewRels(this.#parent)
    this.#parentContainer = parentFrame
    this.#parentToolbarItems = parentToolbarItems
    // const possibleParent =
    //     this.#container?.parentElement?.querySelector<HTMLElement>(
    //       `:scope > scroll-view,:scope > [is=sidebar-view] > scroll-view`
    //     ) ?? undefined, //const sv2 = pr.parentElement.querySelector(`:scope > scroll-view`) //pr.previousElementSibling
    //   {
    //     landmark: parentLm,
    //     frame: parentFrame,
    //     toolbarElements: parentToolbarItems,
    //   } = this.#queryScrollViewRels(possibleParent)
    // this.#parent = parentLm
    // this.#parentContainer = parentFrame
    // this.#parentToolbarItems = parentToolbarItems

    // detect children
    let possibleNest = scrollView?.nextElementSibling as HTMLElement | null

    if ('NAVIGATION-SPLIT-VIEW' === this.#root?.tagName)
      if (
        scrollView?.matches(
         `navigation-split-view > scroll-view${null !==  this.#root.querySelector(':scope > [is=sidebar-view]')? ',navigation-split-view > [is=sidebar-view] > scroll-view,navigation-split-view > body-view > scroll-view': ''}`
        )
      )
        possibleNest = (scrollView?.parentElement?.matches('dialog[is=sidebar-view]')? scrollView?.parentElement: scrollView)?.previousElementSibling as HTMLElement | null // look for prev sibling instead
    // const possibleNest = scrollView?.nextElementSibling as HTMLElement | null

    this.#leaf = [
      ...(possibleNest?.querySelectorAll<Components.ScrollView>(
        'scroll-view:not(navigation-stack[hidden] scroll-view,navigation-split-view[hidden] scroll-view)'
      ) ?? []),
    ]?.pop?.() //'navigation-stack:not([hidden]) scroll-view'

    const { frame: leafFrame, toolbarElements: leafToolbarItems } =
      this.#queryScrollViewRels(this.#leaf)
    this.#leafContainer = leafFrame
    this.#leafToolbarItems = leafToolbarItems

    // const {
    //   landmark: leafLm,
    //   frame: leafFrame,
    //   toolbarElements: leafToolbarItems,
    // } = this.#queryScrollViewRels(
    //   [
    //     ...(possibleNest?.querySelectorAll<Components.ScrollView>(
    //       'scroll-view:not(navigation-stack[hidden] scroll-view,navigation-split-view[hidden] scroll-view)'
    //     ) ?? []),
    //   ]?.pop?.()
    // ) //'navigation-stack:not([hidden]) scroll-view'
    // this.#leaf = leafLm
    // this.#leafContainer = leafFrame
    // this.#leafToolbarItems = leafToolbarItems

    console.debug(
      `${this.#root?.tagName}
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
