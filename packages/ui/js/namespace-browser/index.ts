export type WebComponentCtor = typeof HTMLElement & {
  //CustomElementConstructor & {
  observedAttributes?: string[]
  polyfillExtends?: string
  polyfillConnectedCallback(el: HTMLElement): void
  polyfillDisconnectedCallback(el: HTMLElement): void
  polyfillAttributeChangedCallback?(entries: Pick<MutationRecord, 'attributeName' | 'oldValue' | 'target'>[]): void
}
