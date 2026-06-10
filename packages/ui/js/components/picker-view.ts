import type { PickerSearchableDetail, PickerSelectionDetail } from '../events'
import { I18n } from '../i18n'
import { CleanupRegistry } from '../internal/class/cleanup-registry'
import { FormAssociatedBase, getInternals } from '../internal/class/form-associated-base'
import { MutationObserverSet } from '../internal/class/mutation-observer-set'
import { NavigationPath } from '../internal/class/navigation-path'
import { queryInsertPosition, startViewTransition } from '../internal/privateNamespace'
import { $, debug, kebabCase, onoff } from '../internal/utils'

const pickerStyles = ['menu', 'inline', 'navigation-link', 'sheet', 'automatic'] as const
export type PickerStyle = (typeof pickerStyles)[number]

const update = (path: NavigationPath, node: Element, overwrite = true) => {
  if (!(path instanceof NavigationPath)) throw new Error('invalid view')

  const { component, page } = path
  if (!component) return

  const position = queryInsertPosition(component) //'afterend'
  // const lookFor = 'beforebegin' === position ? 'previousElementSibling' : 'nextElementSibling'

  if (page) page.insertAdjacentElement(position, node)
}

const replaceList = (current?: HTMLElement, source?: HTMLElement) => {
  const { page: oldPage, toolBarConfig: oldToolbar } = new NavigationPath(current).hydrate(),
    { page: newPage, toolBarConfig: newToolbar } = new NavigationPath(source).hydrate()

  const oldList = oldPage?.querySelector('list-view'),
    newList = newPage?.querySelector('list-view'),
    oldBackBtn = oldToolbar?.at(0)?.querySelector('button'),
    newBackBtn = newToolbar?.at(0)?.querySelector('button')

  // pre replace
  const oldOpenedDetails = [...(oldList?.querySelectorAll('details[open]>summary') ?? [])].map((item) => item.textContent.trim())

  // replace
  if (oldList && newList) oldList.replaceWith(newList)

  if (oldBackBtn && newBackBtn) oldBackBtn.replaceWith(newBackBtn)

  // post replace
  for (const label of oldOpenedDetails)
    for (const summary of newList?.querySelectorAll('details>summary') ?? [])
      if (summary.textContent.trim() === label) {
        summary.parentElement?.setAttribute('open', 'open')
        break
      }
}

export class PickerView extends FormAssociatedBase {
  static get ATTR() {
    return {
      PLACEHOLDER: 'placeholder',
      LABEL: 'label',
      PICKER_STYLE: 'picker-style',
      SELECTION: 'selection',
      SEARCHABLE: 'searchable',
    }
  }

  static get observedAttributes() {
    return Object.values(this.ATTR)
  }

  static #templates: Map<string, DocumentFragment> = new Map()

  #spawn?: HTMLElement

  #renderPage = (tag: 'body-view' | 'sheet-view', searchable: boolean = false, title?: string | null, node?: Element) => {
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

