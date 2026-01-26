import { Snapshot } from '../snapshot'

class ToolbarWatcher {
  #observers = new WeakMap<
    Element,
    (prop: string, rect: DOMRectReadOnly) => void
  >()
  public readonly observer: Promise<ResizeObserver>

  constructor() {
    this.observer = Snapshot.waitReady.then(() => {
      const leading = Snapshot.config!['toolbar-leading-stack-part-name'],
        trailing = Snapshot.config!['toolbar-trailing-stack-part-name']

      const parentMap = {
        'navigation-bar': 'navbar',
        'bottom-bar': 'bottombar',
      } as const

      return new ResizeObserver((entries) => {
        console.debug(`tool-bar ⚡️ measure`)

        for (const { contentRect, target } of entries) {
          const parentPart = target.parentElement?.part.contains(
            'navigation-bar'
          )
            ? 'navigation-bar'
            : target.parentElement?.part.contains('bottom-bar')
              ? 'bottom-bar'
              : null
          if (!parentPart) continue

          const side = target.part.contains(leading)
            ? 'inline-start'
            : target.part.contains(trailing)
              ? 'inline-end'
              : null
          if (!side) continue

          const prop = `--${parentMap[parentPart]}-padding-${side}`

          this.#observers.get(target)?.(prop, contentRect)
        }

        // for (const { contentRect, target } of entries) {
        //   let prop
        //   if (target.parentElement?.part.contains('navigation-bar')) {
        //     if (
        //       target.part.contains(
        //         Snapshot.config!['toolbar-leading-stack-part-name']
        //       )
        //     )
        //       prop = '--navbar-padding-inline-start'
        //     else if (
        //       target.part.contains(
        //         Snapshot.config!['toolbar-trailing-stack-part-name']
        //       )
        //     )
        //       prop = '--navbar-padding-inline-end'
        //   } else if (target.parentElement?.part.contains('bottom-bar')) {
        //     if (
        //       target.part.contains(
        //         Snapshot.config!['toolbar-leading-stack-part-name']
        //       )
        //     )
        //       prop = '--bottombar-padding-inline-start'
        //     else if (
        //       target.part.contains(
        //         Snapshot.config!['toolbar-trailing-stack-part-name']
        //       )
        //     )
        //       prop = '--bottombar-padding-inline-end'
        //   }

        //   if (prop)
        //     (this.#sibling as HTMLElement)?.style?.setProperty?.(
        //       prop,
        //       `${Math.round(contentRect.width)}px`
        //     )
        // }
      })

      // return observer
    })
  }

  public async observe(
    target: Element,
    callback: (prop: string, rect: DOMRectReadOnly) => void
  ) {
    this.#observers.set(target, callback)
    ;(await this.observer).observe(target)
  }

  public async unobserve(target: Element) {
    ;(await this.observer).unobserve(target)

    this.#observers.delete(target)
  }
}

const watcher = new ToolbarWatcher()

export class ToolBar extends HTMLElement {
  static #template: HTMLTemplateElement

  static get template() {
    if (!this.#template)
      this.#template = Object.assign(document.createElement('template'), {
        innerHTML: `<div part="root navigation-bar"><!--exportparts="toolbar-leading-stack,toolbar-principal-stack,toolbar-trailing-stack"-->
    <div part="root ${Snapshot.config!['toolbar-leading-stack-part-name']}">
      <slot name="navigation-bar-leading"></slot>
    </div>
    <div part="root ${Snapshot.config!['toolbar-principal-stack-part-name']}">
      <slot></slot>
    </div>
    <div part="root ${Snapshot.config!['toolbar-trailing-stack-part-name']}">
      <slot name="navigation-bar-trailing"></slot>
    </div>
    <!--<slot name="navigation-bar-leading" slot="leading"></slot>
    <slot name="navigation-bar-principal"></slot>
    <slot name="navigation-bar-trailing" slot="trailing"></slot>-->
  </div>
  <div part="root bottom-bar">
    <div part="root ${Snapshot.config!['toolbar-leading-stack-part-name']}">
      <slot name="navigation-bar-leading"></slot>
    </div>
    <div part="root ${Snapshot.config!['toolbar-principal-stack-part-name']}">
      <slot></slot>
    </div>
    <div part="root ${Snapshot.config!['toolbar-trailing-stack-part-name']}">
      <slot name="navigation-bar-trailing"></slot>
    </div>
    <!--<slot name="bottom-bar-leading" slot="leading"></slot>
    <slot name="bottom-bar-principal"></slot>
    <slot name="bottom-bar-trailing" slot="trailing"></slot>-->
  </div>`,
      })

    return this.#template
  }

  #shadowRoot

  // get #rootHost() {
  //   const root = this.getRootNode()

  //   if (root instanceof ShadowRoot) return root.host
  // }

  get #sibling() {
    return (
      this.parentElement?.querySelector(':scope > scroll-view') ?? undefined
    ) //this.previousElementSibling ?? undefined
  }

  constructor() {
    super()

    this.#shadowRoot = this.attachShadow({ mode: 'open' })

    Snapshot.waitReady.then(() => {
      this.#shadowRoot.appendChild(
        document.importNode(
          (this.constructor as typeof ToolBar).template.content,
          true
        )
      )
    })
  }

  connectedCallback() {
    console.debug(`${ToolBar.name} ⚡️ connect`)

    Snapshot.waitReady.then(() => {
      for (const el of this.#shadowRoot.querySelectorAll(
        `[part*="${Snapshot.config!['toolbar-leading-stack-part-name']}"],[part*="${Snapshot.config!['toolbar-trailing-stack-part-name']}"]`
      ))
        watcher.observe(el, this.#measureStacks.bind(this))
    })
  }

  disconnectedCallback() {
    console.debug(`${ToolBar.name} ⚡️ disconnect`)

    watcher.unobserve(this)
  }

  #measureStacks(prop: string, contentRect: DOMRectReadOnly) {
    console.debug(`${ToolBar.name} ⚡️ measure`)
    ;(this.#sibling as HTMLElement)?.style?.setProperty(
      prop,
      `${Math.round(contentRect.width)}px`
    )
  }
}
