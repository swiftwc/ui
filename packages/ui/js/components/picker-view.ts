import type { PickerSearchableDetail, PickerSelectionDetail } from '../events'
import { I18n } from '../i18n'
import { CleanupRegistry } from '../internal/class/cleanup-registry'
import { DictEntry, Dictionary } from '../internal/class/dict-entry'
import { FormAssociatedBase, getInternals } from '../internal/class/form-associated-base'
import { MutationObserverSet } from '../internal/class/mutation-observer-set'
import { NavigationPath } from '../internal/class/navigation-path'
import { queryInsertPosition, startViewTransition } from '../internal/privateNamespace'
import { $, ancestors, debug, kebabCase, onoff } from '../internal/utils'
import { queryMorph } from '../morphdom'
import { html, render } from '../tpl'
import type { LabelView } from './label-view'
import type { MenuView } from './menu-view'

const pickerStyles = ['menu', 'inline', 'navigation-link', 'sheet', 'radio-group', 'palette', 'segmented', 'automatic'] as const
export type PickerStyle = (typeof pickerStyles)[number]

export type { DictEntry, Dictionary } from '../internal/class/dict-entry'

const update = (path: NavigationPath, node: Element, overwrite = true) => {
  debug(`PickerView: update`)

  if (!(path instanceof NavigationPath)) throw new Error('invalid view')

  const { component, page } = path
  if (!component) return

  const position = queryInsertPosition(component) //'afterend'
  // const lookFor = 'beforebegin' === position ? 'previousElementSibling' : 'nextElementSibling'

  if (page) page.insertAdjacentElement(position, node)
}

const reflectSpawnedPage = (current?: HTMLElement, source?: HTMLElement) => {
  debug(`PickerView: reflectSpawnedPage`)

  const { page: oldSv, toolBarConfig: oldToolbar } = new NavigationPath(current).hydrate(),
    { page: newSv, toolBarConfig: newToolbar } = new NavigationPath(source).hydrate()

  const oldList = oldSv?.querySelector<HTMLElement>('list-view'),
    newList = newSv?.querySelector<HTMLElement>('list-view'),
    oldBackBtn = oldToolbar?.at(0)?.querySelector('button'),
    newBackBtn = newToolbar?.at(0)?.querySelector('button')

  // pre replace list (always exists)
  const oldOpenedDetails = [...(oldList?.querySelectorAll('list-view details[open]>summary') ?? [])].map((item) => item.textContent.trim())

  // replace list (always exists)
  if (oldList && newList) oldList.replaceWith(newList)

  // post replace list (always exists)
  for (const label of oldOpenedDetails)
    for (const summary of newList?.querySelectorAll('list-view details>summary') ?? [])
      if (summary.textContent.trim() === label) {
        summary.parentElement?.setAttribute('open', 'open')
        break
      }

  // replace backbtns (always exist)
  if (oldBackBtn && newBackBtn) oldBackBtn.replaceWith(newBackBtn)

  // overwrite navtitle (always exists)
  oldSv?.setAttribute('navigation-inline-title', newSv?.getAttribute('navigation-inline-title') ?? '')

  // replace search (if exists)
  oldList?.style.setProperty('--list--sticky-block-size', newList?.style.getPropertyValue('--list--sticky-block-size') ?? '')

  // replace search (if exists)
  const oldSearch = oldSv?.querySelector<HTMLElement>('sticky-container'),
    newSearch = newSv?.querySelector<HTMLElement>('sticky-container')

  // if already exists, DO NOTHING dont mess up the input element
  if (newSearch) {
    if (!oldSearch)
      oldSv?.insertAdjacentHTML(
        'afterend',
        `<sticky-container edge="navbar" style="order: -1" padding>
                <v-stack spacing="0" alignment="fill">
                  <input is="search-view" placeholder="Search">
                  <!--<button type="button">Filters</button>-->
                </v-stack>
              </sticky-container>`
      )
  } else oldSearch?.remove()
}

/**
 * @summary A control that selects one value from a set of options.
 *
 * @attr {vertical|horizontal|auto} label-value-placement
 *
 * @attr {boolean} horizontal-radio-group-layout
 *
 * @slot — The default slot
 * @slot label
 * @slot list
 * @slot {HTMLOptionElement[]} validity-options
 */
export class PickerView extends FormAssociatedBase {
  static get observedAttributes() {
    return [
      'prompt',
      'prompt-icon',
      'label',
      'name',
      /**
       * @type {menu|inline|navigation-link|sheet|automatic}
       */
      'picker-style',
      'selection',
      /**
       * @type {boolean}
       */
      'searchable',
      'current-value-label',
      'current-value-icon',
      /**
       * Adds a help tooltip to the trigger of the picker, if style supports one
       */
      'help',
      /**
       * Renders all options using this array
       * @type {DictEntry[]}
       */
      'dictionary',
      /**
       * @type {boolean}
       */
      'required',
    ]
  }

  static #templates: Map<string, DocumentFragment> = new Map()

  #guuid = self.crypto.randomUUID()

  #spawn?: HTMLElement

