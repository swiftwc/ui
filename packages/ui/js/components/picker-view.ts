import type { PickerSearchableDetail, PickerSelectionDetail } from '../events'
import { I18n } from '../i18n'
import { CleanupRegistry } from '../internal/class/cleanup-registry'
import { FormAssociatedBase, getInternals } from '../internal/class/form-associated-base'
import { MutationObserverSet } from '../internal/class/mutation-observer-set'
import { NavigationPath } from '../internal/class/navigation-path'
import { queryInsertPosition, startViewTransition } from '../internal/privateNamespace'
import { $, devFlags, kebabCase, onoff, renderLabel, renderLabelIcon, renderLabelTitle } from '../internal/utils'
import type { LabelView } from './label-view'
import type { MenuView } from './menu-view'

const pickerStyles = ['menu', 'inline', 'navigation-link', 'sheet', 'automatic'] as const
export type PickerStyle = (typeof pickerStyles)[number]

const update = (path: NavigationPath, node: Element, overwrite = true) => {
  if (devFlags.debug) console.debug(`PickerView: update`)

  if (!(path instanceof NavigationPath)) throw new Error('invalid view')

  const { component, page } = path
  if (!component) return

  const position = queryInsertPosition(component) //'afterend'
  // const lookFor = 'beforebegin' === position ? 'previousElementSibling' : 'nextElementSibling'

  if (page) page.insertAdjacentElement(position, node)
}

