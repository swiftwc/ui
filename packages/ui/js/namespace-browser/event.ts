export interface TypedEventTargetMethods<M> {
  addEventListener: {
    <K extends keyof M>(type: K, listener: (this: HTMLElement, ev: M[K] extends Event ? M[K] : never) => void, options?: boolean | AddEventListenerOptions): void
    (type: string, listener: EventListenerOrEventListenerObject | null, options?: boolean | AddEventListenerOptions): void
  }
  removeEventListener: {
    <K extends keyof M>(type: K, listener: (this: HTMLElement, ev: M[K] extends Event ? M[K] : never) => void, options?: boolean | EventListenerOptions): void
    (type: string, listener: EventListenerOrEventListenerObject | null, options?: boolean | EventListenerOptions): void
  }
}
