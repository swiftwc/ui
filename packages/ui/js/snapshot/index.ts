export class Snapshot {
  static #readyCalled = false

  static #config?: Record<string, string>

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

    console.debug(this.#config)
  }
}
