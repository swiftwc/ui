export abstract class DialogBase extends HTMLDialogElement {
  static polyfillExtends = 'dialog' as const
  static polyfillConnectedCallback(el: HTMLDialogElement) {}
  static polyfillDisonnectedCallback(el: HTMLDialogElement) {}
  static polyfillAttributeChangedCallback(entries: Pick<MutationRecord, 'attributeName' | 'oldValue' | 'target'>[]) {} //MutationRecord[]) {}

  disconnectedCallback() {
    const ctor = this.constructor as typeof DialogBase

    ctor.polyfillDisonnectedCallback(this)
  }

  connectedCallback() {
    const ctor = this.constructor as typeof DialogBase

    ctor.polyfillConnectedCallback(this)
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    const ctor = this.constructor as typeof DialogBase

    const entry = {
      attributeName: name,
      oldValue,
      target: this,
    }

    ctor.polyfillAttributeChangedCallback([entry])
  }
}

export abstract class ButtonBase extends HTMLButtonElement {
  static polyfillExtends = 'button' as const
  static polyfillConnectedCallback(el: HTMLButtonElement) {}
  static polyfillDisonnectedCallback(el: HTMLButtonElement) {}
  static polyfillAttributeChangedCallback(entries: Pick<MutationRecord, 'attributeName' | 'oldValue' | 'target'>[]) {} //MutationRecord[]) {}

  disconnectedCallback() {
    const ctor = this.constructor as typeof ButtonBase

    ctor.polyfillDisonnectedCallback(this)
  }

  connectedCallback() {
    const ctor = this.constructor as typeof ButtonBase

    ctor.polyfillConnectedCallback(this)
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    const ctor = this.constructor as typeof ButtonBase

    const entry = {
      attributeName: name,
      oldValue,
      target: this,
    }

    ctor.polyfillAttributeChangedCallback([entry])
  }
}

export abstract class DetailsBase extends HTMLDetailsElement {
  static polyfillExtends = 'details' as const
  static polyfillConnectedCallback(el: HTMLDetailsElement) {}
  static polyfillDisonnectedCallback(el: HTMLDetailsElement) {}
  static polyfillAttributeChangedCallback(entries: Pick<MutationRecord, 'attributeName' | 'oldValue' | 'target'>[]) {} //MutationRecord[]) {}

  disconnectedCallback() {
    const ctor = this.constructor as typeof DetailsBase

    ctor.polyfillDisonnectedCallback(this)
  }

  connectedCallback() {
    const ctor = this.constructor as typeof DetailsBase

    ctor.polyfillConnectedCallback(this)
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    const ctor = this.constructor as typeof DetailsBase

    const entry = {
      attributeName: name,
      oldValue,
      target: this,
    }

    ctor.polyfillAttributeChangedCallback([entry])
  }
}

export abstract class FormBase extends HTMLFormElement {
  static polyfillExtends = 'form' as const
  static polyfillConnectedCallback(el: HTMLFormElement) {}
  static polyfillDisonnectedCallback(el: HTMLFormElement) {}
  static polyfillAttributeChangedCallback(entries: Pick<MutationRecord, 'attributeName' | 'oldValue' | 'target'>[]) {} //MutationRecord[]) {}

  disconnectedCallback() {
    const ctor = this.constructor as typeof FormBase

    ctor.polyfillDisonnectedCallback(this)
  }

  connectedCallback() {
    const ctor = this.constructor as typeof FormBase

    ctor.polyfillConnectedCallback(this)
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    const ctor = this.constructor as typeof FormBase

    const entry = {
      attributeName: name,
      oldValue,
      target: this,
    }

    ctor.polyfillAttributeChangedCallback([entry])
  }
}
