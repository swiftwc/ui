export abstract class DialogBase extends HTMLDialogElement {
  static polyfillExtends = 'dialog' as const
  static polyfillConnectedCallback(el: HTMLDialogElement) {}
  static polyfillDisonnectedCallback(el: HTMLDialogElement) {}
}

export abstract class ButtonBase extends HTMLButtonElement {
  static polyfillExtends = 'button' as const
  static polyfillConnectedCallback(el: HTMLButtonElement) {}
  static polyfillDisonnectedCallback(el: HTMLButtonElement) {}
}

export abstract class DetailsBase extends HTMLDetailsElement {
  static polyfillExtends = 'details' as const
  static polyfillConnectedCallback(el: HTMLDetailsElement) {}
  static polyfillDisonnectedCallback(el: HTMLDetailsElement) {}
}