      searchInput?.addEventListener('focus', (evt) => {
        if (this.#spawn) this.dispatchEvent(new CustomEvent<PickerSearchableDetail>('picker:searchfocus', { detail: { element: this.#spawn }, bubbles: true, composed: true }))
      })
      searchInput?.addEventListener('blur', (evt) => {
        if (this.#spawn) this.dispatchEvent(new CustomEvent<PickerSearchableDetail>('picker:searchblur', { detail: { element: this.#spawn }, bubbles: true, composed: true }))
      })
      searchInput?.addEventListener('input', (evt) => {
        if (this.#spawn) this.dispatchEvent(new CustomEvent<PickerSearchableDetail>('picker:searchinput', { detail: { element: this.#spawn }, bubbles: true, composed: true }))
      })
    }

    backBtn?.setAttribute('help', I18n.t('ButtonRole').Back)

    backBtn?.addEventListener('click', async (evt: Event) => {
      evt.stopImmediatePropagation()
      evt.preventDefault()

      const { target } = evt
      if (!(target instanceof HTMLElement && target)) return

      const { component } = new NavigationPath(target)?.hydrate()

      await startViewTransition(target, 'backwards', async () => {
        component?.remove()
      })
    })

    const elements = node ? Array.from(node.children) : (this.#slots?.get('list')?.assignedElements() ?? [])

    for (const el of elements) {
      if (!(el instanceof HTMLElement)) continue

      switch (el.tagName) {
        case 'OPTGROUP': {
          const details = PickerView.#wrapOptgroupTag(el as HTMLOptGroupElement)

          PickerView.#reflectButtons([...el.children] as Element[], details)

          for (const btn of details.querySelectorAll(':scope>button')) btn.addEventListener('click', this.#handlePageClick)

          list?.appendChild(details)

          break
        }
        case 'OPTION': {
          const btn = PickerView.#wrapOptionTag(el as HTMLOptionElement)

          btn.addEventListener('click', this.#handlePageClick)

          list?.appendChild(btn)

          break
        }
        default: {
          const btn = $<HTMLButtonElement>(`<button type="button" tabindex="0"><label-view></label-view></button>`, '>1'),
            label = btn.querySelector(':scope>label-view')

          if (el.dataset.label) label?.setAttribute('title', el.dataset.label)

          btn.addEventListener('click', async (evt: Event) => {
            evt.stopImmediatePropagation()
            evt.preventDefault()

            const { target } = evt
            if (!(target instanceof HTMLElement && target)) return

            const newPage = this.#renderPage('body-view', this.hasAttribute('searchable'), el.dataset.label, el)
            if (!newPage) return

            const path = new NavigationPath(target)?.hydrate()

            await startViewTransition(target, 'forwards', async () => {
              update(path, newPage)
            })
          })

          list?.appendChild(btn)
          break
        }
      }
    }

    return body
  }

  #renderList = (entries: MutationRecord[]) => {
    debug(`${PickerView.name} ⚡️ mutation`)

    switch (this.pickerStyle) {
      case 'sheet':
      case 'navigation-link': {
        // label
        const label = this.querySelector(':scope>label-view') ?? this.appendChild($(`<label-view system-image="dots-three"></label-view>`, '>1'))

        label.setAttribute('title', 'rtyty')

        CleanupRegistry.unregister(this, 'trigger')
        CleanupRegistry.register(this, onoff('click', this.#handleTriggerClick, label).on(), 'trigger')

        this.appendChild(label)

        // rebuild snapshot(tree)
        if (!this.#spawn) break

        // rerender level 0
        replaceList(this.#spawn, this.#renderPage('body-view', this.hasAttribute('searchable'), this.getAttribute('label')))

        for (const el of this.#spawn.querySelectorAll<HTMLElement>('body-view')) {
          const depth = $.ancestors('body-view,[is=sheet-view]', el).indexOf(this.#spawn)
          if (0 >= depth) continue

          const datalist = this.querySelector<HTMLElement>(`:scope>${Array.from({ length: depth }, () => 'datalist').join('>')}`)
          if (!datalist) {
            el.remove()

            break
          }

          replaceList(el, this.#renderPage('body-view', this.hasAttribute('searchable'), datalist.dataset.label, datalist))
        }

        break
      }
      case 'menu': {
        const menu = this.querySelector(':scope>menu-view:not([slot])') ?? this.appendChild($(`<menu-view tabindex="0"></menu-view>`, '>1')),
          label = menu.querySelector(':scope>label-view[slot=label]') ?? menu.appendChild($(`<label-view slot="label" system-image="dots-three"></label-view>`, '>1'))

        label.setAttribute('title', 'rtyty')

        for (const el of menu.querySelectorAll(':scope>:not([slot])')) el.remove()

        PickerView.#reflectButtons([...(this.#slots?.get('list')?.assignedElements() ?? [])], menu)

        break
      }
      case 'inline':
      default: {
        const inlineList = this.querySelector(':scope>list-view:not([slot])') ?? this.appendChild($(`<list-view><section-view></section-view></list-view>`, '>1')),
          section = inlineList.querySelector(':scope>section-view') ?? inlineList.appendChild($(`<section-view></section-view>`, '>1'))

        for (const el of section.querySelectorAll(':scope>:not([slot])')) el.remove() // section.innerHTML = ''

        const label = this.getAttribute((this.constructor as typeof PickerView).ATTR.LABEL)
        if (label) {
          const el = $(`<label-view></label-view>`, '>1')

          el.setAttribute('title', label)

          section.insertAdjacentElement('beforeend', el)
        }

        PickerView.#reflectButtons(
          [...(this.#slots?.get('list')?.assignedElements({ flatten: true }) ?? [])].filter((el) => el.matches('option')),
          section
        )

        break
      }
    }
  }

  #renderValidityMsgs = (entries: MutationRecord[]) => {
    debug(`${PickerView.name} ⚡️ mutation`)

    this.setValidity(this.validity, this.validationMessage)
  }

  #lastRenderedStyle?: PickerStyle //string | null

  #shadowRoot

  #slots?: Map<string, HTMLSlotElement> = new Map()
  #validityObservers = new MutationObserverSet(this.#renderValidityMsgs)
  #observers = new MutationObserverSet(this.#renderList)

  #customValidity: string = ''

  #selection: string = ''

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

  connectedCallback() {
    debug(`${PickerView.name} ⚡️ connect`)

    CleanupRegistry.register(
      this,
      onoff(
        'localechange',
        () => {
          this.#renderList([])
        },
        I18n.on
      ).on()
    )

    CleanupRegistry.register(this, onoff('click', this.#handleClick, this).on())

    if (!this.hasAttribute((this.constructor as typeof PickerView).ATTR.PICKER_STYLE)) this.#render() // will be picked up by attr-change!

    // finally
    if (!this.hasAttribute('selection')) return

    this.#selection = this.getAttribute('selection') ?? ''

    this.#sendValueToForm(false)
  }

  disconnectedCallback() {
    debug(`${PickerView.name} ⚡️ disconnect`)

    CleanupRegistry.unregister(this)

    this.#validityObservers.unobserveAll()
    this.#observers.unobserveAll()
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    debug(`${PickerView.name} ⚡️ attr-change [${name}] ("${oldValue}" → "${newValue}")`)

    switch (name) {
      case (this.constructor as typeof PickerView).ATTR.PLACEHOLDER:
        this.#reflectPlaceholder(newValue)

        break
      case (this.constructor as typeof PickerView).ATTR.LABEL:
        this.#reflectLabel(newValue)

        this.#sendValueToForm()

        break
      case (this.constructor as typeof PickerView).ATTR.PICKER_STYLE:
        if (oldValue === newValue) break

        this.#render()

        break
      case (this.constructor as typeof PickerView).ATTR.SEARCHABLE:
        if (oldValue === newValue) break

        this.#renderList([])

        break
      case (this.constructor as typeof PickerView).ATTR.SELECTION:
        // nothing happens

        break
    }
  }

  get pickerStyle(): PickerStyle {
    return (pickerStyles as readonly string[]).includes(this.getAttribute((this.constructor as typeof PickerView).ATTR.PICKER_STYLE) ?? '')
      ? (this.getAttribute((this.constructor as typeof PickerView).ATTR.PICKER_STYLE) as (typeof pickerStyles)[number])
      : 'automatic'
  }

  #render() {
    debug(`${PickerView.name} ⚡️ render (${this.pickerStyle})`)

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

    if (!(target instanceof HTMLElement && target)) return

    this.#spawn?.remove?.()

    const level0 = this.#renderPage('sheet' === this.pickerStyle ? 'sheet-view' : 'body-view', this.hasAttribute('searchable'), this.getAttribute('label'))
    if (!level0) return

    const path = new NavigationPath(target)?.hydrate()

    await startViewTransition(target, 'forwards', async () => {
      this.#spawn = level0

      update(path, level0)
    })
  }

  #handlePageClick = async (evt: Event) => {
    debug(`${PickerView.name} ⚡️ ${evt?.type}`)

    evt.stopImmediatePropagation()
    evt.preventDefault()

    const { target } = evt
    if (!(target instanceof HTMLElement && target)) return

    const btn = target.closest('button')
    if (!btn) return

    const proceed = () => {
      this.#spawn?.remove()

      this.#selection = btn.getAttribute('value') ?? btn.textContent?.trim() ?? ''

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

    if (!(target instanceof HTMLElement && target)) return

    const btn = target.closest('button')
    if (!btn) return

    this.#selection = btn.getAttribute('value') ?? btn.textContent?.trim() ?? ''

    this.#sendValueToForm()
  }

  #handleValiditiesSlotchange = ({ type, target: slot }: Event) => {
    debug(`${PickerView.name} ⚡️ ${type}`)

    if (!(slot instanceof HTMLSlotElement && slot)) return

    const assigned = slot.assignedElements()

    this.#validityObservers.syncObservations(assigned, ['value', 'label'])

    // if (0 < assigned.length)
    this.#renderValidityMsgs([])
  }

  #handleListSlotchange = ({ type, target: slot }: Event) => {
    debug(`${PickerView.name} ⚡️ ${type}`)

    if (!(slot instanceof HTMLSlotElement && slot)) return

    const assigned = slot.assignedElements()

    this.#observers.syncObservations(assigned)

    // if (0 < assigned.length)
    this.#renderList([])
  }

  static #wrapOptionTag(node: HTMLOptionElement) {
    const btn = $(`<button type="button" tabindex="0"></button>`, '>1')

    btn.setAttribute('value', node.getAttribute('value') ?? node.textContent?.trim() ?? '')

    const label = $(`<label-view></label-view>`, '>1')
    label.setAttribute('title', node.getAttribute('label') ?? node.getAttribute('value') ?? node.textContent?.trim() ?? '')
    btn.appendChild(label)

    return btn
  }

  static #wrapOptgroupTag(node: HTMLOptGroupElement) {
    const labelT = `<label-view></label-view>`,
      summaryT = `<summary>${labelT}</summary>`

    const group = $(`<details is="disclosure-group">${summaryT}</details>`, '>1'),
      summary = group.querySelector(':scope>summary') ?? group.appendChild($(summaryT, '>1')),
      summaryLabel = summary.querySelector(':scope>label-view') ?? summary.appendChild($(labelT, '>1'))

    if (node.hasAttribute('label')) summaryLabel.setAttribute('title', node.getAttribute('label') ?? '')

    if (node.hasAttribute('data-system-image')) summaryLabel.setAttribute('system-image', node.getAttribute('data-system-image') ?? '')

    return group
  }

  static #reflectButtons(nodes: Element[], container: Element) {
    for (const node of nodes)
      switch (node.tagName) {
        case 'DATALIST': {
          const group = $(`<menu-view tabindex="0"></menu-view>`, '>1'),
            label = group.querySelector(':scope>label-view[slot=label]') ?? group.appendChild($(`<label-view slot="label"></label-view>`, '>1'))

          if (node.hasAttribute('data-label')) label.setAttribute('title', node.getAttribute('data-label') ?? '')

          if (node.hasAttribute('data-system-image')) label.setAttribute('system-image', node.getAttribute('data-system-image') ?? '')

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
  }

  #reflectPlaceholder(value: string | null) {
    const input = this.#shadowRoot.querySelector('input')
    if (input) {
      if (value) input.setAttribute('placeholder', value)
      else input.removeAttribute('placeholder')
    }
  }

  #reflectLabel(value: string | null) {
    let label = this.querySelector(':scope>[slot=label]')
    if (value) {
      label ??= this.appendChild($(`<span slot="label"></span>`, '>1'))
      label.textContent = value
    } else label?.remove()

    this.#renderList([])
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

        const option = el as HTMLOptionElement

        if (`${kebabCase(key)}` === option.value) {
          message = option.label
          break
        } else if (`${kebabCase(key)}:${message}` === option.value) {
          message = option.label
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
  formAssociatedCallback = (form: HTMLFormElement) => {
    this.#sendValueToForm()
  }
  formDisabledCallback = (disabled: boolean) => {
    for (const btn of this.#shadowRoot.querySelectorAll('button')) btn.toggleAttribute('disabled', !disabled)
  }
  formResetCallback = () => {
    this.#selection = ''
  }
}
