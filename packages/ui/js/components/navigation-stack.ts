export class NavigationStack extends HTMLElement {
  static observedAttributes = ['hidden']

  constructor() {
    super()

    /* const shadowRoot = this.attachShadow({ mode: 'open' })
    shadowRoot.appendChild(
      document.importNode(this.constructor.template.content, true)
    )
    const slot = shadowRoot.querySelector('slot')!

    slot.addEventListener('slotchange', () => {
      const sv = this.querySelector<HTMLElement>(':scope > scroll-view')
      if (!sv) return

      const st = parseInt(sv?.dataset?.scrolltop ?? '0')

      requestAnimationFrame(() => (sv.scrollTop = st))
    }) */

    // const template = document.createElement('template')
    // template.innerHTML = this.constructor.#template

    // const template = document.getElementById('element-details-template')

    // // Named slot for toolbar
    // const toolbarSlot = document.createElement('slot');
    // toolbarSlot.name = 'toolbar';

    // // Default slot for everything else
    // const defaultSlot = document.createElement('slot');

    // shadow.appendChild(toolbarSlot);
    // shadow.appendChild(defaultSlot);

    // this.attachShadow({ mode: 'open' }).append(template.content.cloneNode(true))
    ////this.constructor.template.content.cloneNode(true)
    // shadowRoot.appendChild(document.importNode(template.content, true))

    // alert(9)

    // const t = this
  }

  attributeChangedCallback(name: string, oldValue: boolean, newValue: boolean) {
    console.log(`Attribute ${name} has changed.`)
    // alert(99)
  }

  disconnectedCallback() {
    console.debug(`${NavigationStack.name} ⚡️ disconnect`)
  }

  connectedCallback() {
    // this.attachShadow({ mode: "open" });
    // this.shadowRoot.innerHTML = NavigationStack.template;
    // Access slotted elements
    // const toolbarSlot = this.shadowRoot.querySelector('slot[name="toolbar"]');
    // const defaultSlot = this.shadowRoot.querySelector('slot:not([name])');
    // // Get assigned nodes
    // const toolbarNodes = toolbarSlot.assignedNodes({ flatten: true });
    // const defaultNodes = defaultSlot.assignedNodes({ flatten: true });
    // console.log('Toolbar nodes:', toolbarNodes);
    // console.log('Default nodes:', defaultNodes);
    // const starRating = document.getElementById('star-rating-template').content;
    //   const shadowRoot = this.attachShadow({
    //     mode: 'open'
    //   });
    //   shadowRoot.appendChild(starRating.cloneNode(true));
    // this.innerHTML = `<div>gh</div><slot name="toolbar"><legend>Rate your experience:</legend></slot>`
    // this.appendChild(slottedToolbar)
    // console.log(99)
    // this.innerHTML = `
    //   <header>
    //     <label>New</label>
    //   </header>
    //   <p>
    //     <h2>Welcome to the new page!</h2>
    //   </p>
    //   ${this.innerHTML}
    // `;
  }
}
