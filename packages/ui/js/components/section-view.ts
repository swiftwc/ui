import { $, devFlags } from '../internal/utils'
import { html, morphdom } from '../morphdom'

/**
 * @slot header
 * @slot footer
 */
export class SectionView extends HTMLElement {
  static get observedAttributes() {
    return ['header', 'footer']
  }

  static #template: DocumentFragment

  static get template() {
    return (this.#template ??= $(
      String.raw`
  <div part="root section-main-stack">
    <slot></slot>
  </div>
  <div part="root section-header-stack">
    <slot name="header"></slot>
  </div>
  <div part="root section-footer-stack">
    <slot name="footer"></slot>
  </div>`
    ))
    // <div class="sticky-sentinel" style="grid-area:sentinel;inline-size:100%;block-size:0.1px;pointer-events:none;"></div>
  }

  #shadowRoot

  // #observer?: IntersectionObserver

  // #sibling?: HTMLElement
  // #sentinel?: HTMLElement

  // #sentinelIsIntersecting: boolean = false
  // #isIntersecting: boolean = false

  constructor() {
    super()

    this.#shadowRoot = this.attachShadow({ mode: 'closed' })

    // Snapshot.waitReady.then(() => {
    this.#shadowRoot.appendChild(document.importNode((this.constructor as typeof SectionView).template, true))

    // this.#sentinel = this.#shadowRoot.querySelector('.sticky-sentinel') ?? undefined
    // })
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (devFlags.debug) console.debug(`${SectionView.name} ⚡️ attr-change [${name}] ("${oldValue}" → "${newValue}")`)

    // Snapshot.waitReady.then(() => {
    switch (name) {
      case 'header':
        if (!newValue) {
          this.querySelector(':scope>[slot=header]')?.remove()
          break
        }

        const header = this.querySelector(':scope>[slot=header]') ?? this.appendChild(Object.assign(document.createElement('header'), { slot: 'header' }))

        morphdom(
          header,
          html`<header slot="header">
            <label-view line-limit="1" truncation-mode="tail" font="callout">
              <span>${newValue}</span>
            </label-view>
          </header>`.toString(),
          {
            onBeforeElUpdated: (fromEl: Element, toEl: Element) => !fromEl.isEqualNode(toEl),
          }
        )
        // render(
        //   html`<label-view line-limit="1" truncation-mode="tail" font="callout">
        //     <span>${newValue}</span>
        //   </label-view>`,
        //   header
        // )

        break
      case 'footer':
        if (!newValue) {
          this.querySelector(':scope>[slot=footer]')?.remove()
          break
        }

        const footer = this.querySelector(':scope>[slot=footer]') ?? this.appendChild(Object.assign(document.createElement('footer'), { slot: 'footer' }))

        morphdom(
          footer,
          html`<footer slot="footer">
            <label-view line-limit="1" truncation-mode="tail" font="callout">
              <span>${newValue}</span>
            </label-view>
          </footer>`.toString(),
          {
            onBeforeElUpdated: (fromEl: Element, toEl: Element) => !fromEl.isEqualNode(toEl),
          }
        )
        // render(
        //   html`<label-view line-limit="1" truncation-mode="tail" font="callout">
        //     <span>${newValue}</span>
        //   </label-view>`,
        //   footer
        // )

        break
    }
    // })
  }

  disconnectedCallback() {
    if (devFlags.debug) console.debug(`${SectionView.name} ⚡️ disconnect`)

    // if (this.#sentinel) this.#observer?.unobserve(this.#sentinel)

    // this.#observer?.unobserve(this)
  }

  connectedCallback() {
    if (devFlags.debug) console.debug(`${SectionView.name} ⚡️ connect`)

    // this.#sibling = this.closest('scroll-view') ?? undefined

    // Snapshot.waitReady.then(() => {
    // if (!(await frame(this))) return // NOTE: Required or BREAKS transitions  // self.requestAnimationFrame(() => {

    // const blockSizeProp = getComputedStyle(this).getPropertyValue('--navigation-bar-block-size') || '0', //`${document.documentElement.computedStyleMap().get(`--navigation-bar-block-size`) ?? '0'}`, //
    //   blockSize = parseFloat(blockSizeProp) * (blockSizeProp.endsWith('rem') ? parseFloat(getComputedStyle(document.documentElement).fontSize) : 1)
    // this.#observer = new IntersectionObserver(this.#handleIntersect, {
    //   root: this.#sibling,
    //   rootMargin: `-${blockSize}px 0px 0px 0px`,
    //   threshold: [0, 1],
    // })
    // if (this.#sentinel) this.#observer.observe(this.#sentinel)
    // this.#observer.observe(this)
    // })
  }

  // #handleIntersect = async (entries: IntersectionObserverEntry[]) => {
  //   if (devFlags.debug) console.debug(`${SectionView.name} ⚡️ intersect (${entries?.length})`)

  //   for (const {
  //     target: { tagName },
  //     isIntersecting,
  //   } of entries) {
  //     if (tagName === 'SECTION-VIEW') this.#isIntersecting = isIntersecting
  //     if (tagName !== 'SECTION-VIEW') this.#sentinelIsIntersecting = isIntersecting
  //   }

  //   this.toggleAttribute('js-stuck', this.#isIntersecting && !this.#sentinelIsIntersecting)
  // }

  // #handleSlotchange = (event: Event) => {
  //   if (devFlags.debug) console.debug(`${SectionView.name} ⚡️ ${event?.type}`)

  //   // const assigned = this.#headerSlot?.assignedElements({ flatten: true })?.[0] ?? undefined

  //   // if (assigned) this.#observer.observe(this.#shadowRoot.querySelector('.sticky-sentinel'))

  //   // this.setAttribute(
  //   //   'header-hint',
  //   //   (this.#headerSlot?.assignedNodes({ flatten: true }) ?? []).filter((node) => (node.nodeType === Node.TEXT_NODE ? node.textContent?.trim() !== '' : true))
  //   //     .length > 0
  //   //     ? 'yes'
  //   //     : 'no'
  //   // )
  //   // this.setAttribute(
  //   //   'footer-hint',
  //   //   (this.#footerSlot?.assignedNodes({ flatten: true }) ?? []).filter((node) => (node.nodeType === Node.TEXT_NODE ? node.textContent?.trim() !== '' : true))
  //   //     .length > 0
  //   //     ? 'yes'
  //   //     : 'no'
  //   // )
  //   // this.setAttribute('main-hint', (this.#slot?.assignedNodes({ flatten: true }) ?? []).length > 0 ? 'yes' : 'no')
  // }
}
