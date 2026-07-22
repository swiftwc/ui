import { $, devFlags } from '../internal/utils'
import { html, queryMorph } from '../morphdom'

export class ImageView extends HTMLElement {
  static get observedAttributes() {
    return ['system-name', 'system-weight']
  }

  static #template: DocumentFragment

  static get template() {
    return (this.#template ??= $(String.raw`<slot></slot>`))
  }

  #shadowRoot

  constructor() {
    super()

    this.#shadowRoot = this.attachShadow({ mode: 'closed' })

    this.#shadowRoot.appendChild(document.importNode((this.constructor as typeof ImageView).template, true))
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (devFlags.debug) console.debug(`${ImageView.name} ⚡️ attr-change [${name}] ("${oldValue}" → "${newValue}")`)

    if (oldValue === newValue) return

    switch (name) {
      case 'system-weight': {
        this.#render(this.getAttribute('system-name'), newValue)

        break
      }
      case 'system-name': {
        this.#render(newValue, this.getAttribute('system-weight'))

        // // this.innerHTML = `<i style="line-height: 1.05" class="ph ph-${newValue}"></i>`

        // //this.setAttribute('class', `ph ph-${newValue}`)
        // let image = this.querySelector(':scope>:not([slot])')
        // if (newValue) {
        //   const el = image ?? $(`<i style="line-height: 1"></i>`, '>1')
        //   el.setAttribute('class', `ph ph-${newValue}`)
        //   image ??= this.appendChild(el)
        //   // image ??= this.appendChild($(`<i style="line-height: 1.05"></i>`, '>1'))
        //   // image.setAttribute('class', `ph ph-${newValue}`)
        // } else image?.remove()

        break
      }
    }
  }

  #render(icon: string | null, weight: string | null) {
    // if (!icon) {
    //   this.querySelector(':scope>:not([slot])')?.remove()
    //   return
    // }

    const tokens = [`ph${weight ? `-${weight}` : ''}`, `ph-${icon}`]

    // const container = this.querySelector<HTMLElement>(':scope>:not([slot])') ?? this.appendChild<HTMLElement>($(`<i style="line-height: 1"></i>`, '>1'))

    queryMorph(':not([slot])', html`<i style="line-height: 1" class="${tokens.join(' ')}"></i>`, this, { removeIf: !icon })

    // if ('1' !== container.style.getPropertyValue('line-height')) container.style.setProperty('line-height', '1')

    // for (const token of container.classList) if (token.startsWith('ph') && !tokens.includes(token)) container.classList.remove(token)

    // container.classList.add(...tokens)
  }

  disconnectedCallback() {
    if (devFlags.debug) console.debug(`${ImageView.name} ⚡️ disconnect`)
  }

  connectedCallback() {
    if (devFlags.debug) console.debug(`${ImageView.name} ⚡️ connect`)
  }
}
