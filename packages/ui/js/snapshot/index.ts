import { debug, onoff } from '../internal/utils'

export class Snapshot {
  static #readyCalled = false

  static #config?: Record<string, string>

  static #listeners?: Set<() => void>

  static #breakpoints?: Map<string, boolean>

  static get breakpoints(): ReadonlyMap<string, boolean> | undefined {
    return this.#breakpoints
  }

  static on = new EventTarget()

  static readonly waitReady = Promise.all([
    'complete' === document.readyState ? Promise.resolve() : new Promise((r) => self.addEventListener('load', r, { once: true })),
    (async () => {
      if (!this.#readyCalled) await this.setOwnConfig()
    })(), // Lazy config read promise, triggered on first access
  ])

  static async waitReadyFor<T extends HTMLElement>(element: T): Promise<T | null> {
    if (!element.isConnected) return null

    await this.waitReady

    return element.isConnected ? element : null
  }

  static get config() {
    return this.#config
  }

  static async setOwnConfig() {
    if (!this.#readyCalled) this.#readyCalled = true

    if ('complete' !== document.readyState) await new Promise((r) => self.addEventListener('load', r, { once: true }))

    this.#getOwnConfig()
  }

  static #getOwnConfig() {
    const style = self.getComputedStyle(document.documentElement, '::before'),
      content = style.getPropertyValue('content'),
      unquoted = content.replace(/^"(.*)"$/, '$1') // Remove quotes around the content

    try {
      this.#config = Object.fromEntries(new URLSearchParams(unquoted).entries()) // {"none": ""}
    } catch {
      console.error('could-not-parse-config')
    }

    for (const off of this.#listeners ?? []) off?.()

    this.#listeners = new Set()

    const mediaQueryList = self.matchMedia(`(pointer: fine) and (min-width: ${this.#config!['ipad-sheet-view-inline-size']}) and (min-height: ${this.#config!['ipad-sheet-view-height']})`)

    this.#breakpoints = new Map([['fine_dialog_sheet', mediaQueryList.matches]])

    this.#listeners.add(onoff('change', (evt: Event) => this.#handleMediaChange(evt as MediaQueryListEvent, 'fine_dialog_sheet:change') as unknown as EventListener, mediaQueryList).on())

    debug(this.#config)
  }

  static #handleMediaChange = ({ type, matches, media }: MediaQueryListEvent, kind: string) => {
    debug(`${Snapshot.name} ⚡️ ${type}`)

    this.#breakpoints?.set('fine_dialog_sheet', matches)

    this.on.dispatchEvent(
      new MediaQueryListEvent(kind, {
        matches,
        media,
      })
    )
  }
}
