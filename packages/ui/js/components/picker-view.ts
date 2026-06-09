import { type PickerSelectionDetail } from '../events'
import { CleanupRegistry } from '../internal/class/cleanup-registry'
import { FormAssociatedBase, getInternals } from '../internal/class/form-associated-base'
import { MutationObserverSet } from '../internal/class/mutation-observer-set'
import { NavigationPath } from '../internal/class/navigation-path'
import { startViewTransition } from '../internal/privateNamespace'
import { $, debug, kebabCase, onoff } from '../internal/utils'

const pickerStyles = ['menu', 'inline', 'navigation-link', 'automatic'] as const
export type PickerStyle = (typeof pickerStyles)[number]

const navigationLinkTemplate = $(
  `<body-view>
        <scroll-view>
          <v-stack padding placement="leading fill">
            <button type="button" class="bw">🔙</button>
            <button type="button" class="bww">🔚</button>
            <button type="button" class="bww2">🔚 of modal</button>
            <button type="button" class="fww">deep</button>
            <p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><input type="text" /><p>...</p><p>...</p><p>...</p>
          </v-stack>
        </scroll-view>

        <tool-bar></tool-bar>

          </body-view>`,
  '>1'
)

export class PickerView extends FormAssociatedBase {
  static get ATTR() {
    return {
      PLACEHOLDER: 'placeholder',
      LABEL: 'label',
      PICKER_STYLE: 'picker-style',
      SELECTION: 'selection',
    }
  }

  static get observedAttributes() {
    return Object.values(this.ATTR)
  }

  static #templates: Map<string, DocumentFragment> = new Map()

  #renderList = (entries: MutationRecord[]) => {
    debug(`${PickerView.name} ⚡️ mutation`)

    switch (this.pickerStyle) {
      case 'navigation-link': {
        const label = this.querySelector(':scope>label-view') ?? this.appendChild($(`<label-view system-image="dots-three"></label-view>`, '>1'))

        label.setAttribute('title', 'rtyty')

        // for (const el of menu.querySelectorAll(':scope>:not([slot])')) el.remove()

        // PickerView.#reflectButtons([...(this.#slots?.get('list')?.assignedElements() ?? [])], menu)

        label.addEventListener('click', async (evt) => {
          const path = new NavigationPath(evt.target)?.hydrate()

          await startViewTransition(evt.target, 'forwards', async () => {
            if (!(path instanceof NavigationPath)) throw new Error('invalid view')

            const position = 'beforebegin' //queryInsertPosition(path.component) //'afterend'
            const lookFor = 'beforebegin' === position ? 'previousElementSibling' : 'nextElementSibling'

            const node = navigationLinkTemplate

            path.page.insertAdjacentElement(position, node)

            // modifyDOMforwards(undefined, path, template)
          })

          console.log(9999, path)
        })

        this.appendChild(label)

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

    if (!this.isConnected) return

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

    // CleanupRegistry.unregister(this, 'tags') //off2()
    // CleanupRegistry.register(this, onoff('slotchange', this.#handleSlotchange, this.#slots?.get('tag')).on(), 'tags')

    // if (0 < (this.#slots?.get('list')?.assignedElements({ flatten: true }) ?? []).length) this.#handleTagMutation()
    // if (0 < (this.#slots?.get('tag')?.assignedElements({ flatten: true }) ?? []).length) this.#handleTagMutation()

    //this.getAttribute((this.constructor as typeof PickerView).ATTR.PICKER_STYLE)) {
    switch (
      this.pickerStyle
      // case 'menu':
      //   // if (0 < (this.#slots?.get('list')?.assignedElements({ flatten: true }) ?? []).length) this.#handleMenuDatalistMutation()

      //   break
      // case 'gg':
      //   // reattach input listener
      //   const input = this.#shadowRoot.querySelector('input')
      //   if (input) {
      //     input.addEventListener('input', () => {
      //       this.#internals!.setFormValue(input.value)
      //     })

      //     // restore placeholder if set
      //     const placeholder = this.getAttribute((this.constructor as typeof PickerView).ATTR.PLACEHOLDER)
      //     if (placeholder) input.setAttribute('placeholder', placeholder)
      //   }

      //   // restore label if set
      //   const label = this.getAttribute((this.constructor as typeof PickerView).ATTR.LABEL)
      //   if (label) this.#reflectLabel(label)

      //   break
      // case 'inline':
      // default:
      //   // if (0 < (this.#slots?.get('list')?.assignedElements({ flatten: true }) ?? []).length) this.#handleInlineDatalistMutation()

      //   break
    ) {
    }
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

    if (0 < assigned.length) this.#renderValidityMsgs([])
  }

  #handleListSlotchange = ({ type, target: slot }: Event) => {
    debug(`${PickerView.name} ⚡️ ${type}`)

    if (!(slot instanceof HTMLSlotElement && slot)) return

    const assigned = slot.assignedElements()

    this.#observers.syncObservations(assigned)

    if (0 < assigned.length) this.#renderList([])
  }

  static #wrapOptionTag(node: HTMLOptionElement) {
    const btn = $(`<button type="button" tabindex="0"></button>`, '>1')

    btn.setAttribute('value', node.getAttribute('value') ?? node.textContent?.trim() ?? '')

    const label = $(`<label-view></label-view>`, '>1')
    label.setAttribute('title', node.getAttribute('label') ?? node.getAttribute('value') ?? node.textContent?.trim() ?? '')
    btn.appendChild(label)

    return btn
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
          const labelT = `<label-view></label-view>`,
            summaryT = `<summary>${labelT}</summary>`

          const group = $(`<details is="disclosure-group">${summaryT}</details>`, '>1'),
            summary = group.querySelector(':scope>summary') ?? group.appendChild($(summaryT, '>1')),
            summaryLabel = summary.querySelector(':scope>label-view') ?? summary.appendChild($(labelT, '>1'))

          if (node.hasAttribute('label')) summaryLabel.setAttribute('title', node.getAttribute('label') ?? '')

          if (node.hasAttribute('data-system-image')) summaryLabel.setAttribute('system-image', node.getAttribute('data-system-image') ?? '')

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
    // switch (this.getAttribute('picker-style')) {
    //   case 'menu':
    //     this.#slot!.assignedElements({ flatten: true })[0].setAttribute('label', value ?? '')
    //     // if (!mv) {
    //     //   mv = document.createElement('label-view')
    //     //   mv.slot = 'label'
    //     //   this.append(mv)
    //     // }

    //     // mv.textContent = newValue //el2.replaceChildren(escapeHTMLPolicy.createHTML(newValue))

    //     break
    //   default:
    let label = this.querySelector(':scope>[slot=label]')
    if (value) {
      label ??= this.appendChild($(`<span slot="label"></span>`, '>1'))
      label.textContent = value
    } else label?.remove()

    this.#renderList([])

    // const el =
    //   (this.#labelSlot?.assignedElements({ flatten: true })[0] as HTMLElement) ??
    //   (() => {
    //     const el = document.createElement('span')
    //     el.slot = 'label'
    //     return this.appendChild(el)
    //   })()

    // el.textContent = value ?? '' // el.replaceChildren(escapeHTMLPolicy.createHTML(newValue))
    // break
    // }

    // const assigned = this.#labelSlot?.assignedElements({ flatten: true }) as HTMLElement[] | undefined
    // let el = assigned?.[0]
    // if (!el) {
    //   el = document.createElement('span')
    //   el.slot = 'label'
    //   this.append(el)
    // }
    // el.textContent = value ?? ''
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
