export abstract class DialogBase extends HTMLDialogElement {
  static polyfillExtends = 'dialog' as const
  static polyfill(el: HTMLDialogElement, connected: boolean) {}
}

export abstract class ButtonBase extends HTMLButtonElement {
  static polyfillExtends = 'button' as const
  static polyfill(el: HTMLButtonElement, connected: boolean) {}
}