  #makeGroupClickHandler(el: DictEntry, groupId: string) {
    return async (evt: Event) => {
      evt.stopImmediatePropagation()
      evt.preventDefault()

      const { target } = evt
      if (!(target instanceof HTMLElement)) return

      const newPage = this.#spawnPage(el.children, 'content-view', groupId, this.hasAttribute('searchable'), el.title)
      if (!newPage) return

      newPage.dataset.groupId = groupId // <-- tag the spawned page

      const path = new NavigationPath(target)?.hydrate()

      await startViewTransition(target, 'forwards', async () => {
        update(path, newPage)

        this.#reflectSelectionOnButtons()
      })
    }
  }

  #spawnPage = (entries: Dictionary, tag: 'content-view' | 'sheet-view', parentGroupId?: string, searchable: boolean = false, title?: string | null) => {
    debug(`${PickerView.name} #spawnPage`)

    const body =
        tag === 'sheet-view'
          ? $<HTMLElement>(
              html`<dialog is="sheet-view">
                <scroll-view>
                  <v-stack placement="leading fill">
                    <list-view preferred-expanded-style="inset"></list-view>
                  </v-stack>
                </scroll-view>
                <tool-bar>
                  <tool-bar-item slot="top-bar-leading">
                    <button type="button" tabindex="0">
                      <label-view system-image="x"></label-view>
                    </button>
                  </tool-bar-item>
                </tool-bar>
              </dialog>`,
              '>1'
            )
          : $<HTMLElement>(
              html`<content-view>
                <scroll-view>
                  <v-stack placement="leading fill">
                    <list-view preferred-expanded-style="inset"></list-view>
                  </v-stack>
                </scroll-view>
                <tool-bar>
                  <tool-bar-item slot="top-bar-leading">
                    <button type="button" tabindex="0">
                      <label-view system-image="caret-left"></label-view>
                    </button>
                  </tool-bar-item>
                </tool-bar>
              </content-view>`,
              '>1'
            ),
      sv = body.querySelector<HTMLElement>('scroll-view'),
      list = body.querySelector<HTMLElement>('list-view'),
      backBtn = body.querySelector<HTMLButtonElement>('button')

    if (title) sv?.setAttribute('navigation-inline-title', title)

    if (searchable) {
      list?.style.setProperty('--list--sticky-block-size', '70px')

      list?.insertAdjacentHTML(
        'afterend',
        `<sticky-container edge="navbar" style="order: -1" padding>
                <v-stack spacing="0" alignment="fill">
                  <input is="search-view" placeholder="Search">
                  <!--<button type="button">Filters</button>-->
                </v-stack>
              </sticky-container>`
      )

      const searchInput = sv?.querySelector('input') // FIXME: compoennt is=search-view??

      searchInput?.addEventListener('focus', ({ target }: Event) => {
        if (this.#spawn)
          this.dispatchEvent(
            new CustomEvent<PickerSearchableDetail>('picker:searchfocus', {
              detail: { element: this.#spawn, search: target instanceof HTMLInputElement ? target.value : '' },
              bubbles: true,
              composed: true,
            })
          )
      })
      searchInput?.addEventListener('blur', ({ target }: Event) => {
        if (this.#spawn)
          this.dispatchEvent(
            new CustomEvent<PickerSearchableDetail>('picker:searchblur', {
              detail: { element: this.#spawn, search: target instanceof HTMLInputElement ? target.value : '' },
              bubbles: true,
              composed: true,
            })
          )
      })
      searchInput?.addEventListener('input', ({ target }: Event) => {
        if (this.#spawn)
          this.dispatchEvent(
            new CustomEvent<PickerSearchableDetail>('picker:searchinput', {
              detail: { element: this.#spawn, search: target instanceof HTMLInputElement ? target.value : '' },
              bubbles: true,
              composed: true,
            })
          )
      })
    }

    backBtn?.setAttribute('help', I18n.t('ButtonRole').Back)

    backBtn?.addEventListener('click', async (evt: Event) => {
      evt.stopImmediatePropagation()
      evt.preventDefault()

      const { target } = evt
      if (!(target instanceof HTMLElement)) return

      const { component } = new NavigationPath(target)?.hydrate()

      await startViewTransition(target, 'backwards', async () => {
        component?.remove()
      })
    })

    for (const [i, el] of entries.entries()) {
      if (DictEntry.isLeaf(el)) {
        const btn = this.#wrapOptionTag(el)
        btn.addEventListener('click', this.#handlePageBtnClick)
        list?.appendChild(btn)
      } else if (DictEntry.isGroup(el)) {
        const group = this.#wrapOptgroupTag(el)
        this.#reflectButtons(el.children, group)
        for (const btn of group.querySelectorAll(':scope>button')) btn.addEventListener('click', this.#handlePageBtnClick)
        list?.appendChild(group)
      } else {
        const btn = PickerView.#wrapOptionSpawnTag(el)
        const groupId = parentGroupId ? `${parentGroupId}.${i}` : `${i}`
        btn.dataset.groupId = groupId
        btn.addEventListener('click', this.#makeGroupClickHandler(el, groupId))
        list?.appendChild(btn)
      }
    }
    return body
  }

  #resyncSpawnedPages = (fresh: Dictionary) => {
    if (!this.#spawn) return

    const groupMap = Dictionary.index(fresh)

    for (const el of this.#spawn.querySelectorAll<HTMLElement>('content-view')) {
      const depth = ancestors('content-view,[is=sheet-view]', el).indexOf(this.#spawn)
      if (0 >= depth) continue

      const groupId = el.dataset.groupId
      const source = groupId ? groupMap.get(groupId) : undefined

      if (!source) {
        el.remove()
        continue
      }

      const children = source.children
      const title = source.title ?? null

      const newPage = this.#spawnPage(children, 'content-view', groupId, this.hasAttribute('searchable'), title)
      newPage.dataset.groupId = groupId

      reflectSpawnedPage(el, newPage)
    }
  }

  #renderButtons(source: Dictionary): void {
    debug(`${PickerView.name} #renderButtons`)

    const { labels, icons } = Dictionary.flatten(source)

    this.#lastRenderedLabelMap = labels

    this.#lastRenderedIconMap = icons

    this.#lastIndexedRoot = source

    switch (this.pickerStyle) {
      case 'sheet':
      case 'navigation-link': {
        // current value label only
        const currentValueLabel = this.querySelector<LabelView>(':scope>label-view:not([slot])') ?? this.appendChild<LabelView>($(html`<label-view></label-view>`, '>1'))

        // reset state
        // if (currentValueLabel) {
        //   renderLabelIcon(currentValueLabel, 'dots-three') // overwritten
        //   renderLabelTitle(currentValueLabel, this.#currentValueLabel) // overwritten
        // }

        // clear all siblings
        for (const el of this.querySelectorAll(':scope>:not([slot])')) if (currentValueLabel !== el) el.remove()

        CleanupRegistry.unregister(this, 'trigger')
        CleanupRegistry.register(this, onoff('click', this.#handleTriggerClick, currentValueLabel).on(), 'trigger')

        if (this.hasAttribute('help')) currentValueLabel?.setAttribute('help', this.getAttribute('help') ?? '')

        // rebuild snapshot(tree)
        if (!this.#spawn) break

        // rerender level 0
        reflectSpawnedPage(
          this.#spawn,
          this.#spawnPage(source, 'DIALOG' === this.#spawn.tagName ? 'sheet-view' : 'content-view', undefined, this.hasAttribute('searchable'), this.getAttribute('label'))
        )

        this.#resyncSpawnedPages(source)
        // // FIXME:
        // for (const el of this.#spawn.querySelectorAll<HTMLElement>('content-view')) {
        //   const depth = $.ancestors('content-view,[is=sheet-view]', el).indexOf(this.#spawn)
        //   if (0 >= depth) continue

        //   const datalist = this.querySelector<HTMLElement>(`:scope>${Array.from({ length: depth }, () => 'datalist').join('>')}`)
        //   if (!datalist) {
        //     el.remove()

        //     break
        //   }

        //   reflectSpawnedElement(el, this.#spawnPage(Array.from(datalist.children), 'content-view', this.hasAttribute('searchable'), datalist.dataset.label))
        // }

        break
      }
      case 'menu': {
        const menu = this.querySelector<MenuView>(':scope>menu-view:not([slot])') ?? this.appendChild<MenuView>($(html`<menu-view></menu-view>`, '>1'))

        // reset state
        menu.innerHTML = ''
        menu.tabIndex = 0

        // clear all siblings
        for (const el of this.querySelectorAll(':scope>:not([slot])')) if (menu !== el) el.remove()

        const currentValueLabel = menu.querySelector<LabelView>(':scope>label-view[slot=label]') ?? menu.appendChild<LabelView>($(html`<label-view slot="label"></label-view>`, '>1'))

        // if (currentValueLabel) {
        //   renderLabelIcon(currentValueLabel, 'dots-three') // overwritten
        //   renderLabelTitle(currentValueLabel, this.#currentValueLabel) // overwritten
        // }

        if (this.hasAttribute('help')) currentValueLabel?.setAttribute('help', this.getAttribute('help') ?? '')

        this.#reflectButtons(source, menu)

        break
      }
      case 'segmented':
      case 'palette':
      case 'radio-group': {
        // capture
        // const stack = this.querySelector<HTMLElement>(':scope>v-stack:not([slot])') ?? this.appendChild<HTMLElement>($(html`<v-stack></v-stack>`, '>1'))

        // reset state
        // stack.innerHTML = ''

        // clear all siblings
        for (const el of this.querySelectorAll(':scope>:not([slot])')) el.remove()

        // add buttons
        this.#reflectButtons(source, this)

        break
      }
      case 'inline':
      default: {
        const sectionTpl = html`<section-view></section-view>`

        const inlineList = this.querySelector(':scope>list-view:not([slot])') ?? this.appendChild($(html`<list-view>${sectionTpl}</list-view>`, '>1')),
          section = inlineList.querySelector(':scope>section-view') ?? inlineList.appendChild($(sectionTpl, '>1'))

        // reset state
        section.innerHTML = ''

        // clear all siblings
        for (const el of this.querySelectorAll(':scope>:not([slot])')) if (inlineList !== el) el.remove()

        // add label as a plain element
        const value = this.getAttribute('label')
        if (value) {
          const hStack = $<LabelView>(
            html`<h-stack distribution="leading" template="auto spacer">
              <label-view data-role="check" style="visibility: hidden">
                <image-view slot="icon" system-name="check"></image-view>
              </label-view>
              <label-view><span></span></label-view>
            </h-stack>`,
            '>1'
          )

          queryMorph('label-view:nth-child(2)', html`<label-view>${value ? html`<span>${value}</span>` : null}</label-view>`, hStack)
          // if (label) renderLabelTitle(label, value) //label.setAttribute('title', value)

          section.insertAdjacentElement('beforeend', hStack)
        }

        this.#reflectButtons(source.filter(DictEntry.isLeaf), section)

        break
      }
    }

    this.#reflectSelectionOnButtons()

    this.#reflectSelectionOnCurrentValueLabel()
  }

  // #renderDictionary = (dictionary: Dictionary) => {
  //   debug(`${PickerView.name} ⚡️ mutation`)

  //   this.#renderButtons({ mode: 'dictionary', source: dictionary })
  // }

  #renderSlotted = (entries: MutationRecord[]) => {
    debug(`${PickerView.name} ⚡️ mutation`)

    this.#renderButtons(this.#resolveSource()) //this.#renderButtons({ mode: 'list', source: this.#slots?.get('list')?.assignedElements({ flatten: true }) ?? [] })
  }

  #renderValidityMsgs = (entries: MutationRecord[]) => {
    debug(`${PickerView.name} ⚡️ mutation`)

    this.setValidity(this.validity, this.validationMessage)
  }

  #lastRenderedStyle?: PickerStyle //string | null

  #shadowRoot

  #slots?: Map<string, HTMLSlotElement> = new Map()
  #validityObservers = new MutationObserverSet(this.#renderValidityMsgs)
  #observers = new MutationObserverSet(this.#renderSlotted)

  #customValidity: string = ''

  #selection: string = ''

  get selection() {
    return this.#selection
  }

  set selection(v) {
    if (Object.is(this.#selection, v)) return

    this.#selection = v

    this.#reflectSelectionOnButtons()

    this.#reflectSelectionOnCurrentValueLabel()

    this.#sendValueToForm()
  }

  #lastRenderedLabelMap: Record<string, string | undefined> = {}
  #lastRenderedIconMap: Record<string, string | undefined> = {}

  #lastIndexedRoot: Dictionary = []

  get #currentValueLabel() {
    return (
      (this.getAttribute('current-value-label') ?? '').replaceAll('{{selection}}', this.#selection).replaceAll('{{currentValueLabel}}', this.#selection) || this.#lastRenderedLabelMap[this.#selection]
    )
  }

  get #currentValueIcon() {
    return (this.getAttribute('current-value-icon') ?? '') || this.#lastRenderedIconMap[this.#selection]
  }

  get #internals(): ElementInternals {
    return getInternals(this)
  }

  get template(): DocumentFragment {
    if (!PickerView.#templates.has(this.pickerStyle))
      switch (this.pickerStyle) {
        case 'sheet':
        case 'navigation-link':
          PickerView.#templates.set(
            this.pickerStyle,
            $(html`
              <label part="root picker-stack">
                <div part="root picker-label-stack">
                  <slot name="label"></slot>
                </div>
                <div part="root picker-input-stack">
                  <slot></slot>
                </div>
                <slot name="list" hidden></slot>
                <slot name="validity-options" hidden></slot>
              </label>
            `)
          )

          break
        case 'menu':
          PickerView.#templates.set(
            this.pickerStyle,
            $(html`
              <label part="root picker-stack">
                <div part="root picker-label-stack">
                  <slot name="label"></slot>
                </div>
                <div part="root picker-input-stack">
                  <slot></slot>
                </div>
                <slot name="list" hidden></slot>
                <slot name="validity-options" hidden></slot>
              </label>
            `)
          )

          break
        case 'segmented':
        case 'palette':
        case 'radio-group':
          PickerView.#templates.set(
            this.pickerStyle,
            $(html`
              <label part="root picker-stack">
                <div part="root picker-label-stack">
                  <slot name="label"></slot>
                </div>
                <div part="root picker-input-stack">
                  <slot></slot>
                </div>
                <slot name="list" hidden></slot>
                <slot name="validity-options" hidden></slot>
              </label>
            `)
          )

          break
        //   break
        // case 'compact':
        //   PickerView.#templates.set(
        //     style,
        //     Object.assign(document.createElement('template'), {
        //       innerHTML: String.raw`
        //     <label part="compact-picker">
        //       <input type="text" part="compact-input">
        //     </label>
        //   `,
        //     })
        //   )

        //   break
        // case 'fancy':
        //   PickerView.#templates.set(
        //     style,
        //     Object.assign(document.createElement('template'), {
        //       innerHTML: String.raw`
        //     <div part="fancy-picker">
        //       <span>Fancy Picker</span>
        //       <input type="text" part="fancy-input">
        //     </div>
        //   `,
        //     })
        //   )

        //   case 'gg':
        //     PickerView.#templates.set(
        //       style,
        //       Object.assign(document.createElement('template'), {
        //         innerHTML: String.raw`
        // <label part="root text-field-stack">
        // <div part="root text-field-label-stack">
        //   <slot name="label"></slot>
        // </div>
        // <div part="root text-field-input-stack">
        //   <input type="text" part="root input text-field-form-input" list="tickmarks">
        //   <datalist id="tickmarks">
        //     <option value="0" label="0%"></option>
        //   </datalist>
        // </div>
        // <slot name="list" hidden></slot>
        // </label>`,
        //       })
        //     )

        //     break
        case 'inline':
        default:
          PickerView.#templates.set(
            this.pickerStyle,
            $(
              html` <label part="root picker-stack">
                <div part="root picker-label-stack">
                  <slot name="label"></slot>
                </div>
                <div part="root picker-input-stack">
                  <slot></slot>
                </div>
                <slot name="list" hidden></slot>
                <slot name="validity-options" hidden></slot>
              </label>`
            )
          )

          break
      }

    return PickerView.#templates.get(this.pickerStyle)!
  }

  constructor() {
    super()

    this.#shadowRoot = this.attachShadow({ mode: 'closed' })
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    debug(`${PickerView.name} ⚡️ attr-change [${name}] ("${oldValue}" → "${newValue}")`)

    switch (name) {
      // case 'horizontal-radio-group-layout':
      //   if (oldValue === newValue) break
      //   this.#renderSlotted([])
      // break
      case 'prompt':
      case 'prompt-icon':
        if (oldValue === newValue) break

        this.#reflectSelectionOnCurrentValueLabel() //this.#reflectPlaceholder(newValue)

        break
      case 'label':
        this.#reflectLabel(newValue)

        // this.#sendValueToForm()

        break
      case 'picker-style':
        if (oldValue === newValue) break

        this.#render()

        break
      case 'searchable':
        if (oldValue === newValue) break

        this.#renderSlotted([])

        break
      case 'current-value-label':
      case 'current-value-icon':
        // if (oldValue === newValue) break

        this.#reflectSelectionOnCurrentValueLabel()

        break
      case 'help':
        // if (oldValue === newValue) break

        this.#reflectTriggerHelp()

        break
      case 'dictionary':
        if (oldValue === newValue) break

        this.#renderSlotted([]) // re-resolve: dictionary present → wins; removed → falls back to slotted //this.#renderDictionary(parseDictionary(newValue))

        break
      case 'name':
      case 'required':
        if (oldValue === newValue) break

        this.#sendValueToForm(false)

        break
      case 'selection':
        if (oldValue === newValue) break

        this.#selection = newValue ?? ''

        // FIXME: What about other callbacks from this.#selection=???? Somehow they run correctly

        this.#sendValueToForm(false)

        break
    }
  }

  disconnectedCallback() {
    debug(`${PickerView.name} ⚡️ disconnect`)

    CleanupRegistry.unregister(this)

    this.#validityObservers.unobserveAll()
    this.#observers.unobserveAll()
  }

  connectedCallback() {
    debug(`${PickerView.name} ⚡️ connect`)

    CleanupRegistry.register(
      this,
      onoff(
        'localechange',
        () => {
          this.#renderSlotted([])
        },
        I18n.on
      ).on()
    )

    CleanupRegistry.register(this, onoff('click', this.#handleClick, this).on())

    CleanupRegistry.register(this, onoff('input', this.#handleInput, this).on())

    if (!this.hasAttribute('picker-style')) this.#render() // skip if already rendered by attr-change during upgrade!

    // finally
    if (!this.hasAttribute('selection')) return

    this.#selection = this.getAttribute('selection') ?? ''

    this.#sendValueToForm(false)
  }

  get pickerStyle(): PickerStyle {
    const attr = 'picker-style'

    return (pickerStyles as readonly string[]).includes(this.getAttribute(attr) ?? '') ? (this.getAttribute(attr) as (typeof pickerStyles)[number]) : 'automatic'
  }

  #resolveSource(): Dictionary {
    if (this.hasAttribute('dictionary')) return Dictionary.parse(this.getAttribute('dictionary'))

    return Dictionary.fromElements(this.#slots?.get('list')?.assignedElements({ flatten: true }) ?? [])
  }

  #render() {
    debug(`${PickerView.name} ⚡️ #render (${this.pickerStyle})`)

    // const style = this.getAttribute('picker-style')
    if (this.#lastRenderedStyle === this.pickerStyle) return // skip if already applied
    this.#lastRenderedStyle = this.pickerStyle

    // clear shadow DOM
    this.#shadowRoot.replaceChildren(document.importNode(this.template, true))

    CleanupRegistry.unregister(this, 'slots')
    for (const slot of this.#shadowRoot.querySelectorAll<HTMLSlotElement>('slot')) this.#slots?.set(slot.name, slot)
    CleanupRegistry.register(
      this,
      () => {
        this.#slots = new Map()
      },
      'slots'
    )

    CleanupRegistry.unregister(this, 'validities')
    CleanupRegistry.register(this, onoff('slotchange', this.#handleValiditiesSlotchange, this.#slots?.get('validity-options')).on(), 'validities')

    CleanupRegistry.unregister(this, 'datalist') //off1()
    CleanupRegistry.register(this, onoff('slotchange', this.#handleListSlotchange, this.#slots?.get('list')).on(), 'datalist')

    // #renderSlotted should run automatically now by slotchange initial event

    // switch (this.pickerStyle) {
    // }
  }

  #sendValueToForm = (dispatchEvent: boolean = true) => {
    // input.value has already been updated/synced !!
    if (this.matches(':disabled')) return this.setValidity({})

    if (this.hasAttribute('required')) {
      if (!this.#selection) {
        this.setValidity({ badInput: true }, 'invalid-selection')
      } else this.setValidity({})
    } else this.setValidity({})

    const entries = new FormData()

    entries.append(this.name, this.#selection)

    this.#internals.setFormValue(entries)

    if (dispatchEvent) this.dispatchEvent(new CustomEvent<PickerSelectionDetail>('selection', { detail: { selection: this.#selection }, bubbles: true, composed: true }))
  }

  #handleTriggerClick = async ({ type, target }: Event) => {
    debug(`${PickerView.name} ⚡️ ${type}`)

    if (!(target instanceof HTMLElement)) return

    this.#spawn?.remove?.()

    const source = this.#resolveSource()

    const level0 = this.#spawnPage(
      source, // this.hasAttribute('dictionary') ? parseDictionary(this.getAttribute('dictionary')) : (this.#slots?.get('list')?.assignedElements() ?? []),
      'sheet' === this.pickerStyle ? 'sheet-view' : 'content-view',
      undefined,
      this.hasAttribute('searchable'),
      this.getAttribute('label')
    )
    if (!level0) return

    const path = new NavigationPath(target)?.hydrate()

    await startViewTransition(target, 'forwards', async () => {
      this.#spawn = level0

      update(path, level0)

      this.#reflectSelectionOnButtons()
    })
  }

  #handlePageBtnClick = async (evt: Event) => {
    debug(`${PickerView.name} ⚡️ ${evt?.type}`)

    evt.stopImmediatePropagation()
    evt.preventDefault()

    const { currentTarget: btn } = evt
    if (!(btn instanceof HTMLElement)) return

    // const btn = target.closest('button')
    // if (!btn) return

    const proceed = () => {
      this.#spawn?.remove()

      this.#selection = btn.getAttribute('value') ?? ''

      this.#reflectSelectionOnButtons()

      this.#reflectSelectionOnCurrentValueLabel()

      this.#sendValueToForm()
    }

    const { body } = new NavigationPath(this.#spawn)?.hydrate()

    if (!body) return proceed()

    await startViewTransition(body, 'backwards', async () => {
      proceed()
    })
  }

  #handleClick({ type, target }: Event) {
    debug(`${PickerView.name} ⚡️ ${type}`)

    if (!(target instanceof HTMLElement)) return

    const btn = target.closest('button')
    if (!btn) return

    this.#selection = btn.getAttribute('value') ?? ''

    this.#reflectSelectionOnButtons()

    this.#reflectSelectionOnCurrentValueLabel()

    this.#sendValueToForm()
  }

  #handleInput({ type, target }: Event) {
    debug(`${PickerView.name} ⚡️ ${type}`)

    if (!(target instanceof HTMLElement)) return

    switch (this.pickerStyle) {
      case 'segmented':
      case 'palette':
      case 'radio-group':
        const radio = target.closest<HTMLInputElement>('input[type="radio"]')
        if (!radio) return

        this.#selection = radio.getAttribute('value') ?? ''

        this.#reflectSelectionOnButtons()

        this.#reflectSelectionOnCurrentValueLabel()

        this.#sendValueToForm()

        break
    }
  }

  #handleValiditiesSlotchange = ({ type, target: slot }: Event) => {
    debug(`${PickerView.name} ⚡️ ${type}`)

    if (!(slot instanceof HTMLSlotElement)) return

    const assigned = slot.assignedElements()

    this.#validityObservers.syncObservations(assigned, ['value', 'label'])

    // if (0 < assigned.length)
    this.#renderValidityMsgs([])
  }

  #handleListSlotchange = ({ type, target: slot }: Event) => {
    debug(`${PickerView.name} ⚡️ ${type}`)

    if (!(slot instanceof HTMLSlotElement)) return

    const assigned = slot.assignedElements()

    this.#observers.syncObservations(assigned)

    // if (0 < assigned.length)
    this.#renderSlotted([])
  }

  static #wrapOptionSpawnTag(node: DictEntry) {
    debug(`${PickerView.name} #wrapOptionSpawnTag`)

    const mount = document.createElement('div')
    render(
      html`<button type="button" tabindex="0" navigation-link>
        <h-stack distribution="leading" template="auto spacer">
          <label-view data-role="check" style="visibility: hidden">
            <image-view slot="icon" system-name="check"></image-view>
          </label-view>
          ${PickerView.#morphITSLabel(node)}
        </h-stack>
      </button>`,
      mount
    )

    return mount.firstElementChild as HTMLButtonElement //btn
  }

  #wrapOptionTag(node: DictEntry) {
    debug(`${PickerView.name} #wrapOptionTag`)

    const tag = node.value

    const mount = document.createElement('div')

    switch (this.pickerStyle) {
      case 'segmented':
        render(PickerView.#morphSegmentedBtn({ name: this.#guuid, node, tag }), mount)

        return mount.firstElementChild as HTMLLabelElement //btn
      case 'palette':
        render(PickerView.#morphPaletteBtn({ name: this.#guuid, node, tag }), mount)

        return mount.firstElementChild as HTMLLabelElement //btn
      case 'radio-group':
        render(PickerView.#morphRadioGroupBtn({ name: this.#guuid, node, tag }), mount)

        return mount.firstElementChild as HTMLLabelElement //btn

      default:
        render(
          html`<button type="button" tabindex="0" value="${tag}">
            <h-stack distribution="leading" template="auto spacer">
              <label-view data-role="check">
                <image-view slot="icon" system-name="check"></image-view>
              </label-view>
              ${PickerView.#morphITSLabel(node)}
            </h-stack>
          </button>`,
          mount
        )

        return mount.firstElementChild as HTMLButtonElement //btn
    }
  }

  static #morphRadioGroupBtn({ name, node, tag }: { name: string | null; node: DictEntry; tag?: string }) {
    if ('string' === typeof tag)
      return html`<label tabindex="0">
        <h-stack distribution="fill" template="auto spacer" spacing="5">
          <input type="radio" name="${name}" value="${tag}" />
          ${PickerView.#morphITSLabel(node)}
        </h-stack>
      </label>`
    else
      return html`<label>
        <h-stack distribution="fill" template="auto spacer" spacing="5">
          <input type="radio" name="${name}" disabled />
          ${PickerView.#morphITSLabel(node)}
        </h-stack>
      </label>`
  }

  static #morphPaletteBtn({ name, node, tag }: { name: string | null; node: DictEntry; tag?: string }) {
    if ('string' === typeof tag) {
      const style = node.src ? `background-image: url('${node.src}')` : null

      return html`<label tabindex="0">
        <v-stack template="auto spacer" spacing="5">
          <input type="radio" name="${name}" value="${tag}" style="${style}" />
          ${PickerView.#morphITSLabel(node)}
        </v-stack>
      </label>`
    } else
      return html`<label>
        <v-stack template="auto spacer" spacing="5">
          <input type="radio" name="${name}" disabled />
          ${PickerView.#morphITSLabel(node)}
        </v-stack>
      </label>`
  }

  static #morphSegmentedBtn({ name, node, tag }: { name: string | null; node: DictEntry; tag?: string }) {
    const cssUrl = (src: unknown): string | null => {
      if ('string' !== typeof src) return null

      try {
        const { protocol, href } = new URL(src, location.href)

        if (protocol !== 'https:' && protocol !== 'http:' && protocol !== 'blob:') return null

        // URL.href already percent-encodes " < > ` space and \ in path/query.
        // Encode the remaining chars that matter inside url('...')
        return href.replace(/['()]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`)
      } catch {
        return null
      }
    }
    if ('string' === typeof tag) {
      const style = node.src ? `background-image: url('${cssUrl(node.src)}')` : null

      return html`<label tabindex="0">
        <v-stack template="auto spacer" spacing="5">
          <input type="radio" name="${name}" value="${tag}" style="${style}" />
          ${PickerView.#morphITSLabel(node)}
        </v-stack>
      </label>`
    } else
      return html`<label>
        <v-stack template="auto spacer" spacing="5">
          <input type="radio" name="${name}" disabled />
          ${PickerView.#morphITSLabel(node)}
        </v-stack>
      </label>`
  }

  static #morphITSLabel({ title, subtitle, systemImage }: DictEntry) {
    return html`<h-stack distribution="fill" template="${systemImage ? 'auto spacer' : null}">
      ${systemImage ? html`<label-view system-image="${systemImage}"></label-view>` : null}
      <v-stack spacing="3" alignment="fill">
        <label-view title="${title}"></label-view>
        ${subtitle ? html`<label-view foreground="secondary" font="callout" title="${subtitle}"></label-view>` : null}
      </v-stack>
    </h-stack>`
  }

  #wrapOptgroupTag(node: DictEntry) {
    debug(`${PickerView.name} #wrapOptgroupTag`)

    const mount = document.createElement('div')

    switch (this.pickerStyle) {
      case 'segmented':
        render(PickerView.#morphSegmentedBtn({ name: this.#guuid, node }), mount)

        return mount.firstElementChild as HTMLLabelElement
      case 'palette':
        render(PickerView.#morphPaletteBtn({ name: this.#guuid, node }), mount)

        return mount.firstElementChild as HTMLLabelElement
      case 'radio-group':
        render(PickerView.#morphRadioGroupBtn({ name: this.#guuid, node }), mount)

        return mount.firstElementChild as HTMLLabelElement
      default:
        render(
          html`<details is="disclosure-group" disclosure-style="marker-trailing">
            <summary>
              <h-stack distribution="leading" template="auto spacer">
                <label-view data-role="check" style="visibility: hidden">
                  <image-view slot="icon" system-name="check"></image-view>
                </label-view>
                ${PickerView.#morphITSLabel(node)}
              </h-stack>
            </summary>
          </details>`,
          mount
        )

        return mount.firstElementChild as HTMLDetailsElement
    }
  }

  #wrapDatalistTag(node: DictEntry) {
    const mount = document.createElement('div')

    switch (this.pickerStyle) {
      case 'segmented':
        render(PickerView.#morphSegmentedBtn({ name: this.#guuid, node }), mount)

        return mount.firstElementChild as HTMLElement
      case 'palette':
        render(PickerView.#morphPaletteBtn({ name: this.#guuid, node }), mount)

        return mount.firstElementChild as HTMLElement
      case 'radio-group':
        render(PickerView.#morphRadioGroupBtn({ name: this.#guuid, node }), mount)

        return mount.firstElementChild as HTMLElement

      default:
        render(
          html`<menu-view tabindex="0">
            <h-stack slot="label" distribution="leading" template="auto spacer">
              <label-view data-role="check" style="visibility: hidden">
                <image-view slot="icon" system-name="check"></image-view>
              </label-view>
              ${PickerView.#morphITSLabel(node)}
            </h-stack>
          </menu-view>`,
          mount
        )

        return mount.firstElementChild as HTMLMenuElement
    }
  }

  #reflectButtons(nodes: Dictionary, container: Element): void {
    debug(`${PickerView.name} #reflectButtons`)

    const flatten = ['radio-group', 'palette', 'segmented'].includes(this.pickerStyle)

    for (const node of nodes) {
      if (DictEntry.isLeaf(node)) {
        container.appendChild(this.#wrapOptionTag(node))
        continue
      }

      if (flatten) {
        container.appendChild(this.#wrapOptgroupTag(node)) // header row, same markup as the datalist one in these styles
        this.#reflectButtons(node.children, container)
        continue
      }

      const group = DictEntry.isGroup(node) ? this.#wrapOptgroupTag(node) : this.#wrapDatalistTag(node)

      this.#reflectButtons(node.children, group)
      container.appendChild(group)
    }
  }

  // #reflectPlaceholder(value: string | null) {
  //   debug(`#reflectPlaceholder`)
  // const input = this.#shadowRoot.querySelector('input')
  // if (input) {
  //   if (value) input.setAttribute('prompt', value)
  //   else input.removeAttribute('prompt')
  // }
  // }

  #reflectLabel(value: string | null) {
    debug(`${PickerView.name} #reflectLabel`)

    queryMorph('[slot=label]', html`<label-view slot="label">${value ? html`<span>${value}</span>` : null}</label-view>`, this)

    this.#renderSlotted([])
  }

  #reflectSelectionOnButtons() {
    debug(`${PickerView.name} #reflectSelectionOnButtons`)

    self.requestAnimationFrame(() => {
      this.ariaCurrent = this.#selection

      const groupMap = Dictionary.index(this.#lastIndexedRoot)

      const groupContainsSelection = (e: DictEntry) => DictEntry.leafValues(e).includes(this.#selection)

      const syncButtons = (root: Element | HTMLElement) => {
        // 1. plain value buttons
        for (const el of root.querySelectorAll<HTMLButtonElement>('button[value]:not([slot])'))
          // $.prop('visibility', el.getAttribute('value') === this.#selection ? 'visible' : 'hidden', el.querySelector<HTMLElement>('label-view[data-role="check"]'))
          el.querySelector<HTMLElement>('label-view[data-role="check"]')?.style.setProperty('visibility', el.getAttribute('value') === this.#selection ? 'visible' : 'hidden')

        // 2. details/optgroups
        for (const details of root.querySelectorAll<HTMLElement>('details[is="disclosure-group"]')) {
          const hasSelectedDescendant = [...details.querySelectorAll<HTMLButtonElement>('button[value]')].some((btn) => btn.getAttribute('value') === this.#selection)

          details.querySelector<HTMLElement>(':scope>summary label-view[data-role="check"]')?.style.setProperty('visibility', hasSelectedDescendant ? 'visible' : 'hidden')
        }

        // 3. nav-link buttons — resolved by groupId, same map used for resync
        for (const btn of root.querySelectorAll<HTMLButtonElement>('button[navigation-link]:not([value])')) {
          const source = btn.dataset.groupId ? groupMap.get(btn.dataset.groupId) : undefined
          const hasSelectedDescendant = source ? groupContainsSelection(source) : false

          btn.querySelector<HTMLElement>('label-view[data-role="check"]')?.style.setProperty('visibility', hasSelectedDescendant ? 'visible' : 'hidden')
        }

        // 4. radio inputs
        for (const el of root.querySelectorAll<HTMLInputElement>('input[type=radio][value]')) el.checked = el.getAttribute('value') === this.#selection
      }

      syncButtons(this)
      if (this.#spawn) syncButtons(this.#spawn)
    })
  }

  /**
   * Overwrite cvlabel with the label prop of the current(find[value === #selection]) option/dictentry
   */
  #reflectSelectionOnCurrentValueLabel() {
    debug(`${PickerView.name} #reflectSelectionOnCurrentValueLabel`)

    self.requestAnimationFrame(() => {
      switch (this.pickerStyle) {
        case 'sheet':
        case 'navigation-link': {
          const currentValueLabel = this.querySelector<LabelView>(':scope>label-view:not([slot])')
          if (!currentValueLabel) break

          // if (!cvl) currentValueLabel.setAttribute('foreground', 'secondary')
          // else currentValueLabel.removeAttribute('foreground')

          const title = this.#currentValueLabel || this.#selection || this.getAttribute('prompt'),
            systemImage = this.#currentValueIcon || this.getAttribute('prompt-icon')

          queryMorph(':not([slot])', html`<span>${title}</span>`, currentValueLabel, { removeIf: !title })

          queryMorph('[slot=icon]', html`<image-view slot="icon" system-name="${systemImage}"></image-view>`, currentValueLabel, { removeIf: !systemImage })

          // morph(
          //   htmx`<label-view>${systemImage ? htmx`<image-view slot="icon" system-name="${systemImage}"></image-view>` : null}${title ? htmx`<span>${title}</span>` : null}</label-view>`,
          //   currentValueLabel
          // ) NOTE: not this bc/ help tooltip right now is added to trigger label and this mangles it

          break
        }
        case 'menu': {
          const currentValueLabel = this.querySelector<LabelView>(':scope>menu-view:not([slot])>label-view[slot=label]')
          if (!currentValueLabel) break

          // if (!cvl) currentValueLabel.setAttribute('foreground', 'secondary')
          // else currentValueLabel.removeAttribute('foreground')

          const title = this.#currentValueLabel || this.#selection || this.getAttribute('prompt'),
            systemImage = this.#currentValueIcon || this.getAttribute('prompt-icon')

          queryMorph(':not([slot])', html`<span>${title}</span>`, currentValueLabel, { removeIf: !title })

          queryMorph('[slot=icon]', html`<image-view slot="icon" system-name="${systemImage}"></image-view>`, currentValueLabel, { removeIf: !systemImage })

          // morph(
          //   htmx`<label-view slot="label">${systemImage ? htmx`<image-view slot="icon" system-name="${systemImage}"></image-view>` : null}${title ? htmx`<span>${title}</span>` : null}</label-view>`,
          //   currentValueLabel
          // ) NOTE: not this bc/ help tooltip right now is added to trigger label and this mangles it

          break
        }
        case 'inline':
        default: {
          //

          break
        }
      }
    })
  }

  #reflectTriggerHelp() {
    debug(`${PickerView.name} #reflectTriggerHelp`)

    let trigger
    switch (this.pickerStyle) {
      case 'sheet':
      case 'navigation-link': {
        trigger = this.querySelector<LabelView>(':scope>label-view:not([slot])') ?? undefined

        break
      }
      case 'menu': {
        trigger = this.querySelector<LabelView>(':scope>menu-view:not([slot])>label-view[slot=label]') ?? undefined

        break
      }
      case 'inline':
      default: {
        //udnefined

        break
      }
    }

    if (this.hasAttribute('help')) trigger?.setAttribute('help', this.getAttribute('help') ?? '')
    else trigger?.removeAttribute('help')
  }

  /**
   * Form participation property
   */
  get name() {
    return this.getAttribute('name') ?? this.getAttribute('label') ?? this.querySelector(':scope>[slot=label]')?.textContent ?? ''
  }
  setValidity = (flags?: ValidityStateFlags, message?: string, anchor?: HTMLElement) => {
    // let msg

    // if (message)
    for (const k in flags) {
      const key = k as keyof ValidityStateFlags // ✅ type-safe cast
      if (true !== flags[key]) continue

      for (const el of this.#slots?.get('validity-options')?.assignedElements({ flatten: true }) ?? []) {
        if (!el.matches('option')) continue

        const { label, value } = el as HTMLOptionElement

        if (`${kebabCase(key)}` === value) {
          message = label
          break
        } else if (`${kebabCase(key)}:${message}` === value) {
          message = label
          break
        }
      }
    }

    if (!message)
      for (const k in flags) {
        const key = k as keyof ValidityStateFlags // ✅ type-safe cast
        if (true !== flags[key]) continue

        message = kebabCase(key)

        break
      }

    debug(`${PickerView.name} ⚡️ validity-change`)

    return this.#internals.setValidity(flags, this.#customValidity || message, anchor)
  }
  setCustomValidity = (message: string) => {
    this.#customValidity = message

    if (this.#customValidity) this.#internals.setValidity({ ...this.#internals.validity, customError: true }, message)
    else this.#sendValueToForm(false)
  }
  formStateRestoreCallback(state: string, reason: string) {
    //
  }
  formAssociatedCallback(form: HTMLFormElement) {
    this.#sendValueToForm(false)
  }
  formDisabledCallback(disabled: boolean) {
    for (const btn of this.#shadowRoot.querySelectorAll('button')) btn.toggleAttribute('disabled', !disabled)
  }
  formResetCallback() {
    this.#selection = ''

    this.#reflectSelectionOnButtons()

    this.#reflectSelectionOnCurrentValueLabel()

    this.#sendValueToForm(false)
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'picker-view': PickerView
  }
}