const reflectSpawnedElement = (current?: HTMLElement, source?: HTMLElement) => {
  if (devFlags.debug) console.debug(`PickerView: reflectSpawnedElement`)

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

  // replace backbtns (always exists)
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
                  <button type="button">Filters</button>
                </v-stack>
              </sticky-container>`
      )
  } else oldSearch?.remove()
}

const extractTagFromOption = (node: HTMLOptionElement | DictEntry) => {
    if (devFlags.debug) console.debug(`PickerView: extractTagFromOption`)

    return node instanceof HTMLOptionElement ? (((node.getAttribute('value') ?? node.textContent?.trim()) || node.getAttribute('label')) ?? '') : (node.value ?? '')
  },
  extractCurrentValueFromOption = (node: HTMLOptionElement | DictEntry) => {
    if (devFlags.debug) console.debug(`PickerView: extractCurrentValueFromOption`)

    return node instanceof HTMLOptionElement ? (node.getAttribute('label') ?? node.getAttribute('value') ?? node.textContent?.trim()) || '' : (node.label ?? node.value ?? '')
  },
  extractIconFromOption = (node: HTMLOptionElement | DictEntry): string | null => {
    if (devFlags.debug) console.debug(`PickerView: extractIconFromOption`)

    return node instanceof HTMLOptionElement ? node.getAttribute('data-system-image') : (node.systemImage ?? null)
  },
  extractLabelFromGroup = (node: HTMLOptGroupElement | HTMLDataListElement | DictEntry): string | null => {
    if (devFlags.debug) console.debug(`PickerView: extractLabelFromGroup`)

    return node instanceof Element ? node.getAttribute('DATALIST' === node.tagName ? 'data-label' : 'label') : (node.label ?? node.value ?? null)
  },
  extractImgFromGroup = (node: HTMLOptGroupElement | HTMLDataListElement | DictEntry): string | null => {
    if (devFlags.debug) console.debug(`PickerView: extractImgFromGroup`)

    return node instanceof Element ? node.getAttribute('data-system-image') : (node.systemImage ?? null)
  }

type DictEntry = {
  value: string
  label?: string
  systemImage?: string
  children: DictEntry[]
}

type Dictionary = DictEntry[]

const allLeaves = (node: DictEntry) => node.children.every((c) => 0 === c.children.length)

const parseDictionary = (value: string | null): Dictionary => {
  let dictionary: Dictionary = []

  try {
    dictionary = JSON.parse(value ?? '[]') as Dictionary
  } catch {
    console.error('invalid-dictionary')
  }

  return dictionary
}

const indexGroups = (nodes: Element[] | Dictionary, parentPath = ''): Map<string, Element | DictEntry> => {
  const map = new Map<string, Element | DictEntry>()

  nodes.forEach((node, i) => {
    const id = parentPath ? `${parentPath}.${i}` : `${i}`

    map.set(id, node) // no DOM write — works identically for Element and DictEntry

    const children = node instanceof Element ? Array.from(node.children) : node.children
    for (const [cid, cnode] of indexGroups(children, id)) map.set(cid, cnode)
  })

  return map
}

const collectLeafValues = (node: DictEntry): string[] => (node.children.length ? node.children.flatMap(collectLeafValues) : [node.value])

/**
 *
 * @attr {menu|inline|navigation-link|sheet|automatic} picker-style
 *
 * @attr {string} help - Adds a help tooltip to the trigger of the picker, if style supports one
 *
 * @attr {DictEntry[]} dictionary - Renders all options using this array
 *
 * @attr {vertical|horizontal|auto} label-value-placement
 *
 * @slot list
 */
export class PickerView extends FormAssociatedBase {
  static get ATTR() {
    return {
      PLACEHOLDER: 'placeholder',
      LABEL: 'label',
      PICKER_STYLE: 'picker-style',
      SELECTION: 'selection',
      SEARCHABLE: 'searchable',
      CURRENT_VALUE_LABEL: 'current-value-label',
      TRIGGER_HELP: 'help',
      DICTIONARY: 'dictionary',
    }
  }

  static get observedAttributes() {
    return Object.values(this.ATTR)
  }

  static #templates: Map<string, DocumentFragment> = new Map()

  #spawn?: HTMLElement

  #makeGroupClickHandler(el: Element | DictEntry, groupId: string) {
    return async (evt: Event) => {
      evt.stopImmediatePropagation()
      evt.preventDefault()

      const { target } = evt
      if (!(target instanceof HTMLElement)) return

      const newPage = this.#spawnPage(
        el instanceof Element ? Array.from(el.children) : el.children,
        'body-view',
        groupId,
        this.hasAttribute('searchable'),
        extractLabelFromGroup(el as HTMLDataListElement)
      )
      if (!newPage) return

      newPage.dataset.groupId = groupId // <-- tag the spawned page

      const path = new NavigationPath(target)?.hydrate()

      await startViewTransition(target, 'forwards', async () => {
        update(path, newPage)

        this.#reflectSelectionOnButtons()
      })
    }
  }

  #spawnPage = (elements: Element[] | DictEntry[], tag: 'body-view' | 'sheet-view', parentGroupId?: string, searchable: boolean = false, title?: string | null) => {
    if (devFlags.debug) console.debug(`${PickerView.name} #spawnPage`)

    const body = $<HTMLElement>(
        `<${'sheet-view' === tag ? 'dialog is="sheet-view"' : 'body-view'}><scroll-view><v-stack placement="leading fill"><list-view preferred-expanded-style="inset"></list-view></v-stack></scroll-view><tool-bar><tool-bar-item slot="top-bar-leading"><button type="button" tabindex="0"><label-view system-image="caret-left"></label-view></button></tool-bar-item></tool-bar></${'sheet-view' === tag ? 'dialog' : 'body-view'}>`,
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
                  <button type="button">Filters</button>
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

    for (const [i, el] of elements.entries()) {
      if (el instanceof Element)
        switch (el.tagName) {
          case 'OPTGROUP': {
            const group = PickerView.#wrapOptgroupTag(el as HTMLOptGroupElement)

            PickerView.#reflectButtons([...el.children] as Element[], group)

            for (const btn of group.querySelectorAll(':scope>button')) btn.addEventListener('click', this.#handlePageBtnClick)

            list?.appendChild(group)

            break
          }
          case 'OPTION': {
            const btn = PickerView.#wrapOptionTag(el as HTMLOptionElement)

            btn.addEventListener('click', this.#handlePageBtnClick)

            list?.appendChild(btn)

            break
          }
          default: {
            const btn = PickerView.#wrapOptionSpawnTag(el as HTMLDataListElement)

            const groupId = parentGroupId ? `${parentGroupId}.${i}` : `${i}`
            // const btn = $<HTMLButtonElement>(
            //     `<button type="button" tabindex="0" navigation-link><h-stack distribution="leading" template="auto spacer"><label-view data-role="check" style="visibility: hidden"><image-view slot="icon" system-name="check"></image-view></label-view><label-view><span></span></label-view></h-stack></button>`,
            //     '>1'
            //   ),
            //   label = btn.querySelector<LabelView>(':scope>h-stack>label-view:nth-child(2)')
            // const node = el as HTMLElement
            // if (label && node.dataset.label) renderLabelTitle(label, node.dataset.label) //label?.setAttribute('title', el.dataset.label)

            btn.dataset.groupId = groupId

            btn.addEventListener('click', this.#makeGroupClickHandler(el, groupId))

            list?.appendChild(btn)

            break
          }
        }
      else {
        if (el.children.length)
          if (allLeaves(el)) {
            const group = PickerView.#wrapOptgroupTag(el)

            PickerView.#reflectButtons(el.children, group)

            for (const btn of group.querySelectorAll(':scope>button')) btn.addEventListener('click', this.#handlePageBtnClick)

            list?.appendChild(group)
          } else {
            const btn = PickerView.#wrapOptionSpawnTag(el)

            const groupId = parentGroupId ? `${parentGroupId}.${i}` : `${i}`

            btn.dataset.groupId = groupId

            btn.addEventListener('click', this.#makeGroupClickHandler(el, groupId))

            list?.appendChild(btn)
          }
        else {
          const btn = PickerView.#wrapOptionTag(el)

          btn.addEventListener('click', this.#handlePageBtnClick)

          list?.appendChild(btn)
        }
      }
    }

    return body
  }

  #resyncSpawnedPages = (freshRoot: Element[] | Dictionary) => {
    if (!this.#spawn) return

    const groupMap = indexGroups(freshRoot)

    for (const el of this.#spawn.querySelectorAll<HTMLElement>('body-view')) {
      const depth = $.ancestors('body-view,[is=sheet-view]', el).indexOf(this.#spawn)
      if (0 >= depth) continue

      const groupId = el.dataset.groupId
      const source = groupId ? groupMap.get(groupId) : undefined

      if (!source) {
        el.remove()
        continue
      }

      const children = source instanceof Element ? Array.from(source.children) : source.children
      const title = source instanceof Element ? extractLabelFromGroup(source as HTMLDataListElement) : (source.label ?? null)

      const newPage = this.#spawnPage(children, 'body-view', groupId, this.hasAttribute('searchable'), title)
      newPage.dataset.groupId = groupId

      reflectSpawnedElement(el, newPage)
    }
  }

  #renderButtons(input: { mode: 'dictionary'; source: Dictionary } | { mode: 'list'; source: Element[] }): void {
    if (devFlags.debug) console.debug(`${PickerView.name} #renderButtons`)

    switch (input.mode) {
      case 'dictionary': {
        const flattenDictionary = (tree: Dictionary): Record<string, string | undefined> => {
          const out: Record<string, string | undefined> = {}
          const stack: DictEntry[][] = [tree]
          const idx: number[] = [0]

          while (stack.length) {
            const frame = stack[stack.length - 1]
            const i = idx[idx.length - 1]

            if (i >= frame.length) {
              stack.pop()
              idx.pop()
              continue
            }

            idx[idx.length - 1]++
            const { value, label, children } = frame[i]
            out[value] = label

            if (children.length) {
              stack.push(children)
              idx.push(0)
            }
          }

          return out
        }
        this.#lastRenderedLabelMap = flattenDictionary(input.source)

        // const collectLeafValues = (node: DictEntry): string[] => (node.children.length ? node.children.flatMap(collectLeafValues) : [node.value])
        // collectGroups = (nodes: DictEntry[]): string[][] => {
        //   const groups: string[][] = []
        //   const walk = (list: DictEntry[]) => {
        //     for (const node of list) {
        //       if (!node.children.length) continue
        //       if (!allLeaves(node)) groups.push(collectLeafValues(node))
        //       walk(node.children)
        //     }
        //   }
        //   walk(nodes)
        //   return groups
        // }
        this.#lastIndexedRoot = input.source //this.#lastRenderedGroupMap = collectGroups(dictionary)

        break
      }

      case 'list': {
        this.#lastRenderedLabelMap = {}

        for (const el of input.source)
          if (el.matches('option')) {
            const opt = el as HTMLOptionElement
            this.#lastRenderedLabelMap[extractTagFromOption(opt)] = opt.getAttribute('label') ?? undefined
          } else for (const opt of el.querySelectorAll<HTMLOptionElement>('option')) this.#lastRenderedLabelMap[extractTagFromOption(opt)] = opt.getAttribute('label') ?? undefined

        this.#lastIndexedRoot = input.source
        // this.#lastRenderedGroupMap = assigned.flatMap<string[]>((el) =>
        //   [...(el.matches('datalist') ? [el as HTMLDataListElement] : []), ...el.querySelectorAll<HTMLDataListElement>('datalist')].map((dl) =>
        //     Array.from(dl.options).map((opt) => extractTagFromOption(opt))
        //   )
        // )

        break
      }
    }

    switch (this.pickerStyle) {
      case 'sheet':
      case 'navigation-link': {
        // current value label only
        const currentValueLabel = this.querySelector<LabelView>(':scope>label-view:not([slot])') ?? this.appendChild<LabelView>($(`<label-view></label-view>`, '>1'))

        // reset state
        // if (currentValueLabel) {
        //   renderLabelIcon(currentValueLabel, 'dots-three') // overwritten
        //   renderLabelTitle(currentValueLabel, this.#currentValueLabel) // overwritten
        // }

        // clear all siblings
        for (const el of this.querySelectorAll(':scope>:not([slot])')) if (currentValueLabel !== el) el.remove()

        CleanupRegistry.unregister(this, 'trigger')
        CleanupRegistry.register(this, onoff('click', this.#handleTriggerClick, currentValueLabel).on(), 'trigger')

        // rebuild snapshot(tree)
        if (!this.#spawn) break

        // rerender level 0
        reflectSpawnedElement(this.#spawn, this.#spawnPage(input.source, 'body-view', undefined, this.hasAttribute('searchable'), this.getAttribute('label')))

        this.#resyncSpawnedPages(input.source)
        // // FIXME:
        // for (const el of this.#spawn.querySelectorAll<HTMLElement>('body-view')) {
        //   const depth = $.ancestors('body-view,[is=sheet-view]', el).indexOf(this.#spawn)
        //   if (0 >= depth) continue

        //   const datalist = this.querySelector<HTMLElement>(`:scope>${Array.from({ length: depth }, () => 'datalist').join('>')}`)
        //   if (!datalist) {
        //     el.remove()

        //     break
        //   }

        //   reflectSpawnedElement(el, this.#spawnPage(Array.from(datalist.children), 'body-view', this.hasAttribute('searchable'), datalist.dataset.label))
        // }

        break
      }
      case 'menu': {
        const menu = this.querySelector<MenuView>(':scope>menu-view:not([slot])') ?? this.appendChild<MenuView>($(`<menu-view></menu-view>`, '>1'))

        // reset state
        menu.innerHTML = ''
        menu.tabIndex = 0

        // clear all siblings
        for (const el of this.querySelectorAll(':scope>:not([slot])')) if (menu !== el) el.remove()

        const currentValueLabel = menu.querySelector<LabelView>(':scope>label-view[slot=label]') ?? menu.appendChild<LabelView>($(`<label-view slot="label"></label-view>`, '>1'))

        // if (currentValueLabel) {
        //   renderLabelIcon(currentValueLabel, 'dots-three') // overwritten
        //   renderLabelTitle(currentValueLabel, this.#currentValueLabel) // overwritten
        // }

        if (this.hasAttribute('help')) currentValueLabel?.setAttribute('help', this.getAttribute('help') ?? '')

        PickerView.#reflectButtons(input.source, menu)

        break
      }
      case 'inline':
      default: {
        const sectionTpl = `<section-view></section-view>`

        const inlineList = this.querySelector(':scope>list-view:not([slot])') ?? this.appendChild($(`<list-view>${sectionTpl}</list-view>`, '>1')),
          section = inlineList.querySelector(':scope>section-view') ?? inlineList.appendChild($(sectionTpl, '>1'))

        // reset state
        section.innerHTML = ''

        // clear all siblings
        for (const el of this.querySelectorAll(':scope>:not([slot])')) if (inlineList !== el) el.remove()

        // add label as a plain element
        const value = this.getAttribute((this.constructor as typeof PickerView).ATTR.LABEL)
        if (value) {
          const hStack = $<LabelView>(
            `<h-stack distribution="leading" template="auto spacer"><label-view data-role="check" style="visibility: hidden"><image-view slot="icon" system-name="check"></image-view></label-view><label-view><span></span></label-view></h-stack>`,
            '>1'
          )

          renderLabel(':scope>label-view:nth-child(2)', `<label-view><span></span></label-view>`, hStack, value)
          // if (label) renderLabelTitle(label, value) //label.setAttribute('title', value)

          section.insertAdjacentElement('beforeend', hStack)
        }

        if ('dictionary' === input.mode)
          PickerView.#reflectButtons(
            input.source.filter((el) => 0 === el.children.length),
            section
          )
        else
          PickerView.#reflectButtons(
            input.source.filter((el) => el.matches('option')),
            section
          )

        break
      }
    }

    this.#reflectSelectionOnButtons()

    this.#reflectSelectionOnCurrentValueLabel()
  }

  #renderDictionary = (dictionary: Dictionary) => {
    if (devFlags.debug) console.debug(`${PickerView.name} ⚡️ mutation`)

    this.#renderButtons({ mode: 'dictionary', source: dictionary })
  }

  #renderSlotted = (entries: MutationRecord[]) => {
    if (devFlags.debug) console.debug(`${PickerView.name} ⚡️ mutation`)

    this.#renderButtons({ mode: 'list', source: this.#slots?.get('list')?.assignedElements({ flatten: true }) ?? [] })
  }

  #renderValidityMsgs = (entries: MutationRecord[]) => {
    if (devFlags.debug) console.debug(`${PickerView.name} ⚡️ mutation`)

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

  #lastIndexedRoot: Element[] | Dictionary = []

  get #currentValueLabel() {
    const cvl = this.#lastRenderedLabelMap[this.#selection]

    return (this.getAttribute('current-value-label') ?? '').replaceAll('{{selection}}', this.#selection).replaceAll('{{currentValueLabel}}', this.#selection) || cvl
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
            $(
              String.raw`
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
                `
            )
          )

          break
        case 'menu':
          PickerView.#templates.set(
            this.pickerStyle,
            $(
              String.raw`
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
                `
            )
          )

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

          break
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
              String.raw`
          <label part="root picker-stack">
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
    if (devFlags.debug) console.debug(`${PickerView.name} ⚡️ attr-change [${name}] ("${oldValue}" → "${newValue}")`)

    switch (name) {
      case (this.constructor as typeof PickerView).ATTR.PLACEHOLDER:
        this.#reflectPlaceholder(newValue)

        break
      case (this.constructor as typeof PickerView).ATTR.LABEL:
        this.#reflectLabel(newValue)

        // this.#sendValueToForm()

        break
      case (this.constructor as typeof PickerView).ATTR.PICKER_STYLE:
        if (oldValue === newValue) break

        this.#render()

        break
      case (this.constructor as typeof PickerView).ATTR.SEARCHABLE:
        if (oldValue === newValue) break

        this.#renderSlotted([])

        break
      case (this.constructor as typeof PickerView).ATTR.CURRENT_VALUE_LABEL:
        // if (oldValue === newValue) break

        this.#reflectSelectionOnCurrentValueLabel()

        break
      case (this.constructor as typeof PickerView).ATTR.TRIGGER_HELP:
        // if (oldValue === newValue) break

        this.#reflectTriggerHelp()

        break
      case (this.constructor as typeof PickerView).ATTR.DICTIONARY:
        if (oldValue === newValue) break

        this.#renderDictionary(parseDictionary(newValue))

        break
      case (this.constructor as typeof PickerView).ATTR.SELECTION:
        // nothing happens

        break
    }
  }

  disconnectedCallback() {
    if (devFlags.debug) console.debug(`${PickerView.name} ⚡️ disconnect`)

    CleanupRegistry.unregister(this)

    this.#validityObservers.unobserveAll()
    this.#observers.unobserveAll()
  }

  connectedCallback() {
    if (devFlags.debug) console.debug(`${PickerView.name} ⚡️ connect`)

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

    if (!this.hasAttribute((this.constructor as typeof PickerView).ATTR.PICKER_STYLE)) this.#render() // skip if already rendered by attr-change during upgrade!

    // finally
    if (!this.hasAttribute('selection')) return

    this.#selection = this.getAttribute('selection') ?? ''

    this.#sendValueToForm(false)
  }

  get pickerStyle(): PickerStyle {
    const attr = (this.constructor as typeof PickerView).ATTR.PICKER_STYLE

    return (pickerStyles as readonly string[]).includes(this.getAttribute(attr) ?? '') ? (this.getAttribute(attr) as (typeof pickerStyles)[number]) : 'automatic'
  }

  #render() {
    if (devFlags.debug) console.debug(`${PickerView.name} ⚡️ render (${this.pickerStyle})`)

    // const style = this.getAttribute((this.constructor as typeof PickerView).ATTR.PICKER_STYLE)
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
    if (devFlags.debug) console.debug(`${PickerView.name} ⚡️ ${type}`)

    if (!(target instanceof HTMLElement)) return

    this.#spawn?.remove?.()

    const level0 = this.#spawnPage(
      this.hasAttribute((this.constructor as typeof PickerView).ATTR.DICTIONARY) ? parseDictionary(this.getAttribute('dictionary')) : (this.#slots?.get('list')?.assignedElements() ?? []),
      'sheet' === this.pickerStyle ? 'sheet-view' : 'body-view',
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
    if (devFlags.debug) console.debug(`${PickerView.name} ⚡️ ${evt?.type}`)

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
    if (devFlags.debug) console.debug(`${PickerView.name} ⚡️ ${type}`)

    if (!(target instanceof HTMLElement)) return

    const btn = target.closest('button')
    if (!btn) return

    this.#selection = btn.getAttribute('value') ?? ''

    this.#reflectSelectionOnButtons()

    this.#reflectSelectionOnCurrentValueLabel()

    this.#sendValueToForm()
  }

  #handleValiditiesSlotchange = ({ type, target: slot }: Event) => {
    if (devFlags.debug) console.debug(`${PickerView.name} ⚡️ ${type}`)

    if (!(slot instanceof HTMLSlotElement)) return

    const assigned = slot.assignedElements()

    this.#validityObservers.syncObservations(assigned, ['value', 'label'])

    // if (0 < assigned.length)
    this.#renderValidityMsgs([])
  }

  #handleListSlotchange = ({ type, target: slot }: Event) => {
    if (devFlags.debug) console.debug(`${PickerView.name} ⚡️ ${type}`)

    if (!(slot instanceof HTMLSlotElement)) return

    const assigned = slot.assignedElements()

    this.#observers.syncObservations(assigned)

    // if (0 < assigned.length)
    this.#renderSlotted([])
  }

  static #wrapOptionSpawnTag(node: HTMLDataListElement | DictEntry) {
    if (devFlags.debug) console.debug(`${PickerView.name} #wrapOptionSpawnTag`)

    const btn = $<HTMLButtonElement>(
        `<button type="button" tabindex="0" navigation-link><h-stack distribution="leading" template="auto spacer"><label-view data-role="check" style="visibility: hidden"><image-view slot="icon" system-name="check"></image-view></label-view><label-view><span></span></label-view></h-stack></button>`,
        '>1'
      ),
      hStack = btn.querySelector<LabelView>(':scope>h-stack') ?? undefined

    renderLabel(
      ':scope>label-view:nth-child(2)',
      `<label-view><span></span></label-view>`,
      hStack,
      extractLabelFromGroup(node as HTMLDataListElement),
      extractImgFromGroup(node as HTMLDataListElement)
    )
    // label = btn.querySelector<LabelView>(':scope>h-stack>label-view:nth-child(2)')
    // if (label) {
    // const lbl = extractLabelFromGroup(node as HTMLDataListElement),
    //         img =extractImgFromGroup(node as HTMLDataListElement)
    //         if(lbl)  renderLabelTitle(label, node.dataset.label) //label?.setAttribute('title', el.dataset.label)
    // }

    return btn
  }

  static #wrapOptionTag(node: HTMLOptionElement | DictEntry) {
    if (devFlags.debug) console.debug(`${PickerView.name} #wrapOptionTag`)

    const btn = $(
        `<button type="button" tabindex="0"><h-stack distribution="leading" template="auto spacer"><label-view data-role="check"><image-view slot="icon" system-name="check"></image-view></label-view></h-stack></button>`,
        '>1'
      ),
      hStack = btn.querySelector<HTMLElement>(':scope>h-stack')
    // chevron = hStack?.querySelector<HTMLElement>(':scope>label-view')

    btn.setAttribute('value', extractTagFromOption(node))

    // if (selection !== btn.getAttribute('value')) chevron?.style.setProperty('visibility', 'hidden')

    const label = $<LabelView>(`<label-view></label-view>`, '>1')

    renderLabelTitle(label, extractCurrentValueFromOption(node)) // label.querySelector('span')!.textContent = extractCurrentValueFromOption(node) //label.setAttribute('title', extractCurrentValueFromOption(node))

    renderLabelIcon(label, extractIconFromOption(node))

    hStack?.appendChild(label)

    return btn
  }

  static #wrapOptgroupTag(node: HTMLOptGroupElement | DictEntry) {
    if (devFlags.debug) console.debug(`${PickerView.name} #wrapOptgroupTag`)

    const labelT = `<label-view><span></span></label-view>`,
      summaryT = `<summary><h-stack distribution="leading" template="auto spacer"><label-view data-role="check" style="visibility: hidden"><image-view slot="icon" system-name="check"></image-view></label-view>${labelT}</h-stack></summary>`

    const group = $(`<details is="disclosure-group" disclosure-style="marker-trailing">${summaryT}</details>`, '>1'), // NOTE: already applied, here it covers spawned sheets
      hStack = group.querySelector(':scope>summary>h-stack') ?? undefined // ?? group.appendChild($(summaryT, '>1'))
    //   summaryLabel = summary.querySelector(':scope>label-view') ?? summary.appendChild($(labelT, '>1'))
    // if (node.hasAttribute('label')) summaryLabel.setAttribute('title', node.getAttribute('label') ?? '')
    // if (node.hasAttribute('data-system-image')) summaryLabel.setAttribute('system-image', node.getAttribute('data-system-image') ?? '')

    renderLabel(':scope>label-view:nth-child(2)', labelT, hStack, extractLabelFromGroup(node), extractImgFromGroup(node))

    return group
  }

  // static #reflectButtons(nodes: Element[], container: Element): void
  // static #reflectButtons(nodes: Dictionary, container: Element): void
  static #reflectButtons(nodes: Element[] | Dictionary, container: Element): void {
    if (devFlags.debug) console.debug(`${PickerView.name} #reflectButtons`)

    for (const node of nodes)
      if (node instanceof Element)
        switch (node.tagName) {
          case 'DATALIST': {
            const group = $(
                `<menu-view tabindex="0"><h-stack slot="label" distribution="leading" template="auto spacer"><label-view data-role="check" style="visibility: hidden"><image-view slot="icon" system-name="check"></image-view></label-view><label-view><span></span></label-view></h-stack></menu-view>`,
                '>1'
              ),
              hStack = group.querySelector(':scope>h-stack[slot=label]') ?? undefined
            // label = group.querySelector(':scope>label-view[slot=label]') ?? group.appendChild($(`<label-view slot="label"></label-view>`, '>1'))
            // if (node.hasAttribute('data-label')) label.setAttribute('title', node.getAttribute('data-label') ?? '')
            // if (node.hasAttribute('data-system-image')) label.setAttribute('system-image', node.getAttribute('data-system-image') ?? '')

            renderLabel(
              ':scope>label-view:nth-child(2)',
              `<label-view><span></span></label-view>`,
              hStack,
              extractLabelFromGroup(node as HTMLDataListElement),
              extractImgFromGroup(node as HTMLDataListElement)
            )

            PickerView.#reflectButtons([...node.children] as Element[], group)

            container.appendChild(group)

            break
          }
          case 'OPTGROUP': {
            const group = PickerView.#wrapOptgroupTag(node as HTMLOptGroupElement)

            PickerView.#reflectButtons([...node.children] as Element[], group)

            container.appendChild(group)

            break
          }
          case 'OPTION':
          default: {
            container.appendChild(PickerView.#wrapOptionTag(node as HTMLOptionElement))

            break
          }
        }
      else {
        if (node.children.length)
          if (allLeaves(node)) {
            const group = PickerView.#wrapOptgroupTag(node)

            PickerView.#reflectButtons(node.children, group)

            container.appendChild(group)
          } else {
            const group = $(`<menu-view tabindex="0"></menu-view>`, '>1')

            renderLabel(':scope>label-view[slot=label]', `<label-view slot="label"><span></span></label-view>`, group, extractLabelFromGroup(node), extractImgFromGroup(node))

            PickerView.#reflectButtons(node.children, group)

            container.appendChild(group)
          }
        else container.appendChild(PickerView.#wrapOptionTag(node))
      }
  }

  #reflectPlaceholder(value: string | null) {
    if (devFlags.debug) console.debug(`#reflectPlaceholder`)

    const input = this.#shadowRoot.querySelector('input')
    if (input) {
      if (value) input.setAttribute('placeholder', value)
      else input.removeAttribute('placeholder')
    }
  }

  #reflectLabel(value: string | null) {
    if (devFlags.debug) console.debug(`${PickerView.name} #reflectLabel`)

    renderLabel(':scope>label-view[slot=label]', `<label-view slot="label"><span></span></label-view>`, this, value)

    this.#renderSlotted([])
  }

  #reflectSelectionOnButtons() {
    if (devFlags.debug) console.debug(`${PickerView.name} #reflectSelectionOnButtons`)

    self.requestAnimationFrame(() => {
      this.ariaCurrent = this.#selection

      const groupMap = indexGroups(this.#lastIndexedRoot)

      const groupContainsSelection = (source: Element | DictEntry): boolean =>
        source instanceof Element
          ? [...source.querySelectorAll<HTMLOptionElement>('option')].some((opt) => extractTagFromOption(opt) === this.#selection)
          : collectLeafValues(source).includes(this.#selection)

      const syncButtons = (root: Element | HTMLElement) => {
        // 1. plain value buttons — unchanged
        for (const el of root.querySelectorAll<HTMLButtonElement>('button[value]:not([slot])'))
          // $.prop('visibility', el.getAttribute('value') === this.#selection ? 'visible' : 'hidden', el.querySelector<HTMLElement>('label-view[data-role="check"]'))
          el.querySelector<HTMLElement>('label-view[data-role="check"]')?.style.setProperty('visibility', el.getAttribute('value') === this.#selection ? 'visible' : 'hidden')

        // 2. details/optgroups — unchanged
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
      }

      syncButtons(this)
      if (this.#spawn) syncButtons(this.#spawn)
    })
  }

  /**
   * Overwrite cvlabel with the label prop of the current(find[value === #selection]) option/dictentry
   */
  #reflectSelectionOnCurrentValueLabel() {
    if (devFlags.debug) console.debug(`${PickerView.name} #reflectSelectionOnCurrentValueLabel`)

    self.requestAnimationFrame(() => {
      switch (this.pickerStyle) {
        case 'sheet':
        case 'navigation-link': {
          const currentValueLabel = this.querySelector<LabelView>(':scope>label-view:not([slot])')
          if (!currentValueLabel) break

          const cvl = this.#currentValueLabel
          if (!cvl) currentValueLabel.setAttribute('foreground', 'secondary')
          else currentValueLabel.removeAttribute('foreground')

          renderLabelTitle(currentValueLabel, cvl || this.getAttribute('placeholder') || this.#selection)
          renderLabelIcon(currentValueLabel, 'dots-three')

          break
        }
        case 'menu': {
          const currentValueLabel = this.querySelector<LabelView>(':scope>menu-view:not([slot])>label-view[slot=label]')
          if (!currentValueLabel) break

          const cvl = this.#currentValueLabel
          if (!cvl) currentValueLabel.setAttribute('foreground', 'secondary')
          else currentValueLabel.removeAttribute('foreground')

          renderLabelTitle(currentValueLabel, cvl || this.getAttribute('placeholder') || this.#selection)
          renderLabelIcon(currentValueLabel, 'dots-three')

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
    if (devFlags.debug) console.debug(`${PickerView.name} #reflectTriggerHelp`)

    let trigger
    switch (this.pickerStyle) {
      case 'sheet':
      case 'navigation-link': {
        trigger = this.querySelector<LabelView>(':scope>label-view:not([slot])') ?? undefined
      }
      case 'menu': {
        trigger = this.querySelector<LabelView>(':scope>menu-view:not([slot])>label-view[slot=label]') ?? undefined
      }
      case 'inline':
      default: {
        //udnefined
      }
    }

    if (this.hasAttribute('help')) trigger?.setAttribute('help', this.getAttribute('help') ?? '')
    else trigger?.removeAttribute('help')
  }

  // Optional: form participation properties
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

    if (devFlags.debug) console.debug(`${PickerView.name} ⚡️ validity-change`)

    return this.#internals.setValidity(flags, this.#customValidity || message, anchor)
  }
  setCustomValidity = (message: string) => {
    this.#customValidity = message

    if (this.#customValidity) this.#internals.setValidity({ ...this.#internals.validity, customError: true }, message)
    else this.#sendValueToForm(false)
  }
  formAssociatedCallback = (form: HTMLFormElement) => {
    this.#sendValueToForm()
  }
  formDisabledCallback = (disabled: boolean) => {
    for (const btn of this.#shadowRoot.querySelectorAll('button')) btn.toggleAttribute('disabled', !disabled)
  }
  formResetCallback = () => {
    this.#selection = ''

    this.#reflectSelectionOnButtons()

    this.#reflectSelectionOnCurrentValueLabel()

    this.#sendValueToForm()
  }
}
