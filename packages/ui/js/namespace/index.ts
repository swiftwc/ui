export type WebComponentCtor = CustomElementConstructor & {
  polyfillExtends?: string
  polyfillConnectedCallback(el: HTMLElement): void
  polyfillDisconnectedCallback(el: HTMLElement): void
  polyfillAttributeChangedCallback?(entries: MutationRecord[]): void
}
