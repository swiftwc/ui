export abstract class DialogBase extends HTMLDialogElement {
  static polyfillExtends = 'dialog' as const
  static polyfillConnectedCallback(el: HTMLDialogElement) {}
  static polyfillDisonnectedCallback(el: HTMLDialogElement) {}
  static polyfillAttributeChangedCallback(entries: MutationRecord[]) {}
}

export abstract class ButtonBase extends HTMLButtonElement {
  static polyfillExtends = 'button' as const
  static polyfillConnectedCallback(el: HTMLButtonElement) {}
  static polyfillDisonnectedCallback(el: HTMLButtonElement) {}
  static polyfillAttributeChangedCallback(entries: MutationRecord[]) {}
}

export abstract class DetailsBase extends HTMLDetailsElement {
  static polyfillExtends = 'details' as const
  static polyfillConnectedCallback(el: HTMLDetailsElement) {}
  static polyfillDisonnectedCallback(el: HTMLDetailsElement) {}
  static polyfillAttributeChangedCallback(entries: MutationRecord[]) {}
}

export abstract class FormBase extends HTMLFormElement {
  static polyfillExtends = 'form' as const
  static polyfillConnectedCallback(el: HTMLFormElement) {}
  static polyfillDisonnectedCallback(el: HTMLFormElement) {}
  static polyfillAttributeChangedCallback(entries: MutationRecord[]) {}
}
