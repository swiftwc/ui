export class Snapshot {
  static #count = 0

  static get count() {
    return this.#count
  }

  static getSnapshot() {
    this.#count++
  }

  static #config?: Record<string, string>

  static get config() {
    return this.#config
  }

  static async setOwnConfig() {
    if ('complete' === document.readyState) return Snapshot.#getOwnConfig() // Page already loaded

    await new Promise((resolve) => self.addEventListener('load', resolve)) // Wait for window load

    return Snapshot.#getOwnConfig()
  }

  static #getOwnConfig() {
    const style = getComputedStyle(document.documentElement, '::before'),
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
