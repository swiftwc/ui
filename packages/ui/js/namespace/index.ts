export type WebComponentCtor = CustomElementConstructor & {
    polyfillExtends?: string
    polyfill(el: HTMLElement, connected: boolean): void
  }